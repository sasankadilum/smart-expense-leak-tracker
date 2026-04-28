const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, getInsights, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:id').delete(protect, deleteExpense);
router.get('/insights', protect, getInsights);

router.route('/')
    .post(protect, addExpense)
    .get(protect, getExpenses);

module.exports = router;