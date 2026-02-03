import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest, crmApiRequest, isAzureADConfigured } from '../config/authConfig';

const AuthContext = createContext(null);

// Initialize MSAL instance only if configured
let msalInstance = null;

if (isAzureADConfigured()) {
  try {
    msalInstance = new PublicClientApplication(msalConfig);
  } catch (error) {
    console.warn('MSAL initialization failed:', error.message);
  }
} else {
  console.info('Azure AD not configured. Use Demo Mode or update src/config/authConfig.js');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msalReady, setMsalReady] = useState(false);

  // Check if MSAL is properly configured
  const isMsalConfigured = isAzureADConfigured();

  useEffect(() => {
    const initializeMsal = async () => {
      if (!msalInstance || !isMsalConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        await msalInstance.initialize();
        setMsalReady(true);

        // Handle redirect response
        const response = await msalInstance.handleRedirectPromise();
        if (response) {
          setUser(response.account);
          setIsAuthenticated(true);
        } else {
          // Check for existing accounts
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            setUser(accounts[0]);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('MSAL initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMsal();
  }, [isMsalConfigured]);

  const login = useCallback(async () => {
    if (!msalInstance || !msalReady) {
      setError('Authentication not configured. Please update authConfig.js');
      return;
    }

    try {
      setError(null);
      // Use redirect instead of popup to avoid browser blocking
      await msalInstance.loginRedirect(loginRequest);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    }
  }, [msalReady]);

  const logout = useCallback(async () => {
    if (!msalInstance || !msalReady) return;

    try {
      // Use redirect for logout as well
      await msalInstance.logoutRedirect();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  }, [msalReady]);

  const getAccessToken = useCallback(async (scopes = loginRequest.scopes) => {
    if (!msalInstance || !msalReady || !user) return null;

    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes,
        account: user,
      });
      return response.accessToken;
    } catch {
      // If silent acquisition fails, use redirect
      try {
        await msalInstance.acquireTokenRedirect({ scopes });
        return null; // Will return after redirect
      } catch (redirectErr) {
        console.error('Token acquisition error:', redirectErr);
        setError(redirectErr.message);
        return null;
      }
    }
  }, [msalReady, user]);

  const getCrmAccessToken = useCallback(async () => {
    return getAccessToken(crmApiRequest.scopes);
  }, [getAccessToken]);

  // Demo mode for development without Azure AD
  const loginDemo = useCallback(() => {
    setUser({
      username: 'demo@company.com',
      name: 'Demo User',
      localAccountId: 'demo-user-id',
    });
    setIsAuthenticated(true);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    isMsalConfigured,
    login,
    logout,
    loginDemo,
    getAccessToken,
    getCrmAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
