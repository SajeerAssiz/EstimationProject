import { useEstimation } from '../context/EstimationContext';

function Header() {
  const { state, calculations } = useEstimation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.projectInfo.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>D365 F&O Estimation Tool</h1>
          <p className="subtitle">
            {state.projectInfo.projectName || 'New Project'}
            {state.projectInfo.clientName && ` - ${state.projectInfo.clientName}`}
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-box">
            <span className="stat-label">Total Hours</span>
            <span className="stat-value">{calculations.totalHours.toLocaleString()}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Modules</span>
            <span className="stat-value">{state.selectedModules.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Integrations</span>
            <span className="stat-value">{state.integrations.length}</span>
          </div>
          <div className="stat-box highlight">
            <span className="stat-label">Est. Cost</span>
            <span className="stat-value">{formatCurrency(calculations.teamCost)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
