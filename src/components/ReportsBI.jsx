import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { reportTypes, biDashboards, complexityMultipliers } from '../data/d365Modules';

function ReportsBI() {
  const { state, dispatch, calculations, formatEstimate, getUnitLabel } = useEstimation();
  const [activeTab, setActiveTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
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

  const reportCategories = ['all', ...new Set(reportTypes.map(r => r.category))];

  const filteredReports = reportTypes.filter(r => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'Financial': '💰',
      'Sales': '📈',
      'Purchase': '🛒',
      'Inventory': '📦',
      'Production': '🏭',
      'Project': '📊',
      'HR': '👥',
      'Custom': '⚙️'
    };
    return icons[category] || '📄';
  };

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
    <div className="section reports-bi-modern">
      <div className="section-header">
        <div className="header-title">
          <h2>Reports & Business Intelligence</h2>
          <p className="section-subtitle">SSRS Reports, Power BI Dashboards & Analytics</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-number">{state.reports.length}</span>
            <span className="stat-text">Reports</span>
          </div>
          <div className="stat-pill">
            <span className="stat-number">{state.biDashboards.length}</span>
            <span className="stat-text">Dashboards</span>
          </div>
          <div className="stat-pill primary">
            <span className="stat-number">{formatEstimate(calculations.reportHours + calculations.biHours).toLocaleString()}</span>
            <span className="stat-text">{getUnitLabel()}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="modern-tabs">
        <button
          className={`modern-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <span className="tab-icon">📄</span>
          <span className="tab-label">Reports</span>
          <span className="tab-count">{state.reports.length}</span>
        </button>
        <button
          className={`modern-tab ${activeTab === 'bi' ? 'active' : ''}`}
          onClick={() => setActiveTab('bi')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">BI Dashboards</span>
          <span className="tab-count">{state.biDashboards.length}</span>
        </button>
      </div>

      {activeTab === 'reports' && (
        <div className="tab-content-modern">
          {/* Search and Filter Bar */}
          <div className="integration-toolbar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div>
            <div className="category-tabs">
              {reportCategories.map(category => (
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

          {/* Reports Grid */}
          <div className="integrations-grid">
            {filteredReports.map(report => {
              const isAdded = isReportAdded(report.id);
              return (
                <div
                  key={report.id}
                  className={`integration-card ${isAdded ? 'added' : ''}`}
                  onClick={() => !isAdded && handleAddReport({
                    reportId: report.id,
                    name: report.name,
                    category: report.category,
                    baseHours: report.baseHours
                  })}
                >
                  <div className="card-icon">{getCategoryIcon(report.category)}</div>
                  <div className="card-content">
                    <h4 className="card-title">{report.name}</h4>
                    <span className="card-category">{report.category}</span>
                  </div>
                  <div className="card-footer">
                    <span className="card-hours">{report.baseHours}h base</span>
                    {isAdded ? (
                      <span className="added-badge">✓ Added</span>
                    ) : (
                      <span className="add-badge">+ Add</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add Custom Card */}
            <div
              className="integration-card custom-card"
              onClick={() => setShowCustomReportModal(true)}
            >
              <div className="card-icon">➕</div>
              <div className="card-content">
                <h4 className="card-title">Custom Report</h4>
                <span className="card-category">Add your own</span>
              </div>
              <div className="card-footer">
                <span className="add-badge">Create New</span>
              </div>
            </div>
          </div>

          {/* Selected Reports */}
          {state.reports.length > 0 && (
            <div className="selected-integrations-modern">
              <div className="selected-header">
                <h3>Selected Reports</h3>
                <span className="selected-count">{state.reports.length} items • {calculations.reportHours}h total</span>
              </div>
              <div className="selected-list">
                {state.reports.map(report => (
                  <div key={report.id} className="selected-item">
                    <div className="item-main">
                      <div className="item-icon">{getCategoryIcon(report.category)}</div>
                      <div className="item-info">
                        <span className="item-name">{report.name}</span>
                        <span className="item-category">{report.category}</span>
                      </div>
                    </div>
                    <div className="item-controls">
                      <div className="control-group">
                        <label>Qty</label>
                        <input
                          type="number"
                          min="1"
                          className="compact-input"
                          value={report.quantity || 1}
                          onChange={(e) => handleUpdateReport(report.id, {
                            quantity: parseInt(e.target.value) || 1
                          })}
                        />
                      </div>
                      <div className="control-group">
                        <label>Hours</label>
                        <input
                          type="number"
                          className="compact-input"
                          placeholder={report.baseHours.toString()}
                          value={report.customHours || ''}
                          onChange={(e) => handleUpdateReport(report.id, {
                            customHours: e.target.value ? parseInt(e.target.value) : null
                          })}
                        />
                      </div>
                      <div className="control-group estimate">
                        <label>Total</label>
                        <span className="estimate-value">
                          {(report.customHours || report.baseHours) * (report.quantity || 1)}h
                        </span>
                      </div>
                    </div>
                    <button
                      className="item-remove"
                      onClick={() => handleRemoveReport(report.id)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bi' && (
        <div className="tab-content-modern">
          <p className="info-banner">
            <span className="info-icon">💡</span>
            Define Power BI dashboards and analytics requirements for the implementation.
          </p>

          {/* Dashboard Grid */}
          <div className="integrations-grid">
            {biDashboards.map(dashboard => {
              const isAdded = isDashboardAdded(dashboard.id);
              return (
                <div
                  key={dashboard.id}
                  className={`integration-card ${isAdded ? 'added' : ''}`}
                  onClick={() => !isAdded && handleAddBIDashboard({
                    dashboardId: dashboard.id,
                    name: dashboard.name,
                    baseHours: dashboard.baseHours,
                    complexity: dashboard.complexity
                  })}
                >
                  <div className="card-icon">📊</div>
                  <div className="card-content">
                    <h4 className="card-title">{dashboard.name}</h4>
                    <span className={`complexity-pill ${dashboard.complexity}`}>
                      {dashboard.complexity}
                    </span>
                  </div>
                  <div className="card-footer">
                    <span className="card-hours">{dashboard.baseHours}h base</span>
                    {isAdded ? (
                      <span className="added-badge">✓ Added</span>
                    ) : (
                      <span className="add-badge">+ Add</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add Custom Dashboard */}
            <div
              className="integration-card custom-card"
              onClick={() => setShowCustomDashboardModal(true)}
            >
              <div className="card-icon">➕</div>
              <div className="card-content">
                <h4 className="card-title">Custom Dashboard</h4>
                <span className="card-category">Add your own</span>
              </div>
              <div className="card-footer">
                <span className="add-badge">Create New</span>
              </div>
            </div>
          </div>

          {/* Selected Dashboards */}
          {state.biDashboards.length > 0 && (
            <div className="selected-integrations-modern">
              <div className="selected-header">
                <h3>Selected Dashboards</h3>
                <span className="selected-count">{state.biDashboards.length} items • {calculations.biHours}h total</span>
              </div>
              <div className="selected-list">
                {state.biDashboards.map(dashboard => (
                  <div key={dashboard.id} className="selected-item">
                    <div className="item-main">
                      <div className="item-icon">📊</div>
                      <div className="item-info">
                        <span className="item-name">{dashboard.name}</span>
                        <input
                          type="text"
                          className="item-notes-input"
                          placeholder="Dashboard requirements and KPIs..."
                          value={dashboard.notes || ''}
                          onChange={(e) => handleUpdateBIDashboard(dashboard.id, {
                            notes: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    <div className="item-controls">
                      <div className="control-group">
                        <label>Complexity</label>
                        <select
                          value={dashboard.complexity}
                          onChange={(e) => handleUpdateBIDashboard(dashboard.id, {
                            complexity: e.target.value
                          })}
                          className="compact-select"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="control-group">
                        <label>Hours</label>
                        <input
                          type="number"
                          className="compact-input"
                          placeholder={dashboard.baseHours.toString()}
                          value={dashboard.customHours || ''}
                          onChange={(e) => handleUpdateBIDashboard(dashboard.id, {
                            customHours: e.target.value ? parseInt(e.target.value) : null
                          })}
                        />
                      </div>
                      <div className="control-group estimate">
                        <label>Estimate</label>
                        <span className="estimate-value">
                          {Math.round(
                            (dashboard.customHours || dashboard.baseHours) *
                            complexityMultipliers[dashboard.complexity]
                          )}h
                        </span>
                      </div>
                    </div>
                    <button
                      className="item-remove"
                      onClick={() => handleRemoveBIDashboard(dashboard.id)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Report Modal */}
      {showCustomReportModal && (
        <div className="modal-overlay" onClick={() => setShowCustomReportModal(false)}>
          <div className="modal modern-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Report</h3>
              <button className="modal-close" onClick={() => setShowCustomReportModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Report Name</label>
                <input
                  type="text"
                  value={customReport.name}
                  onChange={(e) => setCustomReport({ ...customReport, name: e.target.value })}
                  placeholder="Enter report name"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={customReport.category}
                    onChange={(e) => setCustomReport({ ...customReport, category: e.target.value })}
                  >
                    {reportCategories.filter(c => c !== 'all').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
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
              </div>
            </div>
            <div className="modal-footer">
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

      {/* Custom Dashboard Modal */}
      {showCustomDashboardModal && (
        <div className="modal-overlay" onClick={() => setShowCustomDashboardModal(false)}>
          <div className="modal modern-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Dashboard</h3>
              <button className="modal-close" onClick={() => setShowCustomDashboardModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Dashboard Name</label>
                <input
                  type="text"
                  value={customDashboard.name}
                  onChange={(e) => setCustomDashboard({ ...customDashboard, name: e.target.value })}
                  placeholder="Enter dashboard name"
                />
              </div>
              <div className="form-row">
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
              </div>
            </div>
            <div className="modal-footer">
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
