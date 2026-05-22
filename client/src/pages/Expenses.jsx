import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { CATEGORIES, CATEGORY_COLORS } from '../utils/constants';
import ExpenseModal from '../components/ExpenseModal';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy]   = useState('date');
  const [order, setOrder]     = useState('desc');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId, setDeleteId]     = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { sortBy, order };
      if (category !== 'All') params.category = category;
      if (search.trim())      params.search    = search.trim();
      const { data } = await api.get('/expenses', { params });
      setExpenses(data);
    } catch {
      setError('Failed to load expenses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sortBy, order, category, search]);

  useEffect(() => {
    const timer = setTimeout(fetchExpenses, 300);
    return () => clearTimeout(timer);
  }, [fetchExpenses]);

  const handleSave = async (form) => {
    try {
      if (editTarget) {
        await api.put(`/expenses/${editTarget._id}`, form);
        toast.success('Expense updated!');
      } else {
        await api.post('/expenses', form);
        toast.success('Expense added!');
      }
      setEditTarget(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save expense');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense deleted');
      setDeleteId(null);
      fetchExpenses();
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) setOrder(order === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setOrder('desc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return order === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const fmt = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p className="page-sub">{expenses.length} record{expenses.length !== 1 ? 's' : ''} · Total: <strong>{fmt(total)}</strong></p>
        </div>
        <button className="btn-primary" onClick={() => { setEditTarget(null); setModalOpen(true); }}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="page-center"><span className="spinner lg" /></div>
      ) : error ? (
        <div className="page-center"><p className="text-error">{error}</p></div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found.</p>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>+ Add your first expense</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th className="sortable" onClick={() => toggleSort('amount')}>
                  Amount <SortIcon field="amount" />
                </th>
                <th className="sortable" onClick={() => toggleSort('date')}>
                  Date <SortIcon field="date" />
                </th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td className="td-title">{exp.title}</td>
                  <td>
                    <span className="category-badge" style={{
                      background: (CATEGORY_COLORS[exp.category] || '#94a3b8') + '22',
                      color: CATEGORY_COLORS[exp.category] || '#94a3b8'
                    }}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="td-amount">{fmt(exp.amount)}</td>
                  <td className="td-date">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="td-note">{exp.note || '—'}</td>
                  <td className="td-actions">
                    <button
                      className="action-btn edit"
                      title="Edit"
                      onClick={() => { setEditTarget(exp); setModalOpen(true); }}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={() => setDeleteId(exp._id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expense Modal */}
      <ExpenseModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        expense={editTarget}
      />

      {/* Delete Confirm Dialog */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Expense?</h2>
            <p>This action cannot be undone.</p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
