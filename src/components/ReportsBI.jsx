import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { reportTypes, biDashboards, complexityMultipliers } from '../data/d365Modules';

function ReportsBI() {
  const { state, dispatch, calculations } = useEstimation();
  const [activeTab, setActiveTab] = useState('reports');
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showCustomDashboardModal, setShowCustomDashboardModal] = useState(false);
  const [customReport, setCustomReport] = useState({
    name: '',
    category: 'Custom',
    baseHours: 16
  });
  const [customDashboard, setCustomDashboard] = useState({
    name: '',
    baseHours: 40,
    complexity: 'medium'
  });

  const reportCategories = [...new Set(reportTypes.map(r => r.category))];

  const handleAddReport = (report) => {
    dispatch({
      type: 'ADD_REPORT',
      payload: report
    });
  };

  const handleRemoveReport = (id) => {
    dispatch({
      type: 'REMOVE_REPORT',
      payload: id
    });
  };

  const handleUpdateReport = (id, updates) => {
    dispatch({
      type: 'UPDATE_REPORT',
      payload: { id, updates }
    });
  };

  const handleAddBIDashboard = (dashboard) => {
    dispatch({
      type: 'ADD_BI_DASHBOARD',
      payload: dashboard
    });
  };

  const handleRemoveBIDashboard = (id) => {
    dispatch({
      type: 'REMOVE_BI_DASHBOARD',
      payload: id
    });
  };

  const handleUpdateBIDashboard = (id, updates) => {
    dispatch({
      type: 'UPDATE_BI_DASHBOARD',
      payload: { id, updates }
    });
  };

  const isReportAdded = (reportId) => {
    return state.reports.some(r => r.reportId === reportId);
  };

  const isDashboardAdded = (dashboardId) => {
    return state.biDashboards.some(d => d.dashboardId === dashboardId);
  };

  const handleAddCustomReport = () => {
    if (customReport.name.trim()) {
      handleAddReport({
        reportId: `custom_${Date.now()}`,
        name: customReport.name,
        category: customReport.category,
        baseHours: customReport.baseHours
      });
      setCustomReport({ name: '', category: 'Custom', baseHours: 16 });
      setShowCustomReportModal(false);
    }
  };

  const handleAddCustomDashboard = () => {
    if (customDashboard.name.trim()) {
      handleAddBIDashboard({
        dashboardId: `custom_${Date.now()}`,
        name: customDashboard.name,
        baseHours: customDashboard.baseHours,
        complexity: customDashboard.complexity
      });
      setCustomDashboard({ name: '', baseHours: 40, complexity: 'medium' });
      setShowCustomDashboardModal(false);
    }
  };

  return (
    <div className="section reports-bi">
      <div className="section-header">
        <h2>Reports & Business Intelligence</h2>
        <div className="section-summary">
          <span>{state.reports.length} reports, {state.biDashboards.length} dashboards</span>
          <span className="hours">
            {(calculations.reportHours + calculations.biHours).toLocaleString()} hours
          </span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports ({state.reports.length})
        </button>
        <button
          className={`tab ${activeTab === 'bi' ? 'active' : ''}`}
          onClick={() => setActiveTab('bi')}
        >
          BI Dashboards ({state.biDashboards.length})
        </button>
      </div>

      {activeTab === 'reports' && (
        <div className="tab-content">
          <p className="section-description">
            Select standard reports or add custom SSRS/Excel reports needed for the implementation.
          </p>

          <div className="report-categories">
            {reportCategories.map(category => (
              <div key={category} className="report-category">
                <h4>{category}</h4>
                <div className="report-options">
                  {reportTypes
                    .filter(r => r.category === category)
                    .map(report => {
                      const isAdded = isReportAdded(report.id);
                      return (
                        <button
                          key={report.id}
                          className={`report-btn ${isAdded ? 'added' : ''}`}
                          onClick={() => !isAdded && handleAddReport({
                            reportId: report.id,
                            name: report.name,
                            category: report.category,
                            baseHours: report.baseHours
                          })}
                          disabled={isAdded}
                        >
                          {report.name}
                          <span className="hours-badge">{report.baseHours}h</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-secondary add-custom-btn"
            onClick={() => setShowCustomReportModal(true)}
          >
            + Add Custom Report
          </button>

          {state.reports.length > 0 && (
            <div className="selected-items">
              <h3>Selected Reports</h3>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Hours/Each</th>
                    <th>Total Hours</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {state.reports.map(report => (
                    <tr key={report.id}>
                      <td>{report.name}</td>
                      <td><span className="category-badge">{report.category}</span></td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="qty-input"
                          value={report.quantity || 1}
                          onChange={(e) => handleUpdateReport(report.id, {
                            quantity: parseInt(e.target.value) || 1
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="hours-input"
                          placeholder={report.baseHours.toString()}
                          value={report.customHours || ''}
                          onChange={(e) => handleUpdateReport(report.id, {
                            customHours: e.target.value ? parseInt(e.target.value) : null
                          })}
                        />
                      </td>
                      <td className="total-hours">
                        {(report.customHours || report.baseHours) * (report.quantity || 1)}h
                      </td>
                      <td>
                        <input
                          type="text"
                          className="notes-input"
                          placeholder="Add notes..."
                          value={report.notes || ''}
                          onChange={(e) => handleUpdateReport(report.id, {
                            notes: e.target.value
                          })}
                        />
                      </td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveReport(report.id)}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4"><strong>Total Report Hours</strong></td>
                    <td colSpan="3"><strong>{calculations.reportHours}h</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bi' && (
        <div className="tab-content">
          <p className="section-description">
            Define Power BI dashboards and analytics requirements for the implementation.
          </p>

          <div className="dashboard-options">
            {biDashboards.map(dashboard => {
              const isAdded = isDashboardAdded(dashboard.id);
              return (
                <div
                  key={dashboard.id}
                  className={`dashboard-card ${isAdded ? 'added' : ''}`}
                  onClick={() => !isAdded && handleAddBIDashboard({
                    dashboardId: dashboard.id,
                    name: dashboard.name,
                    baseHours: dashboard.baseHours,
                    complexity: dashboard.complexity
                  })}
                >
                  <div className="dashboard-name">{dashboard.name}</div>
                  <div className="dashboard-meta">
                    <span className={`complexity-badge ${dashboard.complexity}`}>
                      {dashboard.complexity}
                    </span>
                    <span className="hours-badge">{dashboard.baseHours}h</span>
                  </div>
                  {isAdded && <span className="added-check">&#10003;</span>}
                </div>
              );
            })}
          </div>

          <button
            className="btn-secondary add-custom-btn"
            onClick={() => setShowCustomDashboardModal(true)}
          >
            + Add Custom Dashboard
          </button>

          {state.biDashboards.length > 0 && (
            <div className="selected-items">
              <h3>Selected Dashboards</h3>
              <div className="dashboards-list">
                {state.biDashboards.map(dashboard => (
                  <div key={dashboard.id} className="dashboard-item">
                    <div className="dashboard-header">
                      <span className="dashboard-name">{dashboard.name}</span>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveBIDashboard(dashboard.id)}
                      >
                        &times;
                      </button>
                    </div>
                    <div className="dashboard-details">
                      <div className="form-group small">
                        <label>Complexity</label>
                        <select
                          value={dashboard.complexity}
                          onChange={(e) => handleUpdateBIDashboard(dashboard.id, {
                            complexity: e.target.value
                          })}
                        >
                          <option value="low">Low (x{complexityMultipliers.low})</option>
                          <option value="medium">Medium (x{complexityMultipliers.medium})</option>
                          <option value="high">High (x{complexityMultipliers.high})</option>
                        </select>
                      </div>
                      <div className="form-group small">
                        <label>Custom Hours</label>
                        <input
                          type="number"
                          placeholder={dashboard.baseHours.toString()}
                          value={dashboard.customHours || ''}
                          onChange={(e) => handleUpdateBIDashboard(dashboard.id, {
                            customHours: e.target.value ? parseInt(e.target.value) : null
                          })}
                        />
                      </div>
                      <div className="form-group small">
                        <label>Est. Hours</label>
                        <span className="calculated-hours">
                          {Math.round(
                            (dashboard.customHours || dashboard.baseHours) *
                            complexityMultipliers[dashboard.complexity]
                          )}h
                        </span>
                      </div>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Dashboard requirements and KPIs..."
                        value={dashboard.notes || ''}
                        onChange={(e) => handleUpdateBIDashboard(dashboard.id, {
                          notes: e.target.value
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bi-total">
                <strong>Total BI Hours: {calculations.biHours}h</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {showCustomReportModal && (
        <div className="modal-overlay" onClick={() => setShowCustomReportModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Custom Report</h3>
            <div className="form-group">
              <label>Report Name</label>
              <input
                type="text"
                value={customReport.name}
                onChange={(e) => setCustomReport({ ...customReport, name: e.target.value })}
                placeholder="Enter report name"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                value={customReport.category}
                onChange={(e) => setCustomReport({ ...customReport, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
            <div className="form-group">
              <label>Base Hours</label>
              <input
                type="number"
                value={customReport.baseHours}
                onChange={(e) => setCustomReport({
                  ...customReport,
                  baseHours: parseInt(e.target.value) || 0
                })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCustomReportModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddCustomReport}>
                Add Report
              </button>
            </div>
          </div>
        </div>
      )}

      {showCustomDashboardModal && (
        <div className="modal-overlay" onClick={() => setShowCustomDashboardModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add Custom Dashboard</h3>
            <div className="form-group">
              <label>Dashboard Name</label>
              <input
                type="text"
                value={customDashboard.name}
                onChange={(e) => setCustomDashboard({ ...customDashboard, name: e.target.value })}
                placeholder="Enter dashboard name"
              />
            </div>
            <div className="form-group">
              <label>Complexity</label>
              <select
                value={customDashboard.complexity}
                onChange={(e) => setCustomDashboard({
                  ...customDashboard,
                  complexity: e.target.value
                })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Base Hours</label>
              <input
                type="number"
                value={customDashboard.baseHours}
                onChange={(e) => setCustomDashboard({
                  ...customDashboard,
                  baseHours: parseInt(e.target.value) || 0
                })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCustomDashboardModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddCustomDashboard}>
                Add Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsBI;
