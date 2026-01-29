import React, { useState } from 'react';
import { ArrowRight, Zap, TrendingUp, Shield, BarChart3, ChevronDown } from 'lucide-react';
import FloatingParticles from './FloatingParticles';

const LandingPage = ({ onGetStarted, onLogin }) => {
    const [email, setEmail] = useState('');

    const features = [
        {
            icon: TrendingUp,
            title: 'Smart Analytics',
            description: 'Real-time insights into your spending patterns and financial health'
        },
        {
            icon: Zap,
            title: 'AI-Powered Advisor',
            description: 'Get personalized financial recommendations powered by AI'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Bank-level encryption to keep your financial data safe'
        },
        {
            icon: BarChart3,
            title: 'Smart Spend',
            description: 'Intelligent budgeting with automated savings suggestions'
        }
    ];

    const reviews = [
        {
            name: 'Sarah Johnson',
            role: 'Marketing Professional',
            rating: 5,
            text: 'FinTwin completely transformed how I manage my money. The AI recommendations have helped me save over $5,000 this year!'
        },
        {
            name: 'Michael Chen',
            role: 'Software Engineer',
            rating: 5,
            text: 'Best financial app I\'ve used. The insights are accurate and the interface is incredibly intuitive. Highly recommended!'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Entrepreneur',
            rating: 5,
            text: 'As a business owner, tracking multiple accounts was a nightmare. FinTwin made it simple and gave me peace of mind.'
        }
    ];

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (email.trim()) {
            onGetStarted(email);
        }
    };

    return (
        <div className="landing-page">
            <FloatingParticles />

            {/* Navigation Header */}
            <header className="landing-header">
                <div className="landing-container">
                    <div className="logo-section">
                        <h1 className="logo-text">
                            Fin<span className="logo-accent">Twin</span>
                        </h1>
                    </div>
                    <nav className="landing-nav">
                        <a href="#features">Features</a>
                        <a href="#about">About</a>
                        <button
                            className="nav-cta-btn"
                            onClick={onGetStarted}
                        >
                            Get Started
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="landing-container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Zap size={16} />
                            <span>AI-Powered Financial Intelligence</span>
                        </div>

                        <h2 className="hero-title">
                            Your Personal <span className="gradient-text">Financial Twin</span>
                        </h2>

                        <p className="hero-subtitle">
                            Unlock smarter spending decisions with AI-powered analytics, real-time insights, and personalized financial advice. Take control of your wealth today.
                        </p>

                        <div className="hero-actions">
                            <button
                                className="btn-primary"
                                onClick={onGetStarted}
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </button>

                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="dashboard-preview">
                            <div className="preview-card">
                                <div className="preview-header">
                                    <div className="preview-dot"></div>
                                    <div className="preview-dot"></div>
                                    <div className="preview-dot"></div>
                                </div>
                                <div className="preview-content">
                                    <div className="preview-line short"></div>
                                    <div className="preview-line long"></div>
                                    <div className="preview-chart">
                                        <div className="chart-bar" style={{ height: '60%' }}></div>
                                        <div className="chart-bar" style={{ height: '80%' }}></div>
                                        <div className="chart-bar" style={{ height: '45%' }}></div>
                                        <div className="chart-bar" style={{ height: '90%' }}></div>
                                        <div className="chart-bar" style={{ height: '70%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="landing-container">
                    <div className="section-header">
                        <h3>Powerful Features</h3>
                        <p>Everything you need to master your finances</p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="feature-card card-float">
                                    <div className="feature-icon">
                                        <Icon size={32} />
                                    </div>
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="landing-container">
                    <div className="section-header">
                        <h3>How It Works</h3>
                        <p>Three simple steps to financial intelligence</p>
                    </div>

                    <div className="steps-container">
                        <div className="step-card card-float">
                            <div className="step-number">1</div>
                            <h4>Connect Your Accounts</h4>
                            <p>Securely link your bank accounts and credit cards</p>
                        </div>
                        <div className="step-divider"></div>
                        <div className="step-card card-float">
                            <div className="step-number">2</div>
                            <h4>Get Smart Insights</h4>
                            <p>AI analyzes your transactions and spending patterns</p>
                        </div>
                        <div className="step-divider"></div>
                        <div className="step-card card-float">
                            <div className="step-number">3</div>
                            <h4>Optimize & Save</h4>
                            <p>Receive personalized recommendations to improve finances</p>
                        </div>
                    </div>
                </div>
            </section>



            {/* CTA Section */}
            <section className="cta-section">
                <div className="landing-container">
                    <div className="cta-content card-float">
                        <h3>Ready to Take Control?</h3>
                        <p>Join thousands of users optimizing their finances with FinTwin</p>

                        <form onSubmit={handleEmailSubmit} className="email-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                Get Started
                            </button>
                        </form>

                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="reviews-section">
                <div className="landing-container">
                    <div className="section-header">
                        <h3>Loved by Users</h3>
                        <p>Join thousands of satisfied customers</p>
                    </div>

                    <div className="reviews-grid">
                        {reviews.map((review, idx) => (
                            <div key={idx} className="review-card card-float">
                                <div className="review-stars">
                                    {'★'.repeat(review.rating)}
                                </div>
                                <p className="review-text">"{review.text}"</p>
                                <div className="review-author">
                                    <div className="author-avatar"></div>
                                    <div>
                                        <p className="author-name">{review.name}</p>
                                        <p className="author-role">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="landing-container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>FinTwin</h4>
                            <p>Your AI-powered financial advisor</p>
                        </div>
                        <div className="footer-links">
                            <a href="#privacy">Privacy</a>
                            <a href="#terms">Terms</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
