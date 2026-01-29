import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ChatInterface from './components/ChatInterface';
import UserProfile from './components/UserProfile';
import SmartSpendView from './components/SmartSpendView';
import FloatingParticles from './components/FloatingParticles';
import './index.css';

function App() {
    const [activeTab, setActiveTab] = useState('analytics');
    const [showSmartSpend, setShowSmartSpend] = useState(false);

    return (
        <div className="app-container">
            <FloatingParticles />
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onSmartSpend={() => setShowSmartSpend(true)}
            />

            <main
                className="main-content container fade-in"
                style={{
                    filter: showSmartSpend ? 'blur(5px)' : 'none',
                    transition: 'filter 0.3s'
                }}
            >
                {activeTab === 'analytics' && <AnalyticsDashboard />}
                {activeTab === 'chat' && <ChatInterface />}
                {activeTab === 'profile' && <UserProfile />}
            </main>

            {showSmartSpend && <SmartSpendView onClose={() => setShowSmartSpend(false)} />}
        </div>
    );
}

export default App;
