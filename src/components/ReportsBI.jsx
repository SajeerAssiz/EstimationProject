import { useState } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { reportTypes, biDashboards, complexityMultipliers } from '../data/d365Modules';

// Predefined document formats organized by module
const documentFormatTypes = [
  // Sales & AR
  { id: 'sales_invoice', name: 'Sales Invoice', module: 'Sales', baseHours: 24, description: 'Customer invoice format' },
  { id: 'sales_order_conf', name: 'Sales Order Confirmation', module: 'Sales', baseHours: 16, description: 'Order confirmation to customer' },
  { id: 'sales_quotation', name: 'Sales Quotation', module: 'Sales', baseHours: 16, description: 'Quote document for customers' },
  { id: 'delivery_note', name: 'Delivery Note / Packing Slip', module: 'Sales', baseHours: 20, description: 'Shipping document' },
  { id: 'proforma_invoice', name: 'Proforma Invoice', module: 'Sales', baseHours: 16, description: 'Preliminary invoice' },
  { id: 'credit_note', name: 'Credit Note', module: 'Sales', baseHours: 16, description: 'Credit memo to customer' },
  { id: 'debit_note', name: 'Debit Note', module: 'Sales', baseHours: 16, description: 'Debit memo to customer' },
  { id: 'customer_statement', name: 'Customer Statement', module: 'Sales', baseHours: 20, description: 'Account statement' },

  // Procurement & AP
  { id: 'purchase_order', name: 'Purchase Order', module: 'Procurement', baseHours: 24, description: 'PO to vendors' },
  { id: 'rfq', name: 'Request for Quotation (RFQ)', module: 'Procurement', baseHours: 16, description: 'RFQ to vendors' },
  { id: 'goods_receipt', name: 'Goods Receipt Note (GRN)', module: 'Procurement', baseHours: 16, description: 'Receipt document' },
  { id: 'purchase_return', name: 'Purchase Return', module: 'Procurement', baseHours: 16, description: 'Return to vendor' },
  { id: 'vendor_payment', name: 'Vendor Payment Advice', module: 'Procurement', baseHours: 16, description: 'Payment notification' },

  // Finance
  { id: 'cheque', name: 'Cheque / Check', module: 'Finance', baseHours: 20, description: 'Bank cheque format' },
  { id: 'payment_voucher', name: 'Payment Voucher', module: 'Finance', baseHours: 16, description: 'Internal payment document' },
  { id: 'receipt_voucher', name: 'Receipt Voucher', module: 'Finance', baseHours: 16, description: 'Cash/bank receipt' },
  { id: 'journal_voucher', name: 'Journal Voucher', module: 'Finance', baseHours: 12, description: 'GL journal entry' },
  { id: 'bank_reconciliation', name: 'Bank Reconciliation Statement', module: 'Finance', baseHours: 20, description: 'Bank recon report' },

  // Inventory & Warehouse
  { id: 'stock_transfer', name: 'Stock Transfer Order', module: 'Inventory', baseHours: 16, description: 'Internal transfer' },
  { id: 'picking_list', name: 'Picking List', module: 'Inventory', baseHours: 16, description: 'Warehouse picking' },
  { id: 'inventory_count', name: 'Inventory Count Sheet', module: 'Inventory', baseHours: 12, description: 'Physical count' },
  { id: 'material_issue', name: 'Material Issue Slip', module: 'Inventory', baseHours: 12, description: 'Material issuance' },

  // Manufacturing
  { id: 'production_order', name: 'Production Order', module: 'Manufacturing', baseHours: 20, description: 'Work order' },
  { id: 'bom_report', name: 'Bill of Materials', module: 'Manufacturing', baseHours: 16, description: 'BOM printout' },
  { id: 'job_card', name: 'Job Card / Route Card', module: 'Manufacturing', baseHours: 16, description: 'Shop floor card' },

  // Project
  { id: 'project_invoice', name: 'Project Invoice', module: 'Project', baseHours: 24, description: 'Project billing' },
  { id: 'timesheet', name: 'Timesheet Report', module: 'Project', baseHours: 16, description: 'Time entry document' },

  // HR
  { id: 'payslip', name: 'Payslip / Salary Slip', module: 'HR', baseHours: 24, description: 'Employee payslip' },
  { id: 'offer_letter', name: 'Offer Letter', module: 'HR', baseHours: 16, description: 'Employment offer' },
  { id: 'experience_letter', name: 'Experience Letter', module: 'HR', baseHours: 12, description: 'Service certificate' },
];

