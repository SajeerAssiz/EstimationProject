import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { addons, supportTypes } from '../data/d365Modules';

function AddonsSupport() {
  const { state, dispatch, calculations } = useEstimation();
  const [activeTab, setActiveTab] = useState('addons');
  const [showCustomAddonModal, setShowCustomAddonModal] = useState(false);
  const [customAddon, setCustomAddon] = useState({
    name: '',
    category: 'Custom',
    baseHours: 80
  });

  const addonCategories = [...new Set(addons.map(a => a.category))];

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

  const handleAddCustomItem = () => {
    dispatch({
      type: 'ADD_CUSTOM_ITEM',
      payload: {
        name: 'New Custom Item',
        category: 'Custom',
        hours: 40
      }
    });
  };

  const handleRemoveCustomItem = (id) => {
    dispatch({
      type: 'REMOVE_CUSTOM_ITEM',
      payload: id
    });
  };

  const handleUpdateCustomItem = (id, updates) => {
    dispatch({
      type: 'UPDATE_CUSTOM_ITEM',
      payload: { id, updates }
    });
  };

  return (
    <div className="section addons-support">
      <div className="section-header">
        <h2>Add-ons & Support</h2>
        <div className="section-summary">
          <span>
            {state.addons.length} add-ons, {state.support.type ? '1' : '0'} support plan
          </span>
          <span className="hours">
            {(calculations.addonHours + calculations.customItemHours).toLocaleString()} hours
          </span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'addons' ? 'active' : ''}`}
          onClick={() => setActiveTab('addons')}
        >
          Add-ons ({state.addons.length})
        </button>
        <button
          className={`tab ${activeTab === 'support' ? 'active' : ''}`}
          onClick={() => setActiveTab('support')}
        >
          Support Plan
        </button>
        <button
          className={`tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          Custom Items ({state.customItems.length})
        </button>
      </div>

      {activeTab === 'addons' && (
        <div className="tab-content">
          <p className="section-description">
            Select additional ISV solutions, advanced features, or custom extensions.
          </p>

          <div className="addon-categories">
            {addonCategories.map(category => (
              <div key={category} className="addon-category">
                <h4>{category}</h4>
                <div className="addon-options">
                  {addons
                    .filter(a => a.category === category)
                    .map(addon => {
                      const isAdded = isAddonAdded(addon.id);
                      return (
                        <div
                          key={addon.id}
                          className={`addon-card ${isAdded ? 'added' : ''}`}
                          onClick={() => !isAdded && handleAddAddon({
                            addonId: addon.id,
                            name: addon.name,
                            category: addon.category,
                            baseHours: addon.baseHours
                          })}
                        >
                          <div className="addon-name">{addon.name}</div>
                          <div className="addon-hours">{addon.baseHours}h</div>
                          {isAdded && <span className="added-check">&#10003;</span>}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-secondary add-custom-btn"
            onClick={() => setShowCustomAddonModal(true)}
          >
            + Add Custom Add-on
          </button>

          {state.addons.length > 0 && (
            <div className="selected-items">
              <h3>Selected Add-ons</h3>
              <div className="addons-list">
                {state.addons.map(addon => (
                  <div key={addon.id} className="addon-item">
                    <div className="addon-header">
                      <div className="addon-info">
                        <span className="addon-name">{addon.name}</span>
                        <span className="category-badge">{addon.category}</span>
                      </div>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveAddon(addon.id)}
                      >
                        &times;
                      </button>
                    </div>
                    <div className="addon-details">
                      <div className="form-group small">
                        <label>Custom Hours</label>
                        <input
                          type="number"
                          placeholder={addon.baseHours.toString()}
                          value={addon.customHours || ''}
                          onChange={(e) => handleUpdateAddon(addon.id, {
                            customHours: e.target.value ? parseInt(e.target.value) : null
                          })}
                        />
                      </div>
                      <div className="form-group small">
                        <label>Est. Hours</label>
                        <span className="calculated-hours">
                          {addon.customHours || addon.baseHours}h
                        </span>
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Add-on requirements..."
                        value={addon.notes || ''}
                        onChange={(e) => handleUpdateAddon(addon.id, {
                          notes: e.target.value
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="addons-total">
                <strong>Total Add-on Hours: {calculations.addonHours}h</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'support' && (
        <div className="tab-content">
          <p className="section-description">
            Select the post-implementation support plan for ongoing maintenance and assistance.
          </p>

          <div className="support-options">
            {supportTypes.map(support => {
              const isSelected = state.support.type?.id === support.id;
              return (
                <div
                  key={support.id}
                  className={`support-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleUpdateSupport({ type: support })}
                >
                  <div className="support-header">
                    <h4>{support.name}</h4>
                    {isSelected && <span className="selected-check">&#10003;</span>}
                  </div>
                  <p className="support-description">{support.description}</p>
                  <div className="support-meta">
                    <span className="monthly-hours">{support.monthlyHours} hours/month</span>
                  </div>
                </div>
              );
            })}
          </div>

          {state.support.type && (
            <div className="support-config">
              <h3>Support Configuration</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Support Duration (months)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={state.support.durationMonths}
                    onChange={(e) => handleUpdateSupport({
                      durationMonths: parseInt(e.target.value) || 12
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Total Support Hours</label>
                  <span className="calculated-value">
                    {calculations.supportHours.toLocaleString()} hours
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="tab-content">
          <p className="section-description">
            Add any custom line items that don't fit in other categories.
          </p>

          <button
            className="btn-primary add-custom-btn"
            onClick={handleAddCustomItem}
          >
            + Add Custom Item
          </button>

          {state.customItems.length > 0 && (
            <div className="custom-items-list">
              {state.customItems.map(item => (
                <div key={item.id} className="custom-item">
                  <div className="custom-item-row">
                    <div className="form-group">
                      <label>Item Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateCustomItem(item.id, {
                          name: e.target.value
                        })}
                        placeholder="Enter item name"
                      />
                    </div>
                    <div className="form-group small">
                      <label>Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handleUpdateCustomItem(item.id, {
                          category: e.target.value
                        })}
                        placeholder="Category"
                      />
                    </div>
                    <div className="form-group small">
                      <label>Hours</label>
                      <input
                        type="number"
                        value={item.hours}
                        onChange={(e) => handleUpdateCustomItem(item.id, {
                          hours: parseInt(e.target.value) || 0
                        })}
                      />
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveCustomItem(item.id)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Notes..."
                      value={item.notes || ''}
                      onChange={(e) => handleUpdateCustomItem(item.id, {
                        notes: e.target.value
                      })}
                    />
                  </div>
                </div>
              ))}
              <div className="custom-total">
                <strong>Total Custom Hours: {calculations.customItemHours}h</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {showCustomAddonModal && (
        <div className="modal-overlay" onClick={() => setShowCustomAddonModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Custom Add-on</h3>
            <div className="form-group">
              <label>Add-on Name</label>
              <input
                type="text"
                value={customAddon.name}
                onChange={(e) => setCustomAddon({ ...customAddon, name: e.target.value })}
                placeholder="Enter add-on name"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={customAddon.category}
                onChange={(e) => setCustomAddon({ ...customAddon, category: e.target.value })}
                placeholder="Enter category"
              />
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
            <div className="modal-actions">
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
