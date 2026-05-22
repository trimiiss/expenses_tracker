const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getAnalytics,
  expenseValidation,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// All expense routes are protected
router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/', getExpenses);
router.post('/', expenseValidation, validate, createExpense);
router.put('/:id', expenseValidation, validate, updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
