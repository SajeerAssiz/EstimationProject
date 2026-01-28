import { useEstimation } from '../context/EstimationContext';
import { teamRoles } from '../data/d365Modules';

function ProjectPlan() {
  const { state, dispatch, calculations } = useEstimation();

  const handleTogglePhase = (phaseId) => {
    dispatch({
      type: 'TOGGLE_PHASE',
      payload: phaseId
    });
  };

  const handleUpdatePhase = (id, updates) => {
    dispatch({
      type: 'UPDATE_PHASE',
      payload: { id, updates }
    });
  };

  const handleAddTeamMember = (roleId) => {
    dispatch({
      type: 'ADD_TEAM_MEMBER',
      payload: { roleId }
    });
  };

  const handleRemoveTeamMember = (id) => {
    dispatch({
      type: 'REMOVE_TEAM_MEMBER',
      payload: id
    });
  };

  const handleUpdateTeamMember = (id, updates) => {
    dispatch({
      type: 'UPDATE_TEAM_MEMBER',
      payload: { id, updates }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.projectInfo.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalPhasePercent = state.projectPlan.phases
    .filter(p => p.enabled)
    .reduce((sum, p) => sum + p.percentOfTotal, 0);

  const calculateMemberCost = (member) => {
    const memberHours = calculations.totalHours * (member.allocation / 100) * member.count;
    return memberHours * member.hourlyRate;
  };

  const calculateMemberHours = (member) => {
    return Math.round(calculations.totalHours * (member.allocation / 100) * member.count);
  };

  return (
    <div className="section project-plan">
      <div className="section-header">
        <h2>Project Plan & Team</h2>
        <div className="section-summary">
          <span>{calculations.phaseHours.length} phases</span>
          <span className="hours">{calculations.totalHours.toLocaleString()} total hours</span>
        </div>
      </div>

      <div className="plan-grid">
        <div className="phases-section">
          <h3>Project Phases</h3>
          <p className="section-description">
            Define project phases and their allocation of total hours.
          </p>

          <div className="phases-list">
            {state.projectPlan.phases.map(phase => (
              <div key={phase.id} className={`phase-item ${phase.enabled ? '' : 'disabled'}`}>
                <div className="phase-header">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={phase.enabled}
                      onChange={() => handleTogglePhase(phase.id)}
                    />
                    <span className="phase-name">{phase.name}</span>
                  </label>
                </div>
                <p className="phase-description">{phase.description}</p>
                <div className="phase-metrics">
                  <div className="form-group small">
                    <label>% of Total</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={phase.percentOfTotal}
                      onChange={(e) => handleUpdatePhase(phase.id, {
                        percentOfTotal: parseInt(e.target.value) || 0
                      })}
                      disabled={!phase.enabled}
                    />
                  </div>
                  <div className="phase-hours">
                    {phase.enabled ? (
                      <>
                        <span className="hours-value">
                          {Math.round(calculations.totalHours * (phase.percentOfTotal / 100)).toLocaleString()}
                        </span>
                        <span className="hours-label">hours</span>
                      </>
                    ) : (
                      <span className="disabled-label">Disabled</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`phase-total ${totalPhasePercent !== 100 ? 'warning' : ''}`}>
            <span>Total Phase Allocation:</span>
            <span className="total-value">{totalPhasePercent}%</span>
            {totalPhasePercent !== 100 && (
              <span className="warning-text">
                (should equal 100%)
              </span>
            )}
          </div>
        </div>

        <div className="team-section">
          <h3>Team Composition</h3>
          <p className="section-description">
            Define the project team and resource allocation.
          </p>

          <div className="add-team-member">
            <label>Add Team Member</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddTeamMember(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Select a role...</option>
              {teamRoles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name} ({formatCurrency(role.hourlyRate)}/hr)
                </option>
              ))}
            </select>
          </div>

          {state.projectPlan.teamMembers.length > 0 && (
            <div className="team-list">
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Count</th>
                    <th>Rate/Hr</th>
                    <th>Allocation %</th>
                    <th>Hours</th>
                    <th>Cost</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {state.projectPlan.teamMembers.map(member => (
                    <tr key={member.id}>
                      <td>{member.roleName}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="count-input"
                          value={member.count}
                          onChange={(e) => handleUpdateTeamMember(member.id, {
                            count: parseInt(e.target.value) || 1
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="rate-input"
                          value={member.hourlyRate}
                          onChange={(e) => handleUpdateTeamMember(member.id, {
                            hourlyRate: parseInt(e.target.value) || 0
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="allocation-input"
                          value={member.allocation}
                          onChange={(e) => handleUpdateTeamMember(member.id, {
                            allocation: parseInt(e.target.value) || 0
                          })}
                        />
                      </td>
                      <td className="hours-cell">
                        {calculateMemberHours(member).toLocaleString()}
                      </td>
                      <td className="cost-cell">
                        {formatCurrency(calculateMemberCost(member))}
                      </td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveTeamMember(member.id)}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4"><strong>Total Team Cost</strong></td>
                    <td><strong>{calculations.totalHours.toLocaleString()}</strong></td>
                    <td colSpan="2"><strong>{formatCurrency(calculations.teamCost)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {state.projectPlan.teamMembers.length === 0 && (
            <div className="empty-team">
              <p>No team members added yet. Select roles above to build your team.</p>
            </div>
          )}
        </div>
      </div>

      <div className="timeline-preview">
        <h3>Phase Timeline Preview</h3>
        <div className="timeline-bar">
          {calculations.phaseHours.map((phase, index) => {
            const colors = [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
              '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'
            ];
            return (
              <div
                key={phase.id}
                className="timeline-segment"
                style={{
                  width: `${phase.percentOfTotal}%`,
                  backgroundColor: colors[index % colors.length]
                }}
                title={`${phase.name}: ${phase.hours.toLocaleString()} hours (${phase.percentOfTotal}%)`}
              >
                <span className="segment-label">
                  {phase.percentOfTotal >= 8 ? phase.name : ''}
                </span>
              </div>
            );
          })}
        </div>
        <div className="timeline-legend">
          {calculations.phaseHours.map((phase, index) => {
            const colors = [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
              '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'
            ];
            return (
              <div key={phase.id} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></span>
                <span className="legend-text">
                  {phase.name} ({phase.hours.toLocaleString()}h)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProjectPlan;
