import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useFetch from '../useFetch';

const EditLeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: leads, loading, error } = useFetch("https://lead-management-be-mp-2.vercel.app/leads");
  const { data: agents } = useFetch("https://lead-management-be-mp-2.vercel.app/sales-agents");
  const [form, setForm] = useState(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (leads) {
      const lead = leads.find(l => l._id === id);
      if (lead) {
        setForm({
          name: lead.name,
          source: lead.source,
          status: lead.status,
          priority: lead.priority,
          salesAgent: lead.salesAgent,
          timeToClose: lead.timeToClose,
          tags: lead.tags || [],
        });
      }
    }
  }, [leads, id]);

  if (loading || !form || !agents) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  const handleChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === 'select-multiple') {
      setForm({ ...form, [name]: Array.from(selectedOptions, o => o.value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError('');
    try {
      const res = await fetch(`https://lead-management-be-mp-2.vercel.app/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, timeToClose: Number(form.timeToClose) }),
      });
      if (!res.ok) {
        setSubmitError('Failed to update lead.');
        return;
      }
      navigate(`/leads/${id}`);
    } catch (err) {
      setSubmitError('Error updating lead.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: '#f4f4f4', padding: '2rem 1rem', minHeight: '100vh' }}>
        <Link to="/" style={{ color: '#007bff', fontWeight: 'bold', textDecoration: 'none' }}>
          &larr; Back to Dashboard
        </Link>
      </aside>
      {/* Main Content */}
      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: 8 }}>
          <h2>Edit Lead</h2>
          {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Lead Name:</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Source:</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
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
            <div style={{ marginBottom: '1rem' }}>
              <label>Status:</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Priority:</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Sales Agent:</label>
              <select
                name="salesAgent"
                value={form.salesAgent}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="">Select Sales Agent</option>
                {agents.map(agent => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Time to Close (days):</label>
              <input
                type="number"
                name="timeToClose"
                value={form.timeToClose}
                onChange={handleChange}
                min={1}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Tags:</label>
              <select
                name="tags"
                multiple
                value={form.tags}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem' }}
              >
                <option value="High Value">High Value</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
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
              Update Lead
            </button>
          </form>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to={`/leads/${id}`} style={{ color: '#007bff' }}>
              Back to Lead Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLeadForm;