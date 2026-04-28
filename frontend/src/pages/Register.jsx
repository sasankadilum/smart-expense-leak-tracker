import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userName', response.data.name);
            alert('Registration Successful!');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center">
            <div className="w-full max-w-md mx-auto px-6 py-10 md:mt-12 md:bg-white md:rounded-2xl md:shadow-lg md:px-8">

                {/* Brand Mark */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-3">
                        <span className="text-white text-xl">💸</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create an Account</h1>
                    <p className="text-sm text-gray-500 mt-1">Start tracking your expenses today</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
                    />
                    <button
                        type="submit"
                        className="w-full py-3.5 bg-black text-white text-sm font-semibold rounded-xl cursor-pointer hover:bg-gray-800 active:scale-95 transition-all duration-150 mt-1"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-black font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
