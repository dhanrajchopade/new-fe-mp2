import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Sidebar from '../components/Sidebar';
Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const chartContainerStyle = {
  margin: '2rem auto',
  padding: '2rem',
  background: '#fff',
  borderRadius: 8,
  maxWidth: 500,
  minWidth: 300,
  boxSizing: 'border-box',
};

const chartTitleStyle = {
  textAlign: 'center',
  marginBottom: '1rem',
};

const Reports = () => {
  const [lastWeekClosed, setLastWeekClosed] = useState([]);
  const [pipeline, setPipeline] = useState(0);
  const [closedByAgent, setClosedByAgent] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Leads closed last week
        const lastWeekRes = await fetch('https://lead-management-be-mp-2.vercel.app/report/last-week');
        const lastWeekData = await lastWeekRes.json();
        setLastWeekClosed(lastWeekData);

        // Pipeline
        const pipelineRes = await fetch('https://lead-management-be-mp-2.vercel.app/report/pipeline');
        const pipelineData = await pipelineRes.json();
        setPipeline(pipelineData.totalLeadsInPipeline || 0);

        // Closed by agent
        const closedByAgentRes = await fetch('https://lead-management-be-mp-2.vercel.app/report/closed-by-agent');
        const closedByAgentData = await closedByAgentRes.json();
        setClosedByAgent(closedByAgentData);

        // For status distribution, fetch all leads
        const allLeadsRes = await fetch('https://lead-management-be-mp-2.vercel.app/leads');
        const allLeadsData = await allLeadsRes.json();
        setAllLeads(allLeadsData);

      } catch (err) {
        // Handle error
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Pie chart: Leads closed vs pipeline
  const closedCount = closedByAgent.reduce((sum, agent) => sum + agent.count, 0);
  const pieData = {
    labels: ['Leads Closed', 'Leads in Pipeline'],
    datasets: [
      {
        data: [closedCount, pipeline],
        backgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Bar chart: Leads closed by sales agent
  const barData = {
    labels: closedByAgent.map(a => a._id || 'Unknown'),
    datasets: [
      {
        label: 'Leads Closed',
        data: closedByAgent.map(a => a.count),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Pie chart: Lead status distribution
  const statusCounts = allLeads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});
  const statusLabels = Object.keys(statusCounts);
  const statusData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusLabels.map(status => statusCounts[status]),
        backgroundColor: [
          '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
      },
    ],
  };

  if (loading) return <p>Loading reports...</p>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h2 style={{ textAlign: 'center', margin: '2rem 0 2rem 0' }}>Lead Reports & Analytics</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={chartContainerStyle}>
            <h4 style={chartTitleStyle}>Leads Closed vs Pipeline</h4>
            <Pie data={pieData} />
          </div>
          <div style={chartContainerStyle}>
            <h4 style={chartTitleStyle}>Leads Closed by Sales Agent</h4>
            <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
          </div>
          <div style={chartContainerStyle}>
            <h4 style={chartTitleStyle}>Lead Status Distribution</h4>
            <Pie data={statusData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;