import { useEstimation } from '../context/EstimationContext';

function ProjectInfo() {
  const { state, dispatch } = useEstimation();
  const { projectInfo } = state;

  const handleChange = (field, value) => {
    dispatch({
      type: 'UPDATE_PROJECT_INFO',
      payload: { [field]: value }
    });
  };

  return (
    <div className="section project-info">
      <h2>Project Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            value={projectInfo.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            placeholder="Enter project name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="clientName">Client Name</label>
          <input
            type="text"
            id="clientName"
            value={projectInfo.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
            placeholder="Enter client name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Estimated Start Date</label>
          <input
            type="date"
            id="startDate"
            value={projectInfo.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            value={projectInfo.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (&euro;)</option>
            <option value="GBP">GBP (&pound;)</option>
            <option value="AED">AED (د.إ)</option>
            <option value="SAR">SAR (﷼)</option>
            <option value="INR">INR (₹)</option>
            <option value="CAD">CAD ($)</option>
            <option value="AUD">AUD ($)</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="estimationUnit">Estimation Unit</label>
          <select
            id="estimationUnit"
            value={projectInfo.estimationUnit || 'hours'}
            onChange={(e) => handleChange('estimationUnit', e.target.value)}
          >
            <option value="hours">Hours</option>
            <option value="days">Days (8 hours/day)</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="hoursPerDay">Hours per Day</label>
          <input
            type="number"
            id="hoursPerDay"
            min="1"
            max="24"
            value={projectInfo.hoursPerDay || 8}
            onChange={(e) => handleChange('hoursPerDay', parseInt(e.target.value) || 8)}
            disabled={projectInfo.estimationUnit === 'hours'}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contingency">Contingency %</label>
          <input
            type="number"
            id="contingency"
            min="0"
            max="50"
            value={projectInfo.contingencyPercent}
            onChange={(e) => handleChange('contingencyPercent', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectInfo;
