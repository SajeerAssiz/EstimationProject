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
  { id: 'medium', name: 'Medium', multiplier: 1.5, description: 'Some cleansing needed, minor transformations' },
  { id: 'high', name: 'High', multiplier: 2.5, description: 'Significant cleansing, complex transformations' },
];

const volumeOptions = [
  { id: 'small', name: 'Small', multiplier: 1.0, description: '< 10,000 records' },
  { id: 'medium', name: 'Medium', multiplier: 1.2, description: '10,000 - 100,000 records' },
  { id: 'large', name: 'Large', multiplier: 1.5, description: '100,000 - 1,000,000 records' },
  { id: 'very_large', name: 'Very Large', multiplier: 2.0, description: '> 1,000,000 records' },
];

function DataMigration() {
  const { state, dispatch, calculations } = useEstimation();
  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleRemoveMigration = (id) => {
    dispatch({ type: 'REMOVE_DATA_MIGRATION', payload: id });
  };

  const handleUpdateMigration = (id, updates) => {
    // Recalculate hours if complexity or volume changed
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

  // Group by category
  const groupedMigrations = dataMigrations.reduce((groups, migration) => {
    const category = migration.category || 'Other';
    if (!groups[category]) groups[category] = [];
    groups[category].push(migration);
    return groups;
  }, {});

  // Check which entities are already added
  const addedEntityIds = dataMigrations.map(m => m.entityId);

  return (
    <div className="section data-migration">
      <div className="section-header">
        <h2>Data Migration Scope</h2>
        <div className="section-summary">
          <span>{dataMigrations.length} entities</span>
          <span className="divider">|</span>
          <span className="hours">{totalHours.toLocaleString()} hours</span>
        </div>
      </div>

      <p className="section-description">
        Define the data migration scope including master data, transactional data, and historical records
        to be migrated from legacy systems to D365 F&O.
      </p>

      <div className="migration-actions">
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          + Add Data Entity
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <h3>Add Data Migration Entity</h3>

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

              <div className="form-group">
                <label>Historical Data (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={newMigration.historicalYears}
                  onChange={(e) => setNewMigration({ ...newMigration, historicalYears: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>Custom Hours (optional)</label>
                <input
                  type="number"
                  value={newMigration.customHours || ''}
                  onChange={(e) => setNewMigration({ ...newMigration, customHours: parseInt(e.target.value) || null })}
                  placeholder="Override base hours"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Notes / Requirements</label>
              <textarea
                value={newMigration.notes}
                onChange={(e) => setNewMigration({ ...newMigration, notes: e.target.value })}
                placeholder="Data cleansing requirements, transformation rules, special considerations..."
                rows={3}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div className="modal-actions">
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

      {dataMigrations.length > 0 ? (
        <div className="migration-list">
          {Object.entries(groupedMigrations).map(([category, migrations]) => (
            <div key={category} className="migration-category">
              <h3 className="category-title">{category}</h3>
              <table className="migration-table">
                <thead>
                  <tr>
                    <th>Entity</th>
                    <th>Source</th>
                    <th>Complexity</th>
                    <th>Volume</th>
                    <th>History</th>
                    <th>Hours</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {migrations.map(migration => (
                    <tr key={migration.id}>
                      <td>
                        <strong>{migration.entityName}</strong>
                        {migration.notes && (
                          <p className="migration-notes">{migration.notes}</p>
                        )}
                      </td>
                      <td>{migration.sourceSystem || '-'}</td>
                      <td>
                        <select
                          className="inline-select"
                          value={migration.complexity}
                          onChange={(e) => handleUpdateMigration(migration.id, { complexity: e.target.value })}
                        >
                          {complexityOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="inline-select"
                          value={migration.volume}
                          onChange={(e) => handleUpdateMigration(migration.id, { volume: e.target.value })}
                        >
                          {volumeOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>{migration.historicalYears > 0 ? `${migration.historicalYears} yrs` : '-'}</td>
                      <td>
                        <input
                          type="number"
                          className="hours-input"
                          value={migration.hours || 0}
                          onChange={(e) => handleUpdateMigration(migration.id, { hours: parseInt(e.target.value) || 0 })}
                        />
                      </td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveMigration(migration.id)}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="migration-total">
            <strong>Total Data Migration Hours:</strong>
            <span className="total-hours">{totalHours.toLocaleString()} hours</span>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Data Migration Entities Defined</h3>
          <p>Add data entities that need to be migrated from legacy systems.</p>
          <button className="btn-primary" onClick={() => setShowAddForm(true)}>
            + Add First Entity
          </button>
        </div>
      )}

      <div className="migration-templates">
        <h3>Quick Add Common Entities</h3>
        <div className="template-buttons">
          {migrationEntities
            .filter(entity => !addedEntityIds.includes(entity.id))
            .slice(0, 8)
            .map(entity => (
              <button
                key={entity.id}
                className="template-btn"
                onClick={() => {
                  setNewMigration({
                    ...newMigration,
                    entityId: entity.id,
                  });
                  setShowAddForm(true);
                }}
              >
                + {entity.name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default DataMigration;
