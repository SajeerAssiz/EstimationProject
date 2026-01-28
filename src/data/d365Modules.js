// D365 Finance and Operations Modules with estimation hours
// Based on user's Module Scope requirements

export const d365Modules = {
  finance: {
    name: "Finance",
    description: "General Ledger, AP, AR, Cash Management, Fixed Assets, Budgeting, Tax",
    subModules: [
      { id: "gl", name: "General Ledger", baseHours: 120, complexity: "medium", description: "Chart of Accounts, Journal Entries, Financial Dimensions" },
      { id: "ap", name: "Accounts Payable", baseHours: 100, complexity: "medium", description: "Vendor Management, Invoice Processing, Payments" },
      { id: "ar", name: "Accounts Receivable", baseHours: 100, complexity: "medium", description: "Customer Management, Invoicing, Collections" },
      { id: "cash", name: "Cash and Bank Management", baseHours: 80, complexity: "low", description: "Bank Accounts, Reconciliation, Cash Flow" },
      { id: "fa", name: "Fixed Assets", baseHours: 60, complexity: "low", description: "Asset Acquisition, Depreciation, Disposal" },
      { id: "budget", name: "Budgeting", baseHours: 80, complexity: "medium", description: "Budget Planning, Control, Analysis" },
      { id: "cost", name: "Cost Accounting", baseHours: 100, complexity: "high", description: "Cost Centers, Cost Allocation, Reporting" },
      { id: "tax", name: "Tax Management", baseHours: 60, complexity: "medium", description: "Tax Setup, Calculations, Reporting" },
      { id: "credit", name: "Credit and Collections", baseHours: 50, complexity: "low", description: "Credit Limits, Collection Letters, Aging" },
      { id: "expense", name: "Expense Management", baseHours: 70, complexity: "low", description: "Expense Reports, Approvals, Reimbursements" },
      { id: "consolidation", name: "Financial Consolidation", baseHours: 90, complexity: "high", description: "Multi-company Consolidation, Elimination" },
      { id: "intercompany", name: "Intercompany Accounting", baseHours: 80, complexity: "high", description: "Intercompany Transactions, Due To/From" }
    ]
  },
  supplyChain: {
    name: "Supply Chain Management",
    description: "Inventory, Procurement, Warehouse, Transportation, Production",
    subModules: [
      { id: "inv", name: "Inventory Management", baseHours: 120, complexity: "medium", description: "Stock Control, Movements, Valuation" },
      { id: "proc", name: "Procurement and Sourcing", baseHours: 100, complexity: "medium", description: "Purchase Orders, RFQ, Vendor Selection" },
      { id: "wms", name: "Warehouse Management", baseHours: 150, complexity: "high", description: "WMS, Picking, Packing, Shipping" },
      { id: "tms", name: "Transportation Management", baseHours: 120, complexity: "high", description: "Shipping, Carriers, Route Planning" },
      { id: "prod", name: "Production Control", baseHours: 140, complexity: "high", description: "Production Orders, Shop Floor, Scheduling" },
      { id: "mrp", name: "Master Planning", baseHours: 100, complexity: "high", description: "MRP, Demand Planning, Supply Planning" },
      { id: "pm", name: "Product Information Management", baseHours: 80, complexity: "medium", description: "Products, Variants, Attributes" },
      { id: "qual", name: "Quality Management", baseHours: 70, complexity: "medium", description: "Quality Orders, Tests, Certificates" },
      { id: "sales", name: "Sales and Marketing", baseHours: 90, complexity: "medium", description: "Sales Orders, Quotations, Pricing" },
      { id: "service", name: "Service Management", baseHours: 80, complexity: "medium", description: "Service Orders, SLA, Contracts" },
      { id: "trade_agree", name: "Trade Agreements", baseHours: 60, complexity: "medium", description: "Price Lists, Discounts, Rebates" },
      { id: "landed_cost", name: "Landed Cost", baseHours: 70, complexity: "medium", description: "Import Costs, Duties, Freight" }
    ]
  },
  manufacturing: {
    name: "Manufacturing",
    description: "Discrete, Process, Lean Manufacturing, Shop Floor Control",
    subModules: [
      { id: "discrete", name: "Discrete Manufacturing", baseHours: 130, complexity: "high", description: "BOM, Routes, Production Orders" },
      { id: "process", name: "Process Manufacturing", baseHours: 140, complexity: "high", description: "Formulas, Batch Orders, Co-products" },
      { id: "lean", name: "Lean Manufacturing", baseHours: 120, complexity: "high", description: "Kanban, Pull Systems, JIT" },
      { id: "shop", name: "Shop Floor Control", baseHours: 100, complexity: "medium", description: "Job Cards, Time Registration, Reporting" },
      { id: "bom", name: "BOM Management", baseHours: 80, complexity: "medium", description: "Bill of Materials, Versions, Engineering" },
      { id: "route", name: "Route Management", baseHours: 70, complexity: "medium", description: "Operations, Work Centers, Capacity" },
      { id: "subcontracting", name: "Subcontracting", baseHours: 60, complexity: "medium", description: "Outside Operations, Vendor Work" }
    ]
  },
  retail: {
    name: "Retail / Commerce",
    description: "POS, E-commerce, Call Center, Retail Management",
    subModules: [
      { id: "pos", name: "Point of Sale (POS)", baseHours: 120, complexity: "high", description: "Store Operations, Transactions, Payments" },
      { id: "ecom", name: "E-commerce", baseHours: 150, complexity: "high", description: "Online Store, Product Catalog, Checkout" },
      { id: "callcenter", name: "Call Center", baseHours: 80, complexity: "medium", description: "Order Entry, Customer Service" },
      { id: "retail_inv", name: "Retail Inventory", baseHours: 90, complexity: "medium", description: "Store Inventory, Replenishment" },
      { id: "loyalty", name: "Loyalty Programs", baseHours: 70, complexity: "medium", description: "Points, Rewards, Campaigns" },
      { id: "pricing", name: "Retail Pricing", baseHours: 60, complexity: "medium", description: "Price Groups, Promotions, Discounts" },
      { id: "modern_trade", name: "Modern Trade", baseHours: 100, complexity: "high", description: "Modern Trade Operations, Distribution" }
    ]
  },
  hr: {
    name: "Human Resources",
    description: "Personnel, Benefits, Compensation, Leave, Training",
    subModules: [
      { id: "personnel", name: "Personnel Management", baseHours: 80, complexity: "medium", description: "Employee Records, Org Structure" },
      { id: "benefits", name: "Benefits Management", baseHours: 70, complexity: "medium", description: "Benefit Plans, Enrollment" },
      { id: "comp", name: "Compensation Management", baseHours: 60, complexity: "medium", description: "Pay Structures, Variable Pay" },
      { id: "leave", name: "Leave and Absence", baseHours: 50, complexity: "low", description: "Leave Types, Balances, Requests" },
      { id: "recruit", name: "Recruiting", baseHours: 70, complexity: "medium", description: "Job Postings, Applications, Hiring" },
      { id: "training", name: "Training and Development", baseHours: 60, complexity: "low", description: "Courses, Skills, Certifications" },
      { id: "perf", name: "Performance Management", baseHours: 50, complexity: "low", description: "Goals, Reviews, Feedback" },
      { id: "payroll", name: "Payroll", baseHours: 120, complexity: "high", description: "Payroll Processing, Tax, Deductions" },
      { id: "time_attend", name: "Time and Attendance", baseHours: 80, complexity: "medium", description: "Time Tracking, Shifts, Overtime" }
    ]
  },
  project: {
    name: "Project Management and Accounting",
    description: "Project Accounting, Time and Expense, Resource Management",
    subModules: [
      { id: "proj_acct", name: "Project Accounting", baseHours: 100, complexity: "high", description: "Project Costs, Revenue, WIP" },
      { id: "time_exp", name: "Time and Expense", baseHours: 60, complexity: "low", description: "Timesheets, Expense Entry" },
      { id: "resource", name: "Resource Management", baseHours: 70, complexity: "medium", description: "Resource Scheduling, Capacity" },
      { id: "proj_budget", name: "Project Budgeting", baseHours: 60, complexity: "medium", description: "Budget Lines, Tracking" },
      { id: "billing", name: "Project Billing", baseHours: 80, complexity: "medium", description: "Invoicing, Revenue Recognition" },
      { id: "proj_contract", name: "Project Contracts", baseHours: 70, complexity: "medium", description: "Contract Management, Milestones" }
    ]
  },
  assetMgmt: {
    name: "Asset Management",
    description: "Enterprise Asset Management, Maintenance, Work Orders",
    subModules: [
      { id: "eam", name: "Enterprise Asset Management", baseHours: 120, complexity: "high", description: "Asset Tracking, Maintenance" },
      { id: "maint", name: "Preventive Maintenance", baseHours: 80, complexity: "medium", description: "Maintenance Plans, Schedules" },
      { id: "workorder", name: "Work Order Management", baseHours: 70, complexity: "medium", description: "Work Orders, Tasks, Completion" },
      { id: "asset_lifecycle", name: "Asset Lifecycle", baseHours: 60, complexity: "medium", description: "Acquisition to Disposal" }
    ]
  },
  publicSector: {
    name: "Public Sector",
    description: "Government and Public Sector specific functionality",
    subModules: [
      { id: "fund_acct", name: "Fund Accounting", baseHours: 100, complexity: "high", description: "Fund Management, GASB Compliance" },
      { id: "grant_mgmt", name: "Grant Management", baseHours: 80, complexity: "high", description: "Grant Tracking, Compliance" },
      { id: "encumbrance", name: "Encumbrance", baseHours: 60, complexity: "medium", description: "Budget Reservations" }
    ]
  }
};

