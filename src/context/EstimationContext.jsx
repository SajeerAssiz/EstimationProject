import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  complexityMultipliers,
  projectPhases,
  teamRoles
} from '../data/d365Modules';
import { useProjects } from './ProjectsContext';

const EstimationContext = createContext(null);

const getInitialState = () => ({
  projectInfo: {
    projectName: '',
    clientName: '',
    startDate: '',
    currency: 'USD',
    contingencyPercent: 15,
    estimationUnit: 'hours', // 'hours' or 'days'
    hoursPerDay: 8
  },
  legalEntities: [],
  moduleMatrix: {}, // { entityId: { moduleKey: { selected: true, complexity: 'medium', hours: 0 } } }
  baseHoursOverrides: {}, // { moduleKey: hours } - overrides for default base hours
  selectedModules: [],
  integrations: [],
  reports: [],
  biDashboards: [],
  documentFormats: [], // Outgoing document formats (PO, Invoice, etc.)
  addons: [],
  support: {
    type: null,
    durationMonths: 12
  },
  customItems: [],
  dataMigrations: [],
  resourceLoading: null, // Resource loading and costing data
  wbsData: [],
  projectPlan: {
    phases: projectPhases.map(p => ({ ...p, enabled: true })),
    teamMembers: []
  }
});

function estimationReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_PROJECT_INFO':
      return {
        ...state,
        projectInfo: { ...state.projectInfo, ...action.payload }
      };

    // Legal Entity Actions
    case 'ADD_LEGAL_ENTITY':
      return {
        ...state,
        legalEntities: [...state.legalEntities, {
          ...action.payload,
          id: action.payload.id || uuidv4()
        }],
        moduleMatrix: {
          ...state.moduleMatrix,
          [action.payload.id || uuidv4()]: {}
        }
      };

    case 'REMOVE_LEGAL_ENTITY': {
      const newModuleMatrix = { ...state.moduleMatrix };
      delete newModuleMatrix[action.payload];
      return {
        ...state,
        legalEntities: state.legalEntities.filter(le => le.id !== action.payload),
        moduleMatrix: newModuleMatrix
      };
    }

    case 'UPDATE_LEGAL_ENTITY':
      return {
        ...state,
        legalEntities: state.legalEntities.map(le =>
          le.id === action.payload.id ? { ...le, ...action.payload.updates } : le
        )
      };

    // Module Matrix Actions (for matrix-style estimation)
    case 'TOGGLE_MODULE_FOR_ENTITY': {
      const { entityId, moduleKey, moduleData } = action.payload;
      const entityModules = state.moduleMatrix[entityId] || {};
      const isSelected = entityModules[moduleKey]?.selected;

      return {
        ...state,
        moduleMatrix: {
          ...state.moduleMatrix,
          [entityId]: {
            ...entityModules,
            [moduleKey]: isSelected ? { selected: false } : {
              selected: true,
              complexity: 'medium',
              customHours: null,
              ...moduleData
            }
          }
        }
      };
    }

    case 'UPDATE_MODULE_FOR_ENTITY': {
      const { entityId, moduleKey, updates } = action.payload;
      const entityModules = state.moduleMatrix[entityId] || {};

      return {
        ...state,
        moduleMatrix: {
          ...state.moduleMatrix,
          [entityId]: {
            ...entityModules,
            [moduleKey]: {
              ...entityModules[moduleKey],
              ...updates
            }
          }
        }
      };
    }

    case 'TOGGLE_MODULE': {
      const moduleExists = state.selectedModules.find(
        m => m.moduleId === action.payload.moduleId && m.subModuleId === action.payload.subModuleId
      );
      if (moduleExists) {
        return {
          ...state,
          selectedModules: state.selectedModules.filter(
            m => !(m.moduleId === action.payload.moduleId && m.subModuleId === action.payload.subModuleId)
          )
        };
      }
      return {
        ...state,
        selectedModules: [...state.selectedModules, {
          ...action.payload,
          id: uuidv4(),
          customHours: null,
          notes: ''
        }]
      };
    }

    case 'UPDATE_MODULE':
      return {
        ...state,
        selectedModules: state.selectedModules.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
        )
      };

    case 'ADD_INTEGRATION':
      return {
        ...state,
        integrations: [...state.integrations, {
          ...action.payload,
          id: uuidv4(),
          customHours: null,
          complexity: 'medium',
          notes: ''
        }]
      };

    case 'REMOVE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.filter(i => i.id !== action.payload)
      };

    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(i =>
          i.id === action.payload.id ? { ...i, ...action.payload.updates } : i
        )
      };

    case 'ADD_REPORT':
      return {
        ...state,
        reports: [...state.reports, {
          ...action.payload,
          id: uuidv4(),
          quantity: 1,
          customHours: null,
          notes: ''
        }]
      };

    case 'REMOVE_REPORT':
      return {
        ...state,
        reports: state.reports.filter(r => r.id !== action.payload)
      };

    case 'UPDATE_REPORT':
      return {
        ...state,
        reports: state.reports.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload.updates } : r
        )
      };

    case 'ADD_BI_DASHBOARD':
      return {
        ...state,
        biDashboards: [...state.biDashboards, {
          ...action.payload,
          id: uuidv4(),
          customHours: null,
          notes: ''
        }]
      };

    case 'REMOVE_BI_DASHBOARD':
      return {
        ...state,
        biDashboards: state.biDashboards.filter(b => b.id !== action.payload)
      };

    case 'UPDATE_BI_DASHBOARD':
      return {
        ...state,
        biDashboards: state.biDashboards.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload.updates } : b
        )
      };

    // Document Format Actions (Outgoing Documents)
    case 'ADD_DOCUMENT_FORMAT':
      return {
        ...state,
        documentFormats: [...state.documentFormats, {
          ...action.payload,
          id: uuidv4(),
          customHours: null,
          notes: ''
        }]
      };

    case 'REMOVE_DOCUMENT_FORMAT':
      return {
        ...state,
        documentFormats: state.documentFormats.filter(d => d.id !== action.payload)
      };

    case 'UPDATE_DOCUMENT_FORMAT':
      return {
        ...state,
        documentFormats: state.documentFormats.map(d =>
          d.id === action.payload.id ? { ...d, ...action.payload.updates } : d
        )
      };

    case 'ADD_ADDON':
      return {
        ...state,
        addons: [...state.addons, {
          ...action.payload,
          id: uuidv4(),
          customHours: null,
          notes: ''
        }]
      };

    case 'REMOVE_ADDON':
      return {
        ...state,
        addons: state.addons.filter(a => a.id !== action.payload)
      };

    case 'UPDATE_ADDON':
      return {
        ...state,
        addons: state.addons.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        )
      };

    case 'UPDATE_SUPPORT':
      return {
        ...state,
        support: { ...state.support, ...action.payload }
      };

    case 'ADD_CUSTOM_ITEM':
      return {
        ...state,
        customItems: [...state.customItems, {
          id: uuidv4(),
          name: action.payload.name,
          category: action.payload.category,
          hours: action.payload.hours,
          notes: ''
        }]
      };

    case 'REMOVE_CUSTOM_ITEM':
      return {
        ...state,
        customItems: state.customItems.filter(c => c.id !== action.payload)
      };

    case 'UPDATE_CUSTOM_ITEM':
      return {
        ...state,
        customItems: state.customItems.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        )
      };

    // Data Migration Actions
    case 'ADD_DATA_MIGRATION':
      return {
        ...state,
        dataMigrations: [...state.dataMigrations, {
          id: uuidv4(),
          ...action.payload
        }]
      };

    case 'REMOVE_DATA_MIGRATION':
      return {
        ...state,
        dataMigrations: state.dataMigrations.filter(d => d.id !== action.payload)
      };

    case 'UPDATE_DATA_MIGRATION':
      return {
        ...state,
        dataMigrations: state.dataMigrations.map(d =>
          d.id === action.payload.id ? { ...d, ...action.payload.updates } : d
        )
      };

    // Resource Loading Actions
    case 'UPDATE_RESOURCE_LOADING':
      return {
        ...state,
        resourceLoading: action.payload
      };

    // Base Hours Override Actions
    case 'UPDATE_BASE_HOURS_OVERRIDE':
      return {
        ...state,
        baseHoursOverrides: {
          ...state.baseHoursOverrides,
          [action.payload.moduleKey]: action.payload.hours
        }
      };

    // WBS Project Plan Actions
    case 'SET_WBS_DATA':
      return {
        ...state,
        wbsData: action.payload
      };

    case 'TOGGLE_PHASE':
      return {
        ...state,
        projectPlan: {
          ...state.projectPlan,
          phases: state.projectPlan.phases.map(p =>
            p.id === action.payload ? { ...p, enabled: !p.enabled } : p
          )
        }
      };

    case 'UPDATE_PHASE':
      return {
        ...state,
        projectPlan: {
          ...state.projectPlan,
          phases: state.projectPlan.phases.map(p =>
            p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
          )
        }
      };

    case 'ADD_TEAM_MEMBER': {
      const roleInfo = teamRoles.find(r => r.id === action.payload.roleId);
      return {
        ...state,
        projectPlan: {
          ...state.projectPlan,
          teamMembers: [...state.projectPlan.teamMembers, {
            id: uuidv4(),
            roleId: action.payload.roleId,
            roleName: roleInfo?.name || 'Custom Role',
            count: 1,
            hourlyRate: roleInfo?.hourlyRate || 150,
            allocation: roleInfo?.allocation || 100
          }]
        }
      };
    }

    case 'REMOVE_TEAM_MEMBER':
      return {
        ...state,
        projectPlan: {
          ...state.projectPlan,
          teamMembers: state.projectPlan.teamMembers.filter(t => t.id !== action.payload)
        }
      };

    case 'UPDATE_TEAM_MEMBER':
      return {
        ...state,
        projectPlan: {
          ...state.projectPlan,
          teamMembers: state.projectPlan.teamMembers.map(t =>
            t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
          )
        }
      };

    case 'RESET_ESTIMATION':
      return getInitialState();

    case 'LOAD_ESTIMATION': {
      // Merge loaded data with initial state to fill missing fields
      const initialState = getInitialState();
      const loaded = action.payload || {};
      return {
        ...initialState,
        ...loaded,
        projectInfo: { ...initialState.projectInfo, ...(loaded.projectInfo || {}) },
        support: { ...initialState.support, ...(loaded.support || {}) },
        projectPlan: {
          ...initialState.projectPlan,
          ...(loaded.projectPlan || {}),
          phases: loaded.projectPlan?.phases || initialState.projectPlan.phases,
          teamMembers: loaded.projectPlan?.teamMembers || []
        }
      };
    }

    default:
      return state;
  }
}

