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
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/expenses', formData, config);
            alert('Expense added successfully!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding expense');
        }
    };

    const inputClass =
        'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition';

    const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wide';

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center">
            <div className="w-full max-w-md mx-auto px-6 py-8 md:mt-10 md:bg-white md:rounded-2xl md:shadow-lg md:px-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        to="/"
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-lg font-light"
                    >
                        ←
                    </Link>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Add Expense</h2>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Amount (Rs.)</label>
                        <input
                            type="number"
                            name="amount"
                            placeholder="0"
                            onChange={handleChange}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Category</label>
                        <select
                            name="category"
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="Food">🍔 Food</option>
                            <option value="Transport">🚗 Transport</option>
                            <option value="Entertainment">🎬 Entertainment</option>
                            <option value="Bills">📄 Bills</option>
                            <option value="Other">📦 Other</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Date <span className="normal-case font-normal text-gray-400">(Optional — defaults to today)</span></label>
                        <input
                            type="date"
                            name="date"
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>Notes <span className="normal-case font-normal text-gray-400">(Optional)</span></label>
                        <textarea
                            name="note"
                            placeholder="Add a note..."
                            onChange={handleChange}
                            rows={3}
                            className={`${inputClass} resize-none`}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-black text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-gray-800 active:scale-95 transition-all duration-150 mt-1"
                    >
                        Save Expense
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
