import React from 'react';
import { AlertTriangle, BellRing, CreditCard, TrendingUp } from 'lucide-react';

const mockNotifications = [
    {
        title: 'Unusual Spending Detected',
        detail: 'Dining spend is 42% higher than your monthly average.',
        time: 'Today, 9:10 AM',
        Icon: AlertTriangle,
        tone: 'warning'
    },
    {
        title: 'Loan Payment Due Tomorrow',
        detail: 'Your car loan autopay of $420 is scheduled for tomorrow.',
        time: 'Today, 7:45 AM',
        Icon: BellRing,
        tone: 'info'
    },
    {
        title: 'Subscription Renewal',
        detail: 'Netflix yearly plan renews in 3 days. Consider downgrading to save $60.',
        time: 'Yesterday, 6:20 PM',
        Icon: CreditCard,
        tone: 'info'
    },
    {
        title: 'Utilities Spike',
        detail: 'Electric bill is up 18% vs last month. Check usage breakdown.',
        time: 'Yesterday, 1:05 PM',
        Icon: TrendingUp,
        tone: 'warning'
    }
];

const toneColors = {
    warning: {
        bg: 'rgba(234, 88, 12, 0.08)',
        border: 'rgba(234, 88, 12, 0.25)',
        text: '#9a3412'
    },
    info: {
        bg: 'rgba(15, 23, 42, 0.06)',
        border: 'rgba(15, 23, 42, 0.16)',
        text: '#0f172a'
    }
};

const Notifications = () => {
    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1.5rem' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="section-heading" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3>Notifications</h3>
                    <span className="pill-soft">Alerts & Reminders</span>
                </div>

                <div className="card-float" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {mockNotifications.map(({ title, detail, time, Icon, tone }, idx) => {
                        const toneStyle = toneColors[tone] || toneColors.info;
                        return (
                            <div
                                key={idx}
                                className="notification-row"
                                style={{
                                    display: 'flex',
                                    gap: '0.85rem',
                                    padding: '0.95rem',
                                    borderRadius: '1rem',
                                    border: `1px solid ${toneStyle.border}`,
                                    background: toneStyle.bg,
                                    alignItems: 'flex-start'
                                }}
                            >
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: `1px solid ${toneStyle.border}`,
                                    boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
                                }}>
                                    <Icon size={20} color={toneStyle.text} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{title}</h4>
                                        <span className="list-meta" style={{ whiteSpace: 'nowrap' }}>{time}</span>
                                    </div>
                                    <p style={{ margin: '0.35rem 0 0', color: '#475569', lineHeight: 1.5 }}>{detail}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
