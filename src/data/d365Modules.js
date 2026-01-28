// D365 Finance and Operations Modules with estimation hours
export const d365Modules = {
  finance: {
    name: "Finance",
    description: "General Ledger, AP, AR, Cash Management, Fixed Assets, Budgeting",
    subModules: [
      { id: "gl", name: "General Ledger", baseHours: 120, complexity: "medium" },
      { id: "ap", name: "Accounts Payable", baseHours: 100, complexity: "medium" },
      { id: "ar", name: "Accounts Receivable", baseHours: 100, complexity: "medium" },
      { id: "cash", name: "Cash and Bank Management", baseHours: 80, complexity: "low" },
      { id: "fa", name: "Fixed Assets", baseHours: 60, complexity: "low" },
      { id: "budget", name: "Budgeting", baseHours: 80, complexity: "medium" },
      { id: "cost", name: "Cost Accounting", baseHours: 100, complexity: "high" },
      { id: "tax", name: "Tax Management", baseHours: 60, complexity: "medium" },
      { id: "credit", name: "Credit and Collections", baseHours: 50, complexity: "low" },
      { id: "expense", name: "Expense Management", baseHours: 70, complexity: "low" }
    ]
  },
  supplyChain: {
    name: "Supply Chain Management",
    description: "Inventory, Procurement, Warehouse, Transportation, Production",
    subModules: [
      { id: "inv", name: "Inventory Management", baseHours: 120, complexity: "medium" },
      { id: "proc", name: "Procurement and Sourcing", baseHours: 100, complexity: "medium" },
      { id: "wms", name: "Warehouse Management", baseHours: 150, complexity: "high" },
      { id: "tms", name: "Transportation Management", baseHours: 120, complexity: "high" },
      { id: "prod", name: "Production Control", baseHours: 140, complexity: "high" },
      { id: "mrp", name: "Master Planning", baseHours: 100, complexity: "high" },
      { id: "pm", name: "Product Information Management", baseHours: 80, complexity: "medium" },
      { id: "qual", name: "Quality Management", baseHours: 70, complexity: "medium" },
      { id: "sales", name: "Sales and Marketing", baseHours: 90, complexity: "medium" },
      { id: "service", name: "Service Management", baseHours: 80, complexity: "medium" }
    ]
  },
  manufacturing: {
    name: "Manufacturing",
    description: "Discrete, Process, Lean Manufacturing, Shop Floor Control",
    subModules: [
      { id: "discrete", name: "Discrete Manufacturing", baseHours: 130, complexity: "high" },
      { id: "process", name: "Process Manufacturing", baseHours: 140, complexity: "high" },
      { id: "lean", name: "Lean Manufacturing", baseHours: 120, complexity: "high" },
      { id: "shop", name: "Shop Floor Control", baseHours: 100, complexity: "medium" },
      { id: "bom", name: "BOM Management", baseHours: 80, complexity: "medium" },
      { id: "route", name: "Route Management", baseHours: 70, complexity: "medium" }
    ]
  },
  retail: {
    name: "Retail / Commerce",
    description: "POS, E-commerce, Call Center, Retail Management",
    subModules: [
      { id: "pos", name: "Point of Sale (POS)", baseHours: 120, complexity: "high" },
      { id: "ecom", name: "E-commerce", baseHours: 150, complexity: "high" },
      { id: "callcenter", name: "Call Center", baseHours: 80, complexity: "medium" },
      { id: "retail_inv", name: "Retail Inventory", baseHours: 90, complexity: "medium" },
      { id: "loyalty", name: "Loyalty Programs", baseHours: 70, complexity: "medium" },
      { id: "pricing", name: "Retail Pricing", baseHours: 60, complexity: "medium" }
    ]
  },
  hr: {
    name: "Human Resources",
    description: "Personnel, Benefits, Compensation, Leave, Training",
    subModules: [
      { id: "personnel", name: "Personnel Management", baseHours: 80, complexity: "medium" },
      { id: "benefits", name: "Benefits Management", baseHours: 70, complexity: "medium" },
      { id: "comp", name: "Compensation Management", baseHours: 60, complexity: "medium" },
      { id: "leave", name: "Leave and Absence", baseHours: 50, complexity: "low" },
      { id: "recruit", name: "Recruiting", baseHours: 70, complexity: "medium" },
      { id: "training", name: "Training and Development", baseHours: 60, complexity: "low" },
      { id: "perf", name: "Performance Management", baseHours: 50, complexity: "low" },
      { id: "payroll", name: "Payroll Integration", baseHours: 100, complexity: "high" }
    ]
  },
  project: {
    name: "Project Management",
    description: "Project Accounting, Time and Expense, Resource Management",
    subModules: [
      { id: "proj_acct", name: "Project Accounting", baseHours: 100, complexity: "high" },
      { id: "time_exp", name: "Time and Expense", baseHours: 60, complexity: "low" },
      { id: "resource", name: "Resource Management", baseHours: 70, complexity: "medium" },
      { id: "proj_budget", name: "Project Budgeting", baseHours: 60, complexity: "medium" },
      { id: "billing", name: "Project Billing", baseHours: 80, complexity: "medium" }
    ]
  },
  assetMgmt: {
    name: "Asset Management",
    description: "Enterprise Asset Management, Maintenance, Work Orders",
    subModules: [
      { id: "eam", name: "Enterprise Asset Management", baseHours: 120, complexity: "high" },
      { id: "maint", name: "Preventive Maintenance", baseHours: 80, complexity: "medium" },
      { id: "workorder", name: "Work Order Management", baseHours: 70, complexity: "medium" },
      { id: "asset_lifecycle", name: "Asset Lifecycle", baseHours: 60, complexity: "medium" }
    ]
  }
};

