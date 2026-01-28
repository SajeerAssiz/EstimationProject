import { useState } from 'react';
import { EstimationProvider } from './context/EstimationContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import ProjectInfo from './components/ProjectInfo';
import ScopeModules from './components/ScopeModules';
import Integrations from './components/Integrations';
import ReportsBI from './components/ReportsBI';
import AddonsSupport from './components/AddonsSupport';
import ProjectPlan from './components/ProjectPlan';
import Summary from './components/Summary';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('project');

  const renderSection = () => {
    switch (activeSection) {
      case 'project':
        return <ProjectInfo />;
      case 'modules':
        return <ScopeModules />;
      case 'integrations':
        return <Integrations />;
      case 'reports':
        return <ReportsBI />;
      case 'addons':
        return <AddonsSupport />;
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
        <Header />
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

export default App;
