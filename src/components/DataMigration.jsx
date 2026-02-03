import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';

const migrationEntities = [
  { id: 'customers', name: 'Customers / Accounts', category: 'Master Data', baseHours: 40, description: 'Customer master records, addresses, contacts' },
  { id: 'vendors', name: 'Vendors / Suppliers', category: 'Master Data', baseHours: 40, description: 'Vendor master records, addresses, contacts' },
  { id: 'products', name: 'Products / Items', category: 'Master Data', baseHours: 60, description: 'Product master, variants, attributes, pricing' },
  { id: 'bom', name: 'Bill of Materials', category: 'Master Data', baseHours: 50, description: 'BOM structures, routes, formulas' },
  { id: 'coa', name: 'Chart of Accounts', category: 'Finance', baseHours: 30, description: 'GL accounts, financial dimensions' },
  { id: 'open_ar', name: 'Open AR Transactions', category: 'Finance', baseHours: 40, description: 'Open customer invoices, payments' },
  { id: 'open_ap', name: 'Open AP Transactions', category: 'Finance', baseHours: 40, description: 'Open vendor invoices, payments' },
  { id: 'gl_balances', name: 'GL Opening Balances', category: 'Finance', baseHours: 30, description: 'Trial balance, opening entries' },
  { id: 'fixed_assets', name: 'Fixed Assets', category: 'Finance', baseHours: 50, description: 'Asset records, depreciation history' },
  { id: 'inventory', name: 'Inventory On-Hand', category: 'Supply Chain', baseHours: 60, description: 'Stock quantities, locations, batches' },
  { id: 'open_po', name: 'Open Purchase Orders', category: 'Supply Chain', baseHours: 35, description: 'Open PO headers and lines' },
  { id: 'open_so', name: 'Open Sales Orders', category: 'Supply Chain', baseHours: 35, description: 'Open SO headers and lines' },
  { id: 'employees', name: 'Employees', category: 'HR', baseHours: 45, description: 'Employee records, positions, history' },
  { id: 'historical_trans', name: 'Historical Transactions', category: 'Historical', baseHours: 80, description: 'Past transactions for reporting (1-3 years)' },
  { id: 'projects', name: 'Projects', category: 'Projects', baseHours: 50, description: 'Project records, WBS, budgets' },
  { id: 'price_lists', name: 'Price Lists / Trade Agreements', category: 'Master Data', baseHours: 45, description: 'Sales prices, purchase prices, discounts' },
  { id: 'bank_accounts', name: 'Bank Accounts', category: 'Finance', baseHours: 20, description: 'Bank accounts setup and balances' },
  { id: 'warehouses', name: 'Warehouses & Locations', category: 'Supply Chain', baseHours: 30, description: 'Warehouse structure, locations, zones' },
];

const complexityOptions = [
  { id: 'low', name: 'Low', multiplier: 1.0, description: 'Clean data, standard format' },
  { id: 'medium', name: 'Medium', multiplier: 1.5, description: 'Some cleansing needed' },
  { id: 'high', name: 'High', multiplier: 2.5, description: 'Significant cleansing required' },
];

const volumeOptions = [
  { id: 'small', name: 'Small', multiplier: 1.0, description: '< 10K records' },
  { id: 'medium', name: 'Medium', multiplier: 1.2, description: '10K - 100K records' },
  { id: 'large', name: 'Large', multiplier: 1.5, description: '100K - 1M records' },
  { id: 'very_large', name: 'Very Large', multiplier: 2.0, description: '> 1M records' },
];

