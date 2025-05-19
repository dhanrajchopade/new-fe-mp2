import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../useFetch';

const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
const priorities = ['High', 'Medium', 'Low']; // Common priorities

const LeadStatus = () => {
  const { data: leads, loading, error } = useFetch('https://lead-management-be-mp-2.vercel.app/leads');
  const { data: agents } = useFetch('https://lead-management-be-mp-2.vercel.app/sales-agents');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [salesAgentFilter, setSalesAgentFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortedLeads, setSortedLeads] = useState([]);

  // Map agentId to agent name for quick lookup
  const agentIdToName = {};
  (agents || []).forEach(agent => {
    agentIdToName[agent._id] = agent.name;
  });

  // Get unique agent IDs from leads that exist in agents list
  const uniqueAgentIds = Array.from(
    new Set((leads || []).map(lead => lead.salesAgent))
  ).filter(id => id && agentIdToName[id]);

  // Filter and sort leads whenever dependencies change
  useEffect(() => {
    let filtered = leads || [];
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(lead => lead.status === selectedStatus);
    }
    if (salesAgentFilter) {
      filtered = filtered.filter(lead => lead.salesAgent === salesAgentFilter);
    }
    if (priorityFilter) {
      filtered = filtered.filter(lead => lead.priority === priorityFilter);
    }
    // Default sort by timeToClose ascending
    filtered = [...filtered].sort((a, b) => a.timeToClose - b.timeToClose);

    setSortedLeads(filtered);
  }, [leads, selectedStatus, salesAgentFilter, priorityFilter]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Leads by Status</h1>

        {/* Status Tabs */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedStatus === status ? '#007bff' : '#f4f4f4',
                color: selectedStatus === status ? '#fff' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedStatus === status ? 'bold' : 'normal'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Lead List by Status */}
        <div style={{ border: '1px solid #ddd', padding: '1rem' }}>
          <h3>Status: {selectedStatus}</h3>
          {sortedLeads.length === 0 && <p>No leads found for this status.</p>}
          {sortedLeads.map(lead => (
            <div key={lead._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <p>
                <strong>{lead.name}</strong> - [Sales Agent: {agentIdToName[lead.salesAgent] || 'Unknown'}]
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

        {/* Filters */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
          <select
            value={salesAgentFilter}
            onChange={e => setSalesAgentFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Filter by Sales Agent</option>
            {uniqueAgentIds.map(agentId => (
              <option key={agentId} value={agentId}>
                {agentIdToName[agentId]}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Filter by Priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority}
              </option>
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
      </main>
    </div>
  );
};

export default LeadStatus;