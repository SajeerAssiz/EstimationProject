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

  // Group entities by business type
  const groupedEntities = legalEntities.reduce((groups, entity) => {
    const type = entity.businessType || 'other';
    if (!groups[type]) groups[type] = [];
    groups[type].push(entity);
    return groups;
  }, {});

  // Get business type info
  const getBusinessType = (id) => businessTypes.find(b => b.id === id) || businessTypes[businessTypes.length - 1];

  return (
    <div className="section legal-entities">
      <div className="section-header">
        <h2>Legal Entities & Business Structure</h2>
        <div className="section-summary">
          <span>{legalEntities.length} Legal Entities</span>
          <span className="divider">|</span>
          <span>{Object.keys(groupedEntities).length} Business Types</span>
        </div>
      </div>

      <p className="section-description">
        Define the legal entity structure for this implementation. Each business unit can have
        multiple legal entities. Modules will be estimated per legal entity in a matrix format.
      </p>

      <div className="le-actions">
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          + Add Legal Entity
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <h3>Add Legal Entity</h3>

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
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div className="modal-actions">
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

      {legalEntities.length > 0 ? (
        <div className="le-structure">
          {Object.entries(groupedEntities).map(([typeId, entities]) => {
            const businessType = getBusinessType(typeId);
            return (
              <div key={typeId} className="le-business-group">
                <div className="business-group-header">
                  <span className="business-icon">{businessType.icon}</span>
                  <div className="business-info">
                    <h3>{businessType.name}</h3>
                    <p>{businessType.description}</p>
                  </div>
                  <span className="entity-count">{entities.length} LE(s)</span>
                </div>

                <div className="le-cards">
                  {entities.map(entity => (
                    <div key={entity.id} className={`le-card ${!entity.isActive ? 'inactive' : ''}`}>
                      <div className="le-card-header">
                        <div className="le-code">{entity.code}</div>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveEntity(entity.id)}
                        >
                          &times;
                        </button>
                      </div>
                      <h4 className="le-name">{entity.name}</h4>
                      <div className="le-details">
                        <span className="le-country">{entity.country || 'N/A'}</span>
                        <span className="le-currency">{entity.currency}</span>
                        <span className={`le-phase phase-${entity.rolloutPhase}`}>
                          Phase {entity.rolloutPhase}
                        </span>
                      </div>
                      {entity.description && (
                        <p className="le-description">{entity.description}</p>
                      )}
                      <div className="le-card-footer">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={entity.isActive}
                            onChange={(e) => handleUpdateEntity(entity.id, { isActive: e.target.checked })}
                          />
                          <span>Active in Scope</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="le-summary">
            <h3>Structure Summary</h3>
            <table className="le-summary-table">
              <thead>
                <tr>
                  <th>Business Type</th>
                  <th>Legal Entities</th>
                  <th>Countries</th>
                  <th>Rollout Phase</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedEntities).map(([typeId, entities]) => {
                  const businessType = getBusinessType(typeId);
                  const activeEntities = entities.filter(e => e.isActive);
                  const uniqueCountries = [...new Set(entities.map(e => e.country).filter(Boolean))];
                  const phases = [...new Set(entities.map(e => e.rolloutPhase))].sort();
                  return (
                    <tr key={typeId}>
                      <td>
                        <span className="business-icon-small">{businessType.icon}</span>
                        {businessType.name}
                      </td>
                      <td>{activeEntities.length} / {entities.length}</td>
                      <td>{uniqueCountries.join(', ') || '-'}</td>
                      <td>{phases.map(p => `P${p}`).join(', ')}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{legalEntities.filter(e => e.isActive).length} / {legalEntities.length}</strong></td>
                  <td><strong>{[...new Set(legalEntities.map(e => e.country).filter(Boolean))].length} countries</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🏢</div>
          <h3>No Legal Entities Defined</h3>
          <p>Start by adding the legal entities for this implementation.</p>
          <p>Each legal entity represents a company in D365 F&O.</p>
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            + Add First Legal Entity
          </button>
        </div>
      )}

      {legalEntities.length > 0 && (
        <div className="le-quick-add">
          <h3>Quick Add Templates</h3>
          <div className="template-buttons">
            {businessTypes.slice(0, 6).map(type => (
              <button
                key={type.id}
                className="template-btn"
                onClick={() => {
                  setNewEntity({
                    ...newEntity,
                    businessType: type.id,
                    name: '',
                    code: '',
                  });
                  setShowAddForm(true);
                }}
              >
                {type.icon} Add {type.name} LE
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LegalEntities;
