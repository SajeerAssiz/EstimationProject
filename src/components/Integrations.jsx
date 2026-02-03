import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { integrationTypes, complexityMultipliers } from '../data/d365Modules';

function Integrations() {
  const { state, dispatch, calculations, formatEstimate, getUnitLabel } = useEstimation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInstanceModal, setShowInstanceModal] = useState(null); // integration type to add instance for
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customIntegration, setCustomIntegration] = useState({
    name: '',
    category: 'Custom',
    baseHours: 60
  });
  const [newInstance, setNewInstance] = useState({
    instanceName: '',
    complexity: 'medium',
    customHours: null,
    remarks: ''
  });

  const categories = ['all', ...new Set(integrationTypes.map(i => i.category))];

  const filteredIntegrations = integrationTypes.filter(i => {
    const matchesCategory = activeCategory === 'all' || i.category === activeCategory;
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddIntegration = (integration, instanceDetails = {}) => {
    dispatch({
      type: 'ADD_INTEGRATION',
      payload: {
        ...integration,
        instanceName: instanceDetails.instanceName || '',
        complexity: instanceDetails.complexity || 'medium',
        customHours: instanceDetails.customHours || null,
        remarks: instanceDetails.remarks || ''
      }
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
        integrationId: `custom_${crypto.randomUUID()}`,
        name: customIntegration.name,
        category: customIntegration.category,
        baseHours: customIntegration.baseHours
      });
      setCustomIntegration({ name: '', category: 'Custom', baseHours: 60 });
      setShowAddModal(false);
    }
  };

  // Open modal to add instance with details
  const openInstanceModal = (integration) => {
    setShowInstanceModal(integration);
    setNewInstance({
      instanceName: '',
      complexity: 'medium',
      customHours: null,
      remarks: ''
    });
  };

  // Add instance with details
  const handleAddInstance = () => {
    if (showInstanceModal) {
      handleAddIntegration({
        integrationId: showInstanceModal.id,
        name: showInstanceModal.name,
        category: showInstanceModal.category,
        baseHours: showInstanceModal.baseHours
      }, newInstance);
      setShowInstanceModal(null);
      setNewInstance({
        instanceName: '',
        complexity: 'medium',
        customHours: null,
        remarks: ''
      });
    }
  };

  // Quick add without details
  const handleQuickAdd = (integration) => {
    handleAddIntegration({
      integrationId: integration.id,
      name: integration.name,
      category: integration.category,
      baseHours: integration.baseHours
    });
  };

  // Get count of instances for an integration type
  const getInstanceCount = (integrationId) => {
    return state.integrations.filter(i => i.integrationId === integrationId).length;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'ERP': '🏢',
      'CRM': '👥',
      'E-Commerce': '🛒',
      'Banking': '🏦',
      'Finance': '💰',
      'EDI': '📡',
      'Warehouse': '📦',
      'HR': '👤',
      'Tax': '📋',
      'Shipping': '🚚',
      'Payments': '💳',
      'Logistics': '🚛',
      'Hardware': '🖥️',
      'Cloud': '☁️',
      'Analytics': '📊',
      'Documents': '📄',
      'Productivity': '📱',
      'Retail': '🏪',
      'Compliance': '✅',
      'Other': '🔗',
      'Custom': '⚙️'
    };
    return icons[category] || '🔗';
  };

  return (
    <div className="section integrations-modern">
      <div className="section-header">
        <div className="header-title">
          <h2>Integrations</h2>
          <p className="section-subtitle">Connect D365 F&O with external systems</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-number">{state.integrations.length}</span>
            <span className="stat-text">Instances</span>
          </div>
          <div className="stat-pill primary">
            <span className="stat-number">{formatEstimate(calculations.integrationHours).toLocaleString()}</span>
            <span className="stat-text">{getUnitLabel()}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="integration-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Available Integrations Grid */}
      <div className="integrations-grid">
        {filteredIntegrations.map(integration => {
          const instanceCount = getInstanceCount(integration.id);
          return (
            <div
              key={integration.id}
              className={`integration-card ${instanceCount > 0 ? 'has-instances' : ''}`}
            >
              <div className="card-icon">
                {getCategoryIcon(integration.category)}
                {instanceCount > 0 && (
                  <span className="instance-count-badge">{instanceCount}</span>
                )}
              </div>
              <div className="card-content">
                <h4 className="card-title">{integration.name}</h4>
                <span className="card-category">{integration.category}</span>
              </div>
              <div className="card-footer">
                <span className="card-hours">{integration.baseHours}h base</span>
                <div className="card-actions">
                  <button
                    className="btn-quick-add"
                    onClick={() => handleQuickAdd(integration)}
                    title="Quick add"
                  >
                    +
                  </button>
                  <button
                    className="btn-add-details"
                    onClick={() => openInstanceModal(integration)}
                    title="Add with details"
                  >
                    + Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Custom Card */}
        <div
          className="integration-card custom-card"
          onClick={() => setShowAddModal(true)}
        >
          <div className="card-icon">➕</div>
          <div className="card-content">
            <h4 className="card-title">Custom Integration</h4>
            <span className="card-category">Add your own</span>
          </div>
          <div className="card-footer">
            <span className="add-badge">Create New</span>
          </div>
        </div>
      </div>

      {/* Add Instance with Details Modal */}
      {showInstanceModal && (
        <div className="modal-overlay" onClick={() => setShowInstanceModal(null)}>
          <div className="modal modern-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add {showInstanceModal.name}</h3>
              <button className="modal-close" onClick={() => setShowInstanceModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="instance-type-info">
                <span className="type-icon">{getCategoryIcon(showInstanceModal.category)}</span>
                <div>
                  <strong>{showInstanceModal.name}</strong>
                  <span className="type-category">{showInstanceModal.category} • {showInstanceModal.baseHours}h base</span>
                </div>
              </div>

              <div className="form-group">
                <label>Instance Name / Description</label>
                <input
                  type="text"
                  value={newInstance.instanceName}
                  onChange={(e) => setNewInstance({ ...newInstance, instanceName: e.target.value })}
                  placeholder="e.g., ABC Bank, Terminal 1, SAP Production"
                />
                <span className="field-hint">Identify this specific instance</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Complexity</label>
                  <select
                    value={newInstance.complexity}
                    onChange={(e) => setNewInstance({ ...newInstance, complexity: e.target.value })}
                  >
                    <option value="low">Low (from repository)</option>
                    <option value="medium">Medium (standard)</option>
                    <option value="high">High (complex/new)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Custom Hours (optional)</label>
                  <input
                    type="number"
                    value={newInstance.customHours || ''}
                    onChange={(e) => setNewInstance({
                      ...newInstance,
                      customHours: e.target.value ? parseInt(e.target.value) : null
                    })}
                    placeholder={showInstanceModal.baseHours.toString()}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Remarks</label>
                <textarea
                  value={newInstance.remarks}
                  onChange={(e) => setNewInstance({ ...newInstance, remarks: e.target.value })}
                  placeholder="Any notes about this integration instance..."
                  rows="2"
                />
              </div>

              <div className="estimate-preview">
                <span>Estimated Hours:</span>
                <strong>
                  {Math.round(
                    (newInstance.customHours || showInstanceModal.baseHours) *
                    complexityMultipliers[newInstance.complexity]
                  )}h
                </strong>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowInstanceModal(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddInstance}>
                Add Instance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Integration Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal modern-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Integration</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Integration Name</label>
                <input
                  type="text"
                  value={customIntegration.name}
                  onChange={(e) => setCustomIntegration({
                    ...customIntegration,
                    name: e.target.value
                  })}
                  placeholder="e.g., Legacy ERP System"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={customIntegration.category}
                    onChange={(e) => setCustomIntegration({
                      ...customIntegration,
                      category: e.target.value
                    })}
                  >
                    {categories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
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
              </div>
            </div>
            <div className="modal-footer">
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

      {/* Selected Integrations */}
      {state.integrations.length > 0 && (
        <div className="selected-integrations-modern">
          <div className="selected-header">
            <h3>Selected Integrations</h3>
            <span className="selected-count">{state.integrations.length} instances</span>
          </div>
          <div className="selected-list">
            {state.integrations.map(integration => (
              <div key={integration.id} className="selected-item">
                <div className="item-main">
                  <div className="item-icon">{getCategoryIcon(integration.category)}</div>
                  <div className="item-info">
                    <span className="item-name">
                      {integration.name}
                      {integration.instanceName && (
                        <span className="instance-label"> - {integration.instanceName}</span>
                      )}
                    </span>
                    <span className="item-category">{integration.category}</span>
                    {integration.remarks && (
                      <span className="item-remarks">{integration.remarks}</span>
                    )}
                  </div>
                </div>
                <div className="item-controls">
                  <div className="control-group">
                    <label>Instance</label>
                    <input
                      type="text"
                      className="compact-input instance-input"
                      value={integration.instanceName || ''}
                      onChange={(e) => handleUpdateIntegration(integration.id, {
                        instanceName: e.target.value
                      })}
                      placeholder="Name..."
                    />
                  </div>
                  <div className="control-group">
                    <label>Complexity</label>
                    <select
                      value={integration.complexity}
                      onChange={(e) => handleUpdateIntegration(integration.id, {
                        complexity: e.target.value
                      })}
                      className="compact-select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="control-group">
                    <label>Hours</label>
                    <input
                      type="number"
                      className="compact-input"
                      placeholder={integration.baseHours.toString()}
                      value={integration.customHours || ''}
                      onChange={(e) => handleUpdateIntegration(integration.id, {
                        customHours: e.target.value ? parseInt(e.target.value) : null
                      })}
                    />
                  </div>
                  <div className="control-group estimate">
                    <label>Estimate</label>
                    <span className="estimate-value">
                      {Math.round(
                        (integration.customHours || integration.baseHours) *
                        complexityMultipliers[integration.complexity]
                      )}h
                    </span>
                  </div>
                </div>
                <button
                  className="item-remove"
                  onClick={() => handleRemoveIntegration(integration.id)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Integrations;
