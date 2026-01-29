import React from 'react';
import { Home, MessageSquare, PieChart, Zap, Bell } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onSmartSpend }) => {
    const navItems = [
        { id: 'analytics', icon: Home, label: 'Home' },
        { id: 'chat', icon: MessageSquare, label: 'Advisor' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'profile', icon: PieChart, label: 'Profile' }
    ];

    return (
        <nav className="bottom-nav">
            {/* Desktop Brand */}
            <h1 
                style={{
                    fontSize: '1.75rem', 
                    fontWeight: 700, 
                    color: 'var(--accent-black)',
                    marginBottom: '2.5rem', 
                    display: 'none', 
                    width: '100%', 
                    textAlign: 'center'
                }} 
                className="desktop-brand"
            >
                Fin<span style={{ color: 'var(--accent-gold)' }}>Twin</span>
            </h1>

            {/* Navigation Items */}
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                        aria-label={item.label}
                    >
                        <span className="nav-dot" aria-hidden="true" />
                        <Icon 
                            size={24} 
                            strokeWidth={isActive ? 2.5 : 1.5} 
                        />
                        <span style={{
                            fontSize: '0.7rem',
                            marginTop: '0.15rem',
                            fontWeight: isActive ? 600 : 400,
                            letterSpacing: '0.05em',
                            display: 'none'
                        }}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
            
            {/* SmartSpend Button - FAB on Mobile, Regular on Desktop */}
            <button
                className="nav-item btn-smart-mobile"
                onClick={onSmartSpend}
                aria-label="SmartSpend Scanner"
            >
                <Zap size={28} fill="currentColor" />
                <span style={{
                    fontSize: '0.7rem',
                    marginTop: '0.15rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    display: 'none'
                }}>
                    SmartSpend
                </span>
            </button>

            <style>{`
                /* Show labels on desktop */
                @media (min-width: 1024px) {
                    .nav-item span {
                        display: inline !important;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
