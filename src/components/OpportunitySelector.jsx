import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CrmService, demoOpportunities, formatCrmCurrency, formatCrmDate } from '../services/crmService';

function OpportunitySelector({ onSelect, onClose }) {
  const { getCrmAccessToken, isMsalConfigured } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isMsalConfigured) {
          // Fetch from real CRM
          const crmService = new CrmService(getCrmAccessToken);
          const data = await crmService.getOpportunities();
          setOpportunities(data);
        } else {
          // Use demo data
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
          setOpportunities(demoOpportunities);
        }
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError(err.message);
        // Fallback to demo data on error
        setOpportunities(demoOpportunities);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [getCrmAccessToken, isMsalConfigured]);

  const filteredOpportunities = opportunities.filter(opp =>
    opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.customerid_account?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedOpp) {
      onSelect(selectedOpp);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select CRM Opportunity</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        {!isMsalConfigured && (
          <div className="demo-notice">
            <span className="demo-badge">Demo Mode</span>
            Showing sample opportunities. Configure Azure AD to connect to your D365 CRM.
          </div>
        )}

        <div className="opportunity-search">
          <input
            type="text"
            placeholder="Search opportunities by name or account..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="opportunity-list">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading opportunities from CRM...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <p className="error-hint">Showing demo opportunities instead.</p>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="empty-state">
              <p>No opportunities found matching your search.</p>
            </div>
          ) : (
            <div className="opportunity-grid">
              {filteredOpportunities.map(opp => (
                <div
                  key={opp.opportunityid}
                  className={`opportunity-card ${selectedOpp?.opportunityid === opp.opportunityid ? 'selected' : ''}`}
                  onClick={() => setSelectedOpp(opp)}
                >
                  <div className="opp-card-header">
                    <h4>{opp.name}</h4>
                    {selectedOpp?.opportunityid === opp.opportunityid && (
                      <span className="selected-check">✓</span>
                    )}
                  </div>
                  <div className="opp-card-body">
                    <div className="opp-detail">
                      <span className="opp-label">Account:</span>
                      <span className="opp-value">{opp.customerid_account?.name || 'N/A'}</span>
                    </div>
                    <div className="opp-detail">
                      <span className="opp-label">Est. Value:</span>
                      <span className="opp-value opp-currency">
                        {formatCrmCurrency(opp.estimatedvalue)}
                      </span>
                    </div>
                    <div className="opp-detail">
                      <span className="opp-label">Close Date:</span>
                      <span className="opp-value">{formatCrmDate(opp.estimatedclosedate)}</span>
                    </div>
                    {opp.description && (
                      <p className="opp-description">{opp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSelect}
            disabled={!selectedOpp}
          >
            Create Estimation from Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpportunitySelector;
