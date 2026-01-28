import { useEstimation } from '../context/EstimationContext';
import { teamRoles, locationMultipliers, implementationModels } from '../data/d365Modules';
import { useState } from 'react';

function ProjectPlan() {
  const { state, dispatch, calculations } = useEstimation();
  const [implementationModel, setImplementationModel] = useState('hybrid_5050');

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

  const getRoleInfo = (roleId) => {
    return teamRoles.find(r => r.id === roleId) || {};
  };

  const calculateMemberCost = (member) => {
    const roleInfo = getRoleInfo(member.roleId);
    const locationMult = locationMultipliers[roleInfo.location] || 1;
    const memberHours = calculations.totalHours * (member.allocation / 100) * member.count;
    return memberHours * member.hourlyRate * locationMult;
  };

  const calculateMemberHours = (member) => {
    return Math.round(calculations.totalHours * (member.allocation / 100) * member.count);
  };

  const calculateMemberDays = (member) => {
    return Math.round(calculateMemberHours(member) / 8);
  };

  // Calculate resource loading by phase
  const calculateResourceByPhase = () => {
    const enabledPhases = state.projectPlan.phases.filter(p => p.enabled);
    return enabledPhases.map(phase => {
      const phaseHours = Math.round(calculations.totalHours * (phase.percentOfTotal / 100));
      const phaseDays = Math.round(phaseHours / 8);

      const resources = state.projectPlan.teamMembers.map(member => {
        const memberPhaseDays = Math.round(phaseDays * (member.allocation / 100) * member.count);
        return {
          ...member,
          days: memberPhaseDays
        };
      });

      return {
        ...phase,
        hours: phaseHours,
        days: phaseDays,
        resources
      };
    });
  };

  const resourceByPhase = calculateResourceByPhase();

  // Calculate totals for summary
  const totalDays = state.projectPlan.teamMembers.reduce((sum, member) => {
    return sum + calculateMemberDays(member);
  }, 0);

  const getLocationBadge = (location) => {
    const badges = {
      onsite: { label: 'On-site', class: 'badge-onsite' },
      offshore: { label: 'Offshore', class: 'badge-offshore' },
      mixed: { label: 'Mixed', class: 'badge-mixed' }
    };
    return badges[location] || badges.mixed;
  };

  // Group team roles by category for easier selection
  const functionalRoles = teamRoles.filter(r =>
    ['pm', 'solution_arch', 'func_lead', 'scm_consultant', 'finance_consultant',
     'hr_payroll_consultant', 'retail_consultant', 'trainer', 'change_mgmt'].includes(r.id)
  );

  const technicalRoles = teamRoles.filter(r =>
    ['tech_lead', 'tech_consultant', 'developer', 'integration',
     'data_migration', 'bi_consultant', 'infra_consultant', 'qa'].includes(r.id)
  );

  return (
    <div className="section project-plan">
      <div className="section-header">
        <h2>Project Plan & Resource Loading</h2>
        <div className="section-summary">
          <span>{calculations.phaseHours.length} phases</span>
          <span className="divider">|</span>
          <span>{state.projectPlan.teamMembers.length} team members</span>
          <span className="divider">|</span>
          <span className="hours">{calculations.totalHours.toLocaleString()} hours</span>
          <span className="divider">|</span>
          <span className="days">{totalDays.toLocaleString()} days</span>
        </div>
      </div>

      <div className="plan-grid">
        <div className="phases-section">
          <h3>Project Phases (WBS)</h3>
          <p className="section-description">
            Define project phases based on implementation methodology.
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
                        <span className="days-value">
                          ({Math.round(calculations.totalHours * (phase.percentOfTotal / 100) / 8)} days)
                        </span>
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
            Define the project team with on-site and offshore resources.
          </p>

          <div className="implementation-model">
            <label>Implementation Model</label>
            <select
              value={implementationModel}
              onChange={(e) => setImplementationModel(e.target.value)}
            >
              {implementationModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
          </div>

          <div className="add-team-member">
            <div className="role-group">
              <label>Functional Roles</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTeamMember(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Add functional role...</option>
                {functionalRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {formatCurrency(role.dailyRate || role.hourlyRate * 8)}/day ({role.location})
                  </option>
                ))}
              </select>
            </div>
            <div className="role-group">
              <label>Technical Roles</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTeamMember(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Add technical role...</option>
                {technicalRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name} - {formatCurrency(role.dailyRate || role.hourlyRate * 8)}/day ({role.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state.projectPlan.teamMembers.length > 0 && (
            <div className="team-list">
              <table className="team-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Location</th>
                    <th>Count</th>
                    <th>Daily Rate</th>
                    <th>Allocation %</th>
                    <th>Days</th>
                    <th>Cost</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {state.projectPlan.teamMembers.map(member => {
                    const roleInfo = getRoleInfo(member.roleId);
                    const badge = getLocationBadge(roleInfo.location);
                    return (
                      <tr key={member.id}>
                        <td>{member.roleName}</td>
                        <td>
                          <span className={`location-badge ${badge.class}`}>
                            {badge.label}
                          </span>
                        </td>
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
                            value={roleInfo.dailyRate || member.hourlyRate * 8}
                            onChange={(e) => handleUpdateTeamMember(member.id, {
                              hourlyRate: Math.round((parseInt(e.target.value) || 0) / 8)
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
                        <td className="days-cell">
                          {calculateMemberDays(member).toLocaleString()}
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
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5"><strong>Total Team</strong></td>
                    <td><strong>{totalDays.toLocaleString()}</strong></td>
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

      {/* Resource Loading Matrix */}
      {state.projectPlan.teamMembers.length > 0 && (
        <div className="resource-loading-section">
          <h3>Resource Loading by Phase</h3>
          <p className="section-description">
            Days allocation per resource across project phases.
          </p>
          <div className="resource-matrix">
            <table className="resource-table">
              <thead>
                <tr>
                  <th>Consultant Type</th>
                  {resourceByPhase.map(phase => (
                    <th key={phase.id}>{phase.name}</th>
                  ))}
                  <th>Total Days</th>
                </tr>
              </thead>
              <tbody>
                {state.projectPlan.teamMembers.map(member => (
                  <tr key={member.id}>
                    <td>
                      <span className="resource-name">{member.roleName}</span>
                      <span className="resource-count">x{member.count}</span>
                    </td>
                    {resourceByPhase.map(phase => {
                      const resource = phase.resources.find(r => r.id === member.id);
                      return (
                        <td key={phase.id} className="days-cell">
                          {resource?.days || 0}
                        </td>
                      );
                    })}
                    <td className="total-cell">
                      <strong>{calculateMemberDays(member)}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Phase Total (Days)</strong></td>
                  {resourceByPhase.map(phase => (
                    <td key={phase.id}>
                      <strong>{phase.days}</strong>
                    </td>
                  ))}
                  <td><strong>{totalDays}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

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
                  {phase.name} ({Math.round(phase.hours / 8)} days)
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
