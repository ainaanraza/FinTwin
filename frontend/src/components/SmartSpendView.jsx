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
            const mockItem = {
                item: "Sony Headphones",
                price: 150,
                category: "Shopping"
            };
            
            const budget = budgets.find(b => b.category === mockItem.category && b.active);
            
            if (budget) {
                const wouldExceed = (budget.spent + mockItem.price) > budget.limit;
                setScanResult({
                    ...mockItem,
                    allowed: !wouldExceed,
                    currentSpent: budget.spent,
                    budgetLimit: budget.limit,
                    alert: wouldExceed ? `Exceeds your remaining budget by $${(budget.spent + mockItem.price - budget.limit).toFixed(2)}` : null,
                    suggestion: wouldExceed ? 'Consider reducing your purchase or adjusting your budget.' : 'This purchase fits your budget!'
                });
                
                if (wouldExceed) {
                    setNotification({
                        type: 'alert',
                        title: 'Budget Alert!',
                        message: `This purchase would exceed your ${mockItem.category} budget`,
                        category: mockItem.category
                    });
                }
            } else {
                setScanResult({
                    ...mockItem,
                    allowed: false,
                    alert: `No active budget for ${mockItem.category}`,
                    suggestion: 'Enable a budget for this category to track spending.'
                });
            }
            
            setAnalyzing(false);
            setView('scan');
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

            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'absolute',
                    top: 'clamp(1rem, 3vw, 2rem)',
                    left: 'clamp(1rem, 3vw, 2rem)',
                    right: 'clamp(1rem, 3vw, 2rem)',
                    maxWidth: '500px',
                    background: notification.type === 'alert' ? '#FEE2E2' : '#FEF3C7',
                    border: `2px solid ${notification.type === 'alert' ? '#EF4444' : '#F59E0B'}`,
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    animation: 'slideDown 0.3s ease-out',
                    zIndex: 101
                }}>
                    <Bell size={20} style={{ color: notification.type === 'alert' ? '#EF4444' : '#F59E0B', marginTop: '0.25rem', flexShrink: 0 }} />
                    <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: notification.type === 'alert' ? '#DC2626' : '#D97706', fontWeight: 700 }}>
                            {notification.title}
                        </h4>
                        <p style={{ margin: 0, color: notification.type === 'alert' ? '#991B1B' : '#92400E', fontSize: '0.9rem' }}>
                            {notification.message}
                        </p>
                    </div>
                </div>
            )}

            {view === 'budget' ? (
                <div style={{ 
                    maxWidth: '600px',
                    width: '100%',
                    color: 'white'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ 
                            fontSize: 'clamp(1.5rem, 5vw, 2rem)', 
                            marginBottom: '0.5rem', 
                            fontWeight: 700
                        }}>
                            Smart<span style={{ color: 'var(--accent-gold)' }}>Spend</span> Budgets
                        </h2>
                        <p style={{ 
                            opacity: 0.8, 
                            letterSpacing: '0.05em',
                            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
                            margin: 0
                        }}>
                            Activate budgets and track your spending in real-time
                        </p>
                    </div>

                    {/* Budget Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
                        {budgets.map(budget => {
                            const percentage = getPercentage(budget.spent, budget.limit);
                            const isOverBudget = budget.spent > budget.limit;
                            
                            return (
                                <div 
                                    key={budget.id}
                                    style={{
                                        background: budget.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                                        border: `2px solid ${budget.active ? '#10B981' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: '0.75rem',
                                        padding: '1rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: '0 0 0.25rem 0', color: 'white', fontWeight: 700 }}>
                                                {budget.category}
                                            </h3>
                                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>
                                                {budget.period}
                                            </p>
                                            {budget.active && budget.endTime && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem', fontSize: '0.8rem', color: '#86EFAC' }}>
                                                    <Clock size={14} />
                                                    {getTimeRemaining(budget.endTime)}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleToggleBudget(budget.id)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: budget.active ? '#10B981' : 'rgba(255,255,255,0.1)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.85rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {budget.active ? 'Active' : 'Inactive'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBudget(budget.id)}
                                                style={{
                                                    padding: '0.5rem 0.75rem',
                                                    background: 'rgba(239, 68, 68, 0.2)',
                                                    color: '#FCA5A5',
                                                    border: 'none',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Amount and Progress */}
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            <span>${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}</span>
                                            <span style={{ color: isOverBudget ? '#FCA5A5' : '#86EFAC' }}>
                                                {percentage}%
                                            </span>
                                        </div>
                                        <div style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            height: '6px',
                                            borderRadius: '3px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${Math.min(percentage, 100)}%`,
                                                height: '100%',
                                                background: isOverBudget ? '#FCA5A5' : '#10B981',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div>

                                    {isOverBudget && (
                                        <div style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(252, 165, 165, 0.5)',
                                            borderRadius: '0.5rem',
                                            padding: '0.5rem 0.75rem',
                                            fontSize: '0.85rem',
                                            color: '#FCA5A5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <AlertTriangle size={16} />
                                            Over budget by ${(budget.spent - budget.limit).toFixed(2)}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Add Budget Form */}
                    {showForm && (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '0.75rem',
                            padding: '1rem',
                            marginBottom: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <select
                                value={newBudget.category}
                                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    fontFamily: 'var(--font-primary)',
                                    fontSize: '0.95rem'
                                }}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Budget Limit ($)"
                                value={newBudget.limit}
                                onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    fontFamily: 'var(--font-primary)',
                                    fontSize: '0.95rem'
                                }}
                                min="0"
                            />

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., 2h 30m or 45m)"
                                    value={newBudget.duration}
                                    onChange={(e) => setNewBudget({ ...newBudget, duration: e.target.value })}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: 'white',
                                        fontFamily: 'var(--font-primary)',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    onClick={handleAddBudget}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'var(--accent-gold)',
                                        color: '#0f172a',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Plus size={18} />
                            New Budget
                        </button>

                        <button
                            onClick={performMockScan}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'var(--accent-gold)',
                                color: '#0f172a',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: analyzing ? 'not-allowed' : 'pointer',
                                fontWeight: 700,
                                opacity: analyzing ? 0.6 : 1,
                                transition: 'all 0.2s'
                            }}
                            disabled={analyzing}
                        >
                            {analyzing ? 'Scanning...' : 'Scan Item'}
                        </button>
                    </div>
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
                                onClick={() => setView('budget')} 
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
