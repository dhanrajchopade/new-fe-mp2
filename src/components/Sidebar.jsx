import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/add-lead", label: "Add New Lead" },
    { to: "/lead-status", label: "Lead Status" },
    { to: "/reports", label: "Reports" },
    { to: "/sales-agents", label: "Sales Agents" },
    { to: "/sales-agent-management", label: "Sales Agent Management" },
  ];

  return (
    <aside style={{ width: "20%", backgroundColor: "#f4f4f4", padding: "1rem", minHeight: "100vh" }}>
      <h3 style={{ marginBottom: "2rem", color: "#007bff" }}>Sidebar</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {links.map(link => (
          <li key={link.to} style={{ marginBottom: "1.2rem" }}>
            <Link
              to={link.to}
              style={{
                display: "block",
                padding: "0.6rem 1rem",
                borderRadius: "6px",
                textDecoration: "none",
                color: location.pathname === link.to ? "#fff" : "#333",
                background: location.pathname === link.to ? "#007bff" : "transparent",
                fontWeight: location.pathname === link.to ? "bold" : "normal",
                transition: "background 0.2s, color 0.2s"
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;