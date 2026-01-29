import React, { useState } from 'react';
import { X, Check, AlertTriangle, Plus, Trash2, Bell, Clock } from 'lucide-react';

const SmartSpendView = ({ onClose }) => {
    const [view, setView] = useState('budget'); // 'budget' or 'scan'
    const [scanResult, setScanResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [budgets, setBudgets] = useState([
        { id: 1, category: 'Shopping', limit: 500, spent: 120, period: 'Monthly', active: true, transactions: [], startTime: null, endTime: null },
        { id: 2, category: 'Dining', limit: 300, spent: 180, period: 'Monthly', active: true, transactions: [], startTime: null, endTime: null },
        { id: 3, category: 'Entertainment', limit: 200, spent: 95, period: 'Monthly', active: false, transactions: [], startTime: null, endTime: null }
    ]);
    
    const [showForm, setShowForm] = useState(false);
    const [newBudget, setNewBudget] = useState({ category: '', limit: '', duration: '' });
    const [notification, setNotification] = useState(null);

    const categories = ['Shopping', 'Dining', 'Entertainment', 'Transportation', 'Groceries', 'Utilities', 'Healthcare', 'Education'];
    const periods = [
        { label: 'Hourly', value: 'Hourly', duration: 1 },
        { label: '3 Hour Shopping', value: '3Hour', duration: 3 },
        { label: 'Daily', value: 'Daily', duration: 24 },
        { label: 'Weekly', value: 'Weekly', duration: 168 },
        { label: 'Monthly', value: 'Monthly', duration: 720 },
        { label: 'Yearly', value: 'Yearly', duration: 8760 },
        { label: 'Custom', value: 'Custom', duration: null }
    ];

    const handleAddBudget = () => {
        if (newBudget.category && newBudget.limit && newBudget.duration) {
            const now = new Date();
            const durationStr = newBudget.duration.toLowerCase().trim();
            let totalMinutes = 0;

            // Parse duration like "2h 30m" or "30m" or "2h"
            const hourMatch = durationStr.match(/(\d+)\s*h/);
            const minuteMatch = durationStr.match(/(\d+)\s*m/);

            if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
            if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);

            if (totalMinutes === 0) {
                alert('Please enter valid duration (e.g., "2h 30m" or "45m")');
                return;
            }

            const durationMs = totalMinutes * 60 * 1000;
            const endTime = new Date(now.getTime() + durationMs);

            const budget = {
                id: Math.max(...budgets.map(b => b.id), 0) + 1,
                category: newBudget.category,
                limit: parseInt(newBudget.limit),
                spent: 0,
                period: newBudget.duration,
                active: false,
                transactions: [],
                startTime: null,
                endTime: null
            };

            setBudgets([...budgets, budget]);
            setNewBudget({ category: '', limit: '', duration: '' });
            setShowForm(false);
        }
    };

    const handleToggleBudget = (id) => {
        const now = new Date();
        setBudgets(budgets.map(b => {
            if (b.id === id) {
                const isActivating = !b.active;
                const durationStr = b.period.toLowerCase().trim();
                let totalMinutes = 0;

                const hourMatch = durationStr.match(/(\d+)\s*h/);
                const minuteMatch = durationStr.match(/(\d+)\s*m/);

                if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
                if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);

                const durationMs = totalMinutes * 60 * 1000;
                const endTime = new Date(now.getTime() + durationMs);
                
                return {
                    ...b,
                    active: isActivating,
                    startTime: isActivating ? now : null,
                    endTime: isActivating ? endTime : null,
                    spent: isActivating ? 0 : b.spent,
                    transactions: isActivating ? [] : b.transactions
                };
            }
            return b;
        }));
    };

    const handleDeleteBudget = (id) => {
        setBudgets(budgets.filter(b => b.id !== id));
    };

    const handleAddTransaction = (budgetId, amount) => {
        const updatedBudgets = budgets.map(b => {
            if (b.id === budgetId && b.active) {
                const newSpent = b.spent + amount;
                const isOverBudget = newSpent > b.limit;
                
                if (isOverBudget) {
                    setNotification({
                        type: 'alert',
                        title: 'Budget Limit Exceeded!',
                        message: `You've exceeded your ${b.category} budget by $${(newSpent - b.limit).toFixed(2)}`,
                        category: b.category
                    });
                } else if (newSpent > b.limit * 0.8) {
                    setNotification({
                        type: 'warning',
                        title: 'Budget Warning',
                        message: `You're at ${Math.round((newSpent / b.limit) * 100)}% of your ${b.category} budget`,
                        category: b.category
                    });
                }

                return {
                    ...b,
                    spent: newSpent,
                    transactions: [...b.transactions, { amount, date: new Date().toLocaleDateString() }]
                };
            }
            return b;
        });
        setBudgets(updatedBudgets);
    };

    const performMockScan = () => {
        setAnalyzing(true);
        setTimeout(() => {
            fetch('http://localhost:8000/api/smartspend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 650, category: 'Shopping' })
            })
                .then(res => res.json())
                .then(data => {
                    setScanResult({
                        item: "Sony Headphones",
                        price: 650,
                        category: "Shopping",
                        ...data
                    });
                    setAnalyzing(false);
                })
                .catch(err => {
                    console.error(err);
                    setAnalyzing(false);
                });
        }, 2000);
    };

    const getPercentage = (spent, limit) => {
        return Math.round((spent / limit) * 100);
    };

    const getTimeRemaining = (endTime) => {
        if (!endTime) return null;
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) return 'Expired';
        
        const hours = Math.floor(diff / (60 * 60 * 1000));
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        
        if (hours > 0) {
            return `${hours}h ${minutes}m left`;
        } else {
            return `${minutes}m left`;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(15,23,42,0.92) 50%, rgba(212,175,55,0.15) 100%)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 4vw, 2rem)',
            animation: 'fadeIn 0.3s ease-out',
            overflow: 'auto'
        }}>
            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 'clamp(1rem, 3vw, 2rem)',
                    right: 'clamp(1rem, 3vw, 2rem)',
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 'clamp(40px, 8vw, 48px)',
                    height: 'clamp(40px, 8vw, 48px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                aria-label="Close"
            >
                <X size={24} />
            </button>

            {!scanResult ? (
                <div style={{ 
                    textAlign: 'center', 
                    color: 'white',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    <h2 style={{ 
                        fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
                        marginBottom: '1rem', 
                        fontFamily: 'var(--font-family)', 
                        fontWeight: 300,
                        lineHeight: 1.2
                    }}>
                        Smart<span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>Spend</span>
                    </h2>
                    <p style={{ 
                        marginBottom: 'clamp(2rem, 6vw, 4rem)', 
                        opacity: 0.8, 
                        letterSpacing: '0.05em',
                        fontSize: 'clamp(0.85rem, 2vw, 1rem)'
                    }}>
                        Scan product to analyze budget fit.
                    </p>

                    <div className="prompt-row" style={{ 
                        justifyContent: 'center', 
                        marginBottom: '1.5rem' 
                    }}>
                        <span className="context-chip" style={{ 
                            background: 'rgba(255,255,255,0.1)', 
                            color: 'white', 
                            borderColor: 'rgba(255,255,255,0.2)' 
                        }}>
                            Budget Guard
                        </span>
                        <span className="context-chip" style={{ 
                            background: 'rgba(255,255,255,0.1)', 
                            color: 'white', 
                            borderColor: 'rgba(255,255,255,0.2)' 
                        }}>
                            Real-time Alerts
                        </span>
                    </div>

                    <button
                        onClick={performMockScan}
                        disabled={analyzing}
                        style={{
                            width: 'clamp(180px, 40vw, 220px)', 
                            height: 'clamp(180px, 40vw, 220px)', 
                            borderRadius: '50%',
                            background: analyzing ? 'transparent' : 'black',
                            border: '2px solid var(--accent-gold)',
                            color: 'var(--accent-gold)',
                            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', 
                            fontWeight: 600, 
                            letterSpacing: '0.1em',
                            boxShadow: analyzing ? '0 0 50px rgba(212, 175, 55, 0.4)' : '0 10px 40px rgba(0,0,0,0.5)',
                            transition: 'all 0.4s ease',
                            animation: analyzing ? 'pulse 1.5s infinite' : 'none',
                            textTransform: 'uppercase',
                            cursor: analyzing ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {analyzing ? 'Scanning...' : 'TAP TO SCAN'}
                    </button>
                </div>
            ) : (
                <div
                    className="card-float"
                    style={{
                        animation: 'slideUp 0.4s ease-out',
                        maxWidth: '500px',
                        width: '100%',
                        margin: 'auto'
                    }}
                >
                    {/* Scan Result Header */}
                    <div style={{
                        textAlign: 'center',
                        paddingBottom: '1.5rem',
                        borderBottom: '1px solid #f3f4f6'
                    }}>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                            marginBottom: '0.5rem'
                        }}>
                            Scanned Item
                        </p>
                        <h3 style={{
                            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                            margin: '0.5rem 0',
                            fontWeight: 700
                        }}>
                            {scanResult.item}
                        </h3>
                        <p style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            fontWeight: 700,
                            color: '#1f2937'
                        }}>
                            ${scanResult.price}
                        </p>
                    </div>

                    {/* Result Content */}
                    <div style={{
                        padding: 'clamp(1.5rem, 4vw, 2rem) clamp(0.75rem, 2vw, 1rem)',
                        textAlign: 'center'
                    }}>
                        {scanResult.allowed ? (
                            <div style={{
                                color: 'var(--text-main)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    border: '2px solid #000',
                                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                                    borderRadius: '50%',
                                    color: '#000'
                                }}>
                                    <Check size={32} />
                                </div>
                                <h3 style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    fontWeight: 700
                                }}>
                                    Safe to Buy
                                </h3>
                                <p style={{
                                    color: '#666',
                                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                                }}>
                                    This fits within your {scanResult.category} budget.
                                </p>
                                <div style={{
                                    background: '#f3f4f6',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.9rem',
                                    color: '#333'
                                }}>
                                    Remaining: ${(scanResult.budgetLimit - scanResult.currentSpent - scanResult.price).toFixed(2)}
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                color: 'var(--text-main)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    border: '2px solid #000',
                                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                                    borderRadius: '50%',
                                    color: '#000'
                                }}>
                                    <AlertTriangle size={32} />
                                </div>
                                <h3 style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    fontWeight: 700
                                }}>
                                    Over Budget
                                </h3>
                                <p style={{
                                    color: '#666',
                                    fontWeight: 500,
                                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                                }}>
                                    {scanResult.alert}
                                </p>
                                <div style={{
                                    background: '#fafafa',
                                    border: '1px solid #eee',
                                    padding: 'clamp(0.85rem, 2vw, 1rem)',
                                    borderRadius: '1rem',
                                    marginTop: '0.5rem',
                                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                                    color: '#333',
                                    textAlign: 'left'
                                }}>
                                    <strong style={{ color: 'var(--accent-gold)' }}>Suggestion:</strong> {scanResult.suggestion}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{
                            marginTop: '1.5rem',
                            display: 'flex',
                            gap: '0.75rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button 
                                className="btn-secondary" 
                                onClick={performMockScan} 
                                style={{ 
                                    background: 'white', 
                                    color: '#0f172a',
                                    flex: '1 1 120px'
                                }}
                            >
                                Back
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={onClose}
                                style={{
                                    background: '#0f172a',
                                    color: 'var(--accent-gold)',
                                    borderColor: 'var(--accent-gold)',
                                    flex: '1 1 120px'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse { 
                    0% { transform: scale(1); opacity: 1; } 
                    50% { transform: scale(1.05); opacity: 0.85; } 
                    100% { transform: scale(1); opacity: 1; } 
                }
                @keyframes slideUp { 
                    from { transform: translateY(50px); opacity: 0; } 
                    to { transform: translateY(0); opacity: 1; } 
                }
                @keyframes slideDown { 
                    from { transform: translateY(-20px); opacity: 0; } 
                    to { transform: translateY(0); opacity: 1; } 
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SmartSpendView;
