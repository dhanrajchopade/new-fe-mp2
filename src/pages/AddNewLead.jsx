import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const AddNewLead = () => {
  const [lead, setLead] = useState({
    name: '',
    source: '',
    salesAgent: '',
    status: 'New',
    priority: '',
    timeToClose: '',
    tags: [],
  });
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch agents for dropdown
  useEffect(() => {
    fetch('https://lead-management-be-mp-2.vercel.app/sales-agents')
      .then(res => res.json())
      .then(data => setAgents(data))
      .catch(() => setAgents([]));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLead({ ...lead, [name]: value });
    setSuccess(false);
    setError('');
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setLead({ ...lead, [field]: selectedOptions });
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate required fields
    if (!lead.name || !lead.source || !lead.salesAgent || !lead.status || !lead.priority || !lead.timeToClose) {
      setError('All fields are required.');
      return;
    }
    if (Number(lead.timeToClose) < 1) {
      setError('Time to Close must be a positive number.');
      return;
    }
    try {
      const res = await fetch('https://lead-management-be-mp-2.vercel.app/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          timeToClose: Number(lead.timeToClose),
        }),
      });
      if (!res.ok) {
        setError('Failed to add lead. Please check your input.');
        return;
      }
      setLead({
        name: '',
        source: '',
        salesAgent: '',
        status: 'New',
        priority: '',
        timeToClose: '',
        tags: [],
      });
      setSuccess(true);
    } catch (err) {
      setError('Error creating lead.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '1rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Add New Lead</h2>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          {success && (
            <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
              Lead created successfully!
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Lead Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lead Name:</label>
              <input
                type="text"
                name="name"
                value={lead.name}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            {/* Lead Source */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lead Source:</label>
              <select
                name="source"
                value={lead.source}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Email">Email</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Sales Agent */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Sales Agent:</label>
              <select
                name="salesAgent"
                value={lead.salesAgent}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              >
                <option value="">Select Sales Agent</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Lead Status */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Lead Status:</label>
              <select
                name="status"
                value={lead.status}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            {/* Priority */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Priority:</label>
              <select
                name="priority"
                value={lead.priority}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            {/* Time to Close */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Time to Close (in days):</label>
              <input
                type="number"
                name="timeToClose"
                value={lead.timeToClose}
                onChange={handleInputChange}
                min={1}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            {/* Tags */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tags:</label>
              <select
                name="tags"
                multiple
                value={lead.tags}
                onChange={(e) => handleMultiSelectChange(e, 'tags')}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="High Value">High Value</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            >
              Create Lead
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddNewLead;