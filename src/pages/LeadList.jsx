import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../useFetch'; // Import the custom useFetch hook

const LeadList = () => {
  const { data: leads, loading, error } = useFetch('https://lead-management-be-mp-2.vercel.app/leads'); // Fetch leads
  const [filteredLeads, setFilteredLeads] = useState([]);  
  const [statusFilter, setStatusFilter] = useState('');  
  const [salesAgentFilter, setSalesAgentFilter] = useState('');  
  const [sortOption, setSortOption] = useState('');  

  // Handle filtering
  useEffect(() => {
    let updatedLeads = leads || [];  

    if (statusFilter) {
      updatedLeads = updatedLeads.filter((lead) => lead.status === statusFilter);
    }

    if (salesAgentFilter) {
      updatedLeads = updatedLeads.filter((lead) => lead.salesAgent === salesAgentFilter);
    }

    setFilteredLeads(updatedLeads);
  }, [statusFilter, salesAgentFilter, leads]);

  // Handle sorting
  const handleSort = (option) => {
    const sortedLeads = [...filteredLeads];
    if (option === 'priority') {
      sortedLeads.sort((a, b) => a.priority.localeCompare(b.priority));
    } else if (option === 'timeToClose') {
      sortedLeads.sort((a, b) => a.timeToClose - b.timeToClose);
    }
    setFilteredLeads(sortedLeads);
    setSortOption(option);
  };

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
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Lead Overview</h1>

    {/* Lead List */}
        <div style={{ marginBottom: '2rem', border: '1px solid #ddd', padding: '1rem' }}>
          {filteredLeads.map((lead) => (
            <div key={lead._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <p>
                <strong>{lead.name}</strong> - <em>{lead.status}</em> - {lead.salesAgent}
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Filter by Status</option>
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
          </select>

          <select
            value={salesAgentFilter}
            onChange={(e) => setSalesAgentFilter(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Filter by Sales Agent</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane">Jane</option>
            <option value="Mark">Mark</option>
          </select>

          <select
            value={sortOption}
            onChange={(e) => handleSort(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Sort by</option>
            <option value="priority">Priority</option>
            <option value="timeToClose">Time to Close</option>
          </select>
        </div>

    

        {/* Add New Lead Button */}
        <div>
          <Link
            to="/add-lead"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            Add New Lead
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LeadList;