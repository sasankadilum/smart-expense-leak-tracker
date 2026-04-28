const mongoose = require('mongoose');

// Schema for Expense data
const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    note: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);