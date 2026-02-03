// WBS (Work Breakdown Structure) for D365 F&O Implementation
// Based on standard implementation methodology

export const wbsTemplate = [
  // W1: Analysis Phase
  {
    wbsId: 'W1',
    level: 1,
    task: 'Analysis',
    category: 'phase',
    percentOfTotal: 20,
    children: [
      {
        wbsId: 'W1.1',
        level: 2,
        task: 'Project Initiation',
        category: 'group',
        children: [
          { wbsId: 'W1.1.1', level: 3, task: 'Kick off meeting', defaultDays: 1, defaultResources: 3 },
          { wbsId: 'W1.1.2', level: 3, task: 'Requirement Gathering Schedule publishing', defaultDays: 1, defaultResources: 2 },
          { wbsId: 'W1.1.3', level: 3, task: 'Project Plan Preparation', defaultDays: 2, defaultResources: 2 },
        ]
      },
      {
        wbsId: 'W1.2',
        level: 2,
        task: 'Requirement Gathering Workshops',
        category: 'group',
        perModule: true,
        children: [
          { wbsId: 'W1.2.{n}', level: 3, task: '{moduleName}', defaultDays: 5, defaultResources: 2, moduleTask: true },
        ]
      },
      {
        wbsId: 'W1.3',
        level: 2,
        task: 'Documentation',
        category: 'group',
        perModule: true,
        children: [
          { wbsId: 'W1.3.{n}', level: 3, task: 'FRD-{moduleName}', defaultDays: 3, defaultResources: 2, moduleTask: true },
          { wbsId: 'W1.3.{n+1}', level: 3, task: 'Gap Fit Analysis', defaultDays: 2, defaultResources: 2 },
        ]
      },
      {
        wbsId: 'W1.4',
        level: 2,
        task: 'FRD Sign off',
        category: 'group',
        perModule: true,
        children: [
          { wbsId: 'W1.4.{n}', level: 3, task: 'FRD Sign off - {moduleName}', defaultDays: 1, defaultResources: 2, moduleTask: true },
          { wbsId: 'W1.4.{n+1}', level: 3, task: 'Gap Fit Sign off', defaultDays: 1, defaultResources: 2 },
        ]
      },
      {
        wbsId: 'W1.5',
        level: 2,
        task: 'Master Data',
        category: 'group',
        children: [
          { wbsId: 'W1.5.1', level: 3, task: 'Templates Submission', defaultDays: 2, defaultResources: 2 },
          { wbsId: 'W1.5.2', level: 3, task: 'Data Receipt', defaultDays: 3, defaultResources: 1 },
          { wbsId: 'W1.5.3', level: 3, task: 'Data Verification', defaultDays: 2, defaultResources: 2 },
        ]
      },
    ]
  },
  // W2: Design Phase
  {
    wbsId: 'W2',
    level: 1,
    task: 'Design',
    category: 'phase',
    percentOfTotal: 15,
    children: [
      {
        wbsId: 'W2.1',
        level: 2,
        task: 'System Configuration',
        category: 'group',
        children: [
          { wbsId: 'W2.1.1', level: 3, task: 'Company Configuration-Test System', defaultDays: 3, defaultResources: 2 },
          { wbsId: 'W2.1.2', level: 3, task: 'Master data Upload', defaultDays: 5, defaultResources: 2 },
        ]
      },
      {
        wbsId: 'W2.2',
        level: 2,
        task: 'Testing',
        category: 'group',
        children: [
          { wbsId: 'W2.2.1', level: 3, task: 'Verify the Data', defaultDays: 2, defaultResources: 2 },
          { wbsId: 'W2.2.2', level: 3, task: 'Test the scenarios', defaultDays: 3, defaultResources: 2 },
        ]
      },
      {
        wbsId: 'W2.3',
        level: 2,
        task: 'FDD',
        category: 'group',
        children: [
          { wbsId: 'W2.3.1', level: 3, task: 'FDD for Customizations', defaultDays: 5, defaultResources: 2 },
        ]
      },
    ]
  },
  // W3: Development Phase
  {
    wbsId: 'W3',
    level: 1,
    task: 'Development Phase',
    category: 'phase',
    percentOfTotal: 30,
    children: [
      {
        wbsId: 'W3.1',
        level: 2,
        task: 'Customization Developments',
        category: 'group',
        children: [
          { wbsId: 'W3.1.1', level: 3, task: 'Functionalities', defaultDays: 10, defaultResources: 3, customDev: true },
          { wbsId: 'W3.1.2', level: 3, task: 'Reports', defaultDays: 8, defaultResources: 2, reports: true },
          { wbsId: 'W3.1.3', level: 3, task: 'BI Dashboards', defaultDays: 5, defaultResources: 2, bi: true },
        ]
      },
      {
        wbsId: 'W3.2',
        level: 2,
        task: 'Integrations',
        category: 'group',
        children: [
          { wbsId: 'W3.2.1', level: 3, task: 'Integration Development', defaultDays: 10, defaultResources: 2, integrations: true },
          { wbsId: 'W3.2.2', level: 3, task: 'Integration Testing', defaultDays: 5, defaultResources: 2 },
        ]
      },
      {
        wbsId: 'W3.3',
        level: 2,
        task: 'Data Migration Development',
        category: 'group',
        children: [
          { wbsId: 'W3.3.1', level: 3, task: 'Data Migration Scripts', defaultDays: 8, defaultResources: 2, dataMigration: true },
          { wbsId: 'W3.3.2', level: 3, task: 'Data Cleansing', defaultDays: 5, defaultResources: 2 },
        ]
      },
    ]
  },
  // W4: Conference Room Pilot / Deployment
  {
    wbsId: 'W4',
    level: 1,
    task: 'Conference Room Pilot',
    category: 'phase',
    percentOfTotal: 25,
    children: [
      {
        wbsId: 'W4.1',
        level: 2,
        task: 'CRP',
        category: 'group',
        perModule: true,
        children: [
          { wbsId: 'W4.1.{n}', level: 3, task: 'CRP - {moduleName}', defaultDays: 3, defaultResources: 2, moduleTask: true },
        ]
      },
      {
        wbsId: 'W4.2',
        level: 2,
        task: 'Training',
        category: 'group',
        perModule: true,
        children: [
          { wbsId: 'W4.2.{n}', level: 3, task: 'Training - {moduleName}', defaultDays: 2, defaultResources: 2, moduleTask: true },
          { wbsId: 'W4.2.{n+1}', level: 3, task: 'Training Sign off', defaultDays: 1, defaultResources: 1 },
          { wbsId: 'W4.2.{n+2}', level: 3, task: 'End User Training', defaultDays: 3, defaultResources: 3 },
        ]
      },
      {
        wbsId: 'W4.3',
        level: 2,
        task: 'UAT',
        category: 'group',
        perModule: true,
        children: [
          { wbsId: 'W4.3.{n}', level: 3, task: 'UAT - {moduleName}', defaultDays: 3, defaultResources: 2, moduleTask: true },
          { wbsId: 'W4.3.{n+1}', level: 3, task: 'UAT Sign off', defaultDays: 1, defaultResources: 2 },
        ]
      },
      {
        wbsId: 'W4.4',
        level: 2,
        task: 'Final Master upload',
        category: 'group',
        children: [
          { wbsId: 'W4.4.1', level: 3, task: 'Upload incremental masters', defaultDays: 3, defaultResources: 2 },
          { wbsId: 'W4.4.2', level: 3, task: 'Configure User Security', defaultDays: 2, defaultResources: 2 },
          { wbsId: 'W4.4.3', level: 3, task: 'Go Live', defaultDays: 2, defaultResources: 3 },
          { wbsId: 'W4.4.4', level: 3, task: 'Opening Balance Upload', defaultDays: 3, defaultResources: 2 },
        ]
      },
    ]
  },
  // W5: Operation / Support
  {
    wbsId: 'W5',
    level: 1,
    task: 'Operation',
    category: 'phase',
    percentOfTotal: 10,
    children: [
      {
        wbsId: 'W5.1',
        level: 2,
        task: 'Support',
        category: 'group',
        children: [
          { wbsId: 'W5.1.1', level: 3, task: 'Support Onsite', defaultDays: 10, defaultResources: 2, location: 'onsite' },
          { wbsId: 'W5.1.2', level: 3, task: 'Support Offshore', defaultDays: 20, defaultResources: 1, location: 'offshore' },
          { wbsId: 'W5.1.3', level: 3, task: 'Project Closure', defaultDays: 2, defaultResources: 2 },
        ]
      },
    ]
  },
];

