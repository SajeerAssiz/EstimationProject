# D365 F&O ERP Estimation Tool - Windows Setup Guide

## Prerequisites
- Node.js 18+ (download from https://nodejs.org)
- Git (download from https://git-scm.com)
- Azure AD access (for multi-user authentication)

## Quick Start (Demo Mode)

1. **Open Command Prompt** and run:
```cmd
cd C:\Users\%USERNAME%
git clone <repository-url> EstimationProject
cd EstimationProject
npm install
npm run dev
```

2. **Open browser** to http://localhost:5173

3. **Click "Continue with Demo Mode"** to test without Azure AD

---

## Azure AD Setup (Multi-User Authentication)

### Step 1: Register Application in Azure Portal

1. Go to **Azure Portal** (https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **"New registration"**
4. Fill in:
   - **Name:** `D365 FO Estimation Tool`
   - **Supported account types:** `Accounts in this organizational directory only`
   - **Redirect URI:**
     - Platform: `Single-page application (SPA)`
     - URL: `http://localhost:5173`

5. Click **Register**

### Step 2: Note Your Application Details

After registration, copy these values:
- **Application (client) ID:** Found on the Overview page
- **Directory (tenant) ID:** Found on the Overview page

### Step 3: Configure API Permissions

1. Go to **API permissions** in your app registration
2. Click **"Add a permission"**
3. Add these permissions:

   **Microsoft Graph:**
   - `User.Read` (Delegated) - For user profile

   **Dynamics 365 CRM (optional, for CRM integration):**
   - `user_impersonation` (Delegated) - For accessing opportunities

4. Click **"Grant admin consent"** for your organization

### Step 4: Update Configuration File

Edit `src/config/authConfig.js`:

```javascript
export const msalConfig = {
  auth: {
    clientId: "YOUR_APPLICATION_CLIENT_ID",  // From Step 2
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",  // From Step 2
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// For D365 CRM Integration (optional)
export const crmConfig = {
  apiUrl: "https://YOUR_ORG.api.crm.dynamics.com/api/data/v9.2",
  opportunitiesEndpoint: "/opportunities",
};
```

### Step 5: Run the Application

```cmd
npm run dev
```

Open http://localhost:5173 and click **"Sign in with Microsoft"**

---

## Production Deployment

### Update Redirect URIs

1. In Azure Portal > App Registration > Authentication
2. Add your production URL as a redirect URI
3. Example: `https://estimation.yourcompany.com`

### Build for Production

```cmd
npm run build
```

The `dist` folder contains the production-ready files.

### Environment Variables (Optional)

Create `.env` file:
```
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_CRM_ORG_URL=https://yourorg.crm.dynamics.com
```

---

## Features

- **Multi-user authentication** via Azure AD / Windows AD
- **Project management** - Create, save, duplicate estimations
- **D365 CRM integration** - Import opportunities
- **Module selection** - Finance, SCM, Manufacturing, Retail, HR, Projects
- **Resource loading** - Team allocation across project phases
- **Cost estimation** - On-site/Offshore pricing models
- **Export** - Summary reports

---

## Troubleshooting

### "localhost refused to connect"
- Make sure you ran `npm run dev` in the project folder
- Check if port 5173 is available

### "AADSTS50011: Reply URL does not match"
- Add `http://localhost:5173` as a redirect URI in Azure Portal

### "AADSTS65001: User or admin has not consented"
- Ask your Azure AD admin to grant consent for the app permissions

### CRM opportunities not loading
- Verify your D365 CRM URL in `authConfig.js`
- Ensure you have read access to opportunities in CRM
