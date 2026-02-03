import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { d365Modules, complexityMultipliers } from '../data/d365Modules';
import ModuleMatrix from './ModuleMatrix';

function ScopeModules() {
  const { state, dispatch, calculations } = useEstimation();
  const [expandedModule, setExpandedModule] = useState(null);

  // If legal entities are defined, use matrix-style selection
  if (state.legalEntities && state.legalEntities.length > 0) {
    return <ModuleMatrix />;
  }

  const isModuleSelected = (moduleId, subModuleId) => {
    return state.selectedModules.some(
      m => m.moduleId === moduleId && m.subModuleId === subModuleId
    );
  };

  const getSelectedModule = (moduleId, subModuleId) => {
    return state.selectedModules.find(
      m => m.moduleId === moduleId && m.subModuleId === subModuleId
    );
  };

  const handleToggleModule = (moduleId, subModule) => {
    dispatch({
      type: 'TOGGLE_MODULE',
      payload: {
        moduleId,
        subModuleId: subModule.id,
        name: subModule.name,
        baseHours: subModule.baseHours,
        complexity: subModule.complexity
      }
    });
  };

  const handleUpdateModule = (id, updates) => {
    dispatch({
      type: 'UPDATE_MODULE',
      payload: { id, updates }
    });
  };

  const getModuleCount = (moduleId) => {
    return state.selectedModules.filter(m => m.moduleId === moduleId).length;
  };

  return (
    <div className="section scope-modules">
      <div className="section-header">
        <h2>D365 F&O Scope Modules</h2>
        <div className="section-summary">
          <span>{state.selectedModules.length} modules selected</span>
          <span className="hours">{calculations.moduleHours.toLocaleString()} hours</span>
        </div>
      </div>

      <p className="section-description">
        Select the D365 Finance and Operations modules required for this implementation.
        Adjust complexity and custom hours as needed.
      </p>

      <div className="modules-container">
        {Object.entries(d365Modules).map(([moduleId, module]) => (
          <div key={moduleId} className="module-category">
            <div
              className={`module-header ${expandedModule === moduleId ? 'expanded' : ''}`}
              onClick={() => setExpandedModule(expandedModule === moduleId ? null : moduleId)}
            >
              <div className="module-header-left">
                <span className={`expand-icon ${expandedModule === moduleId ? 'expanded' : ''}`}>
                  &#9656;
                </span>
                <div className="module-info">
                  <h3>{module.name}</h3>
                  <p>{module.description}</p>
                </div>
              </div>
              <div className="module-header-right">
                {getModuleCount(moduleId) > 0 && (
                  <span className="selected-badge">
                    {getModuleCount(moduleId)} selected
                  </span>
                )}
              </div>
            </div>

            {expandedModule === moduleId && (
              <div className="submodules-list">
                {module.subModules.map((subModule) => {
                  const isSelected = isModuleSelected(moduleId, subModule.id);
                  const selectedData = getSelectedModule(moduleId, subModule.id);

                  return (
                    <div
                      key={subModule.id}
                      className={`submodule-item ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="submodule-main">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleModule(moduleId, subModule)}
                          />
                          <span className="submodule-name">{subModule.name}</span>
                        </label>
                        <div className="submodule-meta">
                          <span className={`complexity-badge ${subModule.complexity}`}>
                            {subModule.complexity}
                          </span>
                          <span className="base-hours">{subModule.baseHours}h base</span>
                        </div>
                      </div>

                      {isSelected && selectedData && (
                        <div className="submodule-details">
                          <div className="detail-row">
                            <div className="form-group small">
                              <label>Complexity</label>
                              <select
                                value={selectedData.complexity}
                                onChange={(e) => handleUpdateModule(selectedData.id, {
                                  complexity: e.target.value
                                })}
                              >
                                <option value="low">Low (x{complexityMultipliers.low})</option>
                                <option value="medium">Medium (x{complexityMultipliers.medium})</option>
                                <option value="high">High (x{complexityMultipliers.high})</option>
                              </select>
                            </div>
                            <div className="form-group small">
                              <label>Custom Hours</label>
                              <input
                                type="number"
                                placeholder={subModule.baseHours.toString()}
                                value={selectedData.customHours || ''}
                                onChange={(e) => handleUpdateModule(selectedData.id, {
                                  customHours: e.target.value ? parseInt(e.target.value) : null
                                })}
                              />
                            </div>
                            <div className="form-group small">
                              <label>Est. Hours</label>
                              <span className="calculated-hours">
                                {Math.round(
                                  (selectedData.customHours || subModule.baseHours) *
                                  complexityMultipliers[selectedData.complexity]
                                )}h
                              </span>
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Notes</label>
                            <input
                              type="text"
                              placeholder="Add notes about this module..."
                              value={selectedData.notes || ''}
                              onChange={(e) => handleUpdateModule(selectedData.id, {
                                notes: e.target.value
                              })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScopeModules;