// Module groups for generating per-module tasks
export const moduleGroups = [
  { id: 'finance', name: 'Finance', modules: ['finance'] },
  { id: 'scm', name: 'SCM', modules: ['supplyChain', 'manufacturing'] },
  { id: 'hr', name: 'HR', modules: ['hr'] },
  { id: 'retail', name: 'Retail', modules: ['retail'] },
  { id: 'project', name: 'Project', modules: ['project'] },
  { id: 'other', name: 'Others', modules: ['assetMgmt', 'publicSector'] },
];

// Location types
export const locationTypes = [
  { id: 'onsite', name: 'Onsite', rateMultiplier: 1.5 },
  { id: 'offshore', name: 'Offshore', rateMultiplier: 1.0 },
  { id: 'mixed', name: 'Mixed', rateMultiplier: 1.25 },
];

// Helper function to generate expanded WBS from template
export const generateWBS = (template, selectedModules = [], legalEntities = []) => {
  const wbsItems = [];

  // Determine which module groups are selected
  const activeModuleGroups = moduleGroups.filter(group => {
    // Check if any module in this group is selected
    if (selectedModules.length > 0) {
      return selectedModules.some(m => group.modules.includes(m.moduleId));
    }
    return true; // Include all if no specific selection
  });

  const expandNode = (node, parentPath = '', moduleIndex = 0) => {
    if (node.perModule && node.children) {
      // This is a group that needs to be expanded per module
      let subIndex = 1;
      activeModuleGroups.forEach((moduleGroup, mIdx) => {
        node.children.forEach((child) => {
          if (child.moduleTask) {
            const wbsId = child.wbsId.replace('{n}', subIndex.toString());
            const taskName = child.task.replace('{moduleName}', moduleGroup.name);
            wbsItems.push({
              ...child,
              wbsId: `${parentPath}${parentPath ? '.' : ''}${subIndex}`,
              task: taskName,
              moduleGroup: moduleGroup.id,
              days: child.defaultDays || 0,
              resources: child.defaultResources || 1,
              location: child.location || 'mixed',
              remarks: '',
            });
            subIndex++;
          }
        });
      });

      // Add non-module tasks
      node.children.forEach((child) => {
        if (!child.moduleTask) {
          wbsItems.push({
            ...child,
            wbsId: `${parentPath}${parentPath ? '.' : ''}${subIndex}`,
            days: child.defaultDays || 0,
            resources: child.defaultResources || 1,
            location: child.location || 'mixed',
            remarks: '',
          });
          subIndex++;
        }
      });
    } else if (node.children) {
      // Regular group - just process children
      node.children.forEach((child, idx) => {
        const childWbsId = `${node.wbsId}.${idx + 1}`;
        wbsItems.push({
          ...child,
          wbsId: childWbsId,
          days: child.defaultDays || 0,
          resources: child.defaultResources || 1,
          location: child.location || 'mixed',
          remarks: '',
        });

        if (child.children) {
          expandNode(child, childWbsId);
        }
      });
    }
  };

  // Process all phases
  template.forEach((phase) => {
    // Add phase header
    wbsItems.push({
      wbsId: phase.wbsId,
      level: phase.level,
      task: phase.task,
      category: 'phase',
      percentOfTotal: phase.percentOfTotal,
      days: 0,
      resources: 0,
      location: '',
      remarks: '',
    });

    // Process phase children
    if (phase.children) {
      phase.children.forEach((group, gIdx) => {
        // Add group header
        const groupWbsId = `${phase.wbsId}.${gIdx + 1}`;
        wbsItems.push({
          wbsId: groupWbsId,
          level: 2,
          task: group.task,
          category: 'group',
          days: 0,
          resources: 0,
          location: '',
          remarks: '',
        });

        // Process group children
        if (group.perModule) {
          // Expand per module
          let subIndex = 1;
          activeModuleGroups.forEach((moduleGroup) => {
            group.children.forEach((child) => {
              if (child.moduleTask) {
                const taskName = child.task.replace('{moduleName}', moduleGroup.name);
                wbsItems.push({
                  wbsId: `${groupWbsId}.${subIndex}`,
                  level: 3,
                  task: taskName,
                  moduleGroup: moduleGroup.id,
                  days: child.defaultDays || 0,
                  resources: child.defaultResources || 1,
                  location: child.location || 'mixed',
                  remarks: '',
                  editable: true,
                });
                subIndex++;
              }
            });
          });

          // Add non-module tasks
          group.children.forEach((child) => {
            if (!child.moduleTask) {
              wbsItems.push({
                wbsId: `${groupWbsId}.${subIndex}`,
                level: 3,
                task: child.task,
                days: child.defaultDays || 0,
                resources: child.defaultResources || 1,
                location: child.location || 'mixed',
                remarks: '',
                editable: true,
              });
              subIndex++;
            }
          });
        } else if (group.children) {
          // Regular children
          group.children.forEach((child, cIdx) => {
            wbsItems.push({
              wbsId: `${groupWbsId}.${cIdx + 1}`,
              level: 3,
              task: child.task,
              days: child.defaultDays || 0,
              resources: child.defaultResources || 1,
              location: child.location || 'mixed',
              remarks: '',
              editable: true,
              customDev: child.customDev,
              reports: child.reports,
              bi: child.bi,
              integrations: child.integrations,
              dataMigration: child.dataMigration,
            });
          });
        }
      });
    }
  });

  return wbsItems;
};
