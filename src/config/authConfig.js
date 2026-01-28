// Azure AD / Windows AD Authentication Configuration
// Update these values with your Azure AD tenant details

export const msalConfig = {
  auth: {
    // Replace with your Azure AD Application (client) ID
    clientId: "YOUR_CLIENT_ID",
    // Replace with your Azure AD tenant ID or use 'common' for multi-tenant
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    // Redirect URI - update for production
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes for Microsoft Graph API and Dynamics 365 CRM
export const loginRequest = {
  scopes: ["User.Read"],
};

// Scopes for D365 CRM API access
export const crmApiRequest = {
  // Replace YOUR_CRM_ORG with your Dynamics 365 organization URL
  scopes: ["https://YOUR_CRM_ORG.crm.dynamics.com/.default"],
};

// D365 CRM Configuration
export const crmConfig = {
  // Replace with your Dynamics 365 CRM organization URL
  apiUrl: "https://YOUR_CRM_ORG.api.crm.dynamics.com/api/data/v9.2",
  // Opportunity entity endpoint
  opportunitiesEndpoint: "/opportunities",
};

/*
 * SETUP INSTRUCTIONS:
 *
 * 1. Register an application in Azure Active Directory:
 *    - Go to Azure Portal > Azure Active Directory > App registrations
 *    - Click "New registration"
 *    - Name: "D365 FO Estimation Tool"
 *    - Supported account types: "Accounts in this organizational directory only"
 *    - Redirect URI: http://localhost:5173 (for development)
 *
 * 2. Configure API Permissions:
 *    - Microsoft Graph > User.Read (delegated)
 *    - Dynamics CRM > user_impersonation (delegated)
 *
 * 3. Update this file:
 *    - Replace YOUR_CLIENT_ID with the Application (client) ID
 *    - Replace YOUR_TENANT_ID with your Azure AD tenant ID
 *    - Replace YOUR_CRM_ORG with your Dynamics 365 organization name
 *
 * 4. For production, update redirectUri to your production URL
 */