export const complexityMultipliers = {
  low: 1.0,
  medium: 1.3,
  high: 1.6
};

export const integrationTypes = [
  { id: "erp_legacy", name: "Legacy ERP System", baseHours: 120, category: "ERP", description: "Migration from existing ERP" },
  { id: "crm", name: "CRM System (D365 CE, Salesforce)", baseHours: 100, category: "CRM", description: "Customer data integration" },
  { id: "ecommerce", name: "E-commerce Platform", baseHours: 140, category: "Commerce", description: "Online sales integration" },
  { id: "wms_external", name: "External WMS", baseHours: 120, category: "Warehouse", description: "Third-party warehouse system" },
  { id: "tms_external", name: "External TMS", baseHours: 100, category: "Transportation", description: "Third-party transport system" },
  { id: "payroll_ext", name: "External Payroll System", baseHours: 90, category: "HR", description: "Payroll integration" },
  { id: "hris", name: "HRIS System", baseHours: 80, category: "HR", description: "HR information system" },
  { id: "bank", name: "Banking Integration", baseHours: 100, category: "Finance", description: "Bank feeds, payments" },
  { id: "tax_engine", name: "Tax Engine (Avalara, Vertex)", baseHours: 80, category: "Finance", description: "Tax calculation service" },
  { id: "edi", name: "EDI Trading Partners", baseHours: 150, category: "B2B", description: "Electronic data interchange" },
  { id: "api", name: "Custom API Integration", baseHours: 60, category: "Custom", description: "REST/SOAP API integration" },
  { id: "bi_tool", name: "BI Tool (Power BI, Tableau)", baseHours: 70, category: "Analytics", description: "Business intelligence" },
  { id: "document", name: "Document Management", baseHours: 60, category: "Documents", description: "DMS integration" },
  { id: "scanners", name: "Barcode/RFID Scanners", baseHours: 50, category: "Hardware", description: "Mobile device integration" },
  { id: "shipping", name: "Shipping Carriers (UPS, FedEx, DHL)", baseHours: 70, category: "Logistics", description: "Carrier integration" },
  { id: "payment", name: "Payment Gateway", baseHours: 80, category: "Payments", description: "Payment processing" },
  { id: "3pl", name: "3PL Provider", baseHours: 100, category: "Logistics", description: "Third-party logistics" },
  { id: "azure", name: "Azure Services", baseHours: 60, category: "Cloud", description: "Azure cloud services" },
  { id: "office365", name: "Office 365 / Teams", baseHours: 40, category: "Productivity", description: "Microsoft 365 integration" },
  { id: "pos_hw", name: "POS Hardware", baseHours: 70, category: "Retail", description: "POS terminals, peripherals" },
  { id: "scales", name: "Weighing Scales", baseHours: 40, category: "Hardware", description: "Scale integration" },
  { id: "govt_portal", name: "Government Portals", baseHours: 80, category: "Compliance", description: "Tax/regulatory portals" }
];

