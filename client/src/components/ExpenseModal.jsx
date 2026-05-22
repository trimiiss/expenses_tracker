import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/constants';
import { X } from 'lucide-react';

const EMPTY = { title: '', amount: '', category: '', date: '', note: '' };

const ExpenseModal = ({ open, onClose, onSave, expense }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        title:    expense.title,
        amount:   expense.amount,
        category: expense.category,
        date:     expense.date ? expense.date.split('T')[0] : '',
        note:     expense.note || '',
      });
    } else {
      setForm({ ...EMPTY, date: new Date().toISOString().split('T')[0] });
    }
    setErrors({});
  }, [expense, open]);

  const validate = () => {
    const e = {};
    if (!form.title.trim())           e.title    = 'Title is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
                                      e.amount   = 'Enter a valid amount greater than 0';
    if (!form.category)               e.category = 'Please select a category';
    if (!form.date)                   e.date     = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({ ...form, amount: parseFloat(form.amount) });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{expense ? 'Edit Expense' : 'Add Expense'}</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="m-title">Title</label>
              <input
                id="m-title"
                type="text"
                placeholder="e.g. Grocery run"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={errors.title ? 'input-error' : ''}
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="m-amount">Amount ($)</label>
              <input
                id="m-amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className={errors.amount ? 'input-error' : ''}
              />
              {errors.amount && <span className="field-error">{errors.amount}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="m-category">Category</label>
              <select
                id="m-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={errors.category ? 'input-error' : ''}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="m-date">Date</label>
              <input
                id="m-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={errors.date ? 'input-error' : ''}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="m-note">Note (optional)</label>
            <textarea
              id="m-note"
              rows={3}
              placeholder="Add a description..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : expense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
