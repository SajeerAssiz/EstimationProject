import { useState, useEffect, useMemo, useCallback } from 'react';
import { useEstimation } from '../context/EstimationContext';
import { wbsTemplate, generateWBS, moduleGroups, locationTypes } from '../data/wbsStructure';

function WBSProjectPlan() {
  const { state, dispatch } = useEstimation();
  const [wbsData, setWbsData] = useState([]);
  const [expandedPhases, setExpandedPhases] = useState({
    W1: true, W2: true, W3: true, W4: true, W5: true
  });

  // Get active modules based on legal entities or selected modules
  const activeModules = useMemo(() => {
    if (state.legalEntities?.length > 0 && state.moduleMatrix) {
      // Get unique modules from matrix
      const moduleSet = new Set();
      Object.values(state.moduleMatrix).forEach(entityModules => {
        Object.entries(entityModules).forEach(([key, data]) => {
          if (data.selected) {
            const moduleId = key.split('_')[0];
            moduleSet.add(moduleId);
          }
        });
      });
      return Array.from(moduleSet).map(id => ({ moduleId: id }));
    }
    return state.selectedModules || [];
  }, [state.legalEntities, state.moduleMatrix, state.selectedModules]);

  // Get active module groups
  const activeModuleGroupIds = useMemo(() => {
    const groups = new Set();
    activeModules.forEach(m => {
      moduleGroups.forEach(group => {
        if (group.modules.includes(m.moduleId)) {
          groups.add(group.id);
        }
      });
    });
    // Always include Finance as minimum
    if (groups.size === 0) groups.add('finance');
    return Array.from(groups);
  }, [activeModules]);

  // Initialize WBS from state or generate new
  const initialWbsData = useMemo(() => {
    if (state.wbsData && state.wbsData.length > 0) {
      return state.wbsData;
    }
    return generateWBS(wbsTemplate, activeModules);
  }, [state.wbsData, activeModules]);

  // Set local state from initial data on mount
  useEffect(() => {
    setWbsData(initialWbsData);
  }, [initialWbsData]);

  // Save WBS data to context (debounced)
  const saveToContext = useCallback((data) => {
    if (data.length > 0) {
      dispatch({ type: 'SET_WBS_DATA', payload: data });
    }
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToContext(wbsData);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [wbsData, saveToContext]);

  const updateTask = (wbsId, field, value) => {
    setWbsData(prev => prev.map(item => {
      if (item.wbsId === wbsId) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const togglePhase = (phaseId) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  // Calculate totals
  const calculateTotals = () => {
    let totalDays = 0;
    let totalManDays = 0;
    const phaseData = {};

    wbsData.forEach(item => {
      if (item.level === 3 && item.days > 0) {
        totalDays += item.days;
        totalManDays += item.days * (item.resources || 1);
      }

      // Calculate per phase
      const phaseId = item.wbsId.split('.')[0];
      if (!phaseData[phaseId]) {
        phaseData[phaseId] = { days: 0, manDays: 0 };
      }
      if (item.level === 3 && item.days > 0) {
        phaseData[phaseId].days += item.days;
        phaseData[phaseId].manDays += item.days * (item.resources || 1);
      }
    });

    return { totalDays, totalManDays, phaseData };
  };

  const totals = calculateTotals();

  // Add new task
  const addTask = (parentWbsId) => {
    // Find the last child of this parent
    const children = wbsData.filter(item => item.wbsId.startsWith(parentWbsId + '.'));
    const maxIndex = children.reduce((max, item) => {
      const parts = item.wbsId.split('.');
      const lastPart = parseInt(parts[parts.length - 1]) || 0;
      return Math.max(max, lastPart);
    }, 0);

    const newWbsId = `${parentWbsId}.${maxIndex + 1}`;
    const newTask = {
      wbsId: newWbsId,
      level: 3,
      task: 'New Task',
      days: 0,
      resources: 1,
      location: 'mixed',
      remarks: '',
      editable: true,
      isCustom: true,
    };

    // Find position to insert
    const insertIndex = wbsData.findIndex((item, idx) => {
      const next = wbsData[idx + 1];
      return item.wbsId.startsWith(parentWbsId) &&
             (!next || !next.wbsId.startsWith(parentWbsId));
    });

    const newWbsData = [...wbsData];
    newWbsData.splice(insertIndex + 1, 0, newTask);
    setWbsData(newWbsData);
  };

  const deleteTask = (wbsId) => {
    setWbsData(prev => prev.filter(item => item.wbsId !== wbsId));
  };

  // Regenerate WBS from template
  const regenerateWBS = () => {
    if (window.confirm('This will reset all WBS data to defaults. Continue?')) {
      const newWBS = generateWBS(wbsTemplate, activeModules);
      setWbsData(newWBS);
    }
  };

  return (
    <div className="section wbs-project-plan">
      <div className="section-header">
        <h2>WBS Project Plan</h2>
        <div className="section-summary">
          <span>{totals.totalDays} days</span>
          <span className="divider">|</span>
          <span className="hours">{totals.totalManDays} man-days</span>
        </div>
      </div>

      <p className="section-description">
        Detailed Work Breakdown Structure for the implementation. Edit days and resources per task.
        Tasks are organized by project phases based on selected modules.
      </p>

      <div className="wbs-actions">
        <button className="btn-secondary" onClick={regenerateWBS}>
          Reset to Defaults
        </button>
        <div className="active-modules-info">
          <strong>Active Modules: </strong>
          {activeModuleGroupIds.map((id, idx) => {
            const group = moduleGroups.find(g => g.id === id);
            return (
              <span key={id} className="module-tag">
                {group?.name || id}
                {idx < activeModuleGroupIds.length - 1 ? ', ' : ''}
              </span>
            );
          })}
        </div>
      </div>

      <div className="wbs-table-container">
        <table className="wbs-table">
          <thead>
            <tr>
              <th className="col-wbs">WBS ID</th>
              <th className="col-level">Level</th>
              <th className="col-task">Task</th>
              <th className="col-location">Onsite/Offshore</th>
              <th className="col-days">No of Days</th>
              <th className="col-resources">No of Resources</th>
              <th className="col-mandays">Total Man-days</th>
              <th className="col-remarks">Remarks</th>
              <th className="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {wbsData.map((item) => {
              // Check if this item should be visible
              const parts = item.wbsId.split('.');
              const phaseId = parts[0];
              const isPhase = item.level === 1;
              const isGroup = item.level === 2;
              const isTask = item.level === 3;

              // Skip if parent phase is collapsed
              if (!isPhase && !expandedPhases[phaseId]) {
                return null;
              }

              const manDays = (item.days || 0) * (item.resources || 1);

              return (
                <tr
                  key={item.wbsId}
                  className={`wbs-row level-${item.level} ${isPhase ? 'phase-row' : ''} ${isGroup ? 'group-row' : ''}`}
                >
                  <td className="col-wbs">
                    {isPhase && (
                      <button
                        className="expand-btn"
                        onClick={() => togglePhase(phaseId)}
                      >
                        {expandedPhases[phaseId] ? '▼' : '▶'}
                      </button>
                    )}
                    <span className="wbs-id">{item.wbsId}</span>
                  </td>
                  <td className="col-level">{item.level}</td>
                  <td className="col-task">
                    <span style={{ paddingLeft: `${(item.level - 1) * 20}px` }}>
                      {isTask && item.editable ? (
                        <input
                          type="text"
                          className="task-input"
                          value={item.task}
                          onChange={(e) => updateTask(item.wbsId, 'task', e.target.value)}
                        />
                      ) : (
                        <strong className={isPhase ? 'phase-name' : isGroup ? 'group-name' : ''}>
                          {item.task}
                        </strong>
                      )}
                    </span>
                  </td>
                  <td className="col-location">
                    {isTask && (
                      <select
                        className="location-select"
                        value={item.location || 'mixed'}
                        onChange={(e) => updateTask(item.wbsId, 'location', e.target.value)}
                      >
                        {locationTypes.map(loc => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="col-days">
                    {isTask ? (
                      <input
                        type="number"
                        className="days-input"
                        min="0"
                        value={item.days || 0}
                        onChange={(e) => updateTask(item.wbsId, 'days', parseInt(e.target.value) || 0)}
                      />
                    ) : isGroup || isPhase ? (
                      <span className="subtotal">
                        {wbsData
                          .filter(child => child.wbsId.startsWith(item.wbsId + '.') && child.level === 3)
                          .reduce((sum, child) => sum + (child.days || 0), 0)}
                      </span>
                    ) : null}
                  </td>
                  <td className="col-resources">
                    {isTask ? (
                      <input
                        type="number"
                        className="resources-input"
                        min="1"
                        value={item.resources || 1}
                        onChange={(e) => updateTask(item.wbsId, 'resources', parseInt(e.target.value) || 1)}
                      />
                    ) : null}
                  </td>
                  <td className="col-mandays">
                    {isTask ? (
                      <span className="mandays-value">{manDays}</span>
                    ) : isGroup || isPhase ? (
                      <span className="subtotal">
                        {wbsData
                          .filter(child => child.wbsId.startsWith(item.wbsId + '.') && child.level === 3)
                          .reduce((sum, child) => sum + ((child.days || 0) * (child.resources || 1)), 0)}
                      </span>
                    ) : null}
                  </td>
                  <td className="col-remarks">
                    {isTask && (
                      <input
                        type="text"
                        className="remarks-input"
                        value={item.remarks || ''}
                        onChange={(e) => updateTask(item.wbsId, 'remarks', e.target.value)}
                        placeholder="..."
                      />
                    )}
                  </td>
                  <td className="col-actions">
                    {isGroup && (
                      <button
                        className="btn-mini btn-add"
                        onClick={() => addTask(item.wbsId)}
                        title="Add task"
                      >
                        +
                      </button>
                    )}
                    {item.isCustom && (
                      <button
                        className="btn-mini btn-delete"
                        onClick={() => deleteTask(item.wbsId)}
                        title="Delete task"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan="4"><strong>TOTAL</strong></td>
              <td className="col-days"><strong>{totals.totalDays}</strong></td>
              <td className="col-resources"></td>
              <td className="col-mandays"><strong>{totals.totalManDays}</strong></td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="wbs-summary">
        <h3>Phase Summary</h3>
        <div className="phase-summary-grid">
          {Object.entries(totals.phaseData).map(([phaseId, data]) => {
            const phase = wbsData.find(item => item.wbsId === phaseId);
            return (
              <div key={phaseId} className="phase-summary-card">
                <div className="phase-id">{phaseId}</div>
                <div className="phase-name">{phase?.task || phaseId}</div>
                <div className="phase-stats">
                  <div className="stat">
                    <span className="stat-value">{data.days}</span>
                    <span className="stat-label">Days</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{data.manDays}</span>
                    <span className="stat-label">Man-days</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WBSProjectPlan;
