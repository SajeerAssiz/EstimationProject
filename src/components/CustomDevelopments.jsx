import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';

const developmentTypes = [
  { id: 'form', name: 'Custom Form', baseHours: 24, category: 'UI' },
  { id: 'report_ssrs', name: 'SSRS Report', baseHours: 16, category: 'Reporting' },
  { id: 'report_excel', name: 'Excel Export', baseHours: 8, category: 'Reporting' },
  { id: 'workflow', name: 'Workflow', baseHours: 32, category: 'Automation' },
  { id: 'batch_job', name: 'Batch Job', baseHours: 20, category: 'Automation' },
  { id: 'interface', name: 'Data Interface', baseHours: 40, category: 'Integration' },
  { id: 'extension', name: 'Form Extension', baseHours: 16, category: 'Customization' },
  { id: 'coc', name: 'Chain of Command', baseHours: 12, category: 'Customization' },
  { id: 'event_handler', name: 'Event Handler', baseHours: 8, category: 'Customization' },
  { id: 'entity', name: 'Data Entity', baseHours: 16, category: 'Data' },
  { id: 'security', name: 'Security Role', baseHours: 8, category: 'Security' },
  { id: 'number_seq', name: 'Number Sequence', baseHours: 4, category: 'Setup' },
  { id: 'menu_item', name: 'Menu Item', baseHours: 2, category: 'UI' },
  { id: 'power_app', name: 'Power App', baseHours: 40, category: 'Low-Code' },
  { id: 'power_automate', name: 'Power Automate Flow', baseHours: 16, category: 'Low-Code' },
];

const complexityOptions = [
  { id: 'simple', name: 'Simple', multiplier: 1.0 },
  { id: 'medium', name: 'Medium', multiplier: 1.5 },
  { id: 'complex', name: 'Complex', multiplier: 2.5 },
];

function CustomDevelopments() {
  const { state, dispatch } = useEstimation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    type: '',
    name: '',
    description: '',
    complexity: 'medium',
    customHours: null,
    module: '',
    priority: 'medium',
  });

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      alert('Please enter a name for the development item.');
      return;
    }

    const typeInfo = developmentTypes.find(t => t.id === newItem.type) || {};
    const complexityInfo = complexityOptions.find(c => c.id === newItem.complexity) || { multiplier: 1 };
    const baseHours = newItem.customHours || typeInfo.baseHours || 20;
    const calculatedHours = Math.round(baseHours * complexityInfo.multiplier);

    dispatch({
      type: 'ADD_CUSTOM_ITEM',
      payload: {
        name: newItem.name,
        category: typeInfo.category || 'Custom',
        hours: calculatedHours,
        description: newItem.description,
        devType: newItem.type,
        complexity: newItem.complexity,
        module: newItem.module,
        priority: newItem.priority,
      },
    });

    setNewItem({
      type: '',
      name: '',
      description: '',
      complexity: 'medium',
      customHours: null,
      module: '',
      priority: 'medium',
    });
    setShowAddForm(false);
  };

  const handleRemoveItem = (id) => {
    dispatch({ type: 'REMOVE_CUSTOM_ITEM', payload: id });
  };

  const handleUpdateItem = (id, updates) => {
    dispatch({ type: 'UPDATE_CUSTOM_ITEM', payload: { id, updates } });
  };

  const totalHours = state.customItems.reduce((sum, item) => sum + (item.hours || 0), 0);

  // Group items by category
  const groupedItems = state.customItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="section custom-developments">
      <div className="section-header">
        <h2>Custom Developments & Reporting</h2>
        <div className="section-summary">
          <span>{state.customItems.length} items</span>
          <span className="hours">{totalHours.toLocaleString()} hours</span>
        </div>
      </div>

      <p className="section-description">
        Define custom development requirements including forms, reports, workflows,
        integrations, and other customizations specific to this implementation.
      </p>

      <div className="dev-actions">
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          + Add Custom Development
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <h3>Add Custom Development</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Development Type</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                >
                  <option value="">Select type...</option>
                  {developmentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.baseHours}h base)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Name / Title *</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Custom Invoice Report"
                />
              </div>

              <div className="form-group">
                <label>Related Module</label>
                <input
                  type="text"
                  value={newItem.module}
                  onChange={(e) => setNewItem({ ...newItem, module: e.target.value })}
                  placeholder="e.g., Accounts Receivable"
                />
              </div>

              <div className="form-group">
                <label>Complexity</label>
                <select
                  value={newItem.complexity}
                  onChange={(e) => setNewItem({ ...newItem, complexity: e.target.value })}
                >
                  {complexityOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} (x{opt.multiplier})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newItem.priority}
                  onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                >
                  <option value="high">High - Must Have</option>
                  <option value="medium">Medium - Should Have</option>
                  <option value="low">Low - Nice to Have</option>
                </select>
              </div>

              <div className="form-group">
                <label>Custom Hours (optional)</label>
                <input
                  type="number"
                  value={newItem.customHours || ''}
                  onChange={(e) => setNewItem({ ...newItem, customHours: parseInt(e.target.value) || null })}
                  placeholder="Override base hours"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Description / Requirements</label>
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe the requirement, business need, and expected functionality..."
                rows={4}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddItem}>
                Add Development Item
              </button>
            </div>
          </div>
        </div>
      )}

      {state.customItems.length > 0 ? (
        <div className="dev-items-list">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="dev-category">
              <h3 className="category-title">{category}</h3>
              <div className="dev-cards">
                {items.map(item => (
                  <div key={item.id} className="dev-card">
                    <div className="dev-card-header">
                      <h4>{item.name}</h4>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        &times;
                      </button>
                    </div>

                    {item.module && (
                      <p className="dev-module">Module: {item.module}</p>
                    )}

                    {item.description && (
                      <p className="dev-description">{item.description}</p>
                    )}

                    <div className="dev-card-footer">
                      <span className={`priority-badge priority-${item.priority || 'medium'}`}>
                        {item.priority || 'medium'}
                      </span>
                      <span className={`complexity-badge ${item.complexity || 'medium'}`}>
                        {item.complexity || 'medium'}
                      </span>
                      <span className="dev-hours">
                        <input
                          type="number"
                          className="hours-input"
                          value={item.hours || 0}
                          onChange={(e) => handleUpdateItem(item.id, {
                            hours: parseInt(e.target.value) || 0
                          })}
                        />
                        hours
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="dev-total">
            <strong>Total Custom Development Hours:</strong>
            <span className="total-hours">{totalHours.toLocaleString()} hours</span>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p>No custom development items added yet.</p>
          <p>Click "Add Custom Development" to define custom reports, forms, workflows, and other customizations.</p>
        </div>
      )}

      <div className="dev-templates">
        <h3>Quick Add Templates</h3>
        <div className="template-buttons">
          {developmentTypes.slice(0, 8).map(type => (
            <button
              key={type.id}
              className="template-btn"
              onClick={() => {
                setNewItem({
                  type: type.id,
                  name: '',
                  description: '',
                  complexity: 'medium',
                  customHours: null,
                  module: '',
                  priority: 'medium',
                });
                setShowAddForm(true);
              }}
            >
              + {type.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomDevelopments;
