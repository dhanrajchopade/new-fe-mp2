import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SalesAgent = () => {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortedLeads, setSortedLeads] = useState([]);

  // Fetch all sales agents
  useEffect(() => {
    fetch('https://lead-management-be-mp-2.vercel.app/sales-agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        if (data.length > 0) setSelectedAgent(data[0]._id); // Use _id, not name
      });
  }, []);

  // Fetch all leads
  useEffect(() => {
    fetch('https://lead-management-be-mp-2.vercel.app/leads')
      .then(res => res.json())
      .then(data => setLeads(data));
  }, []);

  // Filter and sort leads by selected agent, status, and priority
  useEffect(() => {
    let filtered = leads.filter(lead => lead.salesAgent === selectedAgent);

    if (statusFilter) {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter(lead => lead.priority === priorityFilter);
    }

    filtered = [...filtered].sort((a, b) => a.timeToClose - b.timeToClose);

    setSortedLeads(filtered);
  }, [leads, selectedAgent, statusFilter, priorityFilter]);

  const statuses = Array.from(new Set(leads.map(lead => lead.status).filter(Boolean)));
  const priorities = Array.from(new Set(leads.map(lead => lead.priority).filter(Boolean)));

  const selectedAgentObj = agents.find(agent => agent._id === selectedAgent);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '20%', backgroundColor: '#f4f4f4', padding: '1rem' }}>
        <h3>Sidebar</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>
              Back to Dashboard
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Leads by Sales Agent</h2>
        {/* Agent Selector */}
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Sales Agent:&nbsp;
            <select
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
            >
              {agents.map(agent => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="">Filter by Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="">Filter by Priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <button
            onClick={() => setSortedLeads([...sortedLeads].sort((a, b) => a.timeToClose - b.timeToClose))}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sort by Time to Close
          </button>
        </div>

        {/* Lead List */}
        <div style={{ border: '1px solid #ddd', padding: '1rem' }}>
          <h3>
            Sales Agent: {selectedAgentObj ? `${selectedAgentObj.name} (${selectedAgentObj.email})` : ''}
          </h3>
          {sortedLeads.length === 0 && <p>No leads found for this agent.</p>}
          {sortedLeads.map(lead => (
            <div key={lead._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <p>
                <strong>{lead.name}</strong> - [Status: {lead.status}]
              </p>
              <p>
                Priority: {lead.priority} | Time to Close: {lead.timeToClose} Days
              </p>
              <Link
                to={`/leads/${lead._id}`}
                style={{ textDecoration: 'none', color: 'blue' }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SalesAgent;