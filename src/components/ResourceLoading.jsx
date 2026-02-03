import { useState, useMemo } from 'react';
import { useEstimation } from '../context/EstimationContext';

// Default consultant types with pre-populated data matching Excel format
const getDefaultResources = () => [
  { id: 'pm', name: 'Project Manager', phases: {
    analysis: { location: 'onsite', days: 4 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'onsite', days: 5 },
    operation: { location: 'onsite', days: 10 }
  }},
  { id: 'scm1', name: 'SCM Consultant', phases: {
    analysis: { location: 'onsite', days: 4 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'onsite', days: 5 },
    operation: { location: 'onsite', days: 9 }
  }},
  { id: 'scm2', name: 'SCM Consultant', phases: {
    analysis: { location: 'onsite', days: 4 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'onsite', days: 5 },
    operation: { location: 'onsite', days: 9 }
  }},
  { id: 'scm3', name: 'SCM Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 0 },
    deployment: { location: 'offshore', days: 2 },
    operation: { location: 'offshore', days: 1 }
  }},
  { id: 'fin1', name: 'Finance Consultant', phases: {
    analysis: { location: 'onsite', days: 4 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'onsite', days: 5 },
    operation: { location: 'onsite', days: 9 }
  }},
  { id: 'fin2', name: 'Finance Consultant', phases: {
    analysis: { location: 'onsite', days: 4 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'onsite', days: 5 },
    operation: { location: 'onsite', days: 9 }
  }},
  { id: 'fin3', name: 'Finance Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 0 },
    deployment: { location: 'offshore', days: 2 },
    operation: { location: 'offshore', days: 1 }
  }},
  { id: 'hr1', name: 'HR and Payroll Consultant', phases: {
    analysis: { location: 'onsite', days: 4 },
    design_dev: { location: 'offshore', days: 2 },
    deployment: { location: 'onsite', days: 5 },
    operation: { location: 'onsite', days: 9 }
  }},
  { id: 'hr2', name: 'HR and Payroll Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 0 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
  { id: 'retail', name: 'Retail Consultant', phases: {
    analysis: { location: 'offshore', days: 1 },
    design_dev: { location: 'offshore', days: 1 },
    deployment: { location: 'onsite', days: 1 },
    operation: { location: 'onsite', days: 1 }
  }},
  { id: 'tech1', name: 'Technical Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
  { id: 'tech2', name: 'Technical Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
  { id: 'tech3', name: 'Technical Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
  { id: 'tech4', name: 'Technical Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
  { id: 'tech5', name: 'Technical Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
  { id: 'bi1', name: 'BI Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
  { id: 'bi2', name: 'BI Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 5 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
  { id: 'infra', name: 'Infra Consultant', phases: {
    analysis: { location: 'offshore', days: 0 },
    design_dev: { location: 'offshore', days: 0.5 },
    deployment: { location: 'offshore', days: 0 },
    operation: { location: 'offshore', days: 0 }
  }},
];

// Default project phases
const defaultPhases = [
  { id: 'analysis', name: 'Analysis', months: 0 },
  { id: 'design_dev', name: 'Design & Development', months: 0 },
  { id: 'deployment', name: 'Deployment', months: 0 },
  { id: 'operation', name: 'Operation', months: 0 },
];

// Default daily rates (USD)
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
  const [showEstimationSummary, setShowEstimationSummary] = useState(true);
  const [newResource, setNewResource] = useState({
    name: '',
    defaultLocation: 'offshore',
  });

  // Initialize resource data from state or defaults
  const resourceData = state.resourceLoading || {
    resources: getDefaultResources(),
    rates: defaultRates,
    phases: defaultPhases,
  };

  const resources = resourceData.resources || getDefaultResources();
  const rates = resourceData.rates || defaultRates;
  const phases = resourceData.phases || defaultPhases;

  // Calculate estimation hours from other sections
  const estimationSummary = useMemo(() => {
    const moduleHours = state.selectedModules?.reduce((sum, m) => {
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[m.complexity] || 1;
      return sum + ((m.customHours || m.baseHours || 0) * multiplier);
    }, 0) || 0;

    const integrationHours = state.integrations?.reduce((sum, i) => {
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[i.complexity] || 1;
      return sum + ((i.customHours || i.baseHours || 0) * multiplier);
    }, 0) || 0;

    const reportHours = state.reports?.reduce((sum, r) => {
      return sum + ((r.customHours || r.baseHours || 0) * (r.quantity || 1));
    }, 0) || 0;

    const biHours = state.biDashboards?.reduce((sum, b) => {
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[b.complexity] || 1;
      return sum + ((b.customHours || b.baseHours || 0) * multiplier);
    }, 0) || 0;

    const addonHours = state.addons?.reduce((sum, a) => {
      return sum + (a.customHours || a.baseHours || 0);
    }, 0) || 0;

    const customHours = state.customItems?.reduce((sum, c) => {
      return sum + (c.hours || 0);
    }, 0) || 0;

    const dataMigrationHours = state.dataMigration?.reduce((sum, d) => {
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[d.complexity] || 1;
      return sum + ((d.customHours || d.baseHours || 0) * multiplier);
    }, 0) || 0;

    const documentFormatHours = state.documentFormats?.reduce((sum, d) => {
      return sum + (d.hours || 0);
    }, 0) || 0;

    const subtotal = moduleHours + integrationHours + reportHours + biHours +
                     addonHours + customHours + dataMigrationHours + documentFormatHours;

    const contingencyPercent = state.projectInfo?.contingencyPercent || 15;
    const contingencyHours = subtotal * (contingencyPercent / 100);
    const totalHours = subtotal + contingencyHours;

    return {
      moduleHours: Math.round(moduleHours),
      integrationHours: Math.round(integrationHours),
      reportHours: Math.round(reportHours),
      biHours: Math.round(biHours),
      addonHours: Math.round(addonHours),
      customHours: Math.round(customHours),
      dataMigrationHours: Math.round(dataMigrationHours),
      documentFormatHours: Math.round(documentFormatHours),
      subtotal: Math.round(subtotal),
      contingencyPercent,
      contingencyHours: Math.round(contingencyHours),
      totalHours: Math.round(totalHours),
      totalDays: Math.round(totalHours / 8),
    };
  }, [state]);

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

  // Grand totals - computed directly without useMemo to avoid dependency issues
  const grandTotals = (() => {
    const totals = {
      days: 0,
      cost: 0,
      onsiteDays: 0,
      offshoreDays: 0,
      onsiteCost: 0,
      offshoreCost: 0,
    };

    resources.forEach(r => {
      phases.forEach(phase => {
        const pd = r.phases?.[phase.id];
        if (pd) {
          const days = pd.days || 0;
          const location = pd.location || 'offshore';
          const rate = rates[location]?.[r.name] || 500;
          const cost = days * rate;

          totals.days += days;
          totals.cost += cost;

          if (pd.location === 'onsite') {
            totals.onsiteDays += days;
            totals.onsiteCost += cost;
          } else {
            totals.offshoreDays += days;
            totals.offshoreCost += cost;
          }
        }
      });
    });

    return totals;
  })();

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

  // Update phase months
  const updatePhaseMonths = (phaseId, months) => {
    const newPhases = phases.map(p => {
      if (p.id === phaseId) {
        return { ...p, months: parseFloat(months) || 0 };
      }
      return p;
    });
    updateResourceData({ phases: newPhases });
  };

  // Add new resource
  const handleAddResource = () => {
    if (!newResource.name.trim()) return;

    const newId = `custom_${crypto.randomUUID()}`;
    const newResourceItem = {
      id: newId,
      name: newResource.name,
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
    <div className="section resource-loading-section">
      <div className="section-header">
        <div className="header-title">
          <h2>Resource Loading</h2>
          <p className="section-subtitle">Plan consultant allocation across project phases</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-number">{resources.length}</span>
            <span className="stat-text">Resources</span>
          </div>
          <div className="stat-pill">
            <span className="stat-number">{grandTotals.days.toFixed(1)}</span>
            <span className="stat-text">Total Days</span>
          </div>
          <div className="stat-pill primary">
            <span className="stat-number">{formatCurrency(grandTotals.cost)}</span>
            <span className="stat-text">Total Cost</span>
          </div>
        </div>
      </div>

      {/* Estimation Summary Panel */}
      <div className="estimation-summary-panel">
        <div className="panel-header" onClick={() => setShowEstimationSummary(!showEstimationSummary)}>
          <h4>Estimation Summary (Hours)</h4>
          <span className="toggle-icon">{showEstimationSummary ? '▼' : '▶'}</span>
        </div>
        {showEstimationSummary && (
          <div className="panel-content">
            <div className="estimation-grid">
              <div className="est-item">
                <span className="est-label">Modules</span>
                <span className="est-value">{estimationSummary.moduleHours} hrs</span>
              </div>
              <div className="est-item">
                <span className="est-label">Integrations</span>
                <span className="est-value">{estimationSummary.integrationHours} hrs</span>
              </div>
              <div className="est-item">
                <span className="est-label">Reports</span>
                <span className="est-value">{estimationSummary.reportHours} hrs</span>
              </div>
              <div className="est-item">
                <span className="est-label">BI Dashboards</span>
                <span className="est-value">{estimationSummary.biHours} hrs</span>
              </div>
              <div className="est-item">
                <span className="est-label">Data Migration</span>
                <span className="est-value">{estimationSummary.dataMigrationHours} hrs</span>
              </div>
              <div className="est-item">
                <span className="est-label">Document Formats</span>
                <span className="est-value">{estimationSummary.documentFormatHours} hrs</span>
              </div>
              <div className="est-item">
                <span className="est-label">Add-ons</span>
                <span className="est-value">{estimationSummary.addonHours} hrs</span>
              </div>
              <div className="est-item">
                <span className="est-label">Custom Items</span>
                <span className="est-value">{estimationSummary.customHours} hrs</span>
              </div>
            </div>
            <div className="estimation-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{estimationSummary.subtotal} hours</span>
              </div>
              <div className="total-row">
                <span>Contingency ({estimationSummary.contingencyPercent}%):</span>
                <span>{estimationSummary.contingencyHours} hours</span>
              </div>
              <div className="total-row grand-total">
                <span>Total Estimated:</span>
                <span>{estimationSummary.totalHours} hours ({estimationSummary.totalDays} days)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="resource-summary-grid">
        <div className="resource-summary-card">
          <div className="summary-icon">🏢</div>
          <div className="summary-content">
            <div className="summary-value">{grandTotals.onsiteDays.toFixed(1)}</div>
            <div className="summary-label">Onsite Days</div>
            <div className="summary-cost">{formatCurrency(grandTotals.onsiteCost)}</div>
          </div>
        </div>
        <div className="resource-summary-card">
          <div className="summary-icon">🌐</div>
          <div className="summary-content">
            <div className="summary-value">{grandTotals.offshoreDays.toFixed(1)}</div>
            <div className="summary-label">Offshore Days</div>
            <div className="summary-cost">{formatCurrency(grandTotals.offshoreCost)}</div>
          </div>
        </div>
        <div className="resource-summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <div className="summary-value">{grandTotals.days.toFixed(1)}</div>
            <div className="summary-label">Total Man-Days</div>
            <div className="summary-cost">{(grandTotals.days * 8).toFixed(0)} hours</div>
          </div>
        </div>
        <div className="resource-summary-card highlight">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <div className="summary-value">{formatCurrency(grandTotals.cost)}</div>
            <div className="summary-label">Total Project Cost</div>
            <div className="summary-cost">{state.projectInfo?.currency || 'USD'}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="resource-actions">
        <button className="btn-action" onClick={() => setShowAddModal(true)}>
          + Add Resource
        </button>
        <button className="btn-action secondary" onClick={() => setShowRatesModal(true)}>
          Edit Rates
        </button>
      </div>

      {/* Resource Loading Table */}
      <div className="resource-table-wrapper">
        <table className="resource-loading-table">
          <thead>
            <tr className="header-row-1">
              <th rowSpan="2" className="consultant-header">Consultant Type</th>
              {phases.map(phase => (
                <th key={phase.id} colSpan="3" className="phase-header">
                  <div className="phase-name">{phase.name}</div>
                  <div className="phase-months">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={phase.months || ''}
                      onChange={(e) => updatePhaseMonths(phase.id, e.target.value)}
                      placeholder="0"
                    />
                    <span>Months</span>
                  </div>
                </th>
              ))}
              <th rowSpan="2" className="total-header">Total<br/>Days</th>
              <th rowSpan="2" className="total-header">Total<br/>Cost</th>
              <th rowSpan="2" className="action-header"></th>
            </tr>
            <tr className="header-row-2">
              {phases.map(phase => (
                <React.Fragment key={`sub-${phase.id}`}>
                  <th className="sub-header">Onsite/Off SI</th>
                  <th className="sub-header">Days</th>
                  <th className="sub-header">USD Cost</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, idx) => (
              <tr key={resource.id} className={idx % 2 === 0 ? 'row-even' : 'row-odd'}>
                <td className="consultant-cell">{resource.name}</td>
                {phases.map(phase => {
                  const phaseData = resource.phases?.[phase.id] || {};
                  const cost = calculateCost(resource, phase.id);
                  return (
                    <React.Fragment key={`${resource.id}-${phase.id}`}>
                      <td className="location-cell">
                        <select
                          className="location-select"
                          value={phaseData.location || 'offshore'}
                          onChange={(e) => updateResourcePhase(resource.id, phase.id, { location: e.target.value })}
                        >
                          <option value="onsite">On Site</option>
                          <option value="offshore">Off Shore</option>
                        </select>
                      </td>
                      <td className="days-cell">
                        <input
                          type="number"
                          className="days-input"
                          min="0"
                          step="0.5"
                          value={phaseData.days || ''}
                          onChange={(e) => updateResourcePhase(resource.id, phase.id, {
                            days: parseFloat(e.target.value) || 0
                          })}
                          placeholder="0"
                        />
                      </td>
                      <td className="cost-cell">
                        {cost > 0 ? formatCurrency(cost) : '0'}
                      </td>
                    </React.Fragment>
                  );
                })}
                <td className="total-days-cell">{getTotalDays(resource).toFixed(1)}</td>
                <td className="total-cost-cell">{formatCurrency(getTotalCost(resource))}</td>
                <td className="action-cell">
                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveResource(resource.id)}
                    title="Remove"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}

            {/* Phase Totals Row */}
            <tr className="totals-row">
              <td className="consultant-cell totals-label">Phase Totals</td>
              {phases.map(phase => {
                const totals = getPhaseTotals(phase.id);
                return (
                  <React.Fragment key={`total-${phase.id}`}>
                    <td className="location-cell"></td>
                    <td className="days-cell total-value">{totals.days.toFixed(1)}</td>
                    <td className="cost-cell total-value">{formatCurrency(totals.cost)}</td>
                  </React.Fragment>
                );
              })}
              <td className="total-days-cell grand-value">{grandTotals.days.toFixed(1)}</td>
              <td className="total-cost-cell grand-value">{formatCurrency(grandTotals.cost)}</td>
              <td className="action-cell"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rate Card Section */}
      <div className="rate-card-panel">
        <h4>Daily Rate Card ({state.projectInfo?.currency || 'USD'})</h4>
        <div className="rate-card-table">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Onsite Rate</th>
                <th>Offshore Rate</th>
              </tr>
            </thead>
            <tbody>
              {uniqueRoles.map(role => (
                <tr key={role}>
                  <td>{role}</td>
                  <td>
                    <input
                      type="number"
                      value={rates.onsite?.[role] || ''}
                      onChange={(e) => updateRate('onsite', role, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={rates.offshore?.[role] || ''}
                      onChange={(e) => updateRate('offshore', role, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <table className="rates-modal-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Onsite Rate</th>
                    <th>Offshore Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueRoles.map(role => (
                    <tr key={role}>
                      <td>{role}</td>
                      <td>
                        <input
                          type="number"
                          value={rates.onsite?.[role] || ''}
                          onChange={(e) => updateRate('onsite', role, e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
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
