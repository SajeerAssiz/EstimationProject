import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { integrationTypes, complexityMultipliers } from '../data/d365Modules';

function Integrations() {
  const { state, dispatch, calculations, formatEstimate, getUnitLabel } = useEstimation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [customIntegration, setCustomIntegration] = useState({
    name: '',
    category: 'Custom',
    baseHours: 60
  });

  const categories = ['all', ...new Set(integrationTypes.map(i => i.category))];

  const filteredIntegrations = integrationTypes.filter(i => {
    const matchesCategory = activeCategory === 'all' || i.category === activeCategory;
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const getCategoryIcon = (category) => {
    const icons = {
      'ERP': '🏢',
      'CRM': '👥',
      'E-Commerce': '🛒',
      'Banking': '🏦',
      'EDI': '📡',
      'Warehouse': '📦',
      'HR': '👤',
      'Tax': '📋',
      'Shipping': '🚚',
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
            <span className="stat-text">Selected</span>
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
          const isAdded = isIntegrationAdded(integration.id);
          return (
            <div
              key={integration.id}
              className={`integration-card ${isAdded ? 'added' : ''}`}
              onClick={() => !isAdded && handleAddIntegration({
                integrationId: integration.id,
                name: integration.name,
                category: integration.category,
                baseHours: integration.baseHours
              })}
            >
              <div className="card-icon">{getCategoryIcon(integration.category)}</div>
              <div className="card-content">
                <h4 className="card-title">{integration.name}</h4>
                <span className="card-category">{integration.category}</span>
              </div>
              <div className="card-footer">
                <span className="card-hours">{integration.baseHours}h base</span>
                {isAdded ? (
                  <span className="added-badge">✓ Added</span>
                ) : (
                  <span className="add-badge">+ Add</span>
                )}
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
            <span className="selected-count">{state.integrations.length} items</span>
          </div>
          <div className="selected-list">
            {state.integrations.map(integration => (
              <div key={integration.id} className="selected-item">
                <div className="item-main">
                  <div className="item-icon">{getCategoryIcon(integration.category)}</div>
                  <div className="item-info">
                    <span className="item-name">{integration.name}</span>
                    <span className="item-category">{integration.category}</span>
                  </div>
                </div>
                <div className="item-controls">
                  <div className="control-group">
                    <label>Qty</label>
                    <input
                      type="number"
                      className="compact-input qty-input"
                      min="1"
                      value={integration.quantity || 1}
                      onChange={(e) => handleUpdateIntegration(integration.id, {
                        quantity: Math.max(1, parseInt(e.target.value) || 1)
                      })}
                      title="Number of instances (e.g., 3 banks, 2 terminals)"
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
                    <label>Hours/Each</label>
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
                    <label>Total</label>
                    <span className="estimate-value">
                      {Math.round(
                        (integration.customHours || integration.baseHours) *
                        complexityMultipliers[integration.complexity] *
                        (integration.quantity || 1)
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