export const reportTypes = [
  { id: "financial", name: "Financial Statements", baseHours: 16, category: "Finance", description: "P&L, Balance Sheet, Cash Flow" },
  { id: "ar_aging", name: "AR Aging Report", baseHours: 8, category: "Finance", description: "Customer aging analysis" },
  { id: "ap_aging", name: "AP Aging Report", baseHours: 8, category: "Finance", description: "Vendor aging analysis" },
  { id: "trial_balance", name: "Trial Balance", baseHours: 8, category: "Finance", description: "GL trial balance" },
  { id: "cash_flow", name: "Cash Flow Statement", baseHours: 12, category: "Finance", description: "Cash flow reporting" },
  { id: "budget_variance", name: "Budget vs Actual", baseHours: 12, category: "Finance", description: "Budget variance analysis" },
  { id: "inventory_val", name: "Inventory Valuation", baseHours: 12, category: "Inventory", description: "Stock valuation report" },
  { id: "stock_status", name: "Stock Status Report", baseHours: 8, category: "Inventory", description: "Current stock levels" },
  { id: "stock_movement", name: "Stock Movement Report", baseHours: 10, category: "Inventory", description: "Inventory transactions" },
  { id: "sales_analysis", name: "Sales Analysis", baseHours: 12, category: "Sales", description: "Sales performance report" },
  { id: "purchase_analysis", name: "Purchase Analysis", baseHours: 10, category: "Procurement", description: "Purchase performance" },
  { id: "vendor_perf", name: "Vendor Performance", baseHours: 10, category: "Procurement", description: "Vendor scorecards" },
  { id: "production", name: "Production Reports", baseHours: 14, category: "Manufacturing", description: "Production analysis" },
  { id: "wms_reports", name: "Warehouse Reports", baseHours: 12, category: "Warehouse", description: "WMS analytics" },
  { id: "hr_reports", name: "HR Analytics", baseHours: 10, category: "HR", description: "HR metrics and reports" },
  { id: "payroll_reports", name: "Payroll Reports", baseHours: 12, category: "HR", description: "Payroll processing reports" },
  { id: "project_reports", name: "Project Status Reports", baseHours: 12, category: "Projects", description: "Project tracking" },
  { id: "tax_reports", name: "Tax Reports", baseHours: 14, category: "Compliance", description: "VAT, GST, Tax filing" },
  { id: "audit_trail", name: "Audit Trail Report", baseHours: 10, category: "Compliance", description: "Transaction audit" },
  { id: "custom_ssrs", name: "Custom SSRS Report", baseHours: 20, category: "Custom", description: "Custom SQL report" },
  { id: "custom_excel", name: "Custom Excel Export", baseHours: 8, category: "Custom", description: "Excel data export" }
];

