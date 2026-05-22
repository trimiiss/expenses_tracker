import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_COLORS } from '../utils/constants';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '22', color }}>
      <Icon size={22} />
    </div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [analyticsRes, expensesRes] = await Promise.all([
          api.get('/expenses/analytics'),
          api.get('/expenses?sortBy=date&order=desc'),
        ]);
        setAnalytics(analyticsRes.data);
        setRecentExpenses(expensesRes.data.slice(0, 5));
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="page-center"><span className="spinner lg" /></div>;
  if (error) return <div className="page-center"><p className="text-error">{error}</p></div>;

  const fmt = (n) => `$${n?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-sub">Welcome back, <strong>{user?.name}</strong> 👋</p>
        </div>
        <Link to="/expenses" className="btn-primary">
          + Add Expense
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <StatCard icon={DollarSign}  label="Total Expenses"       value={fmt(analytics?.total)}           color="#6366f1" sub={`${analytics?.count} transactions`} />
        <StatCard icon={Calendar}    label="This Month"           value={fmt(analytics?.monthlySpending)} color="#10b981" sub="Current month spending" />
        <StatCard icon={TrendingUp}  label="Highest Category"     value={analytics?.highestCategory?.name || '—'} color="#f97316" sub={fmt(analytics?.highestCategory?.value)} />
        <StatCard icon={ShoppingBag} label="Total Transactions"   value={analytics?.count ?? 0}           color="#a855f7" sub="All time" />
      </div>

      <div className="dashboard-grid">
        {/* Pie Chart */}
        <div className="card">
          <h2 className="card-title">Spending by Category</h2>
          {analytics?.categoryBreakdown?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%" cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {analytics.categoryBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-chart">No data yet. Add some expenses!</p>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <div className="card-header-row">
            <h2 className="card-title">Recent Expenses</h2>
            <Link to="/expenses" className="link-arrow">View all <ArrowRight size={14} /></Link>
          </div>
          {recentExpenses.length === 0 ? (
            <p className="empty-chart">No expenses recorded yet.</p>
          ) : (
            <ul className="recent-list">
              {recentExpenses.map((exp) => (
                <li key={exp._id} className="recent-item">
                  <div className="recent-dot" style={{ background: CATEGORY_COLORS[exp.category] || '#94a3b8' }} />
                  <div className="recent-info">
                    <span className="recent-title">{exp.title}</span>
                    <span className="recent-cat">{exp.category}</span>
                  </div>
                  <div className="recent-right">
                    <span className="recent-amount">{fmt(exp.amount)}</span>
                    <span className="recent-date">{new Date(exp.date).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