function DataMigration() {
  const { state, dispatch, formatEstimate, getUnitLabel } = useEstimation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [newMigration, setNewMigration] = useState({
    entityId: '',
    sourceSystem: '',
    complexity: 'medium',
    volume: 'medium',
    historicalYears: 0,
    notes: '',
    customHours: null,
  });

  const dataMigrations = state.dataMigrations || [];
  const categories = ['all', ...new Set(migrationEntities.map(e => e.category))];

  const getCategoryIcon = (category) => {
    const icons = {
      'Master Data': '📋',
      'Finance': '💰',
      'Supply Chain': '📦',
      'HR': '👥',
      'Historical': '📚',
      'Projects': '📊'
    };
    return icons[category] || '📄';
  };

  const filteredEntities = migrationEntities.filter(e => {
    const matchesCategory = activeCategory === 'all' || e.category === activeCategory;
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddMigration = () => {
    const entity = migrationEntities.find(e => e.id === newMigration.entityId);
    if (!entity) {
      alert('Please select a data entity to migrate.');
      return;
    }

    const complexityMult = complexityOptions.find(c => c.id === newMigration.complexity)?.multiplier || 1;
    const volumeMult = volumeOptions.find(v => v.id === newMigration.volume)?.multiplier || 1;
    const baseHours = newMigration.customHours || entity.baseHours;
    const calculatedHours = Math.round(baseHours * complexityMult * volumeMult);

    dispatch({
      type: 'ADD_DATA_MIGRATION',
      payload: {
        entityId: newMigration.entityId,
        entityName: entity.name,
        category: entity.category,
        sourceSystem: newMigration.sourceSystem,
        complexity: newMigration.complexity,
        volume: newMigration.volume,
        historicalYears: newMigration.historicalYears,
        notes: newMigration.notes,
        baseHours: entity.baseHours,
        customHours: newMigration.customHours,
        hours: calculatedHours,
      },
    });

    setNewMigration({
      entityId: '',
      sourceSystem: '',
      complexity: 'medium',
      volume: 'medium',
      historicalYears: 0,
      notes: '',
      customHours: null,
    });
    setShowAddForm(false);
  };

  const handleQuickAdd = (entity) => {
    if (addedEntityIds.includes(entity.id)) return;

    const complexityMult = complexityOptions.find(c => c.id === 'medium')?.multiplier || 1;
    const volumeMult = volumeOptions.find(v => v.id === 'medium')?.multiplier || 1;
    const calculatedHours = Math.round(entity.baseHours * complexityMult * volumeMult);

    dispatch({
      type: 'ADD_DATA_MIGRATION',
      payload: {
        entityId: entity.id,
        entityName: entity.name,
        category: entity.category,
        sourceSystem: '',
        complexity: 'medium',
        volume: 'medium',
        historicalYears: 0,
        notes: '',
        baseHours: entity.baseHours,
        customHours: null,
        hours: calculatedHours,
      },
    });
  };

  const handleRemoveMigration = (id) => {
    dispatch({ type: 'REMOVE_DATA_MIGRATION', payload: id });
  };

  const handleUpdateMigration = (id, updates) => {
    const migration = dataMigrations.find(m => m.id === id);
    if (migration) {
      const newComplexity = updates.complexity || migration.complexity;
      const newVolume = updates.volume || migration.volume;
      const complexityMult = complexityOptions.find(c => c.id === newComplexity)?.multiplier || 1;
      const volumeMult = volumeOptions.find(v => v.id === newVolume)?.multiplier || 1;
      const baseHours = updates.customHours !== undefined
        ? (updates.customHours || migration.baseHours)
        : (migration.customHours || migration.baseHours);
      const newHours = Math.round(baseHours * complexityMult * volumeMult);

      dispatch({
        type: 'UPDATE_DATA_MIGRATION',
        payload: { id, updates: { ...updates, hours: newHours } }
      });
    }
  };

  const totalHours = dataMigrations.reduce((sum, m) => sum + (m.hours || 0), 0);
  const addedEntityIds = dataMigrations.map(m => m.entityId);

  return (
    <div className="section data-migration-modern">
      <div className="section-header">
        <div className="header-title">
          <h2>Data Migration</h2>
          <p className="section-subtitle">Define data entities to migrate from legacy systems</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-number">{dataMigrations.length}</span>
            <span className="stat-text">Entities</span>
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
            placeholder="Search data entities..."
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

      {/* Data Entities Grid */}
      <div className="integrations-grid">
        {filteredEntities.map(entity => {
          const isAdded = addedEntityIds.includes(entity.id);
          return (
            <div
              key={entity.id}
              className={`integration-card ${isAdded ? 'added' : ''}`}
              onClick={() => handleQuickAdd(entity)}
            >
              <div className="card-icon">{getCategoryIcon(entity.category)}</div>
              <div className="card-content">
                <h4 className="card-title">{entity.name}</h4>
                <span className="card-category">{entity.category}</span>
                <p className="card-description">{entity.description}</p>
              </div>
              <div className="card-footer">
                <span className="card-hours">{entity.baseHours}h base</span>
                {isAdded ? (
                  <span className="added-badge">✓ Added</span>
                ) : (
                  <span className="add-badge">+ Add</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Migrations */}
      {dataMigrations.length > 0 && (
        <div className="selected-integrations-modern">
          <div className="selected-header">
            <h3>Migration Scope</h3>
            <span className="selected-count">{dataMigrations.length} entities • {totalHours}h total</span>
          </div>
          <div className="selected-list">
            {dataMigrations.map(migration => (
              <div key={migration.id} className="selected-item migration-item">
                <div className="item-main">
                  <div className="item-icon">{getCategoryIcon(migration.category)}</div>
                  <div className="item-info">
                    <span className="item-name">{migration.entityName}</span>
                    <div className="item-meta">
                      <span className="item-category">{migration.category}</span>
                      {migration.sourceSystem && (
                        <span className="source-system">from {migration.sourceSystem}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="item-controls">
                  <div className="control-group">
                    <label>Source</label>
                    <input
                      type="text"
                      className="compact-input wide"
                      placeholder="Source system"
                      value={migration.sourceSystem || ''}
                      onChange={(e) => handleUpdateMigration(migration.id, { sourceSystem: e.target.value })}
                    />
                  </div>
                  <div className="control-group">
                    <label>Complexity</label>
                    <select
                      className="compact-select"
                      value={migration.complexity}
                      onChange={(e) => handleUpdateMigration(migration.id, { complexity: e.target.value })}
                    >
                      {complexityOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="control-group">
                    <label>Volume</label>
                    <select
                      className="compact-select"
                      value={migration.volume}
                      onChange={(e) => handleUpdateMigration(migration.id, { volume: e.target.value })}
                    >
                      {volumeOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="control-group estimate">
                    <label>Hours</label>
                    <span className="estimate-value">{migration.hours}h</span>
                  </div>
                </div>
                <button
                  className="item-remove"
                  onClick={() => handleRemoveMigration(migration.id)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {dataMigrations.length === 0 && (
        <div className="empty-state-modern">
          <div className="empty-icon">📊</div>
          <h3>No Data Migration Entities</h3>
          <p>Click on entities above to add them to your migration scope</p>
        </div>
      )}

      {/* Add Custom Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal modern-modal modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Data Migration Entity</h3>
              <button className="modal-close" onClick={() => setShowAddForm(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Data Entity *</label>
                  <select
                    value={newMigration.entityId}
                    onChange={(e) => setNewMigration({ ...newMigration, entityId: e.target.value })}
                  >
                    <option value="">Select entity...</option>
                    {migrationEntities.map(entity => (
                      <option
                        key={entity.id}
                        value={entity.id}
                        disabled={addedEntityIds.includes(entity.id)}
                      >
                        {entity.name} ({entity.baseHours}h) {addedEntityIds.includes(entity.id) ? '- Added' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Source System</label>
                  <input
                    type="text"
                    value={newMigration.sourceSystem}
                    onChange={(e) => setNewMigration({ ...newMigration, sourceSystem: e.target.value })}
                    placeholder="e.g., SAP, Oracle, Legacy ERP"
                  />
                </div>

                <div className="form-group">
                  <label>Data Quality / Complexity</label>
                  <select
                    value={newMigration.complexity}
                    onChange={(e) => setNewMigration({ ...newMigration, complexity: e.target.value })}
                  >
                    {complexityOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} (x{opt.multiplier}) - {opt.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Data Volume</label>
                  <select
                    value={newMigration.volume}
                    onChange={(e) => setNewMigration({ ...newMigration, volume: e.target.value })}
                  >
                    {volumeOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} (x{opt.multiplier}) - {opt.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Notes / Requirements</label>
                <textarea
                  value={newMigration.notes}
                  onChange={(e) => setNewMigration({ ...newMigration, notes: e.target.value })}
                  placeholder="Data cleansing requirements, transformation rules, special considerations..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddMigration}>
                Add Migration Entity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataMigration;