export const biDashboards = [
  { id: "exec_summary", name: "Executive Summary Dashboard", baseHours: 40, complexity: "high", description: "KPIs for leadership" },
  { id: "financial_dash", name: "Financial Performance Dashboard", baseHours: 35, complexity: "high", description: "Finance KPIs and metrics" },
  { id: "sales_dash", name: "Sales Analytics Dashboard", baseHours: 30, complexity: "medium", description: "Sales performance tracking" },
  { id: "inventory_dash", name: "Inventory Analytics Dashboard", baseHours: 30, complexity: "medium", description: "Stock level analytics" },
  { id: "procurement_dash", name: "Procurement Dashboard", baseHours: 25, complexity: "medium", description: "Purchasing metrics" },
  { id: "production_dash", name: "Production KPI Dashboard", baseHours: 35, complexity: "high", description: "Manufacturing metrics" },
  { id: "hr_dash", name: "HR Analytics Dashboard", baseHours: 25, complexity: "medium", description: "Workforce analytics" },
  { id: "supply_chain_dash", name: "Supply Chain Dashboard", baseHours: 35, complexity: "high", description: "End-to-end supply chain" },
  { id: "customer_dash", name: "Customer Analytics Dashboard", baseHours: 30, complexity: "medium", description: "Customer insights" },
  { id: "retail_dash", name: "Retail Performance Dashboard", baseHours: 35, complexity: "high", description: "Store and sales metrics" },
  { id: "project_dash", name: "Project Analytics Dashboard", baseHours: 30, complexity: "medium", description: "Project portfolio view" },
  { id: "custom_dash", name: "Custom Dashboard", baseHours: 40, complexity: "high", description: "Tailored dashboard" }
];

