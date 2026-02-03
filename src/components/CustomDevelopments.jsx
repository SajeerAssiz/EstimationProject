import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';

const developmentTypes = [
  { id: 'form', name: 'Custom Form', baseHours: 24, category: 'UI', icon: '🖥️' },
  { id: 'report_ssrs', name: 'SSRS Report', baseHours: 16, category: 'Reporting', icon: '📄' },
  { id: 'report_excel', name: 'Excel Export', baseHours: 8, category: 'Reporting', icon: '📊' },
  { id: 'workflow', name: 'Workflow', baseHours: 32, category: 'Automation', icon: '🔄' },
  { id: 'batch_job', name: 'Batch Job', baseHours: 20, category: 'Automation', icon: '⚡' },
  { id: 'interface', name: 'Data Interface', baseHours: 40, category: 'Integration', icon: '🔗' },
  { id: 'extension', name: 'Form Extension', baseHours: 16, category: 'Customization', icon: '🔧' },
  { id: 'coc', name: 'Chain of Command', baseHours: 12, category: 'Customization', icon: '⛓️' },
  { id: 'event_handler', name: 'Event Handler', baseHours: 8, category: 'Customization', icon: '📡' },
  { id: 'entity', name: 'Data Entity', baseHours: 16, category: 'Data', icon: '💾' },
  { id: 'security', name: 'Security Role', baseHours: 8, category: 'Security', icon: '🔒' },
  { id: 'number_seq', name: 'Number Sequence', baseHours: 4, category: 'Setup', icon: '🔢' },
  { id: 'menu_item', name: 'Menu Item', baseHours: 2, category: 'UI', icon: '📋' },
  { id: 'power_app', name: 'Power App', baseHours: 40, category: 'Low-Code', icon: '📱' },
  { id: 'power_automate', name: 'Power Automate Flow', baseHours: 16, category: 'Low-Code', icon: '🌊' },
];

const complexityOptions = [
  { id: 'simple', name: 'Simple', multiplier: 1.0 },
  { id: 'medium', name: 'Medium', multiplier: 1.5 },
  { id: 'complex', name: 'Complex', multiplier: 2.5 },
];

function CustomDevelopments() {
  const { state, dispatch, formatEstimate, getUnitLabel } = useEstimation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [newItem, setNewItem] = useState({
    type: '',
    name: '',
    description: '',
    complexity: 'medium',
    customHours: null,
    module: '',
    priority: 'medium',
  });

  const categories = ['all', ...new Set(developmentTypes.map(d => d.category))];

  const filteredTypes = developmentTypes.filter(d => {
    const matchesCategory = activeCategory === 'all' || d.category === activeCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'UI': '🖥️',
      'Reporting': '📄',
      'Automation': '⚡',
      'Integration': '🔗',
      'Customization': '🔧',
      'Data': '💾',
      'Security': '🔒',
      'Setup': '⚙️',
      'Low-Code': '📱',
      'Custom': '🛠️'
    };
    return icons[category] || '📦';
  };

  const handleQuickAdd = (devType) => {
    setNewItem({
      type: devType.id,
      name: '',
      description: '',
      complexity: 'medium',
      customHours: null,
      module: '',
      priority: 'medium',
    });
    setShowAddForm(true);
  };

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
    <div className="section custom-dev-modern">
      <div className="section-header">
        <div className="header-title">
          <h2>Custom Developments</h2>
          <p className="section-subtitle">Forms, Reports, Workflows & Customizations</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-number">{state.customItems.length}</span>
            <span className="stat-text">Items</span>
          </div>
          <div className="stat-pill primary">
            <span className="stat-number">{formatEstimate(totalHours).toLocaleString()}</span>
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
            placeholder="Search development types..."
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

      {/* Development Types Grid */}
      <div className="integrations-grid">
        {filteredTypes.map(devType => (
          <div
            key={devType.id}
            className="integration-card clickable"
            onClick={() => handleQuickAdd(devType)}
          >
            <div className="card-icon">{devType.icon}</div>
            <div className="card-content">
              <h4 className="card-title">{devType.name}</h4>
              <span className="card-category">{devType.category}</span>
            </div>
            <div className="card-footer">
              <span className="card-hours">{devType.baseHours}h base</span>
              <span className="add-badge">+ Add</span>
            </div>
          </div>
        ))}

        {/* Add Custom Card */}
        <div
          className="integration-card custom-card"
          onClick={() => {
            setNewItem({
              type: '',
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
          <div className="card-icon">➕</div>
          <div className="card-content">
            <h4 className="card-title">Custom Item</h4>
            <span className="card-category">Add your own</span>
          </div>
          <div className="card-footer">
            <span className="add-badge">Create New</span>
          </div>
        </div>
      </div>

      {/* Selected Items */}
      {state.customItems.length > 0 && (
        <div className="selected-integrations-modern">
          <div className="selected-header">
            <h3>Development Items</h3>
            <span className="selected-count">{state.customItems.length} items • {totalHours}h total</span>
          </div>

          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="category-group">
              <div className="category-group-header">
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-name">{category}</span>
                <span className="category-count">{items.length}</span>
              </div>
              <div className="selected-list">
                {items.map(item => (
                  <div key={item.id} className="selected-item dev-item">
                    <div className="item-main">
                      <div className="item-icon">{getCategoryIcon(item.category)}</div>
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <div className="item-meta">
                          {item.module && <span className="item-module">{item.module}</span>}
                          <span className={`priority-pill priority-${item.priority || 'medium'}`}>
                            {item.priority || 'medium'}
                          </span>
                        </div>
                        {item.description && (
                          <p className="item-description">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="item-controls">
                      <div className="control-group">
                        <label>Priority</label>
                        <select
                          value={item.priority || 'medium'}
                          onChange={(e) => handleUpdateItem(item.id, { priority: e.target.value })}
                          className="compact-select"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      <div className="control-group">
                        <label>Hours</label>
                        <input
                          type="number"
                          className="compact-input"
                          value={item.hours || 0}
                          onChange={(e) => handleUpdateItem(item.id, {
                            hours: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                      <div className="control-group estimate">
                        <label>Est.</label>
                        <span className="estimate-value">{item.hours}h</span>
                      </div>
                    </div>
                    <button
                      className="item-remove"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {state.customItems.length === 0 && (
        <div className="empty-state-modern">
          <div className="empty-icon">🛠️</div>
          <h3>No Custom Developments</h3>
          <p>Click on development types above to add custom items</p>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal modern-modal modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Development</h3>
              <button className="modal-close" onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <div className="modal-body">
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
                />
              </div>
            </div>
            <div className="modal-footer">
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
    </div>
  );
}

export default CustomDevelopments;
