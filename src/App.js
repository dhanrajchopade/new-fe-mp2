import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from  './pages/Dashboard';
import AddNewLead from './pages/AddNewLead';
import LeadManagement from './pages/LeadManagement';
import EditLeadForm from './components/EditLeadForm';
import LeadStatus from './pages/LeadStatus';
import Reports from './pages/Reports';
import SalesAgent from './pages/SalesAgent';
import SalesAgentManagement from './pages/SalesAgentManagement';
 

function App() {
  return (
    <Router>
      <div>
        <Routes> 
           <Route path="/" element={<Dashboard />} />
          <Route path="/leads/:id" element={<LeadManagement />} />
          <Route path="/leads/:id/edit" element={<EditLeadForm />} />
          <Route path="/add-lead" element={<AddNewLead />} />
          <Route path="/lead-status" element={<LeadStatus />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sales-agents" element={<SalesAgent />} />
          <Route path="/sales-agent-management" element={<SalesAgentManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;