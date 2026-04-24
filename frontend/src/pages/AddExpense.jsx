import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AddExpense = () => {
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        date: '',
        note: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('userToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post('http://localhost:5000/api/expenses', formData, config);
            
            alert('Expense added successfully!');
            navigate('/'); // Go back to dashboard
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding expense');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#000', fontSize: '20px' }}>←</Link>
                <h2 style={{ margin: 0 }}>Add Expense</h2>
            </div>
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>Amount (Rs.)</label>
                <input 
                    type="number" 
                    name="amount" 
                    placeholder="Enter amount" 
                    onChange={handleChange} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <label>Category</label>
                <select 
                    name="category" 
                    onChange={handleChange} 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Bills">Bills</option>
                    <option value="Other">Other</option>
                </select>

                <label>Date (Optional - Defaults to today)</label>
                <input 
                    type="date" 
                    name="date" 
                    onChange={handleChange} 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <label>Notes (Optional)</label>
                <textarea 
                    name="note" 
                    placeholder="Add a note" 
                    onChange={handleChange} 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px' }}
                />

                <button type="submit" style={{ padding: '15px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}>
                    Save Expense
                </button>
            </form>
        </div>
    );
};

export default AddExpense;