export const complexityMultipliers = {
  low: 1.0,
  medium: 1.3,
  high: 1.6
};

export const integrationTypes = [
  { id: "erp_legacy", name: "Legacy ERP System", baseHours: 120, category: "ERP" },
  { id: "crm", name: "CRM System (Salesforce, Dynamics CRM)", baseHours: 100, category: "CRM" },
  { id: "ecommerce", name: "E-commerce Platform", baseHours: 140, category: "Commerce" },
  { id: "wms_external", name: "External WMS", baseHours: 120, category: "Warehouse" },
  { id: "tms_external", name: "External TMS", baseHours: 100, category: "Transportation" },
  { id: "payroll", name: "Payroll System", baseHours: 90, category: "HR" },
  { id: "hris", name: "HRIS System", baseHours: 80, category: "HR" },
  { id: "bank", name: "Banking Integration", baseHours: 100, category: "Finance" },
  { id: "tax_engine", name: "Tax Engine (Avalara, Vertex)", baseHours: 80, category: "Finance" },
  { id: "edi", name: "EDI Trading Partners", baseHours: 150, category: "B2B" },
  { id: "api", name: "Custom API Integration", baseHours: 60, category: "Custom" },
  { id: "bi_tool", name: "BI Tool (Power BI, Tableau)", baseHours: 70, category: "Analytics" },
  { id: "document", name: "Document Management", baseHours: 60, category: "Documents" },
  { id: "scanners", name: "Barcode/RFID Scanners", baseHours: 50, category: "Hardware" },
  { id: "shipping", name: "Shipping Carriers (UPS, FedEx)", baseHours: 70, category: "Logistics" },
  { id: "payment", name: "Payment Gateway", baseHours: 80, category: "Payments" },
  { id: "3pl", name: "3PL Provider", baseHours: 100, category: "Logistics" },
  { id: "azure", name: "Azure Services", baseHours: 60, category: "Cloud" },
  { id: "office365", name: "Office 365 / Teams", baseHours: 40, category: "Productivity" }
];

export const reportTypes = [
  { id: "financial", name: "Financial Statements", baseHours: 16, category: "Finance" },
  { id: "ar_aging", name: "AR Aging Report", baseHours: 8, category: "Finance" },
  { id: "ap_aging", name: "AP Aging Report", baseHours: 8, category: "Finance" },
  { id: "trial_balance", name: "Trial Balance", baseHours: 8, category: "Finance" },
  { id: "cash_flow", name: "Cash Flow Statement", baseHours: 12, category: "Finance" },
  { id: "inventory_val", name: "Inventory Valuation", baseHours: 12, category: "Inventory" },
  { id: "stock_status", name: "Stock Status Report", baseHours: 8, category: "Inventory" },
  { id: "sales_analysis", name: "Sales Analysis", baseHours: 12, category: "Sales" },
  { id: "purchase_analysis", name: "Purchase Analysis", baseHours: 10, category: "Procurement" },
  { id: "production", name: "Production Reports", baseHours: 14, category: "Manufacturing" },
  { id: "wms_reports", name: "Warehouse Reports", baseHours: 12, category: "Warehouse" },
  { id: "hr_reports", name: "HR Analytics", baseHours: 10, category: "HR" },
  { id: "project_reports", name: "Project Status Reports", baseHours: 12, category: "Projects" },
  { id: "custom_ssrs", name: "Custom SSRS Report", baseHours: 20, category: "Custom" },
  { id: "custom_excel", name: "Custom Excel Export", baseHours: 8, category: "Custom" }
];

