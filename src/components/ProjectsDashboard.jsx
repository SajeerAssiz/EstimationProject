import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectsContext';
import OpportunitySelector from './OpportunitySelector';

function ProjectsDashboard({ onOpenProject }) {
  const { user, logout } = useAuth();
  const { projects, createProject, selectProject, deleteProject, duplicateProject } = useProjects();
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleCreateNew = () => {
    createProject();
    onOpenProject();
  };

  const handleCreateFromOpportunity = (opportunity) => {
    createProject(opportunity);
    setShowOpportunityModal(false);
    onOpenProject();
  };

  const handleOpenProject = (projectId) => {
    selectProject(projectId);
    onOpenProject();
  };

  const handleDeleteProject = (projectId) => {
    deleteProject(projectId);
    setShowDeleteConfirm(null);
  };

  const handleDuplicateProject = (projectId) => {
    duplicateProject(projectId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const calculateProjectHours = (project) => {
    if (!project?.estimation) return 0;
    const est = project.estimation;
    let hours = 0;

    // Calculate module hours
    est.selectedModules?.forEach(m => {
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[m.complexity] || 1;
      hours += (m.customHours || m.baseHours) * multiplier;
    });

    // Add integration hours
    est.integrations?.forEach(i => {
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[i.complexity] || 1;
      hours += (i.customHours || i.baseHours) * multiplier;
    });

    // Add report hours
    est.reports?.forEach(r => {
      hours += (r.customHours || r.baseHours) * (r.quantity || 1);
    });

    // Add BI hours
    est.biDashboards?.forEach(b => {
      const multiplier = { low: 1, medium: 1.3, high: 1.6 }[b.complexity] || 1;
      hours += (b.customHours || b.baseHours) * multiplier;
    });

    // Add addon hours
    est.addons?.forEach(a => {
      hours += a.customHours || a.baseHours;
    });

    // Add custom items
    est.customItems?.forEach(c => {
      hours += c.hours || 0;
    });

    // Add contingency
    const contingency = hours * ((est.projectInfo?.contingencyPercent || 15) / 100);
    return Math.round(hours + contingency);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>D365 F&O Estimation Tool</h1>
          <p className="welcome-text">Welcome, {user?.name || user?.username || 'User'}</p>
        </div>
        <div className="dashboard-header-right">
          <button className="btn-secondary" onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-actions">
          <h2>Create New Estimation</h2>
          <div className="action-buttons">
            <button className="btn-primary btn-large" onClick={handleCreateNew}>
              <span className="btn-icon-large">+</span>
              Blank Estimation
            </button>
            <button
              className="btn-secondary btn-large"
              onClick={() => setShowOpportunityModal(true)}
            >
              <span className="btn-icon-large">CRM</span>
              From CRM Opportunity
            </button>
          </div>
        </div>

        <div className="projects-section">
          <h2>My Estimations ({projects.length})</h2>

          {projects.length === 0 ? (
            <div className="empty-projects">
              <div className="empty-icon">📋</div>
              <h3>No estimations yet</h3>
              <p>Create your first estimation project to get started.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-card">
                  <div className="project-card-header">
                    <h3>{project.estimation?.projectInfo?.projectName || 'Untitled Project'}</h3>
                    {project.opportunity && (
                      <span className="crm-badge" title="Linked to CRM Opportunity">
                        CRM
                      </span>
                    )}
                  </div>

                  <div className="project-card-body">
                    <p className="client-name">
                      {project.estimation?.projectInfo?.clientName || 'No client specified'}
                    </p>

                    <div className="project-stats">
                      <div className="stat">
                        <span className="stat-value">{project.estimation?.selectedModules?.length || 0}</span>
                        <span className="stat-label">Modules</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{project.estimation?.integrations?.length || 0}</span>
                        <span className="stat-label">Integrations</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{calculateProjectHours(project).toLocaleString()}</span>
                        <span className="stat-label">Hours</span>
                      </div>
                    </div>

                    {project.opportunity && (
                      <div className="opportunity-info">
                        <span className="opp-label">Opportunity Value:</span>
                        <span className="opp-value">
                          {formatCurrency(project.opportunity.estimatedvalue)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="project-card-footer">
                    <span className="project-date">
                      Updated: {formatDate(project.updatedAt)}
                    </span>
                  </div>

                  <div className="project-card-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleOpenProject(project.id)}
                    >
                      Open
                    </button>
                    <button
                      className="btn-icon-only"
                      onClick={() => handleDuplicateProject(project.id)}
                      title="Duplicate"
                    >
                      ⧉
                    </button>
                    <button
                      className="btn-icon-only btn-danger-icon"
                      onClick={() => setShowDeleteConfirm(project.id)}
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showOpportunityModal && (
        <OpportunitySelector
          onSelect={handleCreateFromOpportunity}
          onClose={() => setShowOpportunityModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-small" onClick={e => e.stopPropagation()}>
            <h3>Delete Estimation?</h3>
            <p>Are you sure you want to delete this estimation? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={() => handleDeleteProject(showDeleteConfirm)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsDashboard;
