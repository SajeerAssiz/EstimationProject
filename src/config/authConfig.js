// Azure AD / Windows AD Authentication Configuration
//
// SETUP OPTIONS:
// 1. Use environment variables (recommended for production)
// 2. Edit values directly below (for development)
//
// See SETUP_WINDOWS.md for detailed instructions

// Get config from environment variables or use defaults
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID || "YOUR_CLIENT_ID";
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID || "YOUR_TENANT_ID";
const crmOrgUrl = import.meta.env.VITE_CRM_ORG_URL || "https://YOUR_CRM_ORG.crm.dynamics.com";

// Check if Azure AD is configured
export const isAzureADConfigured = () => {
  return clientId !== "YOUR_CLIENT_ID" && tenantId !== "YOUR_TENANT_ID";
};

export const msalConfig = {
  auth: {
    // Azure AD Application (client) ID
    // Get this from Azure Portal > App registrations > Your App > Overview
    clientId: clientId,

    // Azure AD Authority URL
    // Format: https://login.microsoftonline.com/{tenant-id}
    authority: `https://login.microsoftonline.com/${tenantId}`,

    // Redirect URI - automatically uses current page URL
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,

    // Navigate to the original page after login
    navigateToLoginRequestUrl: true,
  },
  cache: {
    // Store auth tokens in localStorage (survives browser refresh)
    cacheLocation: "localStorage",
    // Set to true if you have issues with IE11/Edge
    storeAuthStateInCookie: false,
  },
  system: {
    // Logging configuration (enable for debugging)
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        // Uncomment for debugging:
        // console.log(`MSAL [${level}]: ${message}`);
      },
      logLevel: 0, // 0=Error, 1=Warning, 2=Info, 3=Verbose
    },
  },
};

// Scopes requested during login
export const loginRequest = {
  scopes: [
    "User.Read",        // Basic user profile
    "openid",           // OpenID Connect
    "profile",          // User profile info
    "email",            // User email
  ],
};

// Scopes for D365 CRM API access
export const crmApiRequest = {
  scopes: [`${crmOrgUrl}/.default`],
};

// D365 CRM Configuration
export const crmConfig = {
  // Dynamics 365 CRM Web API URL
  apiUrl: `${crmOrgUrl}/api/data/v9.2`,

  // API endpoints
  opportunitiesEndpoint: "/opportunities",
  accountsEndpoint: "/accounts",
  contactsEndpoint: "/contacts",

  // Select fields for opportunities
  opportunitySelect: [
    "opportunityid",
    "name",
    "estimatedvalue",
    "closeprobability",
    "estimatedclosedate",
    "description",
    "statuscode",
    "statecode"
  ].join(","),
};

/*
 * ============================================
 * AZURE AD SETUP INSTRUCTIONS
 * ============================================
 *
 * 1. Go to Azure Portal: https://portal.azure.com
 *
 * 2. Register a new application:
 *    - Azure Active Directory > App registrations > New registration
 *    - Name: "D365 FO Estimation Tool"
 *    - Account types: "Single tenant" (your organization)
 *    - Redirect URI:
 *      - Platform: "Single-page application (SPA)"
 *      - URL: http://localhost:5173
 *
 * 3. Copy your Application IDs:
 *    - Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *    - Directory (tenant) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *
 * 4. Add API permissions:
 *    - Microsoft Graph > User.Read (Delegated)
 *    - Dynamics CRM > user_impersonation (Delegated) [optional]
 *    - Click "Grant admin consent"
 *
 * 5. Configure this file:
 *
 *    OPTION A - Environment variables (.env file):
 *    --------------------------------------------
 *    VITE_AZURE_CLIENT_ID=your-client-id-here
 *    VITE_AZURE_TENANT_ID=your-tenant-id-here
 *    VITE_CRM_ORG_URL=https://yourorg.crm.dynamics.com
 *
 *    OPTION B - Direct edit (above):
 *    --------------------------------------------
 *    Replace "YOUR_CLIENT_ID" with your Application ID
 *    Replace "YOUR_TENANT_ID" with your Tenant ID
 *    Replace "YOUR_CRM_ORG" with your CRM org name
 *
 * 6. For production:
 *    - Add production URL as redirect URI in Azure Portal
 *    - Update CORS settings if needed
 *
 * ============================================
 */
