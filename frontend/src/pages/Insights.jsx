import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Insights = () => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Colors for the Pie Chart
    const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const token = localStorage.getItem('userToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

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
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading Smart Insights...</p>;
    }

    return (
        <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#000', fontSize: '20px' }}>←</Link>
                <h2 style={{ margin: 0 }}>Smart Insights 🧠</h2>
            </div>

            {insights?.message ? (
                <p style={{ textAlign: 'center', color: '#888' }}>{insights.message}</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* 1. Expense Leaks / Alerts */}
                    {insights?.alerts?.length > 0 && (
                        <div style={{ background: '#FEE2E2', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #EF4444' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#B91C1C' }}>Expense Leaks Detected!</h3>
                            {insights.alerts.map((alert, index) => (
                                <p key={index} style={{ margin: '5px 0', color: '#991B1B', fontSize: '14px' }}>{alert}</p>
                            ))}
                        </div>
                    )}

                    {/* 2. Category Pie Chart */}
                    <div style={{ background: '#F9FAFB', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                        <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>Spending Breakdown</h3>
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={insights?.chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {insights?.chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `Rs. ${value}`} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3. Smart Recommendations */}
                    {insights?.recommendations?.length > 0 && (
                        <div style={{ background: '#ECFDF5', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #10B981' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: '#047857' }}>Smart Recommendations</h3>
                            {insights.recommendations.map((rec, index) => (
                                <p key={index} style={{ margin: '5px 0', color: '#065F46', fontSize: '14px' }}>{rec}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Insights;