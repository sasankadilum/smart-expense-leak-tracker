const Expense = require('../models/Expense');

// Add new expense
const addExpense = async (req, res) => {
    try {
        const { amount, category, date, note } = req.body;

        // Basic validation
        if (!amount || !category) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        // Create expense
        const expense = await Expense.create({
            user: req.user.id,
            amount,
            category,
            date: date || Date.now(),
            note
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding expense' });
    }
};

// Get all expenses for the logged-in user
const getExpenses = async (req, res) => {
    try {
        // Find expenses matching the user ID and sort by date (newest first)
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching expenses' });
    }
};


// Get Smart Insights and Expense Leaks
const getInsights = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });

        if (expenses.length === 0) {
            return res.status(200).json({ message: "No data to analyze yet." });
        }

        // 1. Calculate Category Totals for the Pie Chart
        const categoryTotals = {};
        expenses.forEach(expense => {
            if (categoryTotals[expense.category]) {
                categoryTotals[expense.category] += expense.amount;
            } else {
                categoryTotals[expense.category] = expense.amount;
            }
        });

        // Convert to array format for frontend charts
        const chartData = Object.keys(categoryTotals).map(key => ({
            name: key,
            value: categoryTotals[key]
        }));

        // 2. Identify "Expense Leaks" (Smart Algorithm)
        let alerts = [];
        let recommendations = [];

        // Rule 1: High spending on non-essentials (e.g., Food or Entertainment over Rs. 5000)
        if (categoryTotals['Food'] > 5000) {
            alerts.push("⚠️ Warning: Unusually high spending on Food!");
            recommendations.push("💡 Try cooking more meals at home to reduce food expenses.");
        }
        if (categoryTotals['Entertainment'] > 3000) {
            alerts.push("⚠️ Warning: Entertainment expenses are piling up.");
            recommendations.push("💡 Consider cancelling unused subscriptions.");
        }

        // Rule 2: Finding micro-spending (too many small transactions)
        const smallTransactions = expenses.filter(exp => exp.amount < 500);
        if (smallTransactions.length > 5) {
            alerts.push("⚠️ Warning: Multiple small expenses detected. These 'micro-leaks' add up!");
            recommendations.push("💡 Track your small daily purchases, like coffees or snacks.");
        }

        // Default recommendation if doing well
        if (recommendations.length === 0) {
            recommendations.push("🌟 Great job! Your spending looks balanced.");
        }

        res.status(200).json({ chartData, alerts, recommendations });

    } catch (error) {
        res.status(500).json({ message: 'Server error while generating insights' });
    }
};

// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if the expense belongs to the logged-in user
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await expense.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Expense removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting expense' });
    }
};

// Update exports to include deleteExpense
module.exports = { addExpense, getExpenses, getInsights, deleteExpense };