import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ChatInterface from './components/ChatInterface';
import UserProfile from './components/UserProfile';
import SmartSpendView from './components/SmartSpendView';
import Notifications from './components/Notifications';
import FloatingParticles from './components/FloatingParticles';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import FinancialSetup from './components/FinancialSetup';
import Goal from './components/Goal';
import './index.css';

function App() {
    const [activeTab, setActiveTab] = useState('analytics');
    const [showSmartSpend, setShowSmartSpend] = useState(false);
    const [currentPage, setCurrentPage] = useState('landing');
    const [signupEmail, setSignupEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userFinancialData, setUserFinancialData] = useState(null);
    const [userGoals, setUserGoals] = useState([
        { id: 1, label: 'Emergency Fund', value: 5000, target: 6400, color: '#10B981' },
        { id: 2, label: 'Europe Trip', value: 2700, target: 5000, color: '#3B82F6' },
        { id: 3, label: 'Car Downpayment', value: 3200, target: 10000, color: '#F59E0B' }
    ]);
    const [pendingChatPrompt, setPendingChatPrompt] = useState('');

    const handleGetStarted = (email) => {
        setSignupEmail(email);
        setCurrentPage('signup');
    };

    const handleSignupComplete = () => {
        setIsLoggedIn(true);
        setCurrentPage('financialSetup');
    };

    const handleFinancialSetupComplete = (financialData) => {
        setUserFinancialData(financialData);
        setCurrentPage('dashboard');
    };

    const handleBackToLanding = () => {
        setCurrentPage('landing');
        setSignupEmail('');
    };

    const handleChatPrompt = (promptText) => {
        setPendingChatPrompt(promptText);
        setActiveTab('chat');
    };

    if (currentPage === 'landing') {
        return (
            <LandingPage onGetStarted={handleGetStarted} />
        );
    }

    if (currentPage === 'signup') {
        return (
            <SignUp 
                initialEmail={signupEmail} 
                onSignupComplete={handleSignupComplete}
                onBack={handleBackToLanding}
            />
        );
    }

    if (currentPage === 'financialSetup') {
        return (
            <FinancialSetup onSetupComplete={handleFinancialSetupComplete} />
        );
    }

    return (
        <div className="app-container">
            <FloatingParticles />
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onSmartSpend={() => setShowSmartSpend(true)}
                onLogout={() => setIsLoggedIn(false)}
            />

            <main
                className="main-content container fade-in"
                style={{
                    filter: showSmartSpend ? 'blur(5px)' : 'none',
                    transition: 'filter 0.3s'
                }}
            >
                {activeTab === 'analytics' && <AnalyticsDashboard userGoals={userGoals} />}
                {activeTab === 'chat' && <ChatInterface />}
                {activeTab === 'goals' && <Goal userGoals={userGoals} onGoalUpdate={setUserGoals} />}
                {activeTab === 'analytics' && <AnalyticsDashboard onChatPrompt={handleChatPrompt} />}
                {activeTab === 'chat' && (
                    <ChatInterface
                        initialPrompt={pendingChatPrompt}
                        onPromptConsumed={() => setPendingChatPrompt('')}
                    />
                )}
                {activeTab === 'notifications' && <Notifications />}
                {activeTab === 'profile' && <UserProfile />}
            </main>

            {showSmartSpend && <SmartSpendView onClose={() => setShowSmartSpend(false)} />}
        </div>
    );
}

export default App;
