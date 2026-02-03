import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { d365Modules, complexityMultipliers } from '../data/d365Modules';

const businessTypeModuleMapping = {
  retail: ['finance', 'supplyChain', 'retail', 'hr'],
  manufacturing: ['finance', 'supplyChain', 'manufacturing', 'hr', 'project', 'assetMgmt'],
  distribution: ['finance', 'supplyChain', 'hr', 'project'],
  services: ['finance', 'hr', 'project'],
  real_estate: ['finance', 'hr', 'project', 'assetMgmt'],
  healthcare: ['finance', 'supplyChain', 'hr', 'project', 'assetMgmt'],
  finance: ['finance', 'hr', 'project'],
  holding: ['finance', 'hr'],
  shared_services: ['finance', 'hr', 'project'],
  other: ['finance', 'supplyChain', 'hr'],
};

function ModuleMatrix() {
  const { state, dispatch, calculations } = useEstimation();
  const [expandedModules, setExpandedModules] = useState({});

  const legalEntities = state.legalEntities || [];
  const moduleMatrix = state.moduleMatrix || {};

  if (legalEntities.length === 0) {
    return (
      <div className="section module-matrix">
        <div className="section-header">
          <h2>Module Scope Matrix</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Legal Entities Defined</h3>
          <p>Please add legal entities first in the "Legal Entities" section.</p>
          <p>The module matrix will allow you to select which modules apply to each legal entity.</p>
        </div>
      </div>
    );
  }

  const activeEntities = legalEntities.filter(le => le.isActive);

  const toggleModule = (entityId, moduleId, subModuleId, subModule) => {
    const moduleKey = `${moduleId}_${subModuleId}`;
    dispatch({
      type: 'TOGGLE_MODULE_FOR_ENTITY',
      payload: {
        entityId,
        moduleKey,
        moduleData: {
          moduleId,
          subModuleId,
          name: subModule.name,
          baseHours: subModule.baseHours,
          complexity: subModule.complexity || 'medium',
        }
      }
    });
  };

  const updateModuleForEntity = (entityId, moduleKey, updates) => {
    dispatch({
      type: 'UPDATE_MODULE_FOR_ENTITY',
      payload: { entityId, moduleKey, updates }
    });
  };

  const isModuleSelected = (entityId, moduleId, subModuleId) => {
    const moduleKey = `${moduleId}_${subModuleId}`;
    return moduleMatrix[entityId]?.[moduleKey]?.selected || false;
  };

  const getModuleData = (entityId, moduleId, subModuleId) => {
    const moduleKey = `${moduleId}_${subModuleId}`;
    return moduleMatrix[entityId]?.[moduleKey] || {};
  };

  const toggleModuleExpand = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const getRecommendedModules = (businessType) => {
    return businessTypeModuleMapping[businessType] || businessTypeModuleMapping.other;
  };

  const selectAllForEntity = (entityId, selected) => {
    const entity = legalEntities.find(le => le.id === entityId);
    const recommendedModuleIds = getRecommendedModules(entity?.businessType);

    recommendedModuleIds.forEach(moduleId => {
      const moduleData = d365Modules[moduleId];
      if (moduleData) {
        moduleData.subModules.forEach(subModule => {
          const moduleKey = `${moduleId}_${subModule.id}`;
          const isCurrentlySelected = moduleMatrix[entityId]?.[moduleKey]?.selected;

          if (selected && !isCurrentlySelected) {
            dispatch({
              type: 'TOGGLE_MODULE_FOR_ENTITY',
              payload: {
                entityId,
                moduleKey,
                moduleData: {
                  moduleId,
                  subModuleId: subModule.id,
                  name: subModule.name,
                  baseHours: subModule.baseHours,
                  complexity: subModule.complexity || 'medium',
                }
              }
            });
          } else if (!selected && isCurrentlySelected) {
            dispatch({
              type: 'TOGGLE_MODULE_FOR_ENTITY',
              payload: { entityId, moduleKey }
            });
          }
        });
      }
    });
  };

  const calculateEntityHours = (entityId) => {
    const entityModules = moduleMatrix[entityId] || {};
    let totalHours = 0;

    Object.values(entityModules).forEach(moduleData => {
      if (moduleData.selected) {
        const hours = moduleData.customHours || moduleData.baseHours || 0;
        const multiplier = complexityMultipliers[moduleData.complexity] || 1;
        totalHours += hours * multiplier;
      }
    });

    return Math.round(totalHours);
  };

  const countSelectedModules = (entityId) => {
    const entityModules = moduleMatrix[entityId] || {};
    return Object.values(entityModules).filter(m => m.selected).length;
  };

  const getModuleCountForMainModule = (entityId, moduleId) => {
    const entityModules = moduleMatrix[entityId] || {};
    let count = 0;
    Object.entries(entityModules).forEach(([key, data]) => {
      if (key.startsWith(`${moduleId}_`) && data.selected) {
        count++;
      }
    });
    return count;
  };

  return (
    <div className="section module-matrix">
      <div className="section-header">
        <h2>Module Scope Matrix</h2>
        <div className="section-summary">
          <span>{activeEntities.length} Legal Entities</span>
          <span className="divider">|</span>
          <span className="hours">{calculations.moduleHours.toLocaleString()} total hours</span>
        </div>
      </div>

      <p className="section-description">
        Select which modules apply to each legal entity. The system will automatically calculate
        hours based on complexity and rollout factors.
      </p>

      <div className="matrix-container">
        <table className="module-matrix-table">
          <thead>
            <tr>
              <th className="module-header">Module / Sub-Module</th>
              {activeEntities.map(entity => (
                <th key={entity.id} className="entity-header">
                  <div className="entity-col-header">
                    <span className="entity-code">{entity.code}</span>
                    <span className="entity-name">{entity.name}</span>
                    <span className="entity-hours">{calculateEntityHours(entity.id).toLocaleString()}h</span>
                    <div className="entity-quick-actions">
                      <button
                        className="btn-mini"
                        onClick={() => selectAllForEntity(entity.id, true)}
                        title="Select recommended modules"
                      >
                        +All
                      </button>
                      <button
                        className="btn-mini btn-clear"
                        onClick={() => selectAllForEntity(entity.id, false)}
                        title="Clear all modules"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </th>
              ))}
              <th className="total-header">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(d365Modules).map(([moduleId, moduleData]) => {
              const isExpanded = expandedModules[moduleId];
              const totalForModule = moduleData.subModules.reduce((sum, sub) => {
                let subTotal = 0;
                activeEntities.forEach(entity => {
                  const data = getModuleData(entity.id, moduleId, sub.id);
                  if (data.selected) {
                    const hours = data.customHours || data.baseHours || sub.baseHours;
                    const multiplier = complexityMultipliers[data.complexity] || 1;
                    subTotal += hours * multiplier;
                  }
                });
                return sum + subTotal;
              }, 0);

              return (
                <>
                  <tr key={moduleId} className="module-group-row">
                    <td className="module-group-cell">
                      <button
                        className="module-expand-btn"
                        onClick={() => toggleModuleExpand(moduleId)}
                      >
                        {isExpanded ? '▼' : '▶'} {moduleData.name}
                      </button>
                      <span className="module-desc">{moduleData.description}</span>
                    </td>
                    {activeEntities.map(entity => {
                      const count = getModuleCountForMainModule(entity.id, moduleId);
                      return (
                        <td key={entity.id} className="module-count-cell">
                          {count > 0 && (
                            <span className="module-count-badge">{count}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="module-total-cell">
                      {totalForModule > 0 && `${Math.round(totalForModule).toLocaleString()}h`}
                    </td>
                  </tr>
                  {isExpanded && moduleData.subModules.map(subModule => {
                    const subTotal = activeEntities.reduce((sum, entity) => {
                      const data = getModuleData(entity.id, moduleId, subModule.id);
                      if (data.selected) {
                        const hours = data.customHours || data.baseHours || subModule.baseHours;
                        const multiplier = complexityMultipliers[data.complexity] || 1;
                        return sum + hours * multiplier;
                      }
                      return sum;
                    }, 0);

                    return (
                      <tr key={`${moduleId}_${subModule.id}`} className="sub-module-row">
                        <td className="sub-module-cell">
                          <span className="sub-module-name">{subModule.name}</span>
                          <span className="sub-module-base">{subModule.baseHours}h base</span>
                        </td>
                        {activeEntities.map(entity => {
                          const isSelected = isModuleSelected(entity.id, moduleId, subModule.id);
                          const moduleData = getModuleData(entity.id, moduleId, subModule.id);
                          const moduleKey = `${moduleId}_${subModule.id}`;

                          return (
                            <td key={entity.id} className="matrix-cell">
                              <div className="cell-content">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleModule(entity.id, moduleId, subModule.id, subModule)}
                                  className="module-checkbox"
                                />
                                {isSelected && (
                                  <select
                                    className="complexity-select"
                                    value={moduleData.complexity || 'medium'}
                                    onChange={(e) => updateModuleForEntity(entity.id, moduleKey, {
                                      complexity: e.target.value
                                    })}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Med</option>
                                    <option value="high">High</option>
                                  </select>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td className="sub-total-cell">
                          {subTotal > 0 && `${Math.round(subTotal).toLocaleString()}h`}
                        </td>
                      </tr>
                    );
                  })}
                </>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td><strong>Total Hours</strong></td>
              {activeEntities.map(entity => (
                <td key={entity.id} className="entity-total">
                  <strong>{calculateEntityHours(entity.id).toLocaleString()}h</strong>
                  <span className="module-count">{countSelectedModules(entity.id)} modules</span>
                </td>
              ))}
              <td className="grand-total">
                <strong>{calculations.moduleHours.toLocaleString()}h</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {calculations.moduleMatrixBreakdown?.entityBreakdown && (
        <div className="matrix-summary">
          <h3>Hours by Legal Entity</h3>
          <div className="entity-hours-grid">
            {activeEntities.map(entity => (
              <div key={entity.id} className="entity-hours-card">
                <div className="entity-card-header">
                  <span className="entity-code">{entity.code}</span>
                  <span className={`phase-badge phase-${entity.rolloutPhase}`}>
                    Phase {entity.rolloutPhase}
                  </span>
                </div>
                <div className="entity-card-body">
                  <div className="hours-value">
                    {calculateEntityHours(entity.id).toLocaleString()}
                  </div>
                  <div className="hours-label">hours</div>
                </div>
                <div className="entity-card-footer">
                  {countSelectedModules(entity.id)} modules selected
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModuleMatrix;
