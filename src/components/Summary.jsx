import { useState, useMemo } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { generateEstimationDocument } from '../utils/exportWord';
import { complexityMultipliers } from '../data/d365Modules';

function Summary() {
  const { state, dispatch, calculations, formatEstimate, getUnitLabel, estimationUnit } = useEstimation();
  const [isExporting, setIsExporting] = useState(false);

  // Calculate WBS totals
  const wbsTotals = useMemo(() => {
    if (!state.wbsData || state.wbsData.length === 0) return null;

    let totalDays = 0;
    let totalManDays = 0;
    const phaseData = {};

    state.wbsData.forEach(item => {
      if (item.level === 3 && item.days > 0) {
        totalDays += item.days;
        totalManDays += item.days * (item.resources || 1);
      }

      const phaseId = item.wbsId.split('.')[0];
      if (!phaseData[phaseId]) {
        phaseData[phaseId] = { days: 0, manDays: 0, name: '' };
      }
      if (item.level === 1) {
        phaseData[phaseId].name = item.task;
      }
      if (item.level === 3 && item.days > 0) {
        phaseData[phaseId].days += item.days;
        phaseData[phaseId].manDays += item.days * (item.resources || 1);
      }
    });

    return { totalDays, totalManDays, phaseData };
  }, [state.wbsData]);

  // Calculate hours per legal entity
  const entityBreakdown = useMemo(() => {
    if (!state.legalEntities || state.legalEntities.length === 0) return null;

    const breakdown = {};
    const activeEntities = state.legalEntities.filter(le => le.isActive);

    activeEntities.forEach(entity => {
      const entityModules = state.moduleMatrix?.[entity.id] || {};
      let entityHours = 0;
      let moduleCount = 0;

      Object.entries(entityModules).forEach(([, data]) => {
        if (data.selected) {
          const hours = data.customHours || data.baseHours || 0;
          const multiplier = complexityMultipliers[data.complexity] || 1;
          entityHours += hours * multiplier;
          moduleCount++;
        }
      });

      breakdown[entity.id] = {
        entity,
        hours: Math.round(entityHours),
        moduleCount
      };
    });

    return breakdown;
  }, [state.legalEntities, state.moduleMatrix]);

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      const fileName = await generateEstimationDocument(state, calculations);
      alert(`Document exported: ${fileName}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting document. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.projectInfo.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const baseHours = calculations.moduleHours +
    calculations.integrationHours +
    (calculations.dataMigrationHours || 0) +
    calculations.reportHours +
    calculations.biHours +
    calculations.addonHours +
    calculations.customItemHours;

  const contingencyHours = Math.round(baseHours * (state.projectInfo.contingencyPercent / 100));

  const handleExportJSON = () => {
    const exportData = {
      projectInfo: state.projectInfo,
      legalEntities: state.legalEntities,
      moduleMatrix: state.moduleMatrix,
      estimation: {
        modules: state.selectedModules,
        integrations: state.integrations,
        dataMigrations: state.dataMigrations,
        reports: state.reports,
        biDashboards: state.biDashboards,
        addons: state.addons,
        customItems: state.customItems,
        support: state.support
      },
      calculations: {
        moduleHours: calculations.moduleHours,
        moduleMatrixBreakdown: calculations.moduleMatrixBreakdown,
        integrationHours: calculations.integrationHours,
        dataMigrationHours: calculations.dataMigrationHours || 0,
        reportHours: calculations.reportHours,
        biHours: calculations.biHours,
        addonHours: calculations.addonHours,
        customItemHours: calculations.customItemHours,
        supportHours: calculations.supportHours,
        contingencyPercent: state.projectInfo.contingencyPercent,
        contingencyHours: contingencyHours,
        totalHours: calculations.totalHours,
        teamCost: calculations.teamCost
      },
      wbsData: state.wbsData,
      wbsTotals: wbsTotals,
      projectPlan: state.projectPlan,
      phaseBreakdown: calculations.phaseHours,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.projectInfo.projectName || 'D365FO-Estimation'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    let csv = 'Category,Item,Quantity,Base Hours,Complexity,Total Hours,Notes\n';

    // Legal Entities Summary
    if (entityBreakdown && Object.keys(entityBreakdown).length > 0) {
      csv += '\nLegal Entity,Code,Business Type,Modules,Hours\n';
      Object.values(entityBreakdown).forEach(({ entity, hours, moduleCount }) => {
        csv += `"${entity.name}",${entity.code},${entity.businessType},${moduleCount},${hours}\n`;
      });
      csv += '\n';
    }

    // Modules (from matrix or traditional)
    if (state.legalEntities?.length > 0 && state.moduleMatrix) {
      csv += '\nEntity,Module,Complexity,Hours\n';
      state.legalEntities.filter(le => le.isActive).forEach(entity => {
        const entityModules = state.moduleMatrix[entity.id] || {};
        Object.entries(entityModules).forEach(([moduleKey, data]) => {
          if (data.selected) {
            const hours = data.customHours || data.baseHours || 0;
            const multiplier = complexityMultipliers[data.complexity] || 1;
            csv += `"${entity.code}","${data.name || moduleKey}",${data.complexity},${Math.round(hours * multiplier)}\n`;
          }
        });
      });
    } else {
      state.selectedModules.forEach(m => {
        const hours = m.customHours || m.baseHours;
        const multiplier = { low: 1, medium: 1.3, high: 1.6 }[m.complexity] || 1;
        csv += `Modules,"${m.name}",1,${hours},${m.complexity},${Math.round(hours * multiplier)},"${m.notes || ''}"\n`;
      });
    }

    // Integrations
    state.integrations.forEach(i => {
      const hours = i.customHours || i.baseHours;
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[i.complexity] || 1;
      csv += `Integrations,"${i.name}",1,${hours},${i.complexity},${Math.round(hours * multiplier)},"${i.notes || ''}"\n`;
    });

    // Data Migration
    if (state.dataMigrations?.length > 0) {
      csv += '\nData Migration\n';
      csv += 'Entity,Source System,Complexity,Volume,Hours\n';
      state.dataMigrations.forEach(m => {
        csv += `"${m.entityName}","${m.sourceSystem || '-'}",${m.complexity},${m.volume},${m.hours}\n`;
      });
    }

    // Reports
    state.reports.forEach(r => {
      const hours = r.customHours || r.baseHours;
      csv += `Reports,"${r.name}",${r.quantity || 1},${hours},-,${hours * (r.quantity || 1)},"${r.notes || ''}"\n`;
    });

    // BI Dashboards
    state.biDashboards.forEach(b => {
      const hours = b.customHours || b.baseHours;
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[b.complexity] || 1;
      csv += `BI Dashboards,"${b.name}",1,${hours},${b.complexity},${Math.round(hours * multiplier)},"${b.notes || ''}"\n`;
    });

    // Addons
    state.addons.forEach(a => {
      const hours = a.customHours || a.baseHours;
      csv += `Add-ons,"${a.name}",1,${hours},-,${hours},"${a.notes || ''}"\n`;
    });

    // Custom Items
    state.customItems.forEach(c => {
      csv += `Custom,"${c.name}",1,${c.hours},-,${c.hours},"${c.notes || ''}"\n`;
    });

    // WBS Summary
    if (wbsTotals) {
      csv += '\nWBS Project Plan Summary\n';
      csv += 'Phase,Days,Man-Days,Hours\n';
      Object.entries(wbsTotals.phaseData).forEach(([phaseId, data]) => {
        csv += `"${phaseId} - ${data.name}",${data.days},${data.manDays},${data.manDays * 8}\n`;
      });
      csv += `Total,${wbsTotals.totalDays},${wbsTotals.totalManDays},${wbsTotals.totalManDays * 8}\n`;
    }

    // Summary
    csv += '\n\nSummary\n';
    csv += `Module Hours,${calculations.moduleHours}\n`;
    csv += `Integration Hours,${calculations.integrationHours}\n`;
    csv += `Data Migration Hours,${calculations.dataMigrationHours || 0}\n`;
    csv += `Report Hours,${calculations.reportHours}\n`;
    csv += `BI Hours,${calculations.biHours}\n`;
    csv += `Add-on Hours,${calculations.addonHours}\n`;
    csv += `Custom Item Hours,${calculations.customItemHours}\n`;
    csv += `Contingency (${state.projectInfo.contingencyPercent}%),${contingencyHours}\n`;
    csv += `Total Hours,${calculations.totalHours}\n`;
    csv += `Estimated Cost,${calculations.teamCost}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.projectInfo.projectName || 'D365FO-Estimation'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveEstimation = () => {
    const saveData = JSON.stringify(state);
    localStorage.setItem('d365fo-estimation', saveData);
    alert('Estimation saved to local storage!');
  };

  const handleLoadEstimation = () => {
    const savedData = localStorage.getItem('d365fo-estimation');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_ESTIMATION', payload: parsed });
        alert('Estimation loaded successfully!');
      } catch {
        alert('Error loading estimation data.');
      }
    } else {
      alert('No saved estimation found.');
    }
  };

  const handleResetEstimation = () => {
    if (window.confirm('Are you sure you want to reset the entire estimation? This cannot be undone.')) {
      dispatch({ type: 'RESET_ESTIMATION' });
    }
  };

  return (
    <div className="section summary">
      <div className="section-header">
        <h2>Estimation Summary</h2>
        <div className="export-buttons">
          <button className="btn-secondary" onClick={handleSaveEstimation}>
            Save
          </button>
          <button className="btn-secondary" onClick={handleLoadEstimation}>
            Load
          </button>
          <button className="btn-secondary" onClick={handleExportCSV}>
            Export CSV
          </button>
          <button className="btn-secondary" onClick={handleExportJSON}>
            Export JSON
          </button>
          <button
            className="btn-primary"
            onClick={handleExportWord}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Word'}
          </button>
          <button className="btn-danger" onClick={handleResetEstimation}>
            Reset
          </button>
        </div>
      </div>

      <div className="summary-content">
        <div className="project-summary-card">
          <h3>{state.projectInfo.projectName || 'Untitled Project'}</h3>
          {state.projectInfo.clientName && (
            <p className="client-name">Client: {state.projectInfo.clientName}</p>
          )}
          {state.projectInfo.startDate && (
            <p className="start-date">
              Target Start: {new Date(state.projectInfo.startDate).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Legal Entity Overview */}
        {entityBreakdown && Object.keys(entityBreakdown).length > 0 && (
          <div className="legal-entity-summary">
            <h3>Legal Entity Estimation</h3>
            <p className="section-description">
              Module breakdown by legal entity. Total: {formatEstimate(calculations.moduleHours).toLocaleString()} {getUnitLabel()}
            </p>
            <div className="entity-grid">
              {Object.values(entityBreakdown).map(({ entity, hours, moduleCount }) => (
                <div key={entity.id} className="entity-summary-card">
                  <div className="entity-header">
                    <span className="entity-code">{entity.code}</span>
                    <span className={`business-type ${entity.businessType}`}>{entity.businessType}</span>
                  </div>
                  <div className="entity-name">{entity.name}</div>
                  <div className="entity-stats">
                    <div className="stat">
                      <span className="stat-value">{moduleCount}</span>
                      <span className="stat-label">Modules</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{formatEstimate(hours).toLocaleString()}</span>
                      <span className="stat-label">{getUnitLabel()}</span>
                    </div>
                  </div>
                  {entity.rolloutPhase && (
                    <div className="entity-phase">Phase {entity.rolloutPhase}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="summary-grid">
          <div className="summary-card">
            <h4>Legal Entities</h4>
            <div className="summary-value">{state.legalEntities?.filter(le => le.isActive).length || 0}</div>
            <div className="summary-hours">{formatEstimate(calculations.moduleHours).toLocaleString()} module {getUnitLabel()}</div>
          </div>

          <div className="summary-card">
            <h4>Integrations</h4>
            <div className="summary-value">{state.integrations.length}</div>
            <div className="summary-hours">{formatEstimate(calculations.integrationHours).toLocaleString()} {getUnitLabel()}</div>
          </div>

          <div className="summary-card">
            <h4>Data Migration</h4>
            <div className="summary-value">{(state.dataMigrations || []).length}</div>
            <div className="summary-hours">{formatEstimate(calculations.dataMigrationHours || 0).toLocaleString()} {getUnitLabel()}</div>
          </div>

          <div className="summary-card">
            <h4>Reports</h4>
            <div className="summary-value">{state.reports.length}</div>
            <div className="summary-hours">{formatEstimate(calculations.reportHours).toLocaleString()} {getUnitLabel()}</div>
          </div>

          <div className="summary-card">
            <h4>BI Dashboards</h4>
            <div className="summary-value">{state.biDashboards.length}</div>
            <div className="summary-hours">{formatEstimate(calculations.biHours).toLocaleString()} {getUnitLabel()}</div>
          </div>

          <div className="summary-card">
            <h4>Add-ons</h4>
            <div className="summary-value">{state.addons.length}</div>
            <div className="summary-hours">{formatEstimate(calculations.addonHours).toLocaleString()} {getUnitLabel()}</div>
          </div>

          <div className="summary-card">
            <h4>Custom Items</h4>
            <div className="summary-value">{state.customItems.length}</div>
            <div className="summary-hours">{formatEstimate(calculations.customItemHours).toLocaleString()} {getUnitLabel()}</div>
          </div>
        </div>

        <div className="hours-breakdown">
          <h3>Estimation Breakdown ({estimationUnit === 'days' ? 'Days' : 'Hours'})</h3>
          <table className="breakdown-table">
            <tbody>
              <tr>
                <td>Module Implementation</td>
                <td className="hours-cell">{formatEstimate(calculations.moduleHours).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Integrations</td>
                <td className="hours-cell">{formatEstimate(calculations.integrationHours).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Data Migration</td>
                <td className="hours-cell">{formatEstimate(calculations.dataMigrationHours || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Reports & BI</td>
                <td className="hours-cell">{formatEstimate(calculations.reportHours + calculations.biHours).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Add-ons & Custom</td>
                <td className="hours-cell">{formatEstimate(calculations.addonHours + calculations.customItemHours).toLocaleString()}</td>
              </tr>
              <tr className="subtotal-row">
                <td><strong>Subtotal</strong></td>
                <td className="hours-cell"><strong>{formatEstimate(baseHours).toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td>Contingency ({state.projectInfo.contingencyPercent}%)</td>
                <td className="hours-cell">{formatEstimate(contingencyHours).toLocaleString()}</td>
              </tr>
              <tr className="total-row">
                <td><strong>Total Implementation {estimationUnit === 'days' ? 'Days' : 'Hours'}</strong></td>
                <td className="hours-cell"><strong>{formatEstimate(calculations.totalHours).toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {state.support.type && (
          <div className="support-summary">
            <h3>Support Plan</h3>
            <div className="support-details">
              <p><strong>{state.support.type.name}</strong></p>
              <p>{state.support.durationMonths} months @ {state.support.type.monthlyHours} {getUnitLabel()}/month</p>
              <p className="support-total">Total Support {getUnitLabel()}: {formatEstimate(calculations.supportHours).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="cost-summary">
          <h3>Cost Summary</h3>
          <div className="cost-breakdown">
            <div className="cost-row total">
              <span>Estimated Project Cost</span>
              <span className="cost-value">{formatCurrency(calculations.teamCost)}</span>
            </div>
            {state.projectPlan.teamMembers.length > 0 && (
              <div className="team-cost-breakdown">
                <h4>By Role:</h4>
                {state.projectPlan.teamMembers.map(member => {
                  const memberHours = calculations.totalHours * (member.allocation / 100) * member.count;
                  const memberCost = memberHours * member.hourlyRate;
                  return (
                    <div key={member.id} className="cost-row">
                      <span>{member.roleName} ({member.count}x @ {member.allocation}%)</span>
                      <span className="cost-value">{formatCurrency(memberCost)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* WBS Summary */}
        {wbsTotals && (
          <div className="wbs-summary-section">
            <h3>WBS Project Plan Summary</h3>
            <div className="wbs-totals">
              <div className="wbs-total-card">
                <span className="wbs-total-value">{wbsTotals.totalDays}</span>
                <span className="wbs-total-label">Total Days</span>
              </div>
              <div className="wbs-total-card">
                <span className="wbs-total-value">{wbsTotals.totalManDays}</span>
                <span className="wbs-total-label">Man-Days</span>
              </div>
              <div className="wbs-total-card">
                <span className="wbs-total-value">{Math.round(wbsTotals.totalManDays * 8)}</span>
                <span className="wbs-total-label">Total Hours</span>
              </div>
            </div>
            <table className="phase-table wbs-phase-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Days</th>
                  <th>Man-Days</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(wbsTotals.phaseData).map(([phaseId, data]) => (
                  <tr key={phaseId}>
                    <td><strong>{phaseId}</strong> - {data.name}</td>
                    <td>{data.days}</td>
                    <td>{data.manDays}</td>
                    <td>{(data.manDays * 8).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{wbsTotals.totalDays}</strong></td>
                  <td><strong>{wbsTotals.totalManDays}</strong></td>
                  <td><strong>{(wbsTotals.totalManDays * 8).toLocaleString()}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Legacy Phase Distribution (when WBS not used) */}
        {!wbsTotals && calculations.phaseHours && calculations.phaseHours.length > 0 && (
          <div className="phase-summary">
            <h3>Phase Distribution</h3>
            <table className="phase-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>%</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {calculations.phaseHours.map(phase => (
                  <tr key={phase.id}>
                    <td>{phase.name}</td>
                    <td>{phase.percentOfTotal}%</td>
                    <td>{phase.hours.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(state.selectedModules.length > 0 || state.integrations.length > 0) && (
          <div className="detail-lists">
            {state.selectedModules.length > 0 && (
              <div className="detail-section">
                <h3>Selected Modules</h3>
                <ul className="item-list">
                  {state.selectedModules.map(m => (
                    <li key={m.id}>
                      <span className="item-name">{m.name}</span>
                      <span className={`complexity-badge ${m.complexity}`}>{m.complexity}</span>
                      {m.notes && <span className="item-note">- {m.notes}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {state.integrations.length > 0 && (
              <div className="detail-section">
                <h3>Integrations</h3>
                <ul className="item-list">
                  {state.integrations.map(i => (
                    <li key={i.id}>
                      <span className="item-name">{i.name}</span>
                      <span className="category-badge">{i.category}</span>
                      {i.notes && <span className="item-note">- {i.notes}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Summary;