export const biDashboards = [
  { id: "exec_summary", name: "Executive Summary Dashboard", baseHours: 40, complexity: "high" },
  { id: "financial_dash", name: "Financial Performance Dashboard", baseHours: 35, complexity: "high" },
  { id: "sales_dash", name: "Sales Analytics Dashboard", baseHours: 30, complexity: "medium" },
  { id: "inventory_dash", name: "Inventory Analytics Dashboard", baseHours: 30, complexity: "medium" },
  { id: "procurement_dash", name: "Procurement Dashboard", baseHours: 25, complexity: "medium" },
  { id: "production_dash", name: "Production KPI Dashboard", baseHours: 35, complexity: "high" },
  { id: "hr_dash", name: "HR Analytics Dashboard", baseHours: 25, complexity: "medium" },
  { id: "supply_chain_dash", name: "Supply Chain Dashboard", baseHours: 35, complexity: "high" },
  { id: "customer_dash", name: "Customer Analytics Dashboard", baseHours: 30, complexity: "medium" },
  { id: "custom_dash", name: "Custom Dashboard", baseHours: 40, complexity: "high" }
];

export const addons = [
  { id: "dms", name: "Document Management System", baseHours: 80, category: "Productivity" },
  { id: "workflow", name: "Advanced Workflow Automation", baseHours: 100, category: "Automation" },
  { id: "mobile", name: "Mobile Applications", baseHours: 120, category: "Mobile" },
  { id: "portal", name: "Vendor/Customer Portal", baseHours: 150, category: "Portal" },
  { id: "advanced_wms", name: "Advanced WMS Features", baseHours: 100, category: "Warehouse" },
  { id: "demand_planning", name: "Demand Planning", baseHours: 120, category: "Planning" },
  { id: "configurator", name: "Product Configurator", baseHours: 140, category: "Product" },
  { id: "rebates", name: "Rebate Management", baseHours: 80, category: "Sales" },
  { id: "trade_allow", name: "Trade Allowance Management", baseHours: 90, category: "Sales" },
  { id: "gts", name: "Global Trade Services", baseHours: 100, category: "Trade" },
  { id: "intercompany", name: "Intercompany Automation", baseHours: 80, category: "Finance" },
  { id: "consolidation", name: "Financial Consolidation", baseHours: 100, category: "Finance" },
  { id: "ai_insights", name: "AI/ML Insights", baseHours: 150, category: "AI" },
  { id: "iot", name: "IoT Integration", baseHours: 120, category: "IoT" }
];

export const supportTypes = [
  { id: "basic", name: "Basic Support (8x5)", monthlyHours: 20, description: "Standard business hours support" },
  { id: "standard", name: "Standard Support (12x5)", monthlyHours: 40, description: "Extended hours weekday support" },
  { id: "premium", name: "Premium Support (24x5)", monthlyHours: 60, description: "24-hour weekday support" },
  { id: "enterprise", name: "Enterprise Support (24x7)", monthlyHours: 80, description: "Round-the-clock support" }
];

export const projectPhases = [
  { id: "discovery", name: "Discovery & Analysis", percentOfTotal: 10, description: "Requirements gathering and gap analysis" },
  { id: "design", name: "Solution Design", percentOfTotal: 15, description: "Technical and functional design" },
  { id: "development", name: "Development & Configuration", percentOfTotal: 35, description: "Build and customize solution" },
  { id: "testing", name: "Testing", percentOfTotal: 15, description: "UAT, integration, and performance testing" },
  { id: "migration", name: "Data Migration", percentOfTotal: 10, description: "Data cleansing, mapping, and migration" },
  { id: "training", name: "Training", percentOfTotal: 8, description: "End-user and admin training" },
  { id: "cutover", name: "Cutover & Go-Live", percentOfTotal: 5, description: "Go-live preparation and execution" },
  { id: "hypercare", name: "Hypercare", percentOfTotal: 2, description: "Post go-live support" }
];

export const teamRoles = [
  { id: "pm", name: "Project Manager", hourlyRate: 175, allocation: 100 },
  { id: "solution_arch", name: "Solution Architect", hourlyRate: 200, allocation: 50 },
  { id: "func_lead", name: "Functional Lead", hourlyRate: 165, allocation: 100 },
  { id: "func_cons", name: "Functional Consultant", hourlyRate: 150, allocation: 100 },
  { id: "tech_lead", name: "Technical Lead", hourlyRate: 185, allocation: 75 },
  { id: "developer", name: "D365 Developer", hourlyRate: 160, allocation: 100 },
  { id: "integration", name: "Integration Specialist", hourlyRate: 170, allocation: 50 },
  { id: "data_migration", name: "Data Migration Specialist", hourlyRate: 155, allocation: 50 },
  { id: "bi_analyst", name: "BI Analyst", hourlyRate: 145, allocation: 50 },
  { id: "qa", name: "QA Analyst", hourlyRate: 130, allocation: 75 },
  { id: "trainer", name: "Training Specialist", hourlyRate: 125, allocation: 25 },
  { id: "change_mgmt", name: "Change Management Lead", hourlyRate: 155, allocation: 25 }
];