function ReportsBI() {
  const { state, dispatch, calculations, formatEstimate, getUnitLabel } = useEstimation();
  const [activeTab, setActiveTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [showCustomDashboardModal, setShowCustomDashboardModal] = useState(false);
  const [showCustomDocFormatModal, setShowCustomDocFormatModal] = useState(false);
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
  const [customDocFormat, setCustomDocFormat] = useState({
    name: '',
    module: 'Custom',
    baseHours: 20,
    complexity: 'medium',
    description: ''
  });

  const reportCategories = ['all', ...new Set(reportTypes.map(r => r.category))];
  const docFormatModules = ['all', ...new Set(documentFormatTypes.map(d => d.module))];

  const filteredReports = reportTypes.filter(r => {
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredDocFormats = documentFormatTypes.filter(d => {
    const matchesModule = activeCategory === 'all' || d.module === activeCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
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

  const getModuleIcon = (module) => {
    const icons = {
      'Sales': '📈',
      'Procurement': '🛒',
      'Finance': '💰',
      'Inventory': '📦',
      'Manufacturing': '🏭',
      'Project': '📊',
      'HR': '👥',
      'Custom': '⚙️'
    };
    return icons[module] || '📄';
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

  // Document Format Handlers
  const handleAddDocFormat = (docFormat) => {
    dispatch({
      type: 'ADD_DOCUMENT_FORMAT',
      payload: docFormat
    });
  };

  const handleRemoveDocFormat = (id) => {
    dispatch({
      type: 'REMOVE_DOCUMENT_FORMAT',
      payload: id
    });
  };

  const handleUpdateDocFormat = (id, updates) => {
    dispatch({
      type: 'UPDATE_DOCUMENT_FORMAT',
      payload: { id, updates }
    });
  };

  const isReportAdded = (reportId) => {
    return state.reports.some(r => r.reportId === reportId);
  };

  const isDashboardAdded = (dashboardId) => {
    return state.biDashboards.some(d => d.dashboardId === dashboardId);
  };

  const isDocFormatAdded = (docFormatId) => {
    return (state.documentFormats || []).some(d => d.formatId === docFormatId);
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

  const handleAddCustomDocFormat = () => {
    if (customDocFormat.name.trim()) {
      handleAddDocFormat({
        formatId: `custom_${Date.now()}`,
        name: customDocFormat.name,
        module: customDocFormat.module,
        baseHours: customDocFormat.baseHours,
        complexity: customDocFormat.complexity,
        description: customDocFormat.description
      });
      setCustomDocFormat({ name: '', module: 'Custom', baseHours: 20, complexity: 'medium', description: '' });
      setShowCustomDocFormatModal(false);
    }
  };

  const documentFormats = state.documentFormats || [];
  const totalReportsBIHours = calculations.reportHours + calculations.biHours + calculations.documentFormatHours;

  return (
    <div className="section reports-bi-modern">
      <div className="section-header">
        <div className="header-title">
          <h2>Reports & Business Intelligence</h2>
          <p className="section-subtitle">SSRS Reports, Power BI Dashboards & Document Formats</p>
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
          <div className="stat-pill">
            <span className="stat-number">{documentFormats.length}</span>
            <span className="stat-text">Doc Formats</span>
          </div>
          <div className="stat-pill primary">
            <span className="stat-number">{formatEstimate(totalReportsBIHours).toLocaleString()}</span>
            <span className="stat-text">{getUnitLabel()}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="modern-tabs">
        <button
          className={`modern-tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => { setActiveTab('reports'); setActiveCategory('all'); setSearchTerm(''); }}
        >
          <span className="tab-icon">📄</span>
          <span className="tab-label">Reports</span>
          <span className="tab-count">{state.reports.length}</span>
        </button>
        <button
          className={`modern-tab ${activeTab === 'bi' ? 'active' : ''}`}
          onClick={() => { setActiveTab('bi'); setActiveCategory('all'); setSearchTerm(''); }}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-label">BI Dashboards</span>
          <span className="tab-count">{state.biDashboards.length}</span>
        </button>
        <button
          className={`modern-tab ${activeTab === 'docformats' ? 'active' : ''}`}
          onClick={() => { setActiveTab('docformats'); setActiveCategory('all'); setSearchTerm(''); }}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-label">Document Formats</span>
          <span className="tab-count">{documentFormats.length}</span>
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

      {activeTab === 'docformats' && (
        <div className="tab-content-modern">
          <p className="info-banner">
            <span className="info-icon">📝</span>
            Define outgoing document formats (PO, Invoice, Delivery Note, Cheque, etc.) that need to be customized per customer requirements.
          </p>

          {/* Search and Filter Bar */}
          <div className="integration-toolbar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search document formats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div>
            <div className="category-tabs">
              {docFormatModules.map(module => (
                <button
                  key={module}
                  className={`category-tab ${activeCategory === module ? 'active' : ''}`}
                  onClick={() => setActiveCategory(module)}
                >
                  {module === 'all' ? 'All' : module}
                </button>
              ))}
            </div>
          </div>

          {/* Document Formats Grid */}
          <div className="integrations-grid">
            {filteredDocFormats.map(docFormat => {
              const isAdded = isDocFormatAdded(docFormat.id);
              return (
                <div
                  key={docFormat.id}
                  className={`integration-card ${isAdded ? 'added' : ''}`}
                  onClick={() => !isAdded && handleAddDocFormat({
                    formatId: docFormat.id,
                    name: docFormat.name,
                    module: docFormat.module,
                    baseHours: docFormat.baseHours,
                    description: docFormat.description,
                    complexity: 'medium'
                  })}
                >
                  <div className="card-icon">{getModuleIcon(docFormat.module)}</div>
                  <div className="card-content">
                    <h4 className="card-title">{docFormat.name}</h4>
                    <span className="card-category">{docFormat.module}</span>
                    <p className="card-description">{docFormat.description}</p>
                  </div>
                  <div className="card-footer">
                    <span className="card-hours">{docFormat.baseHours}h base</span>
                    {isAdded ? (
                      <span className="added-badge">✓ Added</span>
                    ) : (
                      <span className="add-badge">+ Add</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add Custom Document Format */}
            <div
              className="integration-card custom-card"
              onClick={() => setShowCustomDocFormatModal(true)}
            >
              <div className="card-icon">➕</div>
              <div className="card-content">
                <h4 className="card-title">Custom Document</h4>
                <span className="card-category">Add your own format</span>
              </div>
              <div className="card-footer">
                <span className="add-badge">Create New</span>
              </div>
            </div>
          </div>

          {/* Selected Document Formats */}
          {documentFormats.length > 0 && (
            <div className="selected-integrations-modern">
              <div className="selected-header">
                <h3>Document Formats for Development</h3>
                <span className="selected-count">{documentFormats.length} items • {calculations.documentFormatHours}h total</span>
              </div>

              {/* Table-like header */}
              <div className="doc-format-table-header">
                <span className="col-slno">Sl No</span>
                <span className="col-module">Module</span>
                <span className="col-name">Document Name</span>
                <span className="col-complexity">Complexity</span>
                <span className="col-hours">Hours</span>
                <span className="col-remarks">Remarks</span>
                <span className="col-action"></span>
              </div>

              <div className="selected-list doc-format-list">
                {documentFormats.map((docFormat, index) => (
                  <div key={docFormat.id} className="selected-item doc-format-row">
                    <span className="col-slno">{index + 1}</span>
                    <span className="col-module">
                      <span className="module-badge">{getModuleIcon(docFormat.module)} {docFormat.module}</span>
                    </span>
                    <span className="col-name">{docFormat.name}</span>
                    <span className="col-complexity">
                      <select
                        value={docFormat.complexity || 'medium'}
                        onChange={(e) => handleUpdateDocFormat(docFormat.id, {
                          complexity: e.target.value
                        })}
                        className="compact-select"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </span>
                    <span className="col-hours">
                      <input
                        type="number"
                        className="compact-input"
                        placeholder={docFormat.baseHours?.toString()}
                        value={docFormat.customHours || ''}
                        onChange={(e) => handleUpdateDocFormat(docFormat.id, {
                          customHours: e.target.value ? parseInt(e.target.value) : null
                        })}
                      />
                      <span className="hours-estimate">
                        = {Math.round((docFormat.customHours || docFormat.baseHours) * complexityMultipliers[docFormat.complexity || 'medium'])}h
                      </span>
                    </span>
                    <span className="col-remarks">
                      <input
                        type="text"
                        className="remarks-input"
                        placeholder="Add remarks..."
                        value={docFormat.notes || ''}
                        onChange={(e) => handleUpdateDocFormat(docFormat.id, {
                          notes: e.target.value
                        })}
                      />
                    </span>
                    <span className="col-action">
                      <button
                        className="item-remove"
                        onClick={() => handleRemoveDocFormat(docFormat.id)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {documentFormats.length === 0 && (
            <div className="empty-state-modern">
              <div className="empty-icon">📝</div>
              <h3>No Document Formats Selected</h3>
              <p>Click on document formats above to add them to your scope</p>
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

      {/* Custom Document Format Modal */}
      {showCustomDocFormatModal && (
        <div className="modal-overlay" onClick={() => setShowCustomDocFormatModal(false)}>
          <div className="modal modern-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Document Format</h3>
              <button className="modal-close" onClick={() => setShowCustomDocFormatModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Document Name</label>
                <input
                  type="text"
                  value={customDocFormat.name}
                  onChange={(e) => setCustomDocFormat({ ...customDocFormat, name: e.target.value })}
                  placeholder="e.g., Tax Invoice, Pro-forma Invoice"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Module</label>
                  <select
                    value={customDocFormat.module}
                    onChange={(e) => setCustomDocFormat({ ...customDocFormat, module: e.target.value })}
                  >
                    {docFormatModules.filter(m => m !== 'all').map(mod => (
                      <option key={mod} value={mod}>{mod}</option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Complexity</label>
                  <select
                    value={customDocFormat.complexity}
                    onChange={(e) => setCustomDocFormat({ ...customDocFormat, complexity: e.target.value })}
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
                    value={customDocFormat.baseHours}
                    onChange={(e) => setCustomDocFormat({
                      ...customDocFormat,
                      baseHours: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={customDocFormat.description}
                  onChange={(e) => setCustomDocFormat({ ...customDocFormat, description: e.target.value })}
                  placeholder="Brief description of the document"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowCustomDocFormatModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddCustomDocFormat}>
                Add Document Format
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsBI;
