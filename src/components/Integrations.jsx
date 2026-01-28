import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { integrationTypes, complexityMultipliers } from '../data/d365Modules';

function Integrations() {
  const { state, dispatch, calculations } = useEstimation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [customIntegration, setCustomIntegration] = useState({
    name: '',
    category: 'Custom',
    baseHours: 60
  });

  const categories = [...new Set(integrationTypes.map(i => i.category))];

  const handleAddIntegration = (integration) => {
    dispatch({
      type: 'ADD_INTEGRATION',
      payload: integration
    });
  };

  const handleRemoveIntegration = (id) => {
    dispatch({
      type: 'REMOVE_INTEGRATION',
      payload: id
    });
  };

  const handleUpdateIntegration = (id, updates) => {
    dispatch({
      type: 'UPDATE_INTEGRATION',
      payload: { id, updates }
    });
  };

  const handleAddCustomIntegration = () => {
    if (customIntegration.name.trim()) {
      handleAddIntegration({
        integrationId: `custom_${Date.now()}`,
        name: customIntegration.name,
        category: customIntegration.category,
        baseHours: customIntegration.baseHours
      });
      setCustomIntegration({ name: '', category: 'Custom', baseHours: 60 });
      setShowAddModal(false);
    }
  };

  const isIntegrationAdded = (integrationId) => {
    return state.integrations.some(i => i.integrationId === integrationId);
  };

  return (
    <div className="section integrations">
      <div className="section-header">
        <h2>Integrations</h2>
        <div className="section-summary">
          <span>{state.integrations.length} integrations</span>
          <span className="hours">{calculations.integrationHours.toLocaleString()} hours</span>
        </div>
      </div>

      <p className="section-description">
        Define the external systems that need to integrate with D365 F&O.
        Specify complexity and custom hours for accurate estimation.
      </p>

      <div className="integration-categories">
        {categories.map(category => (
          <div key={category} className="integration-category">
            <h4>{category}</h4>
            <div className="integration-options">
              {integrationTypes
                .filter(i => i.category === category)
                .map(integration => {
                  const isAdded = isIntegrationAdded(integration.id);
                  return (
                    <button
                      key={integration.id}
                      className={`integration-btn ${isAdded ? 'added' : ''}`}
                      onClick={() => !isAdded && handleAddIntegration({
                        integrationId: integration.id,
                        name: integration.name,
                        category: integration.category,
                        baseHours: integration.baseHours
                      })}
                      disabled={isAdded}
                    >
                      {integration.name}
                      <span className="hours-badge">{integration.baseHours}h</span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn-secondary add-custom-btn"
        onClick={() => setShowAddModal(true)}
      >
        + Add Custom Integration
      </button>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Custom Integration</h3>
            <div className="form-group">
              <label>Integration Name</label>
              <input
                type="text"
                value={customIntegration.name}
                onChange={(e) => setCustomIntegration({
                  ...customIntegration,
                  name: e.target.value
                })}
                placeholder="Enter integration name"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={customIntegration.category}
                onChange={(e) => setCustomIntegration({
                  ...customIntegration,
                  category: e.target.value
                })}
                placeholder="Enter category"
              />
            </div>
            <div className="form-group">
              <label>Base Hours</label>
              <input
                type="number"
                value={customIntegration.baseHours}
                onChange={(e) => setCustomIntegration({
                  ...customIntegration,
                  baseHours: parseInt(e.target.value) || 0
                })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddCustomIntegration}>
                Add Integration
              </button>
            </div>
          </div>
        </div>
      )}

      {state.integrations.length > 0 && (
        <div className="selected-integrations">
          <h3>Selected Integrations</h3>
          <div className="integrations-list">
            {state.integrations.map(integration => (
              <div key={integration.id} className="integration-item">
                <div className="integration-header">
                  <div className="integration-info">
                    <span className="integration-name">{integration.name}</span>
                    <span className="category-badge">{integration.category}</span>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveIntegration(integration.id)}
                  >
                    &times;
                  </button>
                </div>
                <div className="integration-details">
                  <div className="detail-row">
                    <div className="form-group small">
                      <label>Complexity</label>
                      <select
                        value={integration.complexity}
                        onChange={(e) => handleUpdateIntegration(integration.id, {
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
                        placeholder={integration.baseHours.toString()}
                        value={integration.customHours || ''}
                        onChange={(e) => handleUpdateIntegration(integration.id, {
                          customHours: e.target.value ? parseInt(e.target.value) : null
                        })}
                      />
                    </div>
                    <div className="form-group small">
                      <label>Est. Hours</label>
                      <span className="calculated-hours">
                        {Math.round(
                          (integration.customHours || integration.baseHours) *
                          complexityMultipliers[integration.complexity]
                        )}h
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Integration Details/Notes</label>
                    <input
                      type="text"
                      placeholder="Describe integration requirements..."
                      value={integration.notes || ''}
                      onChange={(e) => handleUpdateIntegration(integration.id, {
                        notes: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Integrations;
