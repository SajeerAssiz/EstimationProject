import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  PageBreak,
} from 'docx';
import { saveAs } from 'file-saver';

// Helper to create a styled heading
const createHeading = (text, level = HeadingLevel.HEADING_1) => {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 400, after: 200 },
  });
};

// Helper to create a paragraph
const createParagraph = (text, options = {}) => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        ...options,
      }),
    ],
    spacing: { after: 100 },
  });
};

// Helper to create table cell
const createCell = (text, options = {}) => {
  const { bold = false, shading = null, alignment = AlignmentType.LEFT } = options;
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: String(text), bold })],
        alignment,
      }),
    ],
    shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
    margins: { top: 50, bottom: 50, left: 100, right: 100 },
  });
};

// Helper to create table row
const createRow = (cells, isHeader = false) => {
  return new TableRow({
    children: cells.map((cell, i) =>
      createCell(cell, {
        bold: isHeader,
        shading: isHeader ? 'DEECF9' : (i === cells.length - 1 ? 'F5F5F5' : null),
        alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
      })
    ),
  });
};

// Create the Word document
export const generateEstimationDocument = async (state, calculations) => {
  const {
    projectInfo,
    selectedModules,
    integrations,
    reports,
    biDashboards,
    addons,
    support,
    customItems,
    projectPlan,
  } = state;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: projectInfo.currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build document sections
  const sections = [];

  // ===== TITLE PAGE =====
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'D365 Finance & Operations',
          size: 48,
          bold: true,
          color: '0078D4',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 2000, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Implementation Estimation',
          size: 40,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    new Paragraph({
      children: [new TextRun({ text: '―――――――――――――――', size: 28, color: '0078D4' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: projectInfo.projectName || 'Project Estimation',
          size: 36,
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: projectInfo.clientName || 'Client Name',
          size: 28,
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Date: ${currentDate}`, size: 24 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Start Date: ${projectInfo.startDate || 'TBD'}`,
          size: 24,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 2000 },
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ===== EXECUTIVE SUMMARY =====
  sections.push(
    createHeading('Executive Summary', HeadingLevel.HEADING_1),
    createParagraph(
      `This document presents the implementation estimation for ${projectInfo.projectName || 'the D365 F&O project'} for ${projectInfo.clientName || 'the client'}.`
    ),
    new Paragraph({ spacing: { after: 200 } }),

    // Summary table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createRow(['Metric', 'Value'], true),
        createRow(['Total Implementation Hours', `${formatNumber(calculations.totalHours)} hours`]),
        createRow(['Total Implementation Days', `${formatNumber(Math.round(calculations.totalHours / 8))} days`]),
        createRow(['Estimated Team Cost', formatCurrency(calculations.teamCost)]),
        createRow(['Contingency', `${projectInfo.contingencyPercent}%`]),
        createRow(['Number of Modules', `${selectedModules.length} modules`]),
        createRow(['Number of Integrations', `${integrations.length} integrations`]),
        createRow(['Reports & BI Dashboards', `${reports.length + biDashboards.length} items`]),
        createRow(['Add-ons', `${addons.length} add-ons`]),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] })
  );

  // ===== HOURS BREAKDOWN =====
  sections.push(
    createHeading('Hours Breakdown', HeadingLevel.HEADING_1),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        createRow(['Category', 'Hours'], true),
        createRow(['D365 Modules Configuration', formatNumber(calculations.moduleHours)]),
        createRow(['Integrations', formatNumber(calculations.integrationHours)]),
        createRow(['Reports', formatNumber(calculations.reportHours)]),
        createRow(['BI Dashboards', formatNumber(calculations.biHours)]),
        createRow(['Add-ons', formatNumber(calculations.addonHours)]),
        createRow(['Custom Items', formatNumber(calculations.customItemHours)]),
        createRow([
          'Subtotal',
          formatNumber(
            calculations.moduleHours +
              calculations.integrationHours +
              calculations.reportHours +
              calculations.biHours +
              calculations.addonHours +
              calculations.customItemHours
          ),
        ]),
        createRow([`Contingency (${projectInfo.contingencyPercent}%)`, formatNumber(Math.round(calculations.totalHours * projectInfo.contingencyPercent / (100 + projectInfo.contingencyPercent)))]),
        createRow(['TOTAL HOURS', formatNumber(calculations.totalHours)]),
      ],
    }),
    new Paragraph({ spacing: { after: 400 } })
  );

  // ===== MODULE SCOPE =====
  sections.push(
    createHeading('Module Scope', HeadingLevel.HEADING_1),
    createParagraph(
      `The following ${selectedModules.length} D365 F&O modules are in scope for this implementation:`
    ),
    new Paragraph({ spacing: { after: 200 } })
  );

  if (selectedModules.length > 0) {
    const moduleRows = [createRow(['Module', 'Sub-Module', 'Complexity', 'Hours'], true)];
    selectedModules.forEach((module) => {
      moduleRows.push(
        createRow([
          module.moduleName || '',
          module.subModuleName || '',
          module.complexity || 'medium',
          formatNumber(module.customHours || module.baseHours || 0),
        ])
      );
    });
    moduleRows.push(
      createRow(['', '', 'TOTAL', formatNumber(calculations.moduleHours)])
    );
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: moduleRows,
      })
    );
  } else {
    sections.push(createParagraph('No modules selected.', { italics: true }));
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));

  // ===== INTEGRATIONS =====
  sections.push(
    createHeading('Integrations', HeadingLevel.HEADING_1),
    createParagraph(`${integrations.length} integrations are planned for this implementation:`),
    new Paragraph({ spacing: { after: 200 } })
  );

  if (integrations.length > 0) {
    const intRows = [createRow(['Integration', 'Category', 'Complexity', 'Hours'], true)];
    integrations.forEach((int) => {
      intRows.push(
        createRow([
          int.name || '',
          int.category || '',
          int.complexity || 'medium',
          formatNumber(int.customHours || int.baseHours || 0),
        ])
      );
    });
    intRows.push(createRow(['', '', 'TOTAL', formatNumber(calculations.integrationHours)]));
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: intRows,
      })
    );
  } else {
    sections.push(createParagraph('No integrations defined.', { italics: true }));
  }

  // ===== REPORTS & BI =====
  sections.push(
    new Paragraph({ spacing: { after: 400 } }),
    createHeading('Reports & BI Dashboards', HeadingLevel.HEADING_1)
  );

  if (reports.length > 0) {
    sections.push(
      createHeading('Reports', HeadingLevel.HEADING_2),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createRow(['Report Name', 'Category', 'Quantity', 'Hours'], true),
          ...reports.map((r) =>
            createRow([
              r.name || '',
              r.category || '',
              r.quantity || 1,
              formatNumber((r.customHours || r.baseHours || 0) * (r.quantity || 1)),
            ])
          ),
          createRow(['', '', 'TOTAL', formatNumber(calculations.reportHours)]),
        ],
      })
    );
  }

  if (biDashboards.length > 0) {
    sections.push(
      createHeading('BI Dashboards', HeadingLevel.HEADING_2),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createRow(['Dashboard Name', 'Complexity', 'Hours'], true),
          ...biDashboards.map((d) =>
            createRow([
              d.name || '',
              d.complexity || 'medium',
              formatNumber(d.customHours || d.baseHours || 0),
            ])
          ),
          createRow(['', 'TOTAL', formatNumber(calculations.biHours)]),
        ],
      })
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));

  // ===== ADD-ONS =====
  sections.push(createHeading('Add-ons / IP Modules', HeadingLevel.HEADING_1));

  if (addons.length > 0) {
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createRow(['Add-on Name', 'Category', 'Hours'], true),
          ...addons.map((a) =>
            createRow([a.name || '', a.category || '', formatNumber(a.customHours || a.baseHours || 0)])
          ),
          createRow(['', 'TOTAL', formatNumber(calculations.addonHours)]),
        ],
      })
    );
  } else {
    sections.push(createParagraph('No add-ons selected.', { italics: true }));
  }

  // ===== PROJECT PHASES =====
  sections.push(
    new Paragraph({ spacing: { after: 400 } }),
    createHeading('Project Phases', HeadingLevel.HEADING_1),
    createParagraph('The implementation will follow these phases:'),
    new Paragraph({ spacing: { after: 200 } })
  );

  const enabledPhases = projectPlan.phases.filter((p) => p.enabled);
  if (enabledPhases.length > 0) {
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createRow(['Phase', 'Description', '% of Total', 'Hours', 'Days'], true),
          ...enabledPhases.map((p) => {
            const hours = Math.round(calculations.totalHours * (p.percentOfTotal / 100));
            return createRow([
              p.name || '',
              p.description || '',
              `${p.percentOfTotal}%`,
              formatNumber(hours),
              formatNumber(Math.round(hours / 8)),
            ]);
          }),
          createRow(['TOTAL', '', '100%', formatNumber(calculations.totalHours), formatNumber(Math.round(calculations.totalHours / 8))]),
        ],
      })
    );
  }

  sections.push(new Paragraph({ children: [new PageBreak()] }));

  // ===== TEAM COMPOSITION =====
  sections.push(
    createHeading('Team Composition', HeadingLevel.HEADING_1),
    createParagraph('The following team structure is proposed for this implementation:'),
    new Paragraph({ spacing: { after: 200 } })
  );

  if (projectPlan.teamMembers.length > 0) {
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createRow(['Role', 'Count', 'Allocation %', 'Hours', 'Days', 'Cost'], true),
          ...projectPlan.teamMembers.map((m) => {
            const memberHours = Math.round(calculations.totalHours * (m.allocation / 100) * m.count);
            const memberDays = Math.round(memberHours / 8);
            const memberCost = memberHours * m.hourlyRate;
            return createRow([
              m.roleName || '',
              m.count || 1,
              `${m.allocation}%`,
              formatNumber(memberHours),
              formatNumber(memberDays),
              formatCurrency(memberCost),
            ]);
          }),
          createRow([
            'TOTAL',
            projectPlan.teamMembers.reduce((sum, m) => sum + m.count, 0),
            '',
            formatNumber(calculations.totalHours),
            formatNumber(Math.round(calculations.totalHours / 8)),
            formatCurrency(calculations.teamCost),
          ]),
        ],
      })
    );
  } else {
    sections.push(createParagraph('No team members defined.', { italics: true }));
  }

  // ===== RESOURCE LOADING BY PHASE =====
  if (projectPlan.teamMembers.length > 0 && enabledPhases.length > 0) {
    sections.push(
      new Paragraph({ spacing: { after: 400 } }),
      createHeading('Resource Loading by Phase', HeadingLevel.HEADING_1),
      createParagraph('Days allocation per resource across project phases:'),
      new Paragraph({ spacing: { after: 200 } })
    );

    const headerCells = ['Consultant Type', ...enabledPhases.map((p) => p.name), 'Total Days'];
    const resourceRows = [createRow(headerCells, true)];

    projectPlan.teamMembers.forEach((member) => {
      const totalMemberDays = Math.round(
        (calculations.totalHours * (member.allocation / 100) * member.count) / 8
      );
      const phaseDays = enabledPhases.map((phase) => {
        const phaseHours = calculations.totalHours * (phase.percentOfTotal / 100);
        const memberPhaseDays = Math.round((phaseHours * (member.allocation / 100) * member.count) / 8);
        return formatNumber(memberPhaseDays);
      });
      resourceRows.push(
        createRow([`${member.roleName} x${member.count}`, ...phaseDays, formatNumber(totalMemberDays)])
      );
    });

    // Phase totals row
    const phaseTotals = enabledPhases.map((phase) => {
      return formatNumber(Math.round((calculations.totalHours * (phase.percentOfTotal / 100)) / 8));
    });
    resourceRows.push(
      createRow([
        'Phase Total (Days)',
        ...phaseTotals,
        formatNumber(Math.round(calculations.totalHours / 8)),
      ])
    );

    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: resourceRows,
      })
    );
  }

  // ===== SUPPORT =====
  if (support.type) {
    sections.push(
      new Paragraph({ spacing: { after: 400 } }),
      createHeading('Post Go-Live Support', HeadingLevel.HEADING_1),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          createRow(['Support Type', support.type.name || ''], false),
          createRow(['Duration', `${support.durationMonths} months`], false),
          createRow(['Monthly Hours', `${support.type.monthlyHours} hours/month`], false),
          createRow(['Total Support Hours', `${formatNumber(calculations.supportHours)} hours`], false),
        ],
      })
    );
  }

  // ===== FOOTER =====
  sections.push(
    new Paragraph({ spacing: { after: 800 } }),
    new Paragraph({
      children: [new TextRun({ text: '―――――――――――――――', color: '0078D4' })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Generated by D365 F&O Estimation Tool',
          size: 20,
          italics: true,
          color: '666666',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: currentDate,
          size: 20,
          italics: true,
          color: '666666',
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  const fileName = `${projectInfo.projectName || 'D365_Estimation'}_${new Date().toISOString().split('T')[0]}.docx`;
  saveAs(blob, fileName);

  return fileName;
};
