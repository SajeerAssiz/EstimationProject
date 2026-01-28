import { crmConfig } from '../config/authConfig';

// D365 CRM Service for fetching opportunities
export class CrmService {
  constructor(getAccessToken) {
    this.getAccessToken = getAccessToken;
  }

  async fetchWithAuth(endpoint, options = {}) {
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('Unable to acquire access token for CRM');
    }

    const response = await fetch(`${crmConfig.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'OData-MaxVersion': '4.0',
        'OData-Version': '4.0',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`CRM API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Fetch opportunities from D365 CRM
  async getOpportunities(filters = {}) {
    let query = crmConfig.opportunitiesEndpoint;
    const queryParams = [];

    // Select specific fields
    queryParams.push('$select=opportunityid,name,description,estimatedvalue,estimatedclosedate,statuscode,statecode,customerid_account,customerid_contact');

    // Expand related entities
    queryParams.push('$expand=customerid_account($select=name),customerid_contact($select=fullname)');

    // Filter by status (open opportunities by default)
    if (filters.statusCode !== undefined) {
      queryParams.push(`$filter=statuscode eq ${filters.statusCode}`);
    } else {
      // Default: Open opportunities (statecode = 0)
      queryParams.push('$filter=statecode eq 0');
    }

    // Order by estimated close date
    queryParams.push('$orderby=estimatedclosedate desc');

    // Limit results
    if (filters.top) {
      queryParams.push(`$top=${filters.top}`);
    } else {
      queryParams.push('$top=50');
    }

    if (queryParams.length > 0) {
      query += '?' + queryParams.join('&');
    }

    const data = await this.fetchWithAuth(query);
    return data.value || [];
  }

  // Get a single opportunity by ID
  async getOpportunity(opportunityId) {
    const query = `${crmConfig.opportunitiesEndpoint}(${opportunityId})?$select=opportunityid,name,description,estimatedvalue,estimatedclosedate,statuscode,customerid_account&$expand=customerid_account($select=name,accountid)`;
    return this.fetchWithAuth(query);
  }

  // Search opportunities by name
  async searchOpportunities(searchTerm) {
    const query = `${crmConfig.opportunitiesEndpoint}?$select=opportunityid,name,estimatedvalue,estimatedclosedate&$filter=contains(name,'${searchTerm}') and statecode eq 0&$top=20`;
    const data = await this.fetchWithAuth(query);
    return data.value || [];
  }
}

// Demo data for development without CRM connection
export const demoOpportunities = [
  {
    opportunityid: 'demo-opp-001',
    name: 'Contoso Ltd - D365 FO Implementation',
    description: 'Full ERP implementation for manufacturing operations',
    estimatedvalue: 500000,
    estimatedclosedate: '2026-03-15',
    statuscode: 1,
    customerid_account: { name: 'Contoso Ltd', accountid: 'acc-001' },
  },
  {
    opportunityid: 'demo-opp-002',
    name: 'Fabrikam Inc - Finance Module',
    description: 'Finance and accounting module implementation',
    estimatedvalue: 150000,
    estimatedclosedate: '2026-02-28',
    statuscode: 1,
    customerid_account: { name: 'Fabrikam Inc', accountid: 'acc-002' },
  },
  {
    opportunityid: 'demo-opp-003',
    name: 'Adventure Works - SCM Upgrade',
    description: 'Supply chain management upgrade and optimization',
    estimatedvalue: 250000,
    estimatedclosedate: '2026-04-30',
    statuscode: 1,
    customerid_account: { name: 'Adventure Works', accountid: 'acc-003' },
  },
  {
    opportunityid: 'demo-opp-004',
    name: 'Northwind Traders - Retail Implementation',
    description: 'D365 Commerce and POS implementation',
    estimatedvalue: 350000,
    estimatedclosedate: '2026-05-15',
    statuscode: 1,
    customerid_account: { name: 'Northwind Traders', accountid: 'acc-004' },
  },
  {
    opportunityid: 'demo-opp-005',
    name: 'Wide World Importers - WMS',
    description: 'Warehouse management system implementation',
    estimatedvalue: 200000,
    estimatedclosedate: '2026-03-31',
    statuscode: 1,
    customerid_account: { name: 'Wide World Importers', accountid: 'acc-005' },
  },
];

// Helper to format currency
export const formatCrmCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

// Helper to format date
export const formatCrmDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