// Add-ons based on user's IP Details
export const addons = [
  { id: "investment", name: "Investment Module", baseHours: 120, category: "Finance", description: "Investment tracking and management" },
  { id: "modern_trade_rebate", name: "Modern Trade Rebate", baseHours: 100, category: "Sales", description: "Rebate management for modern trade" },
  { id: "contract_mgmt", name: "Contract Management", baseHours: 90, category: "Procurement", description: "Contract lifecycle management" },
  { id: "advance_budget", name: "Advance Budgeting", baseHours: 110, category: "Finance", description: "Advanced budget planning and control" },
  { id: "treasury", name: "Treasury Management", baseHours: 130, category: "Finance", description: "Cash and treasury operations" },
  { id: "prod_cost_sim", name: "Production Cost Simulator", baseHours: 100, category: "Manufacturing", description: "Production costing simulation" },
  { id: "pweol360", name: "Pweol 360 (Global Payroll)", baseHours: 150, category: "HR", description: "Global payroll solution" },
  { id: "connectin", name: "ConnectIn (Marketing App)", baseHours: 80, category: "Marketing", description: "Marketing automation app" },
  { id: "healthcare", name: "Healthcare Module", baseHours: 140, category: "Industry", description: "Healthcare industry solution" },
  { id: "real_estate", name: "Real Estate", baseHours: 120, category: "Industry", description: "Real estate management" },
  { id: "dms", name: "Document Management System", baseHours: 80, category: "Productivity", description: "Document handling and storage" },
  { id: "workflow", name: "Advanced Workflow Automation", baseHours: 100, category: "Automation", description: "Business process automation" },
  { id: "mobile", name: "Mobile Applications", baseHours: 120, category: "Mobile", description: "Mobile app development" },
  { id: "portal", name: "Vendor/Customer Portal", baseHours: 150, category: "Portal", description: "External user portal" },
  { id: "advanced_wms", name: "Advanced WMS Features", baseHours: 100, category: "Warehouse", description: "Enhanced warehouse features" },
  { id: "demand_planning", name: "Demand Planning", baseHours: 120, category: "Planning", description: "Demand forecasting solution" },
  { id: "configurator", name: "Product Configurator", baseHours: 140, category: "Product", description: "Product configuration tool" },
  { id: "rebates", name: "Rebate Management", baseHours: 80, category: "Sales", description: "Customer rebate tracking" },
  { id: "trade_allow", name: "Trade Allowance Management", baseHours: 90, category: "Sales", description: "Trade promotion management" },
  { id: "gts", name: "Global Trade Services", baseHours: 100, category: "Trade", description: "Import/export compliance" },
  { id: "ai_insights", name: "AI/ML Insights", baseHours: 150, category: "AI", description: "AI-powered analytics" },
  { id: "iot", name: "IoT Integration", baseHours: 120, category: "IoT", description: "IoT device integration" }
];

