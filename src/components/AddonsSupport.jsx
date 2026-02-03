import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { addons, supportTypes } from '../data/d365Modules';

function AddonsSupport() {
  const { state, dispatch, calculations, formatEstimate, getUnitLabel } = useEstimation();
  const [activeTab, setActiveTab] = useState('addons');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCustomAddonModal, setShowCustomAddonModal] = useState(false);
  const [customAddon, setCustomAddon] = useState({
    name: '',
    category: 'Custom',
    baseHours: 80
  });

  const addonCategories = ['all', ...new Set(addons.map(a => a.category))];

  const filteredAddons = addons.filter(a => {
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'ISV Solution': '🧩',
      'Advanced Feature': '⚡',
      'Compliance': '📜',
      'Analytics': '📊',
      'Integration': '🔗',
      'Custom': '⚙️'
    };
    return icons[category] || '📦';
  };

  const handleAddAddon = (addon) => {
    dispatch({
      type: 'ADD_ADDON',
      payload: addon
    });
  };

  const handleRemoveAddon = (id) => {
    dispatch({
      type: 'REMOVE_ADDON',
      payload: id
    });
  };

  const handleUpdateAddon = (id, updates) => {
    dispatch({
      type: 'UPDATE_ADDON',
      payload: { id, updates }
    });
  };

  const handleUpdateSupport = (updates) => {
    dispatch({
      type: 'UPDATE_SUPPORT',
      payload: updates
    });
  };

  const isAddonAdded = (addonId) => {
    return state.addons.some(a => a.addonId === addonId);
  };

  const handleAddCustomAddon = () => {
    if (customAddon.name.trim()) {
      handleAddAddon({
        addonId: `custom_${Date.now()}`,
        name: customAddon.name,
        category: customAddon.category,
        baseHours: customAddon.baseHours
      });
      setCustomAddon({ name: '', category: 'Custom', baseHours: 80 });
      setShowCustomAddonModal(false);
    }
  };

  const totalHours = calculations.addonHours + (state.support.type ? calculations.supportHours : 0);

  return (
    <div className="section addons-support-modern">
      <div className="section-header">
        <div className="header-title">
          <h2>Add-ons & Support</h2>
          <p className="section-subtitle">ISV Solutions, Advanced Features & Support Plans</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-number">{state.addons.length}</span>
            <span className="stat-text">Add-ons</span>
          </div>
          <div className="stat-pill">
            <span className="stat-number">{state.support.type ? '1' : '0'}</span>
            <span className="stat-text">Support</span>
          </div>
          <div className="stat-pill primary">
            <span className="stat-number">{formatEstimate(totalHours).toLocaleString()}</span>
            <span className="stat-text">{getUnitLabel()}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="modern-tabs">
        <button
          className={`modern-tab ${activeTab === 'addons' ? 'active' : ''}`}
          onClick={() => setActiveTab('addons')}
        >
          <span className="tab-icon">🧩</span>
          <span className="tab-label">Add-ons</span>
          <span className="tab-count">{state.addons.length}</span>
        </button>
        <button
          className={`modern-tab ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveTab('support')}
        >
          <span className="tab-icon">🛟</span>
          <span className="tab-label">Support Plan</span>
          {state.support.type && <span className="tab-count">1</span>}
        </button>
      </div>

      {activeTab === 'addons' && (
        <div className="tab-content-modern">
          {/* Search and Filter Bar */}
          <div className="integration-toolbar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search add-ons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div>
            <div className="category-tabs">
              {addonCategories.map(category => (
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

          {/* Add-ons Grid */}
          <div className="integrations-grid">
            {filteredAddons.map(addon => {
              const isAdded = isAddonAdded(addon.id);
              return (
                <div
                  key={addon.id}
                  className={`integration-card ${isAdded ? 'added' : ''}`}
                  onClick={() => !isAdded && handleAddAddon({
                    addonId: addon.id,
                    name: addon.name,
                    category: addon.category,
                    baseHours: addon.baseHours
                  })}
                >
                  <div className="card-icon">{getCategoryIcon(addon.category)}</div>
                  <div className="card-content">
                    <h4 className="card-title">{addon.name}</h4>
                    <span className="card-category">{addon.category}</span>
                  </div>
                  <div className="card-footer">
                    <span className="card-hours">{addon.baseHours}h base</span>
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
              onClick={() => setShowCustomAddonModal(true)}
            >
              <div className="card-icon">➕</div>
              <div className="card-content">
                <h4 className="card-title">Custom Add-on</h4>
                <span className="card-category">Add your own</span>
              </div>
              <div className="card-footer">
                <span className="add-badge">Create New</span>
              </div>
            </div>
          </div>

          {/* Selected Add-ons */}
          {state.addons.length > 0 && (
            <div className="selected-integrations-modern">
              <div className="selected-header">
                <h3>Selected Add-ons</h3>
                <span className="selected-count">{state.addons.length} items • {calculations.addonHours}h total</span>
              </div>
              <div className="selected-list">
                {state.addons.map(addon => (
                  <div key={addon.id} className="selected-item">
                    <div className="item-main">
                      <div className="item-icon">{getCategoryIcon(addon.category)}</div>
                      <div className="item-info">
                        <span className="item-name">{addon.name}</span>
                        <span className="item-category">{addon.category}</span>
                      </div>
                    </div>
                    <div className="item-controls">
                      <div className="control-group">
                        <label>Hours</label>
                        <input
                          type="number"
                          className="compact-input"
                          placeholder={addon.baseHours.toString()}
                          value={addon.customHours || ''}
                          onChange={(e) => handleUpdateAddon(addon.id, {
                            customHours: e.target.value ? parseInt(e.target.value) : null
                          })}
                        />
                      </div>
                      <div className="control-group estimate">
                        <label>Estimate</label>
                        <span className="estimate-value">
                          {addon.customHours || addon.baseHours}h
                        </span>
                      </div>
                    </div>
                    <button
                      className="item-remove"
                      onClick={() => handleRemoveAddon(addon.id)}
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
      )}

      {activeTab === 'support' && (
        <div className="tab-content-modern">
          <p className="info-banner">
            <span className="info-icon">💡</span>
            Select a post-implementation support plan for ongoing maintenance and assistance.
          </p>

          {/* Support Plans Grid */}
          <div className="support-cards-grid">
            {supportTypes.map(support => {
              const isSelected = state.support.type?.id === support.id;
              return (
                <div
                  key={support.id}
                  className={`support-card-modern ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleUpdateSupport({ type: support })}
                >
                  <div className="support-card-header">
                    <h4>{support.name}</h4>
                    {isSelected && <span className="selected-badge">✓ Selected</span>}
                  </div>
                  <p className="support-description">{support.description}</p>
                  <div className="support-meta">
                    <div className="support-hours">
                      <span className="hours-number">{support.monthlyHours}</span>
                      <span className="hours-label">hours/month</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Support Configuration */}
          {state.support.type && (
            <div className="selected-integrations-modern">
              <div className="selected-header">
                <h3>Support Configuration</h3>
              </div>
              <div className="support-config-modern">
                <div className="config-item">
                  <label>Selected Plan</label>
                  <span className="config-value">{state.support.type.name}</span>
                </div>
                <div className="config-item">
                  <label>Duration (months)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    className="compact-input"
                    value={state.support.durationMonths}
                    onChange={(e) => handleUpdateSupport({
                      durationMonths: parseInt(e.target.value) || 12
                    })}
                  />
                </div>
                <div className="config-item">
                  <label>Monthly Hours</label>
                  <span className="config-value">{state.support.type.monthlyHours}h</span>
                </div>
                <div className="config-item highlight">
                  <label>Total Support Hours</label>
                  <span className="config-value large">{calculations.supportHours.toLocaleString()}h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Add-on Modal */}
      {showCustomAddonModal && (
        <div className="modal-overlay" onClick={() => setShowCustomAddonModal(false)}>
          <div className="modal modern-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Add-on</h3>
              <button className="modal-close" onClick={() => setShowCustomAddonModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Add-on Name</label>
                <input
                  type="text"
                  value={customAddon.name}
                  onChange={(e) => setCustomAddon({ ...customAddon, name: e.target.value })}
                  placeholder="Enter add-on name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={customAddon.category}
                    onChange={(e) => setCustomAddon({ ...customAddon, category: e.target.value })}
                  >
                    {addonCategories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Base Hours</label>
                  <input
                    type="number"
                    value={customAddon.baseHours}
                    onChange={(e) => setCustomAddon({
                      ...customAddon,
                      baseHours: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCustomAddonModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddCustomAddon}>
                Add Add-on
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddonsSupport;