export function EstimationProvider({ children }) {
  const [state, dispatch] = useReducer(estimationReducer, getInitialState());
  const { currentProject, updateCurrentProject, currentProjectId } = useProjects();

  // Load estimation from current project when project changes
  useEffect(() => {
    if (currentProject?.estimation) {
      dispatch({ type: 'LOAD_ESTIMATION', payload: currentProject.estimation });
    } else {
      dispatch({ type: 'RESET_ESTIMATION' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProjectId]);

  // Auto-save estimation to current project when state changes
  useEffect(() => {
    if (currentProjectId && state) {
      const timeoutId = setTimeout(() => {
        updateCurrentProject(state);
      }, 500); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [state, currentProjectId, updateCurrentProject]);

  // Calculate hours from module matrix (per legal entity)
  const calculateModuleMatrixHours = useCallback(() => {
    let totalHours = 0;
    const entityBreakdown = {};

    Object.entries(state.moduleMatrix).forEach(([entityId, modules]) => {
      let entityHours = 0;
      Object.entries(modules).forEach(([, moduleData]) => {
        if (moduleData.selected) {
          const hours = moduleData.customHours || moduleData.baseHours || 0;
          const multiplier = complexityMultipliers[moduleData.complexity] || 1;
          entityHours += hours * multiplier;
        }
      });
      entityBreakdown[entityId] = entityHours;
      totalHours += entityHours;
    });

    return { totalHours: Math.round(totalHours), entityBreakdown };
  }, [state.moduleMatrix]);

  const calculateModuleHours = useCallback(() => {
    // If using matrix style (legal entities defined), use matrix calculation
    if (state.legalEntities.length > 0) {
      return calculateModuleMatrixHours().totalHours;
    }
    // Otherwise use traditional module selection
    return state.selectedModules.reduce((total, module) => {
      const hours = module.customHours || module.baseHours;
      const multiplier = complexityMultipliers[module.complexity] || 1;
      return total + (hours * multiplier);
    }, 0);
  }, [state.selectedModules, state.legalEntities, calculateModuleMatrixHours]);

  const calculateIntegrationHours = useCallback(() => {
    return state.integrations.reduce((total, integration) => {
      const hours = integration.customHours || integration.baseHours;
      const multiplier = complexityMultipliers[integration.complexity] || 1;
      return total + (hours * multiplier);
    }, 0);
  }, [state.integrations]);

  const calculateReportHours = useCallback(() => {
    return state.reports.reduce((total, report) => {
      const hours = report.customHours || report.baseHours;
      return total + (hours * (report.quantity || 1));
    }, 0);
  }, [state.reports]);

  const calculateBIHours = useCallback(() => {
    return state.biDashboards.reduce((total, dashboard) => {
      const hours = dashboard.customHours || dashboard.baseHours;
      const multiplier = complexityMultipliers[dashboard.complexity] || 1;
      return total + (hours * multiplier);
    }, 0);
  }, [state.biDashboards]);

  const calculateDocumentFormatHours = useCallback(() => {
    return (state.documentFormats || []).reduce((total, doc) => {
      const hours = doc.customHours || doc.baseHours || 0;
      const multiplier = complexityMultipliers[doc.complexity] || 1;
      return total + (hours * multiplier);
    }, 0);
  }, [state.documentFormats]);

  const calculateAddonHours = useCallback(() => {
    return state.addons.reduce((total, addon) => {
      return total + (addon.customHours || addon.baseHours);
    }, 0);
  }, [state.addons]);

  const calculateCustomItemHours = useCallback(() => {
    return state.customItems.reduce((total, item) => {
      return total + (item.hours || 0);
    }, 0);
  }, [state.customItems]);

  const calculateDataMigrationHours = useCallback(() => {
    return state.dataMigrations.reduce((total, migration) => {
      return total + (migration.hours || 0);
    }, 0);
  }, [state.dataMigrations]);

  const calculateSupportHours = useCallback(() => {
    if (!state.support.type) return 0;
    return state.support.type.monthlyHours * state.support.durationMonths;
  }, [state.support]);

  const calculateTotalHours = useCallback(() => {
    const baseHours = calculateModuleHours() +
      calculateIntegrationHours() +
      calculateReportHours() +
      calculateBIHours() +
      calculateDocumentFormatHours() +
      calculateAddonHours() +
      calculateCustomItemHours() +
      calculateDataMigrationHours();

    const contingency = baseHours * (state.projectInfo.contingencyPercent / 100);
    return Math.round(baseHours + contingency);
  }, [
    calculateModuleHours,
    calculateIntegrationHours,
    calculateReportHours,
    calculateBIHours,
    calculateDocumentFormatHours,
    calculateAddonHours,
    calculateCustomItemHours,
    calculateDataMigrationHours,
    state.projectInfo.contingencyPercent
  ]);

  const calculatePhaseHours = useCallback(() => {
    const totalHours = calculateTotalHours();
    return state.projectPlan.phases
      .filter(p => p.enabled)
      .map(phase => ({
        ...phase,
        hours: Math.round(totalHours * (phase.percentOfTotal / 100))
      }));
  }, [calculateTotalHours, state.projectPlan.phases]);

  const calculateTeamCost = useCallback(() => {
    const totalHours = calculateTotalHours();
    return state.projectPlan.teamMembers.reduce((total, member) => {
      const memberHours = totalHours * (member.allocation / 100) * member.count;
      return total + (memberHours * member.hourlyRate);
    }, 0);
  }, [calculateTotalHours, state.projectPlan.teamMembers]);

  // Utility functions for unit conversion
  const hoursPerDay = state.projectInfo.hoursPerDay || 8;
  const estimationUnit = state.projectInfo.estimationUnit || 'hours';

  const hoursToDays = useCallback((hours) => {
    return Math.round((hours / hoursPerDay) * 10) / 10; // Round to 1 decimal
  }, [hoursPerDay]);

  const formatEstimate = useCallback((hours) => {
    if (estimationUnit === 'days') {
      return hoursToDays(hours);
    }
    return Math.round(hours);
  }, [estimationUnit, hoursToDays]);

  const getUnitLabel = useCallback((plural = true) => {
    if (estimationUnit === 'days') {
      return plural ? 'days' : 'day';
    }
    return plural ? 'hours' : 'hour';
  }, [estimationUnit]);

  const value = {
    state,
    dispatch,
    calculations: {
      moduleHours: calculateModuleHours(),
      moduleMatrixBreakdown: calculateModuleMatrixHours(),
      integrationHours: calculateIntegrationHours(),
      reportHours: calculateReportHours(),
      biHours: calculateBIHours(),
      documentFormatHours: calculateDocumentFormatHours(),
      addonHours: calculateAddonHours(),
      customItemHours: calculateCustomItemHours(),
      dataMigrationHours: calculateDataMigrationHours(),
      supportHours: calculateSupportHours(),
      totalHours: calculateTotalHours(),
      phaseHours: calculatePhaseHours(),
      teamCost: calculateTeamCost(),
      // Converted values based on unit setting
      totalDays: hoursToDays(calculateTotalHours()),
      moduleDays: hoursToDays(calculateModuleHours()),
      integrationDays: hoursToDays(calculateIntegrationHours()),
      // Display value based on selected unit
      totalEstimate: formatEstimate(calculateTotalHours()),
      moduleEstimate: formatEstimate(calculateModuleHours()),
      integrationEstimate: formatEstimate(calculateIntegrationHours()),
      reportEstimate: formatEstimate(calculateReportHours()),
      biEstimate: formatEstimate(calculateBIHours()),
      documentFormatEstimate: formatEstimate(calculateDocumentFormatHours()),
      addonEstimate: formatEstimate(calculateAddonHours()),
      customItemEstimate: formatEstimate(calculateCustomItemHours()),
      dataMigrationEstimate: formatEstimate(calculateDataMigrationHours()),
    },
    // Utility functions
    formatEstimate,
    hoursToDays,
    getUnitLabel,
    estimationUnit,
    hoursPerDay,
  };

  return (
    <EstimationContext.Provider value={value}>
      {children}
    </EstimationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEstimation() {
  const context = useContext(EstimationContext);
  if (!context) {
    throw new Error('useEstimation must be used within an EstimationProvider');
  }
  return context;
}
