import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useFetch from '../useFetch';

const LeadManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch lead details
  const { data: lead, loading, error, refetch } = useFetch(`https://lead-management-be-mp-2.vercel.app/leads/${id}`);
  // Fetch all agents for mapping agentId to agent name
  const { data: agents } = useFetch('https://lead-management-be-mp-2.vercel.app/sales-agents');
  // Fetch all comments
  const { data: allComments, loading: commentsLoading } = useFetch('https://lead-management-be-mp-2.vercel.app/comments');

  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  // Map agentId to agent name
  const agentIdToName = {};
  (agents || []).forEach(agent => {
    agentIdToName[agent._id] = agent.name;
  });

  // Filter comments for this lead
  const leadComments = Array.isArray(allComments) && lead && lead.comments
    ? allComments.filter(comment => lead.comments.includes(comment._id))
    : [];

  // Handle adding a new comment
 const handleAddComment = async () => {
  if (!newComment.trim()) {
    alert('Comment cannot be empty.');
    return;
  }
  setCommentLoading(true);
  try {
    // Use the correct endpoint to link the comment to the lead
    const response = await fetch(`https://lead-management-be-mp-2.vercel.app/leads/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentText: newComment }),
    });
    if (response.ok) {
      setNewComment('');
      if (typeof refetch === 'function') refetch();
      window.location.reload();
    } else {
      alert('Failed to add comment.');
    }
  } catch {
    alert('Failed to add comment.');
  }
  setCommentLoading(false);
};

  // Handle deleting the lead
  const handleDeleteLead = async () => {
    setDeleteError('');
    setDeleteSuccess('');
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`https://lead-management-be-mp-2.vercel.app/leads/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        setDeleteError('Failed to delete lead.');
        return;
      }
      setDeleteSuccess('Lead deleted successfully.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setDeleteError('Failed to delete lead.');
    }
  };

  if (loading || !agents || commentsLoading) return <p>Loading...</p>;
  if (error || !lead) return <p>{error || 'No lead found.'}</p>;

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
        <h1>Lead Management: {lead.name}</h1>
        {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
        {deleteSuccess && <p style={{ color: 'green' }}>{deleteSuccess}</p>}
        <div style={{ marginBottom: '2rem', border: '1px solid #ddd', padding: '1rem' }}>
          <p>
            <strong>Sales Agent:</strong>{" "}
            {agentIdToName[lead.salesAgent] || 'Unknown'}
          </p>
          <p><strong>Lead Source:</strong> {lead.source}</p>
          <p><strong>Lead Status:</strong> {lead.status}</p>
          <p><strong>Priority:</strong> {lead.priority}</p>
          <p><strong>Time to Close:</strong> {lead.timeToClose} Days</p>
          <button
            onClick={() => navigate(`/leads/${lead._id}/edit`)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              marginRight: '1rem'
            }}
          >
            Edit Lead Details
          </button>
          <button
            onClick={handleDeleteLead}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Delete Lead
          </button>
        </div>

        {/* Comments Section */}
        <div style={{ marginBottom: '2rem', border: '1px solid #ddd', padding: '1rem' }}>
          <h3>Comments Section</h3>
          {leadComments.length > 0 ? (
            leadComments.map((comment, index) => (
              <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                <p>
                  <strong>Comment:</strong> {comment.commentText}
                  {comment.author && (
                    <span style={{ marginLeft: 8, color: '#888' }}>
                      — {comment.author.name}
                    </span>
                  )}
                </p>
                {comment.createdAt && (
                  <p style={{ fontSize: '0.85em', color: '#888' }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No comments</p>
          )}

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a new comment..."
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '0.5rem' }}
          />
          <button
            onClick={handleAddComment}
            disabled={commentLoading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {commentLoading ? 'Submitting...' : 'Submit Comment'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default LeadManagement;
