import { useState } from "react";
import useFetch from "../useFetch";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const statuses = ["All", "New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

const Dashboard = () => {
  const { data, loading, error } = useFetch("https://lead-management-be-mp-2.vercel.app/leads");
  const [filter, setFilter] = useState("All"); // Default to "All"

  // Function to handle filtering
  const handleFilter = (status) => {
    setFilter(status);
  };

  // Filtered leads based on the selected filter
  const filteredLeads = data?.filter((lead) => {
    if (filter === "All") return true;
    return lead.status === filter;
  });

  // Count leads by status
  const leadCounts = statuses.reduce((acc, status) => {
    if (status === "All") return acc;
    acc[status] = data?.filter((lead) => lead.status === status).length || 0;
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main style={{ flex: 1, padding: "1rem" }}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Anvaya CRM Dashboard</h1>

        {/* Filtered Leads */}
        <div style={{ marginBottom: "2rem" }}>
          <h3>Filtered Leads:</h3>
          {filteredLeads && filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <div key={lead._id} style={{ marginBottom: "1rem", border: "1px solid #ddd", padding: "1rem" }}>
                <Link
                  to={`/leads/${lead._id}`}
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  <strong>{lead.name}</strong>
                </Link>
              </div>
            ))
          ) : (
            <p style={{ color: "#888" }}>No leads available</p>
          )}
        </div>

        {/* Lead Status */}
        <div style={{ marginBottom: "2rem", border: "1px solid #ddd", padding: "1rem" }}>
          <h3>Lead Status:</h3>
          {statuses
            .filter((status) => status !== "All")
            .map((status) => (
              <p key={status}>
                {status}: {leadCounts[status]} Leads
              </p>
            ))}
        </div>

        {/* Quick Filters */}
        <div style={{ marginBottom: "2rem" }}>
          <h3>Quick Filters</h3>
          {statuses.map((status) => (
            <button
              key={status}
              style={{
                marginRight: "1rem",
                backgroundColor: filter === status ? "#007bff" : "#f4f4f4",
                color: filter === status ? "#fff" : "#333",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1rem",
                fontWeight: filter === status ? "bold" : "normal",
                cursor: "pointer",
              }}
              onClick={() => handleFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Add New Lead Button */}
        <div>
          <Link
            to="/add-lead"
            style={{
              display: "inline-block",
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            Add New Lead
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;