export const supportTypes = [
  { id: "basic", name: "Basic Support (8x5)", monthlyHours: 20, description: "Standard business hours support" },
  { id: "standard", name: "Standard Support (12x5)", monthlyHours: 40, description: "Extended hours weekday support" },
  { id: "premium", name: "Premium Support (24x5)", monthlyHours: 60, description: "24-hour weekday support" },
  { id: "enterprise", name: "Enterprise Support (24x7)", monthlyHours: 80, description: "Round-the-clock support" }
];

// Project phases based on user's WBS structure
export const projectPhases = [
  { id: "analysis", name: "Analysis (W1)", percentOfTotal: 12, description: "Requirements gathering, gap analysis, fit-gap workshops" },
  { id: "design", name: "Design (W2)", percentOfTotal: 15, description: "Solution design, technical design, process mapping" },
  { id: "development", name: "Development (W3)", percentOfTotal: 35, description: "Configuration, customization, development, integrations" },
  { id: "crp", name: "CRP (W4)", percentOfTotal: 15, description: "Conference room pilot, UAT, testing cycles" },
  { id: "deployment", name: "Deployment (W5)", percentOfTotal: 15, description: "Data migration, training, cutover, go-live" },
  { id: "operation", name: "Operation", percentOfTotal: 8, description: "Hypercare, post go-live support, stabilization" }
];

// Team roles based on user's Resource Loading structure
export const teamRoles = [
  { id: "pm", name: "Project Manager", hourlyRate: 175, dailyRate: 1400, allocation: 100, location: "onsite" },
  { id: "scm_consultant", name: "SCM Consultant", hourlyRate: 165, dailyRate: 1320, allocation: 100, location: "mixed" },
  { id: "finance_consultant", name: "Finance Consultant", hourlyRate: 165, dailyRate: 1320, allocation: 100, location: "mixed" },
  { id: "hr_payroll_consultant", name: "HR/Payroll Consultant", hourlyRate: 155, dailyRate: 1240, allocation: 100, location: "mixed" },
  { id: "retail_consultant", name: "Retail Consultant", hourlyRate: 160, dailyRate: 1280, allocation: 100, location: "mixed" },
  { id: "tech_consultant", name: "Technical Consultant", hourlyRate: 170, dailyRate: 1360, allocation: 100, location: "offshore" },
  { id: "bi_consultant", name: "BI Consultant", hourlyRate: 155, dailyRate: 1240, allocation: 75, location: "offshore" },
  { id: "infra_consultant", name: "Infra Consultant", hourlyRate: 145, dailyRate: 1160, allocation: 50, location: "offshore" },
  { id: "solution_arch", name: "Solution Architect", hourlyRate: 200, dailyRate: 1600, allocation: 50, location: "onsite" },
  { id: "func_lead", name: "Functional Lead", hourlyRate: 175, dailyRate: 1400, allocation: 100, location: "onsite" },
  { id: "tech_lead", name: "Technical Lead", hourlyRate: 185, dailyRate: 1480, allocation: 75, location: "mixed" },
  { id: "developer", name: "D365 Developer", hourlyRate: 160, dailyRate: 1280, allocation: 100, location: "offshore" },
  { id: "integration", name: "Integration Specialist", hourlyRate: 170, dailyRate: 1360, allocation: 50, location: "offshore" },
  { id: "data_migration", name: "Data Migration Specialist", hourlyRate: 155, dailyRate: 1240, allocation: 50, location: "offshore" },
  { id: "qa", name: "QA Analyst", hourlyRate: 130, dailyRate: 1040, allocation: 75, location: "offshore" },
  { id: "trainer", name: "Training Specialist", hourlyRate: 125, dailyRate: 1000, allocation: 25, location: "onsite" },
  { id: "change_mgmt", name: "Change Management Lead", hourlyRate: 155, dailyRate: 1240, allocation: 25, location: "onsite" }
];

