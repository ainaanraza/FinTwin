import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { ChevronRight, DollarSign, TrendingUp, ShieldCheck, Activity } from 'lucide-react';

import leafPattern from '../assets/leaf_pattern.png';

const AnalyticsDashboard = ({ onChatPrompt = () => {} }) => {
    const [data, setData] = useState([
        { name: 'Jun', amount: 2400 }, { name: 'Jul', amount: 1398 },
        { name: 'Aug', amount: 9800 }, { name: 'Sep', amount: 3908 },
        { name: 'Oct', amount: 4800 }, { name: 'Nov', amount: 3800 }
    ]);
    const [balance, setBalance] = useState(13250);
    const [view, setView] = useState('expenses');
    const [selectedMonth, setSelectedMonth] = useState('November');
    const [showAllDeposits, setShowAllDeposits] = useState(false);
    const [monthPulse, setMonthPulse] = useState(false);

    const monthOptions = ['November', 'October', 'September', 'August', 'July', 'June'];

    const kpisByMonth = {
        November: [
            { title: 'Cash Flow', value: '+$2,908', trend: '+6.4% MoM', Icon: DollarSign, positive: true },
            { title: 'Savings Rate', value: '31%', trend: '+2.1 pts', Icon: ShieldCheck, positive: true },
            { title: 'Discretionary', value: '$1,120', trend: '-8.2% MoM', Icon: Activity, positive: false },
            { title: 'Investments', value: '$48.2k', trend: '+4.8% QoQ', Icon: TrendingUp, positive: true }
        ],
        October: [
            { title: 'Cash Flow', value: '+$2,420', trend: '+3.1% MoM', Icon: DollarSign, positive: true },
            { title: 'Savings Rate', value: '28%', trend: '-1.4 pts', Icon: ShieldCheck, positive: false },
            { title: 'Discretionary', value: '$1,340', trend: '+5.6% MoM', Icon: Activity, positive: false },
            { title: 'Investments', value: '$47.6k', trend: '+3.2% QoQ', Icon: TrendingUp, positive: true }
        ],
        September: [
            { title: 'Cash Flow', value: '+$2,115', trend: '+1.9% MoM', Icon: DollarSign, positive: true },
            { title: 'Savings Rate', value: '26%', trend: '-0.7 pts', Icon: ShieldCheck, positive: false },
            { title: 'Discretionary', value: '$1,410', trend: '+2.8% MoM', Icon: Activity, positive: false },
            { title: 'Investments', value: '$46.9k', trend: '+2.6% QoQ', Icon: TrendingUp, positive: true }
        ],
        August: [
            { title: 'Cash Flow', value: '+$2,780', trend: '+4.5% MoM', Icon: DollarSign, positive: true },
            { title: 'Savings Rate', value: '29%', trend: '+1.2 pts', Icon: ShieldCheck, positive: true },
            { title: 'Discretionary', value: '$1,210', trend: '-3.8% MoM', Icon: Activity, positive: true },
            { title: 'Investments', value: '$46.1k', trend: '+2.1% QoQ', Icon: TrendingUp, positive: true }
        ],
        July: [
            { title: 'Cash Flow', value: '+$1,980', trend: '-2.2% MoM', Icon: DollarSign, positive: false },
            { title: 'Savings Rate', value: '25%', trend: '-2.3 pts', Icon: ShieldCheck, positive: false },
            { title: 'Discretionary', value: '$1,520', trend: '+6.1% MoM', Icon: Activity, positive: false },
            { title: 'Investments', value: '$45.4k', trend: '+1.4% QoQ', Icon: TrendingUp, positive: true }
        ],
        June: [
            { title: 'Cash Flow', value: '+$2,350', trend: '+2.6% MoM', Icon: DollarSign, positive: true },
            { title: 'Savings Rate', value: '27%', trend: '+0.8 pts', Icon: ShieldCheck, positive: true },
            { title: 'Discretionary', value: '$1,260', trend: '-1.9% MoM', Icon: Activity, positive: true },
            { title: 'Investments', value: '$44.8k', trend: '+1.0% QoQ', Icon: TrendingUp, positive: true }
        ]
    };

    const kpis = kpisByMonth[selectedMonth] || kpisByMonth.November;

    const categoryByMonth = {
        November: [
            { name: 'Housing', value: 1420, color: '#0f172a' },
            { name: 'Groceries', value: 620, color: '#F59E0B' },
            { name: 'Transport', value: 240, color: '#475569' },
            { name: 'Dining', value: 310, color: '#ea580c' },
            { name: 'Utilities', value: 190, color: '#1e293b' }
        ],
        October: [
            { name: 'Housing', value: 1400, color: '#0f172a' },
            { name: 'Groceries', value: 680, color: '#F59E0B' },
            { name: 'Transport', value: 220, color: '#475569' },
            { name: 'Dining', value: 340, color: '#ea580c' },
            { name: 'Utilities', value: 210, color: '#1e293b' }
        ],
        September: [
            { name: 'Housing', value: 1380, color: '#0f172a' },
            { name: 'Groceries', value: 640, color: '#F59E0B' },
            { name: 'Transport', value: 260, color: '#475569' },
            { name: 'Dining', value: 295, color: '#ea580c' },
            { name: 'Utilities', value: 205, color: '#1e293b' }
        ],
        August: [
            { name: 'Housing', value: 1360, color: '#0f172a' },
            { name: 'Groceries', value: 600, color: '#F59E0B' },
            { name: 'Transport', value: 230, color: '#475569' },
            { name: 'Dining', value: 280, color: '#ea580c' },
            { name: 'Utilities', value: 195, color: '#1e293b' }
        ],
        July: [
            { name: 'Housing', value: 1340, color: '#0f172a' },
            { name: 'Groceries', value: 610, color: '#F59E0B' },
            { name: 'Transport', value: 210, color: '#475569' },
            { name: 'Dining', value: 260, color: '#ea580c' },
            { name: 'Utilities', value: 190, color: '#1e293b' }
        ],
        June: [
            { name: 'Housing', value: 1320, color: '#0f172a' },
            { name: 'Groceries', value: 580, color: '#F59E0B' },
            { name: 'Transport', value: 215, color: '#475569' },
            { name: 'Dining', value: 250, color: '#ea580c' },
            { name: 'Utilities', value: 185, color: '#1e293b' }
        ]
    };

    const categoryData = categoryByMonth[selectedMonth] || categoryByMonth.November;

    useEffect(() => {
        // Fetch real data
        const fetchTransactions = async () => {
            try {
                const res = await fetch('http://127.0.0.1:8000/api/spending');
                const rawData = await res.json();

                // Process for Chart (Simple aggregation by month for demo)
                // This is a placeholder aggregation
                if (view === 'expenses') {
                    // Keep mock chart data for stability unless we implement full aggregation
                    const expenseData = [
                        { name: 'Jun', amount: 2400 }, { name: 'Jul', amount: 1398 },
                        { name: 'Aug', amount: 9800 }, { name: 'Sep', amount: 3908 },
                        { name: 'Oct', amount: 4800 }, { name: 'Nov', amount: 3800 }
                    ];
                    setData(expenseData);
                } else {
                    const incomeData = [
                        { name: 'Jun', amount: 5000 }, { name: 'Jul', amount: 5100 },
                        { name: 'Aug', amount: 5200 }, { name: 'Sep', amount: 5000 },
                        { name: 'Oct', amount: 5500 }, { name: 'Nov', amount: 5300 }
                    ];
                    setData(incomeData);
                }

                // Format for Transaction List
                const formattedTransactions = rawData.map(item => ({
                    name: item.merchant,
                    date: item.date,
                    amount: -item.amount, // Assuming all indexed are expenses for now
                    icon: item.category.charAt(0).toUpperCase(),
                    color: '#000',
                    bg: '#f4f4f5'
                }));

                // Update state or just use a ref? 
                // Since 'transactions' is currently a derived const, we need to store this in state to use it.
                setRealTransactions(formattedTransactions);

            } catch (e) {
                console.error("Error fetching transactions:", e);
            }
        };

        fetchTransactions();
    }, [view]);

    const [realTransactions, setRealTransactions] = useState([]);

    const transactions = view === 'expenses' ? (realTransactions.length > 0 ? realTransactions : [
        { name: 'Invision', date: '13 Nov, 8:34 AM', amount: -68.03, icon: 'IN', color: '#000', bg: '#f4f4f5' },
        { name: 'McDonalds', date: '9 Nov, 3:52 PM', amount: -21.55, icon: 'M', color: '#000', bg: '#f4f4f5' },
        { name: 'Medical Center', date: '7 Nov, 3:34 PM', amount: -385.02, icon: '+', color: '#000', bg: '#f4f4f5' },
        { name: 'Uber', date: '5 Nov, 8:00 AM', amount: -15.50, icon: 'U', color: '#000', bg: '#f4f4f6' }
    ]) : [
        { name: 'Salary', date: '1 Nov, 9:00 AM', amount: 5000.00, icon: '$', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Freelance', date: '25 Oct, 2:00 PM', amount: 450.00, icon: 'F', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' }
    ];

    const allDeposits = [
        { name: 'Salary', date: '1 Nov, 9:00 AM', amount: 5000.00, icon: '$', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Freelance', date: '25 Oct, 2:00 PM', amount: 450.00, icon: 'F', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Project Bonus', date: '18 Oct, 4:15 PM', amount: 1200.00, icon: 'B', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Dividends', date: '15 Oct, 11:30 AM', amount: 210.50, icon: 'D', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Refund', date: '10 Oct, 1:05 PM', amount: 86.25, icon: 'R', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Cashback', date: '2 Oct, 6:20 PM', amount: 42.10, icon: 'C', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Stock Sale', date: '28 Sep, 3:45 PM', amount: 860.00, icon: 'S', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
        { name: 'Client Retainer', date: '20 Sep, 10:10 AM', amount: 950.00, icon: 'R', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' }
    ];

    if (showAllDeposits) {
        return (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '1.5rem' }}>
                <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="section-heading" style={{ alignItems: 'center' }}>
                        <h3>All Recent Deposits</h3>
                        <button
                            className="btn-secondary"
                            onClick={() => setShowAllDeposits(false)}
                            style={{ padding: '0.5rem 1rem' }}
                        >
                            Back
                        </button>
                    </div>

                    <div className="card-float">
                        <ul className="list-card" style={{ margin: 0 }}>
                            {allDeposits.map((tx, i) => (
                                <li key={i}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'clamp(0.75rem, 2vw, 1.25rem)',
                                        minWidth: 0,
                                        flex: 1
                                    }}>
                                        <div style={{
                                            width: 'clamp(42px, 10vw, 52px)',
                                            height: 'clamp(42px, 10vw, 52px)',
                                            minWidth: '42px',
                                            borderRadius: '50%',
                                            background: tx.bg,
                                            color: tx.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                                            border: '1px solid rgba(0,0,0,0.05)'
                                        }}>
                                            {tx.icon}
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <h4 style={{
                                                fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                                                fontWeight: 700,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {tx.name}
                                            </h4>
                                            <p className="list-meta">{tx.date}</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontWeight: 700,
                                        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                                        color: '#F59E0B',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '0.5rem'
                                    }}>
                                        +{tx.amount}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '1.5rem' }}>
            {/* Hero Section with Balance */}
            <div style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '1.5rem 0.5rem 0',
            }}>
                <img
                    src={leafPattern}
                    alt=""
                    style={{
                        position: 'absolute',
                        top: '-120px',
                        right: '-80px',
                        width: '400px',
                        opacity: 0.9,
                        transform: 'rotate(-12deg)',
                        pointerEvents: 'none'
                    }}
                    className="leaf-pattern-img"
                />

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
                            Current Balance
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
                            ${balance.toLocaleString()}
                        </h1>
                        <div className="btn-toggle" style={{ background: 'rgba(255,255,255,0.85)' }}>
                            <button
                                className={`btn-toggle-opt ${view === 'income' ? 'active' : ''}`}
                                onClick={() => setView('income')}
                            >
                                Income
                            </button>
                            <button
                                className={`btn-toggle-opt ${view === 'expenses' ? 'active' : ''}`}
                                onClick={() => setView('expenses')}
                            >
                                Expenses
                            </button>
                        </div>
                        <div className="prompt-row" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                            <span className="context-chip">Run cash flow</span>
                            <span className="context-chip">AI forecast</span>
                            <span className="context-chip">Download CSV</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPIs and Content */}
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="section-heading" style={{ alignItems: 'center', gap: '0.75rem' }}>
                    <h3>Portfolio Snapshot</h3>
                    <div className="month-select-wrap">
                        <span className={`pill month-pill ${monthPulse ? 'pulse' : ''}`} key={selectedMonth}>
                            {selectedMonth}
                        </span>
                        <select
                            className="month-select"
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                setMonthPulse(true);
                                setTimeout(() => setMonthPulse(false), 500);
                            }}
                            aria-label="Select month"
                        >
                            {monthOptions.map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="kpi-grid">
                    {kpis.map(({ title, value, trend, Icon, positive }) => (
                        <div key={title} className="kpi-card">
                            <div className="kpi-title">
                                <Icon size={18} />
                                <span>{title}</span>
                            </div>
                            <div className="kpi-value">{value}</div>
                            <div className={`kpi-trend ${positive ? '' : 'neg'}`}>{trend}</div>
                        </div>
                    ))}
                </div>

                {/* Charts and Transactions Grid */}
                <div className="dashboard-grid">
                    {/* Chart Card */}
                    <div className="card-float" style={{
                        minWidth: 0,
                        borderTop: '4px solid var(--accent-primary)'
                    }}>
                        <div className="section-heading" style={{ marginBottom: '1rem' }}>
                            <h3>{view === 'expenses' ? 'Spending Trend' : 'Income Trend'}</h3>
                            <span className="pill-soft">Last 6 months</span>
                        </div>

                        <div style={{
                            height: 'clamp(200px, 30vh, 260px)',
                            width: '100%'
                        }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={view === 'expenses' ? '#0f172a' : '#F59E0B'} stopOpacity={0.5} />
                                            <stop offset="95%" stopColor={view === 'expenses' ? '#0f172a' : '#EF4444'} stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        strokeWidth={1.5}
                                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                        axisLine={{ stroke: '#cbd5e1', strokeWidth: 1.5 }}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        strokeWidth={1.5}
                                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                        axisLine={{ stroke: '#cbd5e1', strokeWidth: 1.5 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '1rem',
                                            border: '2px solid ' + (view === 'expenses' ? '#0f172a' : '#F59E0B'),
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                            color: '#1a1a1a',
                                            fontWeight: 600
                                        }}
                                        cursor={{ stroke: view === 'expenses' ? '#0f172a' : '#F59E0B', strokeWidth: 2 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke={view === 'expenses' ? '#0f172a' : '#F59E0B'}
                                        strokeWidth={5}
                                        fill="url(#colorGradient)"
                                        dot={{ fill: view === 'expenses' ? '#0f172a' : '#F59E0B', strokeWidth: 2, r: 5 }}
                                        activeDot={{ r: 8, strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            marginTop: '1.25rem',
                        }}>
                            <div className="pill-soft" style={{ width: 'fit-content' }}>
                                {view === 'expenses' ? 'Total spent: $2,392' : 'Total earned: $5,300'}
                            </div>
                            <button
                                className="btn-secondary"
                                style={{
                                    background: 'var(--accent-gradient)',
                                    color: 'white',
                                    borderColor: 'transparent',
                                    width: '100%',
                                    boxShadow: 'var(--shadow-accent)'
                                }}
                            >
                                Export summary
                            </button>
                        </div>
                    </div>

                    {/* Transactions Card */}
                    <div className="card-float" style={{ padding: 'clamp(1rem, 3vw, 1.75rem)' }}>
                        <div className="section-heading" style={{ marginBottom: '0.75rem' }}>
                            <h3>{view === 'income' ? 'Recent Deposits' : 'Transactions'}</h3>
                            <span
                                className="pill-soft"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowAllDeposits(true)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setShowAllDeposits(true)}
                            >
                                View all <ChevronRight size={16} />
                            </span>
                        </div>

                        <ul className="list-card">
                            {transactions.map((tx, i) => (
                                <li key={i}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'clamp(0.75rem, 2vw, 1.25rem)',
                                        minWidth: 0,
                                        flex: 1
                                    }}>
                                        <div style={{
                                            width: 'clamp(42px, 10vw, 52px)',
                                            height: 'clamp(42px, 10vw, 52px)',
                                            minWidth: '42px',
                                            borderRadius: '50%',
                                            background: tx.bg,
                                            color: tx.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                                            border: '1px solid rgba(0,0,0,0.05)'
                                        }}>
                                            {tx.icon}
                                        </div>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <h4 style={{
                                                fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
                                                fontWeight: 700,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {tx.name}
                                            </h4>
                                            <p className="list-meta">{tx.date}</p>
                                        </div>
                                    </div>
                                    <span style={{
                                        fontWeight: 700,
                                        fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                                        color: view === 'income' ? '#F59E0B' : '#1a1a1a',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '0.5rem'
                                    }}>
                                        {view === 'income' ? '+' : ''}{tx.amount}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Category Breakdown Chart */}
                <div className="card-float" style={{ borderTop: '4px solid var(--accent-black)', minWidth: 0 }}>
                    <div className="section-heading" style={{ marginBottom: '0.75rem', alignItems: 'center', gap: '0.5rem' }}>
                        <h3>Spending Breakdown</h3>
                        <span className="pill-soft">{selectedMonth}</span>
                    </div>
                    <div style={{ height: 'clamp(220px, 32vh, 280px)', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(15, 23, 42, 0.04)' }}
                                    contentStyle={{
                                        borderRadius: '1rem',
                                        border: '1px solid rgba(15,23,42,0.08)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                                        fontWeight: 600
                                    }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Goals and AI Advisor Grid */}
                <div className="dashboard-grid" style={{
                    gridTemplateColumns: '1fr'
                }}>
                    <div className="card-float" style={{ borderTop: '4px solid var(--accent-black)' }}>
                        <div className="section-heading">
                            <h3>Goals Progress</h3>
                            <span className="pill-soft">On track</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { label: 'Emergency Fund', value: 78 },
                                { label: 'Europe Trip', value: 54 },
                                { label: 'Car Downpayment', value: 32 }
                            ].map(goal => (
                                <div key={goal.label}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        gap: '0.5rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{
                                            color: '#0f172a',
                                            fontWeight: 600,
                                            fontSize: 'clamp(0.85rem, 2vw, 1rem)'
                                        }}>
                                            {goal.label}
                                        </span>
                                        <span className="pill-soft">{goal.value}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${goal.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-float" style={{
                        background: '#0f172a',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div className="section-heading" style={{ marginBottom: '0.75rem' }}>
                            <h3 style={{ color: 'rgba(255,255,255,0.7)' }}>AI Advisor</h3>
                            <span className="badge">Live</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.9rem',
                            lineHeight: 1.5
                        }}>
                            <p style={{
                                margin: 0,
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: 'clamp(0.85rem, 2vw, 1rem)'
                            }}>
                                Cash flow remains strong. You can increase investments by $250 this month without impacting emergency reserves.
                            </p>
                            <div className="prompt-row">
                                <button
                                    type="button"
                                    className="prompt-btn"
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.1)'
                                    }}
                                    onClick={() => onChatPrompt('Ask to rebalance')}
                                >
                                    Ask to rebalance
                                </button>
                                <button
                                    type="button"
                                    className="prompt-btn"
                                    style={{
                                        background: 'rgba(255,255,255,0.08)',
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.1)'
                                    }}
                                    onClick={() => onChatPrompt('Show spending leaks')}
                                >
                                    Show spending leaks
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .month-select-wrap {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }

                .month-pill {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }

                .month-pill.pulse {
                    animation: pillPop 0.4s ease;
                    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
                }

                .month-select {
                    appearance: none;
                    padding: 0.45rem 1.9rem 0.45rem 0.75rem;
                    border-radius: 999px;
                    border: 1px solid rgba(15, 23, 42, 0.12);
                    background: white;
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: #0f172a;
                    background-image: linear-gradient(45deg, transparent 50%, #0f172a 50%),
                        linear-gradient(135deg, #0f172a 50%, transparent 50%),
                        linear-gradient(to right, #ffffff, #ffffff);
                    background-position: calc(100% - 16px) calc(0.55rem), calc(100% - 11px) calc(0.55rem), 100% 0;
                    background-size: 5px 5px, 5px 5px, 2.2rem 100%;
                    background-repeat: no-repeat;
                    cursor: pointer;
                }

                .month-select:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.15);
                }

                @keyframes pillPop {
                    0% { transform: scale(1); }
                    40% { transform: scale(1.05) translateY(-1px); }
                    100% { transform: scale(1); }
                }

                @media (min-width: 641px) {
                    .leaf-pattern-img {
                        top: -150px !important;
                        right: -100px !important;
                        width: 480px !important;
                    }
                }
                
                @media (min-width: 1024px) {
                    .leaf-pattern-img {
                        top: -180px !important;
                        right: -120px !important;
                        width: 540px !important;
                    }
                    
                    .dashboard-grid:last-child {
                        grid-template-columns: 1.25fr 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AnalyticsDashboard;
