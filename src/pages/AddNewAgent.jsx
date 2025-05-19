import  { useState } from 'react';

const AddNewAgent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');
    if (!name.trim() || !email.trim()) {
      setError('Both name and email are required.');
      return;
    }
    try {
      const res = await fetch('https://lead-management-be-mp-2.vercel.app/sales-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        setError('Failed to create agent. Email may already exist.');
        return;
      }
      setName('');
      setEmail('');
      setSuccess(true);
    } catch (error) {
      setError('Error creating agent.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', border: '1px solid #ddd', borderRadius: 8, padding: '2rem', boxShadow: '0 2px 8px #eee' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Add New Sales Agent</h2>
      {success && (
        <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          Agent created successfully!
        </div>
      )}
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleCreateAgent}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Agent Name:</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
            placeholder="Enter agent name"
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', marginTop: 4 }}
            placeholder="Enter email address"
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Create Agent
        </button>
      </form>
    </div>
  );
};

export default AddNewAgent;