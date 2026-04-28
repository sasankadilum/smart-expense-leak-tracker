import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

const Insights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) { navigate('/login'); return; }
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('http://localhost:5000/api/expenses/insights', config);
                setInsights(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching insights:', error);
                setLoading(false);
            }
        };
        fetchInsights();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                    <p className="text-sm">Loading Smart Insights...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center">
            <div className="w-full max-w-md mx-auto px-5 py-6 md:mt-8 md:bg-white md:rounded-2xl md:shadow-lg md:px-7 md:py-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-7">
                    <Link
                        to="/"
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition text-lg"
                    >
                        ←
                    </Link>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Smart Insights 🧠</h2>
                </div>

                {/* Empty State */}
                {insights?.message ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">📊</p>
                        <p className="text-sm">{insights.message}</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">

                        {/* 1. Expense Leaks / Alerts */}
                        {insights?.alerts?.length > 0 && (
                            <div className="bg-red-50 border-l-4 border-red-500 rounded-xl px-5 py-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">🚨</span>
                                    <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide">
                                        Expense Leaks Detected
                                    </h3>
                                </div>
                                <ul className="flex flex-col gap-2">
                                    {insights.alerts.map((alert, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-sm text-red-700"
                                        >
                                            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                            {alert}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 2. Category Pie Chart */}
                        {insights?.chartData?.length > 0 && (
                            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-5">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide text-center mb-4">
                                    Spending Breakdown
                                </h3>
                                <div className="w-full h-60">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={insights.chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={80}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {insights.chartData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `Rs. ${value}`} />
                                            <Legend
                                                iconType="circle"
                                                iconSize={8}
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* 3. Smart Recommendations */}
                        {insights?.recommendations?.length > 0 && (
                            <div className="bg-green-50 border-l-4 border-green-500 rounded-xl px-5 py-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg">✅</span>
                                    <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide">
                                        Smart Recommendations
                                    </h3>
                                </div>
                                <ul className="flex flex-col gap-2">
                                    {insights.recommendations.map((rec, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-sm text-green-800"
                                        >
                                            <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default Insights;
