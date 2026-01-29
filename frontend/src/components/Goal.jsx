import React, { useState } from 'react';
import { Plus, Trash2, Target, Edit2 } from 'lucide-react';

const Goal = ({ userGoals = [], onGoalUpdate }) => {
    const [goals, setGoals] = useState(userGoals || [
        { id: 1, label: 'Emergency Fund', value: 5000, target: 6400, color: '#10B981' },
        { id: 2, label: 'Europe Trip', value: 2700, target: 5000, color: '#3B82F6' },
        { id: 3, label: 'Car Downpayment', value: 3200, target: 10000, color: '#F59E0B' }
    ]);
    
    const [showForm, setShowForm] = useState(false);
    const [newGoal, setNewGoal] = useState({ label: '', target: '', color: '#8B5CF6' });
    const [editingId, setEditingId] = useState(null);

    const handleAddGoal = () => {
        if (newGoal.label && newGoal.target) {
            const goal = {
                id: editingId || Math.max(...goals.map(g => g.id), 0) + 1,
                label: newGoal.label,
                value: editingId ? goals.find(g => g.id === editingId).value : 0,
                target: parseInt(newGoal.target),
                color: newGoal.color
            };

            if (editingId) {
                setGoals(goals.map(g => g.id === editingId ? goal : g));
            } else {
                setGoals([...goals, goal]);
            }

            setNewGoal({ label: '', target: '', color: '#8B5CF6' });
            setShowForm(false);
            setEditingId(null);
            onGoalUpdate?.(editingId ? goals.map(g => g.id === editingId ? goal : g) : [...goals, goal]);
        }
    };

    const handleDeleteGoal = (id) => {
        const updated = goals.filter(g => g.id !== id);
        setGoals(updated);
        onGoalUpdate?.(updated);
    };

    const handleEditGoal = (goal) => {
        setEditingId(goal.id);
        setNewGoal({ label: goal.label, target: goal.target.toString(), color: goal.color });
        setShowForm(true);
    };

    const handleUpdateValue = (id, newValue) => {
        const updated = goals.map(g => 
            g.id === id ? { ...g, value: Math.min(parseInt(newValue) || 0, g.target) } : g
        );
        setGoals(updated);
        onGoalUpdate?.(updated);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const getPercentage = (value, target) => {
        return Math.round((value / target) * 100);
    };

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '1.5rem' }}>
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '1.5rem 0.5rem 0',
            }}>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <span className="pill-soft" style={{
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontSize: 'clamp(0.65rem, 2vw, 0.85rem)'
                        }}>
                            Financial Goals
                        </span>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                            fontWeight: 800,
                            background: 'var(--accent-gradient)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-0.05em',
                            margin: 0,
                            lineHeight: 1.1,
                            filter: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.3))'
                        }}>
                            Track Your Dreams
                        </h1>
                        <p style={{
                            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                            color: 'var(--text-secondary)',
                            maxWidth: '500px',
                            margin: '0.5rem 0 0 0'
                        }}>
                            Set financial goals and watch your progress grow
                        </p>
                    </div>
                </div>
            </div>

            {/* Goals Section */}
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div className="section-heading">
                        <h3>My Goals</h3>
                        <span className="pill">{goals.length} Active</span>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={() => {
                            setEditingId(null);
                            setNewGoal({ label: '', target: '', color: '#8B5CF6' });
                            setShowForm(!showForm);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                    >
                        <Plus size={18} />
                        {showForm ? 'Cancel' : 'New Goal'}
                    </button>
                </div>

                {/* Add/Edit Goal Form */}
                {showForm && (
                    <div className="card-float" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-black)' }}>
                            {editingId ? 'Edit Goal' : 'Create New Goal'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--accent-black)' }}>
                                    Goal Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Emergency Fund, Vacation"
                                    value={newGoal.label}
                                    onChange={(e) => setNewGoal({ ...newGoal, label: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-primary)',
                                        backgroundColor: 'var(--bg-secondary)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--accent-black)' }}>
                                    Target Amount ($)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={newGoal.target}
                                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                                    min="0"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '1rem',
                                        fontFamily: 'var(--font-primary)',
                                        backgroundColor: 'var(--bg-secondary)'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--accent-black)' }}>
                                    Color
                                </label>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewGoal({ ...newGoal, color })}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: color,
                                                border: newGoal.color === color ? '3px solid var(--accent-black)' : '2px solid rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                className="btn-primary"
                                onClick={handleAddGoal}
                                style={{ width: '100%' }}
                            >
                                {editingId ? 'Update Goal' : 'Create Goal'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Goals Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {goals.map(goal => {
                        const percentage = getPercentage(goal.value, goal.target);
                        return (
                            <div key={goal.id} className="card-float" style={{
                                borderLeft: `4px solid ${goal.color}`,
                                padding: 'clamp(1rem, 3vw, 1.75rem)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem',
                                    gap: '1rem'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <Target size={20} style={{ color: goal.color }} />
                                            <h3 style={{
                                                margin: 0,
                                                color: 'var(--accent-black)',
                                                fontSize: '1.1rem',
                                                fontWeight: 700
                                            }}>
                                                {goal.label}
                                            </h3>
                                        </div>
                                        <p style={{
                                            margin: '0.25rem 0 0 0',
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {formatCurrency(goal.value)} of {formatCurrency(goal.target)}
                                        </p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem'
                                    }}>
                                        <button
                                            onClick={() => handleEditGoal(goal)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--text-secondary)',
                                                padding: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 'var(--radius-md)',
                                                transition: 'all 0.2s',
                                                fontSize: '1rem'
                                            }}
                                            title="Edit goal"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#EF4444',
                                                padding: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 'var(--radius-md)',
                                                transition: 'all 0.2s',
                                                fontSize: '1rem'
                                            }}
                                            title="Delete goal"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.9rem',
                                        fontWeight: 600
                                    }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                                        <span style={{ color: goal.color }}>{percentage}%</span>
                                    </div>
                                    <div className="progress-bar" style={{ height: '8px' }}>
                                        <div 
                                            className="progress-fill"
                                            style={{
                                                width: `${percentage}%`,
                                                background: goal.color,
                                                transition: 'width 0.3s ease'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Input to Add Money */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    alignItems: 'flex-end'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.35rem',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            color: 'var(--text-secondary)'
                                        }}>
                                            Saved Amount
                                        </label>
                                        <input
                                            type="number"
                                            value={goal.value}
                                            onChange={(e) => handleUpdateValue(goal.id, e.target.value)}
                                            min="0"
                                            max={goal.target}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem 0.75rem',
                                                border: `1px solid ${goal.color}`,
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '0.95rem',
                                                fontFamily: 'var(--font-primary)',
                                                backgroundColor: 'var(--bg-secondary)'
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (goal.value < goal.target) {
                                                handleUpdateValue(goal.id, goal.target);
                                            }
                                        }}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: goal.color,
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: goal.value >= goal.target ? 'default' : 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            opacity: goal.value >= goal.target ? 0.5 : 1,
                                            whiteSpace: 'nowrap'
                                        }}
                                        disabled={goal.value >= goal.target}
                                    >
                                        Complete
                                    </button>
                                </div>

                                {goal.value >= goal.target && (
                                    <div style={{
                                        marginTop: '0.75rem',
                                        padding: '0.5rem 0.75rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        borderRadius: 'var(--radius-md)',
                                        color: '#10B981',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        textAlign: 'center'
                                    }}>
                                        ✓ Goal Completed!
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Goal;
