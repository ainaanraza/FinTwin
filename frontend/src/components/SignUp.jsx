import React, { useState } from 'react';
import { Mail, User, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import FloatingParticles from './FloatingParticles';

const SignUp = ({ initialEmail = '', onSignupComplete, onBack }) => {
        console.log("initialEmail:", initialEmail, typeof initialEmail);
        
    const [step, setStep] = useState(initialEmail ? 2 : 1);
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return;
        }
        
        setStep(2);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim()) {
            setError('Please enter your full name');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onSignupComplete();
        }, 1500);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 1) {
            setError('Please enter your password');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onSignupComplete();
        }, 1500);
    };

    return (
        <div className="signup-page">
            <FloatingParticles />

            <div className="signup-container">
                {/* Form Section */}
                <div className="signup-form-section">
                    <div className="signup-header">
                        <h2>{isLogin ? 'Welcome Back' : 'Join FinTwin'}</h2>
                        <p>
                            {isLogin 
                                ? 'Sign in to your account to continue' 
                                : 'Start your financial intelligence journey today'}
                        </p>
                    </div>

         

                    <div className="signup-card">
                        {/* Step 1: Email */}
                        {step === 1 && (
                            <form onSubmit={handleEmailSubmit}>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <Mail className="icon" size={20} />
                                    </div>
                                    {error && <div className="error-message">
                                        <span>⚠️</span> {error}
                                    </div>}
                                </div>

                                <div className="form-actions">
                                    <button 
                                        type="button"
                                        className="btn-back"
                                        onClick={onBack}
                                    >
                                        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
                                        Back
                                    </button>
                                    <button 
                                        type="submit"
                                        className="btn-submit"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Step 2: Password & Details or Login */}
                        {step === 2 && (
                            <form onSubmit={isLogin ? handleLogin : handleSignUp}>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <Mail className="icon" size={20} />
                                    </div>
                                </div>

                                {!isLogin && (
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <div className="input-wrapper">
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                            />
                                            <User className="icon" size={20} />
                                        </div>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="toggle-password"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {!isLogin && password && password.length < 8 && (
                                        <div className="error-message">
                                            <span>⚠️</span> Minimum 8 characters required
                                        </div>
                                    )}
                                </div>

                                {!isLogin && (
                                    <div className="form-group">
                                        <label>Confirm Password</label>
                                        <div className="input-wrapper">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="toggle-password"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {confirmPassword && password !== confirmPassword && (
                                            <div className="error-message">
                                                <span>⚠️</span> Passwords do not match
                                            </div>
                                        )}
                                    </div>
                                )}

                                {error && (
                                    <div className="error-message" style={{ marginBottom: '1rem' }}>
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button 
                                        type="button"
                                        className="btn-back"
                                        onClick={() => {
                                            setStep(1);
                                            setError('');
                                        }}
                                    >
                                        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} />
                                        Back
                                    </button>
                                    <button 
                                        type="submit"
                                        className="btn-submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span style={{ marginRight: '0.5rem' }}>⏳</span>
                                                {isLogin ? 'Signing in...' : 'Creating account...'}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={18} style={{ marginRight: '0.5rem' }} />
                                                {isLogin ? 'Sign In' : 'Create Account'}
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Toggle between Sign-In and Sign-Up */}
                                <div className="toggle-mode">
                                    {isLogin ? (
                                        <>
                                            Don't have an account?
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setIsLogin(false);
                                                    setPassword('');
                                                    setConfirmPassword('');
                                                    setFullName('');
                                                    setError('');
                                                }}
                                            >
                                                Sign Up
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            Already have an account?
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setIsLogin(true);
                                                    setPassword('');
                                                    setConfirmPassword('');
                                                    setFullName('');
                                                    setError('');
                                                }}
                                            >
                                                Sign In
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div className="signup-features">
                    <div className="feature-item">
                        <div className="feature-icon-box">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3>Secure & Safe</h3>
                            <p>Bank-level encryption protects your financial data 24/7</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon-box">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                        </div>
                        <div>
                            <h3>Instant Setup</h3>
                            <p>Get started in minutes with our simple onboarding process</p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon-box">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 21H3V3h9V1h9v8h2v4h-2v8z"></path>
                                <polyline points="3 9 15 9"></polyline>
                                <polyline points="3 15 15 15"></polyline>
                            </svg>
                        </div>
                        <div>
                            <h3>Smart Insights</h3>
                            <p>AI-powered analytics help you make better financial decisions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
