import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectsProvider, useProjects } from './context/ProjectsContext';
import { EstimationProvider } from './context/EstimationContext';
import LoginPage from './components/LoginPage';
import ProjectsDashboard from './components/ProjectsDashboard';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProjectInfo from './components/ProjectInfo';
import LegalEntities from './components/LegalEntities';
import ScopeModules from './components/ScopeModules';
import Integrations from './components/Integrations';
import DataMigration from './components/DataMigration';
import ReportsBI from './components/ReportsBI';
import AddonsSupport from './components/AddonsSupport';
import CustomDevelopments from './components/CustomDevelopments';
import ProjectPlan from './components/ProjectPlan';
import Summary from './components/Summary';
import './App.css';

function EstimationApp() {
  const [activeSection, setActiveSection] = useState('project');
  const { currentProject } = useProjects();

  const renderSection = () => {
    switch (activeSection) {
      case 'project':
        return <ProjectInfo />;
      case 'entities':
        return <LegalEntities />;
      case 'modules':
        return <ScopeModules />;
      case 'integrations':
        return <Integrations />;
      case 'migration':
        return <DataMigration />;
      case 'reports':
        return <ReportsBI />;
      case 'addons':
        return <AddonsSupport />;
      case 'customdev':
        return <CustomDevelopments />;
      case 'plan':
        return <ProjectPlan />;
      case 'summary':
        return <Summary />;
      default:
        return <ProjectInfo />;
    }
  };

  return (
    <EstimationProvider>
      <div className="app">
        <Header opportunity={currentProject?.opportunity} />
        <div className="main-container">
          <Navigation
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
          <main className="content">
            {renderSection()}
          </main>
        </div>
      </div>
    </EstimationProvider>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showEstimation, setShowEstimation] = useState(false);

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (showEstimation) {
    return (
      <ProjectsProvider>
        <AppWithProjects onBack={() => setShowEstimation(false)} />
      </ProjectsProvider>
    );
  }

  return (
    <ProjectsProvider>
      <ProjectsDashboard onOpenProject={() => setShowEstimation(true)} />
    </ProjectsProvider>
  );
}

function AppWithProjects({ onBack }) {
  const { currentProject, currentProjectId } = useProjects();

  // If no project is selected, go back to dashboard
  if (!currentProjectId) {
    onBack();
    return null;
  }

  return (
    <div className="app-with-back">
      <button className="btn-back" onClick={onBack}>
        &larr; Back to Projects
      </button>
      {currentProject?.opportunity && (
        <div className="opportunity-banner">
          <span className="opp-badge">CRM Opportunity</span>
          <span className="opp-name">{currentProject.opportunity.name}</span>
          <span className="opp-value">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }).format(currentProject.opportunity.estimatedvalue || 0)}
          </span>
        </div>
      )}
      <EstimationApp />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
