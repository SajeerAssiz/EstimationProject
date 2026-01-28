import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login, loginDemo, error, isLoading, isMsalConfigured } = useAuth();

  if (isLoading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">D365</div>
        </div>
        <h1>D365 F&O Estimation Tool</h1>
        <p className="login-subtitle">
          ERP Implementation Estimation for<br />
          Dynamics 365 Finance & Operations
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <div className="login-buttons">
          {isMsalConfigured ? (
            <button className="btn-login btn-azure" onClick={login}>
              <span className="btn-icon">
                <svg viewBox="0 0 21 21" width="21" height="21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
              </span>
              Sign in with Microsoft
            </button>
          ) : (
            <div className="config-notice">
              <p>Azure AD not configured.</p>
              <p className="config-hint">
                Update <code>src/config/authConfig.js</code> with your Azure AD credentials to enable SSO.
              </p>
            </div>
          )}

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="btn-login btn-demo" onClick={loginDemo}>
            Continue as Demo User
          </button>
        </div>

        <div className="login-features">
          <h3>Features</h3>
          <ul>
            <li>D365 F&O Module Scope Selection</li>
            <li>Integration Requirements Tracking</li>
            <li>Reports & BI Dashboard Planning</li>
            <li>Project Phase & Team Estimation</li>
            <li>CRM Opportunity Integration</li>
            <li>Multi-Project Management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
