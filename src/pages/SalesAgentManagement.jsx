import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../useFetch';

const SalesAgentManagement = () => {
  const { data: agents, loading, error, refetch } = useFetch('https://lead-management-be-mp-2.vercel.app/sales-agents');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAgent = async e => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch('https://lead-management-be-mp-2.vercel.app/sales-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: '', email: '' });
        setShowForm(false);
        setSuccess(true);
        if (typeof refetch === 'function') refetch();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert('Failed to add agent.');
      }
    } catch {
      alert('Failed to add agent.');
    }
    setSaving(false);
  };

  // Delete sales agent handler
  const handleDeleteAgent = async (agentId) => {
    setDeleteError('');
    setDeleteSuccess('');
    if (!window.confirm('Are you sure you want to delete this sales agent?')) return;
    try {
      const res = await fetch(`https://lead-management-be-mp-2.vercel.app/sales-agents/${agentId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        setDeleteError('Failed to delete sales agent.');
        return;
      }
      setDeleteSuccess('Sales agent deleted successfully.');
      if (typeof refetch === 'function') refetch();
      setTimeout(() => setDeleteSuccess(''), 2000);
    } catch (err) {
      setDeleteError('Failed to delete sales agent.');
    }
  };

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
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sales Agent Management</h2>
        {success && (
          <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
            Sales agent added successfully!
          </div>
        )}
        {deleteError && (
          <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
            {deleteError}
          </div>
        )}
        {deleteSuccess && (
          <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
            {deleteSuccess}
          </div>
        )}
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <h3>Sales Agent List</h3>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {agents && agents.length === 0 && <p>No agents found.</p>}
          {agents && agents.map(agent => (
            <div key={agent._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <strong>Agent:</strong> {agent.name} {agent.email && <>- <span style={{ color: '#888' }}>{agent.email}</span></>}
              </span>
              <button
                onClick={() => handleDeleteAgent(agent._id)}
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.3rem 0.8rem',
                  cursor: 'pointer',
                  marginLeft: '1rem'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}
        >
          {showForm ? 'Cancel' : 'Add New Agent'}
        </button>
        {showForm && (
          <form onSubmit={handleAddAgent} style={{ maxWidth: 400, margin: '1rem auto', border: '1px solid #eee', borderRadius: 8, padding: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {saving ? 'Adding...' : 'Add Agent'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default SalesAgentManagement;