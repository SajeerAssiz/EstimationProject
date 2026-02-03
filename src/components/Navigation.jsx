function Navigation({ activeSection, onSectionChange }) {
  const sections = [
    { id: 'project', label: 'Project Info', icon: '📋' },
    { id: 'modules', label: 'Scope Modules', icon: '📦' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'reports', label: 'Reports & BI', icon: '📊' },
    { id: 'addons', label: 'Add-ons & Support', icon: '🧩' },
    { id: 'customdev', label: 'Custom Development', icon: '⚙️' },
    { id: 'plan', label: 'Project Plan', icon: '📅' },
    { id: 'summary', label: 'Summary', icon: '✅' }
  ];

  return (
    <nav className="navigation">
      <ul className="nav-list">
        {sections.map((section, index) => (
          <li key={section.id}>
            <button
              className={`nav-btn ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => onSectionChange(section.id)}
            >
              <span className="nav-number">{index + 1}</span>
              <span className="nav-label">{section.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
