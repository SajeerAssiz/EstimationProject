import React, { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';

// Default consultant types
const defaultConsultantTypes = [
  { id: 'pm', name: 'Project Manager', defaultLocation: 'onsite' },
  { id: 'scm1', name: 'SCM Consultant', defaultLocation: 'onsite' },
  { id: 'scm2', name: 'SCM Consultant', defaultLocation: 'onsite' },
  { id: 'scm3', name: 'SCM Consultant', defaultLocation: 'offshore' },
  { id: 'fin1', name: 'Finance Consultant', defaultLocation: 'onsite' },
  { id: 'fin2', name: 'Finance Consultant', defaultLocation: 'onsite' },
  { id: 'fin3', name: 'Finance Consultant', defaultLocation: 'offshore' },
  { id: 'hr1', name: 'HR and Payroll Consultant', defaultLocation: 'onsite' },
  { id: 'hr2', name: 'HR and Payroll Consultant', defaultLocation: 'offshore' },
  { id: 'retail', name: 'Retail Consultant', defaultLocation: 'offshore' },
  { id: 'tech1', name: 'Technical Consultant', defaultLocation: 'offshore' },
  { id: 'tech2', name: 'Technical Consultant', defaultLocation: 'offshore' },
  { id: 'tech3', name: 'Technical Consultant', defaultLocation: 'offshore' },
  { id: 'tech4', name: 'Technical Consultant', defaultLocation: 'offshore' },
  { id: 'tech5', name: 'Technical Consultant', defaultLocation: 'offshore' },
  { id: 'bi1', name: 'BI Consultant', defaultLocation: 'offshore' },
  { id: 'bi2', name: 'BI Consultant', defaultLocation: 'offshore' },
  { id: 'infra', name: 'Infra Consultant', defaultLocation: 'offshore' },
];

// Project phases for resource loading
const projectPhases = [
  { id: 'analysis', name: 'Analysis', months: 2 },
  { id: 'design_dev', name: 'Design & Development', months: 5 },
  { id: 'deployment', name: 'Deployment', months: 3 },
  { id: 'operation', name: 'Operation', months: 3 },
];

// Default rates
const defaultRates = {
  onsite: {
    'Project Manager': 1500,
    'SCM Consultant': 1200,
    'Finance Consultant': 1200,
    'HR and Payroll Consultant': 1100,
    'Retail Consultant': 1100,
    'Technical Consultant': 1000,
    'BI Consultant': 1000,
    'Infra Consultant': 900,
  },
  offshore: {
    'Project Manager': 800,
    'SCM Consultant': 600,
    'Finance Consultant': 600,
    'HR and Payroll Consultant': 550,
    'Retail Consultant': 550,
    'Technical Consultant': 500,
    'BI Consultant': 500,
    'Infra Consultant': 450,
  },
};

function ResourceLoading() {
  const { state, dispatch } = useEstimation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    defaultLocation: 'offshore',
  });

  // Initialize resource data from state or defaults
  const resourceData = state.resourceLoading || {
    resources: defaultConsultantTypes.map(c => ({
      ...c,
      phases: projectPhases.reduce((acc, phase) => {
        acc[phase.id] = {
          location: c.defaultLocation,
          days: 0,
        };
        return acc;
      }, {}),
    })),
    rates: defaultRates,
    phases: projectPhases,
  };

  const resources = resourceData.resources || [];
  const rates = resourceData.rates || defaultRates;
  const phases = resourceData.phases || projectPhases;

  // Calculate cost for a resource/phase
  const calculateCost = (resource, phaseId) => {
    const phaseData = resource.phases?.[phaseId];
    if (!phaseData || !phaseData.days) return 0;
    const location = phaseData.location || 'offshore';
    const rate = rates[location]?.[resource.name] || 500;
    return phaseData.days * rate;
  };

  // Calculate total days for a resource
  const getTotalDays = (resource) => {
    return phases.reduce((total, phase) => {
      return total + (resource.phases?.[phase.id]?.days || 0);
    }, 0);
  };

  // Calculate total cost for a resource
  const getTotalCost = (resource) => {
    return phases.reduce((total, phase) => {
      return total + calculateCost(resource, phase.id);
    }, 0);
  };

  // Calculate phase totals
  const getPhaseTotals = (phaseId) => {
    let totalDays = 0;
    let totalCost = 0;
    resources.forEach(resource => {
      totalDays += resource.phases?.[phaseId]?.days || 0;
      totalCost += calculateCost(resource, phaseId);
    });
    return { days: totalDays, cost: totalCost };
  };

  // Grand totals
  const grandTotals = {
    days: resources.reduce((total, r) => total + getTotalDays(r), 0),
    cost: resources.reduce((total, r) => total + getTotalCost(r), 0),
    onsiteDays: resources.reduce((total, r) => {
      return total + phases.reduce((pTotal, phase) => {
        const pd = r.phases?.[phase.id];
        return pTotal + (pd?.location === 'onsite' ? pd.days || 0 : 0);
      }, 0);
    }, 0),
    offshoreDays: resources.reduce((total, r) => {
      return total + phases.reduce((pTotal, phase) => {
        const pd = r.phases?.[phase.id];
        return pTotal + (pd?.location === 'offshore' ? pd.days || 0 : 0);
      }, 0);
    }, 0),
  };

  // Update resource data
  const updateResourceData = (newData) => {
    dispatch({
      type: 'UPDATE_RESOURCE_LOADING',
      payload: { ...resourceData, ...newData },
    });
  };

  // Update resource phase
  const updateResourcePhase = (resourceId, phaseId, updates) => {
    const newResources = resources.map(r => {
      if (r.id === resourceId) {
        return {
          ...r,
          phases: {
            ...r.phases,
            [phaseId]: { ...r.phases[phaseId], ...updates },
          },
        };
      }
      return r;
    });
    updateResourceData({ resources: newResources });
  };

  // Add new resource
  const handleAddResource = () => {
    if (!newResource.name.trim()) return;

    const newId = `custom_${crypto.randomUUID()}`;
    const newResourceItem = {
      id: newId,
      name: newResource.name,
      defaultLocation: newResource.defaultLocation,
      phases: phases.reduce((acc, phase) => {
        acc[phase.id] = {
          location: newResource.defaultLocation,
          days: 0,
        };
        return acc;
      }, {}),
    };

    updateResourceData({ resources: [...resources, newResourceItem] });
    setNewResource({ name: '', defaultLocation: 'offshore' });
    setShowAddModal(false);
  };

  // Remove resource
  const handleRemoveResource = (resourceId) => {
    updateResourceData({
      resources: resources.filter(r => r.id !== resourceId),
    });
  };

  // Update rate
  const updateRate = (location, roleName, rate) => {
    const newRates = {
      ...rates,
      [location]: {
        ...rates[location],
        [roleName]: parseFloat(rate) || 0,
      },
    };
    updateResourceData({ rates: newRates });
  };

  // Get unique role names for rate card
  const uniqueRoles = [...new Set(resources.map(r => r.name))];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.projectInfo?.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="section resource-loading-modern">
      <div className="section-header">
        <div className="header-title">
          <h2>Resource Loading & Costing</h2>
          <p className="section-subtitle">Plan consultant allocation across project phases</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-number">{resources.length}</span>
            <span className="stat-text">Resources</span>
          </div>
          <div className="stat-pill">
            <span className="stat-number">{grandTotals.days}</span>
            <span className="stat-text">Total Days</span>
          </div>
          <div className="stat-pill primary">
            <span className="stat-number">{formatCurrency(grandTotals.cost)}</span>
            <span className="stat-text">Total Cost</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="resource-summary-grid">
        <div className="resource-summary-card">
          <div className="summary-label">Onsite Days</div>
          <div className="summary-value">{grandTotals.onsiteDays}</div>
          <div className="summary-unit">days</div>
        </div>
        <div className="resource-summary-card">
          <div className="summary-label">Offshore Days</div>
          <div className="summary-value">{grandTotals.offshoreDays}</div>
          <div className="summary-unit">days</div>
        </div>
        <div className="resource-summary-card">
          <div className="summary-label">Total Man-Days</div>
          <div className="summary-value">{grandTotals.days}</div>
          <div className="summary-unit">days</div>
        </div>
        <div className="resource-summary-card highlight">
          <div className="summary-label">Total Project Cost</div>
          <div className="summary-value">{formatCurrency(grandTotals.cost)}</div>
          <div className="summary-unit">{state.projectInfo?.currency || 'USD'}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="resource-actions">
        <button className="add-resource-btn" onClick={() => setShowAddModal(true)}>
          ➕ Add Resource
        </button>
        <button className="add-resource-btn" onClick={() => setShowRatesModal(true)} style={{ background: '#6c757d' }}>
          💰 Edit Rates
        </button>
      </div>

      {/* Resource Loading Table */}
      <div className="resource-table-container">
        <table className="resource-table">
          <thead>
            <tr>
              <th rowSpan="2" style={{ background: '#365f3b', textAlign: 'left', paddingLeft: '1rem' }}>
                Consultant Type
              </th>
              {phases.map(phase => (
                <th key={phase.id} colSpan="3" className="phase-header">
                  {phase.name} ({phase.months}M)
                </th>
              ))}
              <th rowSpan="2" style={{ background: '#365f3b' }}>Total Days</th>
              <th rowSpan="2" style={{ background: '#365f3b' }}>Total Cost</th>
              <th rowSpan="2" style={{ background: '#365f3b', width: '40px' }}></th>
            </tr>
            <tr>
              {phases.map(phase => (
                <React.Fragment key={`header-${phase.id}`}>
                  <th>Location</th>
                  <th>Days</th>
                  <th>Cost</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td className="consultant-type-cell">{resource.name}</td>
                {phases.map(phase => {
                  const phaseData = resource.phases?.[phase.id] || {};
                  const cost = calculateCost(resource, phase.id);
                  return (
                    <React.Fragment key={`${resource.id}-${phase.id}`}>
                      <td>
                        <select
                          className="location-select"
                          value={phaseData.location || 'offshore'}
                          onChange={(e) => updateResourcePhase(resource.id, phase.id, { location: e.target.value })}
                        >
                          <option value="onsite">On Site</option>
                          <option value="offshore">Off Shore</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="days-input"
                          min="0"
                          value={phaseData.days || ''}
                          onChange={(e) => updateResourcePhase(resource.id, phase.id, {
                            days: parseInt(e.target.value) || 0
                          })}
                          placeholder="0"
                        />
                      </td>
                      <td className="cost-cell">
                        {cost > 0 ? formatCurrency(cost) : '-'}
                      </td>
                    </React.Fragment>
                  );
                })}
                <td style={{ fontWeight: 600 }}>{getTotalDays(resource)}</td>
                <td className="cost-cell">{formatCurrency(getTotalCost(resource))}</td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveResource(resource.id)}
                    title="Remove"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}

            {/* Phase Totals Row */}
            <tr className="total-row">
              <td className="consultant-type-cell">Phase Totals</td>
              {phases.map(phase => {
                const totals = getPhaseTotals(phase.id);
                return (
                  <React.Fragment key={`total-${phase.id}`}>
                    <td></td>
                    <td style={{ fontWeight: 700 }}>{totals.days}</td>
                    <td className="cost-cell">{formatCurrency(totals.cost)}</td>
                  </React.Fragment>
                );
              })}
              <td style={{ fontWeight: 700 }}>{grandTotals.days}</td>
              <td className="cost-cell">{formatCurrency(grandTotals.cost)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rate Card Section */}
      <div className="rate-card-section">
        <h4>💰 Daily Rate Card ({state.projectInfo?.currency || 'USD'})</h4>
        <div className="rate-card-grid">
          {uniqueRoles.map(role => (
            <div key={role} className="rate-card-item">
              <span className="role-name">{role}</span>
              <div className="rate-inputs">
                <div>
                  <span className="rate-label">Onsite</span>
                  <input
                    type="number"
                    className="rate-input"
                    value={rates.onsite?.[role] || ''}
                    onChange={(e) => updateRate('onsite', role, e.target.value)}
                  />
                </div>
                <div>
                  <span className="rate-label">Offshore</span>
                  <input
                    type="number"
                    className="rate-input"
                    value={rates.offshore?.[role] || ''}
                    onChange={(e) => updateRate('offshore', role, e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal modern-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Resource</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Consultant Type / Role</label>
                <input
                  type="text"
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                  placeholder="e.g., Solution Architect"
                />
              </div>
              <div className="form-group">
                <label>Default Location</label>
                <select
                  value={newResource.defaultLocation}
                  onChange={(e) => setNewResource({ ...newResource, defaultLocation: e.target.value })}
                >
                  <option value="onsite">On Site</option>
                  <option value="offshore">Off Shore</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddResource}>
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rates Modal */}
      {showRatesModal && (
        <div className="modal-overlay" onClick={() => setShowRatesModal(false)}>
          <div className="modal modern-modal modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Daily Rates ({state.projectInfo?.currency || 'USD'})</h3>
              <button className="modal-close" onClick={() => setShowRatesModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.75rem', borderBottom: '2px solid var(--border-color)' }}>Role</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid var(--border-color)' }}>Onsite Rate</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid var(--border-color)' }}>Offshore Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueRoles.map(role => (
                    <tr key={role}>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)' }}>{role}</td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <input
                          type="number"
                          className="compact-input"
                          style={{ width: '100px' }}
                          value={rates.onsite?.[role] || ''}
                          onChange={(e) => updateRate('onsite', role, e.target.value)}
                        />
                      </td>
                      <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <input
                          type="number"
                          className="compact-input"
                          style={{ width: '100px' }}
                          value={rates.offshore?.[role] || ''}
                          onChange={(e) => updateRate('offshore', role, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowRatesModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceLoading;
