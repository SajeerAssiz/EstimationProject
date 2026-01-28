import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { projectPhases, teamRoles } from '../data/d365Modules';

const ProjectsContext = createContext(null);

const STORAGE_KEY = 'd365fo-projects';

// Initial state for a new estimation project
const getInitialEstimationState = () => ({
  projectInfo: {
    projectName: '',
    clientName: '',
    startDate: '',
    currency: 'USD',
    contingencyPercent: 15
  },
  selectedModules: [],
  integrations: [],
  reports: [],
  biDashboards: [],
  addons: [],
  support: {
    type: null,
    durationMonths: 12
  },
  customItems: [],
  projectPlan: {
    phases: projectPhases.map(p => ({ ...p, enabled: true })),
    teamMembers: []
  }
});

const initialState = {
  projects: [],
  currentProjectId: null,
  isLoading: true,
};

function projectsReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PROJECTS':
      return {
        ...state,
        projects: action.payload.projects || [],
        currentProjectId: action.payload.currentProjectId || null,
        isLoading: false,
      };

    case 'CREATE_PROJECT':
      const newProject = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: action.payload.userId,
        opportunity: action.payload.opportunity || null,
        estimation: getInitialEstimationState(),
      };

      // Pre-fill project info from opportunity if available
      if (action.payload.opportunity) {
        newProject.estimation.projectInfo.projectName = action.payload.opportunity.name;
        newProject.estimation.projectInfo.clientName =
          action.payload.opportunity.customerid_account?.name || '';
      }

      return {
        ...state,
        projects: [...state.projects, newProject],
        currentProjectId: newProject.id,
      };

    case 'SELECT_PROJECT':
      return {
        ...state,
        currentProjectId: action.payload,
      };

    case 'UPDATE_CURRENT_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === state.currentProjectId
            ? {
                ...p,
                estimation: action.payload,
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      };

    case 'DELETE_PROJECT':
      const filteredProjects = state.projects.filter(p => p.id !== action.payload);
      return {
        ...state,
        projects: filteredProjects,
        currentProjectId:
          state.currentProjectId === action.payload
            ? (filteredProjects[0]?.id || null)
            : state.currentProjectId,
      };

    case 'DUPLICATE_PROJECT':
      const projectToDuplicate = state.projects.find(p => p.id === action.payload);
      if (!projectToDuplicate) return state;

      const duplicatedProject = {
        ...JSON.parse(JSON.stringify(projectToDuplicate)),
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimation: {
          ...projectToDuplicate.estimation,
          projectInfo: {
            ...projectToDuplicate.estimation.projectInfo,
            projectName: `${projectToDuplicate.estimation.projectInfo.projectName} (Copy)`,
          },
        },
      };

      return {
        ...state,
        projects: [...state.projects, duplicatedProject],
        currentProjectId: duplicatedProject.id,
      };

    case 'LINK_OPPORTUNITY':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === state.currentProjectId
            ? {
                ...p,
                opportunity: action.payload,
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        projects: [],
        currentProjectId: null,
      };

    default:
      return state;
  }
}

export function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(projectsReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load projects from localStorage on mount
  useEffect(() => {
    const loadProjects = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          // Filter projects by user if authenticated
          const userProjects = isAuthenticated && user
            ? data.projects.filter(p => p.createdBy === user.localAccountId || p.createdBy === 'demo-user-id')
            : data.projects;

          dispatch({
            type: 'LOAD_PROJECTS',
            payload: {
              projects: userProjects,
              currentProjectId: data.currentProjectId,
            },
          });
        } else {
          dispatch({ type: 'LOAD_PROJECTS', payload: { projects: [], currentProjectId: null } });
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        dispatch({ type: 'LOAD_PROJECTS', payload: { projects: [], currentProjectId: null } });
      }
    };

    loadProjects();
  }, [isAuthenticated, user]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          projects: state.projects,
          currentProjectId: state.currentProjectId,
        }));
      } catch (error) {
        console.error('Error saving projects:', error);
      }
    }
  }, [state.projects, state.currentProjectId, state.isLoading]);

  const createProject = useCallback((opportunity = null) => {
    dispatch({
      type: 'CREATE_PROJECT',
      payload: {
        userId: user?.localAccountId || 'demo-user-id',
        opportunity,
      },
    });
  }, [user]);

  const selectProject = useCallback((projectId) => {
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
  }, []);

  const updateCurrentProject = useCallback((estimation) => {
    dispatch({ type: 'UPDATE_CURRENT_PROJECT', payload: estimation });
  }, []);

  const deleteProject = useCallback((projectId) => {
    dispatch({ type: 'DELETE_PROJECT', payload: projectId });
  }, []);

  const duplicateProject = useCallback((projectId) => {
    dispatch({ type: 'DUPLICATE_PROJECT', payload: projectId });
  }, []);

  const linkOpportunity = useCallback((opportunity) => {
    dispatch({ type: 'LINK_OPPORTUNITY', payload: opportunity });
  }, []);

  const getCurrentProject = useCallback(() => {
    return state.projects.find(p => p.id === state.currentProjectId) || null;
  }, [state.projects, state.currentProjectId]);

  const value = {
    projects: state.projects,
    currentProjectId: state.currentProjectId,
    currentProject: getCurrentProject(),
    isLoading: state.isLoading,
    createProject,
    selectProject,
    updateCurrentProject,
    deleteProject,
    duplicateProject,
    linkOpportunity,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
