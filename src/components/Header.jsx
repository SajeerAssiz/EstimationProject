import { useEstimation } from '../context/EstimationContext';

function Header() {
  const { state, calculations, formatEstimate, estimationUnit } = useEstimation();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.projectInfo.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Count modules from matrix or traditional selection
  const moduleCount = state.legalEntities?.length > 0
    ? Object.values(state.moduleMatrix || {}).reduce((count, entityModules) => {
        return count + Object.values(entityModules).filter(m => m.selected).length;
      }, 0)
    : state.selectedModules.length;

  // Count active legal entities
  const activeEntities = state.legalEntities?.filter(le => le.isActive).length || 0;

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
            <span className="stat-label">Total {estimationUnit === 'days' ? 'Days' : 'Hours'}</span>
            <span className="stat-value">{formatEstimate(calculations.totalHours).toLocaleString()}</span>
          </div>
          {activeEntities > 0 && (
            <div className="stat-box">
              <span className="stat-label">Legal Entities</span>
              <span className="stat-value">{activeEntities}</span>
            </div>
          )}
          <div className="stat-box">
            <span className="stat-label">Modules</span>
            <span className="stat-value">{moduleCount}</span>
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
