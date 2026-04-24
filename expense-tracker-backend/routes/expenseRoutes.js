const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, getInsights } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');


router.get('/insights', protect, getInsights);
// Add protect middleware to secure these routes
router.route('/')
    .post(protect, addExpense)
    .get(protect, getExpenses);

module.exports = router;