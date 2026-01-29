import React, { useState, useEffect } from 'react';
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

import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function App() {
    const [activeTab, setActiveTab] = useState('analytics');
    const [showSmartSpend, setShowSmartSpend] = useState(false);
    const [currentPage, setCurrentPage] = useState('landing');
    const [signupEmail, setSignupEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userFinancialData, setUserFinancialData] = useState(null);
    const [pendingFinancialData, setPendingFinancialData] = useState(null);
    const [userGoals, setUserGoals] = useState([
        { id: 1, label: 'Emergency Fund', value: 5000, target: 6400, color: '#10B981' },
        { id: 2, label: 'Europe Trip', value: 2700, target: 5000, color: '#3B82F6' },
        { id: 3, label: 'Car Downpayment', value: 3200, target: 10000, color: '#F59E0B' }
    ]);
    const [pendingChatPrompt, setPendingChatPrompt] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);

                // Check if we have pending financial data to save
                if (pendingFinancialData) {
                    try {
                        await setDoc(doc(db, 'users', user.uid), {
                            financialProfile: pendingFinancialData,
                            updatedAt: new Date().toISOString()
                        }, { merge: true });

                        setUserFinancialData(pendingFinancialData);
                        setPendingFinancialData(null); // Clear pending
                        setCurrentPage('dashboard');
                    } catch (error) {
                        console.error("Error saving financial data:", error);
                    }
                } else {
                    // Check if user already has financial data
                    try {
                        const docRef = doc(db, 'users', user.uid);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists() && docSnap.data().financialProfile) {
                            setUserFinancialData(docSnap.data().financialProfile);
                            // Only switch to dashboard if we're not already there or in a specific flow
                            // However, on refresh, currentPage is 'landing', so we should switch.
                            setCurrentPage('dashboard');
                        } else {
                            // User exists but no profile? Send to setup
                            setCurrentPage('financialSetup');
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                        // Fallback to dashboard so user isn't stuck on login screen
                        setCurrentPage('dashboard');
                    }
                }
            } else {
                setIsLoggedIn(false);
                setUserFinancialData(null);
                // If logged out, stay on landing page (default)
            }
        });
        return () => unsubscribe();
    }, [pendingFinancialData]);


    const [isLoginMode, setIsLoginMode] = useState(false);

    const handleGetStarted = (email) => {
        setSignupEmail(email);
        setIsLoginMode(false);
        // Changed flow: Go to Signup FIRST, then Financial Setup if needed (handled by auth listener)
        setCurrentPage('signup');
    };

    const handleLogin = () => {
        setIsLoginMode(true);
        setSignupEmail('');
        setCurrentPage('signup');
    };

    const handleSignupComplete = () => {
        // Auth listener will handle redirection
        setIsLoggedIn(true);
    };

    const handleFinancialSetupComplete = (financialData) => {
        if (isLoggedIn) {
            // If already logged in (e.g. from dashboard), just save
            const user = auth.currentUser;
            if (user) {
                setDoc(doc(db, 'users', user.uid), {
                    financialProfile: financialData,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
                setUserFinancialData(financialData);
                setCurrentPage('dashboard');
            }
        } else {
            // Not logged in (onboarding flow) -> Store temporarily and go to Signup
            setPendingFinancialData(financialData);
            setIsLoginMode(false); // Ensure we are in signup mode after setup
            setCurrentPage('signup');
        }
    };



    const handleBackToLanding = () => {
        setCurrentPage('landing');
        setSignupEmail('');
        setIsLoginMode(false);
    };

    const handleChatPrompt = (promptText) => {
        setPendingChatPrompt(promptText);
        setActiveTab('chat');
    };

    if (currentPage === 'landing') {
        return (
            <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />
        );
    }

    if (currentPage === 'signup') {
        return (
            <SignUp
                initialEmail={signupEmail}
                initialLoginMode={isLoginMode}
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
                {activeTab === 'analytics' && (
                    <AnalyticsDashboard
                        userGoals={userGoals}
                        onChatPrompt={handleChatPrompt}
                    />
                )}
                {activeTab === 'chat' && (
                    <ChatInterface
                        initialPrompt={pendingChatPrompt}
                        onPromptConsumed={() => setPendingChatPrompt('')}
                    />
                )}
                {activeTab === 'goals' && <Goal userGoals={userGoals} onGoalUpdate={setUserGoals} />}
                {activeTab === 'notifications' && <Notifications />}
                {activeTab === 'profile' && <UserProfile />}
            </main>

            {showSmartSpend && <SmartSpendView onClose={() => setShowSmartSpend(false)} />}
        </div>
    );
}

export default App;
