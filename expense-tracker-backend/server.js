const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// 👉 DNS fix
const dns = require('dns');
dns.setServers(['1.1.1.1']);

const app = express();

// Middleware (JSON ඩේටා සහ Frontend එකෙන් එන requests බාරගන්න)
app.use(express.json());
app.use(cors());

// Database Connection (MongoDB)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.log('❌ MongoDB Connection Error: ', err));

    // Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Smart Expense Tracker API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});