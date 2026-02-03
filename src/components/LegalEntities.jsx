import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';

const businessTypes = [
  { id: 'retail', name: 'Retail', icon: '🏪', description: 'POS, E-commerce, Store Operations' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭', description: 'Production, BOM, Shop Floor' },
  { id: 'distribution', name: 'Distribution', icon: '📦', description: 'Warehouse, Logistics, 3PL' },
  { id: 'services', name: 'Professional Services', icon: '💼', description: 'Project-based, Time & Materials' },
  { id: 'real_estate', name: 'Real Estate', icon: '🏢', description: 'Property Management, Leasing' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Healthcare Operations' },
  { id: 'finance', name: 'Financial Services', icon: '🏦', description: 'Banking, Insurance' },
  { id: 'holding', name: 'Holding Company', icon: '🏛️', description: 'Group Consolidation' },
  { id: 'shared_services', name: 'Shared Services', icon: '🔄', description: 'Centralized Operations' },
  { id: 'other', name: 'Other', icon: '📋', description: 'Custom Business Type' },
];

const countries = [
  'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'USA', 'UK', 'Germany', 'France', 'India', 'Singapore', 'Other'
];

function LegalEntities() {
  const { state, dispatch } = useEstimation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [newEntity, setNewEntity] = useState({
    name: '',
    code: '',
    businessType: '',
    country: '',
    currency: 'USD',
    description: '',
    isActive: true,
    rolloutPhase: 1,
  });

  const legalEntities = state.legalEntities || [];

  // Group entities by business type
  const groupedEntities = legalEntities.reduce((groups, entity) => {
    const type = entity.businessType || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(entity);
    return groups;
  }, {});

  const activeBusinessTypes = Object.keys(groupedEntities);
  const filterOptions = ['all', ...activeBusinessTypes];

  const filteredEntities = activeFilter === 'all'
    ? legalEntities
    : legalEntities.filter(e => e.businessType === activeFilter);

  const getBusinessType = (id) => businessTypes.find(b => b.id === id) || businessTypes[businessTypes.length - 1];

  const handleAddEntity = () => {
    if (!newEntity.name.trim() || !newEntity.code.trim()) {
      alert('Please enter entity name and code.');
      return;
    }

    dispatch({
      type: 'ADD_LEGAL_ENTITY',
      payload: {
        ...newEntity,
        id: `le_${Date.now()}`,
      },
    });

    setNewEntity({
      name: '',
      code: '',
      businessType: '',
      country: '',
      currency: 'USD',
      description: '',
      isActive: true,
      rolloutPhase: 1,
    });
    setShowAddForm(false);
  };

  const handleRemoveEntity = (id) => {
    if (window.confirm('Remove this legal entity? This will also remove its module selections.')) {
      dispatch({ type: 'REMOVE_LEGAL_ENTITY', payload: id });
    }
  };

  const handleUpdateEntity = (id, updates) => {
    dispatch({ type: 'UPDATE_LEGAL_ENTITY', payload: { id, updates } });
  };

  const handleQuickAdd = (businessType) => {
    setNewEntity({
      ...newEntity,
      businessType: businessType.id,
      name: '',
      code: '',
    });
    setShowAddForm(true);
  };

  return (
    <div className="section legal-entities-modern">
      <div className="section-header">
        <div className="header-title">
          <h2>Legal Entities</h2>
          <p className="section-subtitle">Define business structure and company configuration</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-number">{legalEntities.length}</span>
            <span className="stat-text">Entities</span>
          </div>
          <div className="stat-pill">
            <span className="stat-number">{legalEntities.filter(e => e.isActive).length}</span>
            <span className="stat-text">Active</span>
          </div>
          <div className="stat-pill primary">
            <span className="stat-number">{Object.keys(groupedEntities).length}</span>
            <span className="stat-text">Business Types</span>
          </div>
        </div>
      </div>

      {/* Business Type Quick Add Grid */}
      <div className="integrations-grid">
        {businessTypes.slice(0, 8).map(type => (
          <div
            key={type.id}
            className="integration-card clickable"
            onClick={() => handleQuickAdd(type)}
          >
            <div className="card-icon">{type.icon}</div>
            <div className="card-content">
              <h4 className="card-title">{type.name}</h4>
              <span className="card-category">{type.description}</span>
            </div>
            <div className="card-footer">
              <span className="add-badge">+ Add LE</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legal Entities List */}
      {legalEntities.length > 0 && (
        <div className="selected-integrations-modern">
          <div className="selected-header">
            <h3>Configured Legal Entities</h3>
            <span className="selected-count">{legalEntities.length} entities</span>
          </div>

          {/* Filter Tabs */}
          {activeBusinessTypes.length > 1 && (
            <div className="category-tabs" style={{ marginBottom: '1rem' }}>
              {filterOptions.map(filter => (
                <button
                  key={filter}
                  className={`category-tab ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all' ? 'All' : getBusinessType(filter).name}
                </button>
              ))}
            </div>
          )}

          <div className="le-cards-grid">
            {filteredEntities.map(entity => {
              const businessType = getBusinessType(entity.businessType);
              return (
                <div key={entity.id} className={`le-card-modern ${!entity.isActive ? 'inactive' : ''}`}>
                  <div className="le-card-top">
                    <div className="le-type-icon">{businessType.icon}</div>
                    <div className="le-header-info">
                      <span className="le-code-badge">{entity.code}</span>
                      <button
                        className="item-remove"
                        onClick={() => handleRemoveEntity(entity.id)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <h4 className="le-name">{entity.name}</h4>
                  <p className="le-type-name">{businessType.name}</p>

                  <div className="le-details-row">
                    <div className="le-detail">
                      <span className="le-detail-icon">🌍</span>
                      <span>{entity.country || 'N/A'}</span>
                    </div>
                    <div className="le-detail">
                      <span className="le-detail-icon">💰</span>
                      <span>{entity.currency}</span>
                    </div>
                    <div className="le-detail">
                      <span className={`phase-badge phase-${entity.rolloutPhase}`}>
                        Phase {entity.rolloutPhase}
                      </span>
                    </div>
                  </div>

                  {entity.description && (
                    <p className="le-description">{entity.description}</p>
                  )}

                  <div className="le-card-footer">
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={entity.isActive}
                        onChange={(e) => handleUpdateEntity(entity.id, { isActive: e.target.checked })}
                      />
                      <span className="toggle-text">{entity.isActive ? 'Active' : 'Inactive'}</span>
                    </label>
                    <select
                      className="compact-select"
                      value={entity.rolloutPhase}
                      onChange={(e) => handleUpdateEntity(entity.id, { rolloutPhase: parseInt(e.target.value) })}
                    >
                      <option value={1}>Phase 1</option>
                      <option value={2}>Phase 2</option>
                      <option value={3}>Phase 3</option>
                      <option value={4}>Phase 4</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Table */}
          <div className="le-summary-modern">
            <h4>Structure Summary</h4>
            <div className="summary-grid">
              {Object.entries(groupedEntities).map(([typeId, entities]) => {
                const businessType = getBusinessType(typeId);
                const activeCount = entities.filter(e => e.isActive).length;
                const uniqueCountries = [...new Set(entities.map(e => e.country).filter(Boolean))];
                return (
                  <div key={typeId} className="summary-item">
                    <span className="summary-icon">{businessType.icon}</span>
                    <div className="summary-info">
                      <span className="summary-name">{businessType.name}</span>
                      <span className="summary-meta">
                        {activeCount}/{entities.length} active • {uniqueCountries.length} countries
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {legalEntities.length === 0 && (
        <div className="empty-state-modern">
          <div className="empty-icon">🏢</div>
          <h3>No Legal Entities</h3>
          <p>Click on a business type above to add your first legal entity</p>
        </div>
      )}

      {/* Add Entity Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal modern-modal modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Legal Entity</h3>
              <button className="modal-close" onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Entity Name *</label>
                  <input
                    type="text"
                    value={newEntity.name}
                    onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                    placeholder="e.g., ABC Retail LLC"
                  />
                </div>

                <div className="form-group">
                  <label>Entity Code *</label>
                  <input
                    type="text"
                    value={newEntity.code}
                    onChange={(e) => setNewEntity({ ...newEntity, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., ABCR"
                    maxLength={10}
                  />
                </div>

                <div className="form-group">
                  <label>Business Type</label>
                  <select
                    value={newEntity.businessType}
                    onChange={(e) => setNewEntity({ ...newEntity, businessType: e.target.value })}
                  >
                    <option value="">Select business type...</option>
                    {businessTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <select
                    value={newEntity.country}
                    onChange={(e) => setNewEntity({ ...newEntity, country: e.target.value })}
                  >
                    <option value="">Select country...</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={newEntity.currency}
                    onChange={(e) => setNewEntity({ ...newEntity, currency: e.target.value })}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SAR">SAR - Saudi Riyal</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Rollout Phase</label>
                  <select
                    value={newEntity.rolloutPhase}
                    onChange={(e) => setNewEntity({ ...newEntity, rolloutPhase: parseInt(e.target.value) })}
                  >
                    <option value={1}>Phase 1 - Pilot</option>
                    <option value={2}>Phase 2 - Wave 1</option>
                    <option value={3}>Phase 3 - Wave 2</option>
                    <option value={4}>Phase 4 - Wave 3</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Description / Notes</label>
                <textarea
                  value={newEntity.description}
                  onChange={(e) => setNewEntity({ ...newEntity, description: e.target.value })}
                  placeholder="Additional details about this legal entity..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddEntity}>
                Add Legal Entity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LegalEntities;