// Location multipliers for rate calculations
export const locationMultipliers = {
  onsite: 1.0,
  offshore: 0.6,
  mixed: 0.8
};

// Implementation models
export const implementationModels = [
  { id: "onsite", name: "100% On-site", description: "All resources on customer site", multiplier: 1.0 },
  { id: "hybrid_7030", name: "70/30 Hybrid", description: "70% On-site, 30% Offshore", multiplier: 0.85 },
  { id: "hybrid_5050", name: "50/50 Hybrid", description: "50% On-site, 50% Offshore", multiplier: 0.75 },
  { id: "hybrid_3070", name: "30/70 Hybrid", description: "30% On-site, 70% Offshore", multiplier: 0.65 },
  { id: "offshore", name: "100% Offshore", description: "All resources offshore", multiplier: 0.55 }
];

// Master data types for data migration
export const masterDataTypes = [
  { id: "coa", name: "Chart of Accounts", category: "Finance", baseHours: 16 },
  { id: "dimensions", name: "Financial Dimensions", category: "Finance", baseHours: 12 },
  { id: "bank", name: "Bank Accounts", category: "Finance", baseHours: 8 },
  { id: "customer", name: "Customers", category: "Sales", baseHours: 20 },
  { id: "vendor", name: "Vendors", category: "Procurement", baseHours: 20 },
  { id: "item", name: "Items/Products", category: "Inventory", baseHours: 24 },
  { id: "employee", name: "Employees", category: "HR", baseHours: 16 },
  { id: "fixed_asset", name: "Fixed Assets", category: "Finance", baseHours: 12 },
  { id: "bom", name: "Bills of Material", category: "Manufacturing", baseHours: 20 },
  { id: "route", name: "Routes/Operations", category: "Manufacturing", baseHours: 16 }
];

// Opening balance types for data migration
export const openingBalanceTypes = [
  { id: "stock", name: "Stock/Inventory Balance", category: "Inventory", baseHours: 16 },
  { id: "customer_bal", name: "Customer Balance", category: "AR", baseHours: 12 },
  { id: "vendor_bal", name: "Vendor Balance", category: "AP", baseHours: 12 },
  { id: "bank_bal", name: "Bank Balance", category: "Cash", baseHours: 8 },
  { id: "fa_bal", name: "Fixed Asset Balance", category: "FA", baseHours: 12 },
  { id: "gl_bal", name: "GL Balance", category: "GL", baseHours: 16 }
];

// Open transaction types for data migration
export const openTransactionTypes = [
  { id: "po", name: "Purchase Orders", category: "Procurement", baseHours: 12 },
  { id: "so", name: "Sales Orders", category: "Sales", baseHours: 12 },
  { id: "sq", name: "Sales Quotations", category: "Sales", baseHours: 8 },
  { id: "to", name: "Transfer Orders", category: "Inventory", baseHours: 8 },
  { id: "pdc", name: "Post-dated Checks", category: "Finance", baseHours: 8 },
  { id: "prod_order", name: "Production Orders", category: "Manufacturing", baseHours: 12 }
];

// Legal entity structure
export const legalEntityTypes = [
  { id: "operating", name: "Operating Company", description: "Main business operations" },
  { id: "holding", name: "Holding Company", description: "Parent/holding entity" },
  { id: "shared_services", name: "Shared Services", description: "Centralized services entity" },
  { id: "subsidiary", name: "Subsidiary", description: "Child company" }
];
