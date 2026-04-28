import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    //Filter State 
    const [filter, setFilter] = useState('This Month'); 
    
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) { navigate('/login'); return; }

        const fetchExpenses = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('http://localhost:5000/api/expenses', config);
                setExpenses(response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
                if (error.response?.status === 401) navigate('/login');
            }
        };

        fetchExpenses();
    }, [navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                const token = localStorage.getItem('userToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/expenses/${id}`, config);
                setExpenses((prev) => prev.filter((exp) => exp._id !== id));
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting expense');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    // Category emoji map
    const categoryEmoji = {
        Food: '🍔', Transport: '🚗', Entertainment: '🎬', Bills: '📄', Other: '📦'
    };

    // --- Filter Logic ---
    const filteredExpenses = expenses.filter(expense => {
        if (filter === 'All Time') return true;
        
        const expenseDate = new Date(expense.date);
        const today = new Date();
        
        if (filter === 'Today') {
            return expenseDate.toDateString() === today.toDateString();
        }
        
        if (filter === 'This Month') {
            return expenseDate.getMonth() === today.getMonth() && 
                   expenseDate.getFullYear() === today.getFullYear();
        }
        return true;
    });

    
    const currentTotal = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center">
            <div className="w-full max-w-md mx-auto px-5 py-6 md:mt-8 md:bg-white md:rounded-2xl md:shadow-lg md:px-7 md:py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Good day,</p>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{userName} 👋</h2>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-50 text-red-500 text-xs font-semibold rounded-xl border border-red-100 hover:bg-red-100 transition cursor-pointer"
                    >
                        Logout
                    </button>
                </div>

                {/* Total Spending Card (Updates based on filter) */}
                <div className="bg-black text-white rounded-2xl px-6 py-7 text-center mb-8 shadow-md">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                        Total Spent {filter === 'Today' ? 'Today' : filter === 'This Month' ? 'this Month' : 'Overall'}
                    </p>
                    <p className="text-4xl font-bold tracking-tight">Rs. {currentTotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-2">{filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Transactions Header with Modern Tailwind Dropdown */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Recent Transactions</h3>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer hover:bg-gray-200 transition focus:ring-2 focus:ring-gray-300"
                    >
                        <option value="Today">Today</option>
                        <option value="This Month">This Month</option>
                        <option value="All Time">All Time</option>
                    </select>
                </div>

                {/* Filtered Transactions List */}
                <div className="flex flex-col gap-3">
                    {filteredExpenses.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-3xl mb-2">🧾</p>
                            <p className="text-sm">No expenses recorded for {filter.toLowerCase()}.</p>
                        </div>
                    ) : (
                        filteredExpenses.map((expense) => (
                            <div
                                key={expense._id}
                                className="flex items-center justify-between px-4 py-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Left side */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                                        {categoryEmoji[expense.category] || '📦'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{expense.category}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(expense.date).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Right side */}
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-bold text-gray-900">Rs. {expense.amount.toLocaleString()}</p>
                                    <button
                                        onClick={() => handleDelete(expense._id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400 transition cursor-pointer"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-8">
                    <Link to="/add-expense" className="block">
                        <button className="w-full py-4 bg-black text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-gray-800 active:scale-95 transition-all duration-150">
                            + Add New Expense
                        </button>
                    </Link>

                    <Link to="/insights" className="block">
                        <button className="w-full py-4 bg-blue-600 text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-blue-700 active:scale-95 transition-all duration-150">
                            🧠 View Smart Insights
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;