import { useEffect, useState } from 'react';
import { CATEGORY_COLORS } from '../utils/constants';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import api from '../api/axios';
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/expenses/analytics')
      .then((r) => setData(r.data))
      .catch(() => setError('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center"><span className="spinner lg" /></div>;
  if (error)   return <div className="page-center"><p className="text-error">{error}</p></div>;

  const fmt = (n) => `$${(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const topCategories = [...(data?.categoryBreakdown || [])]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p className="page-sub">Visual breakdown of your spending habits</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#6366f122', color: '#6366f1' }}><DollarSign size={22} /></div>
          <div className="stat-info">
            <p className="stat-label">Total Spent</p>
            <h3 className="stat-value">{fmt(data?.total)}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98122', color: '#10b981' }}><BarChart2 size={22} /></div>
          <div className="stat-info">
            <p className="stat-label">Transactions</p>
            <h3 className="stat-value">{data?.count ?? 0}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f9731622', color: '#f97316' }}><TrendingUp size={22} /></div>
          <div className="stat-info">
            <p className="stat-label">Top Category</p>
            <h3 className="stat-value" style={{ fontSize: '1rem' }}>{data?.highestCategory?.name || '—'}</h3>
            <p className="stat-sub">{fmt(data?.highestCategory?.value)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#a855f722', color: '#a855f7' }}><TrendingDown size={22} /></div>
          <div className="stat-info">
            <p className="stat-label">This Month</p>
            <h3 className="stat-value">{fmt(data?.monthlySpending)}</h3>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Pie Chart */}
        <div className="card">
          <h2 className="card-title">Category Breakdown</h2>
          {data?.categoryBreakdown?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.categoryBreakdown} cx="50%" cy="50%" outerRadius={110} paddingAngle={3} dataKey="value">
                  {data.categoryBreakdown.map((e) => (
                    <Cell key={e.name} fill={CATEGORY_COLORS[e.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="empty-chart">No expense data available.</p>}
        </div>

        {/* Monthly Bar Chart */}
        <div className="card">
          <h2 className="card-title">Monthly Spending (Last 6 Months)</h2>
          {data?.monthlyBreakdown?.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyBreakdown} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="empty-chart">No monthly data available.</p>}
        </div>

        {/* Line Chart */}
        <div className="card span-2">
          <h2 className="card-title">Spending Trend</h2>
          {data?.monthlyBreakdown?.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.monthlyBreakdown} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="empty-chart">No trend data available.</p>}
        </div>

        {/* Top Categories Table */}
        <div className="card span-2">
          <h2 className="card-title">Top 5 Categories</h2>
          <div className="top-cat-list">
            {topCategories.map((c, i) => {
              const pct = data.total > 0 ? ((c.value / data.total) * 100).toFixed(1) : 0;
              return (
                <div key={c.name} className="top-cat-item">
                  <span className="top-cat-rank">#{i + 1}</span>
                  <div className="top-cat-dot" style={{ background: CATEGORY_COLORS[c.name] || '#94a3b8' }} />
                  <span className="top-cat-name">{c.name}</span>
                  <div className="top-cat-bar-wrap">
                    <div className="top-cat-bar" style={{ width: `${pct}%`, background: CATEGORY_COLORS[c.name] || '#94a3b8' }} />
                  </div>
                  <span className="top-cat-pct">{pct}%</span>
                  <span className="top-cat-val">{fmt(c.value)}</span>
                </div>
              );
            })}
            {topCategories.length === 0 && <p className="empty-chart">No data yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
