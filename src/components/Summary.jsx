import { useEstimation } from '../context/EstimationContext';

function Summary() {
  const { state, dispatch, calculations } = useEstimation();

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
    calculations.reportHours +
    calculations.biHours +
    calculations.addonHours +
    calculations.customItemHours;

  const contingencyHours = Math.round(baseHours * (state.projectInfo.contingencyPercent / 100));

  const handleExportJSON = () => {
    const exportData = {
      projectInfo: state.projectInfo,
      estimation: {
        modules: state.selectedModules,
        integrations: state.integrations,
        reports: state.reports,
        biDashboards: state.biDashboards,
        addons: state.addons,
        customItems: state.customItems,
        support: state.support
      },
      calculations: {
        moduleHours: calculations.moduleHours,
        integrationHours: calculations.integrationHours,
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

    // Modules
    state.selectedModules.forEach(m => {
      const hours = m.customHours || m.baseHours;
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[m.complexity] || 1;
      csv += `Modules,"${m.name}",1,${hours},${m.complexity},${Math.round(hours * multiplier)},"${m.notes || ''}"\n`;
    });

    // Integrations
    state.integrations.forEach(i => {
      const hours = i.customHours || i.baseHours;
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[i.complexity] || 1;
      csv += `Integrations,"${i.name}",1,${hours},${i.complexity},${Math.round(hours * multiplier)},"${i.notes || ''}"\n`;
    });

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

    // Summary
    csv += '\n\nSummary\n';
    csv += `Module Hours,${calculations.moduleHours}\n`;
    csv += `Integration Hours,${calculations.integrationHours}\n`;
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
          <button className="btn-primary" onClick={handleExportJSON}>
            Export JSON
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

        <div className="summary-grid">
          <div className="summary-card">
            <h4>Scope Modules</h4>
            <div className="summary-value">{state.selectedModules.length}</div>
            <div className="summary-hours">{calculations.moduleHours.toLocaleString()} hours</div>
          </div>

          <div className="summary-card">
            <h4>Integrations</h4>
            <div className="summary-value">{state.integrations.length}</div>
            <div className="summary-hours">{calculations.integrationHours.toLocaleString()} hours</div>
          </div>

          <div className="summary-card">
            <h4>Reports</h4>
            <div className="summary-value">{state.reports.length}</div>
            <div className="summary-hours">{calculations.reportHours.toLocaleString()} hours</div>
          </div>

          <div className="summary-card">
            <h4>BI Dashboards</h4>
            <div className="summary-value">{state.biDashboards.length}</div>
            <div className="summary-hours">{calculations.biHours.toLocaleString()} hours</div>
          </div>

          <div className="summary-card">
            <h4>Add-ons</h4>
            <div className="summary-value">{state.addons.length}</div>
            <div className="summary-hours">{calculations.addonHours.toLocaleString()} hours</div>
          </div>

          <div className="summary-card">
            <h4>Custom Items</h4>
            <div className="summary-value">{state.customItems.length}</div>
            <div className="summary-hours">{calculations.customItemHours.toLocaleString()} hours</div>
          </div>
        </div>

        <div className="hours-breakdown">
          <h3>Hours Breakdown</h3>
          <table className="breakdown-table">
            <tbody>
              <tr>
                <td>Module Implementation</td>
                <td className="hours-cell">{calculations.moduleHours.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Integrations</td>
                <td className="hours-cell">{calculations.integrationHours.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Reports & BI</td>
                <td className="hours-cell">{(calculations.reportHours + calculations.biHours).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Add-ons & Custom</td>
                <td className="hours-cell">{(calculations.addonHours + calculations.customItemHours).toLocaleString()}</td>
              </tr>
              <tr className="subtotal-row">
                <td><strong>Subtotal</strong></td>
                <td className="hours-cell"><strong>{baseHours.toLocaleString()}</strong></td>
              </tr>
              <tr>
                <td>Contingency ({state.projectInfo.contingencyPercent}%)</td>
                <td className="hours-cell">{contingencyHours.toLocaleString()}</td>
              </tr>
              <tr className="total-row">
                <td><strong>Total Implementation Hours</strong></td>
                <td className="hours-cell"><strong>{calculations.totalHours.toLocaleString()}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {state.support.type && (
          <div className="support-summary">
            <h3>Support Plan</h3>
            <div className="support-details">
              <p><strong>{state.support.type.name}</strong></p>
              <p>{state.support.durationMonths} months @ {state.support.type.monthlyHours} hours/month</p>
              <p className="support-total">Total Support Hours: {calculations.supportHours.toLocaleString()}</p>
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
