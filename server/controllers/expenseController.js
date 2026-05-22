const { body } = require('express-validator');
const Expense = require('../models/Expense');

// @desc    Get all expenses for logged-in user
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { category, sortBy = 'date', order = 'desc', search } = req.query;

    const filter = { user: req.user._id };
    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortField = sortBy === 'amount' ? 'amount' : 'date';

    const expenses = await Expense.find(filter).sort({ [sortField]: sortOrder });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      note,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ message: 'Failed to create expense' });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Ensure expense belongs to the requesting user
    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    const { title, amount, category, date, note } = req.body;
    expense.title = title ?? expense.title;
    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.date = date ?? expense.date;
    expense.note = note ?? expense.note;

    const updated = await expense.save();
    res.json(updated);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

// @desc    Get expense analytics summary
// @route   GET /api/expenses/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;

    // Category breakdown
    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    const categoryBreakdown = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));

    // Highest category
    const highestCategory = categoryBreakdown.reduce(
      (max, c) => (c.value > max.value ? c : max),
      { name: 'None', value: 0 }
    );

    // Monthly breakdown (last 6 months)
    const now = new Date();
    const monthlyMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyMap[key] = 0;
    }
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (key in monthlyMap) monthlyMap[key] += e.amount;
    });
    const monthlyBreakdown = Object.entries(monthlyMap).map(([month, amount]) => ({
      month,
      amount: parseFloat(amount.toFixed(2)),
    }));

    // Current month spending
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlySpending = expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    res.json({
      total: parseFloat(total.toFixed(2)),
      count,
      highestCategory,
      monthlySpending: parseFloat(monthlySpending.toFixed(2)),
      categoryBreakdown,
      monthlyBreakdown,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// Validation rules
const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('category').notEmpty().withMessage('Category is required'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
];

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getAnalytics,
  expenseValidation,
};
