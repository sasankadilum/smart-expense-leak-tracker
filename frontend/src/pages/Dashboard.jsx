import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const navigate = useNavigate();
    
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/login');
            return;
        }

        // Fetch expenses from backend
        const fetchExpenses = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:5000/api/expenses', config);
                
                setExpenses(response.data);

                // Calculate total spending
                const total = response.data.reduce((acc, expense) => acc + expense.amount, 0);
                setTotalSpent(total);

            } catch (error) {
                console.error('Error fetching expenses:', error);
                if(error.response?.status === 401) {
                    navigate('/login'); // Token expired or invalid
                }
            }
        };

        fetchExpenses();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Welcome, {userName}! 👋</h2>
                <button onClick={handleLogout} style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
            </div>

            {/* Total Spending Card */}
            <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '10px', textAlign: 'center', marginTop: '20px' }}>
                <p style={{ margin: 0, color: '#555' }}>Total Spent this Month</p>
                <h1 style={{ margin: '10px 0', fontSize: '32px', color: '#000' }}>Rs. {totalSpent}</h1>
            </div>

            {/* Recent Transactions */}
            <h3 style={{ marginTop: '30px' }}>Recent Transactions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {expenses.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>No expenses recorded yet.</p>
                ) : (
                    expenses.map((expense) => (
                        <div key={expense._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>{expense.category}</h4>
                                <small style={{ color: '#888' }}>{new Date(expense.date).toLocaleDateString()}</small>
                            </div>
                            <h4 style={{ margin: 0 }}>Rs. {expense.amount}</h4>
                        </div>
                    ))
                )}
            </div>

            {/* Add Expense Button */}
            <Link to="/add-expense">
                <button style={{ width: '100%', padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', marginTop: '20px', cursor: 'pointer' }}>
                    + Add New Expense
                </button>
            </Link>
            {/* View Insights Button */}
            <Link to="/insights">
                <button style={{ width: '100%', padding: '15px', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🧠 View Smart Insights
                </button>
            </Link>
        </div>
    );
};

export default Dashboard;