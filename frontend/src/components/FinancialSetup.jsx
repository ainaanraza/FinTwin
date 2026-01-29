import React, { useState } from 'react';
import { DollarSign, TrendingDown, Building2, PiggyBank, TrendingUp, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import FloatingParticles from './FloatingParticles';

const FinancialSetup = ({ onSetupComplete }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        monthlyIncome: '',
        monthlyExpenses: '',
        existingLoans: '',
        savings: '',
        currentInvestments: ''
    });

    const steps = [
        { number: 1, title: 'Monthly Income', field: 'monthlyIncome', icon: DollarSign, color: '#10B981' },
        { number: 2, title: 'Monthly Expenses', field: 'monthlyExpenses', icon: TrendingDown, color: '#EF4444' },
        { number: 3, title: 'Existing Loans', field: 'existingLoans', icon: Building2, color: '#F59E0B' },
        { number: 4, title: 'Savings', field: 'savings', icon: PiggyBank, color: '#3B82F6' },
        { number: 5, title: 'Current Investments', field: 'currentInvestments', icon: TrendingUp, color: '#8B5CF6' }
    ];

    const currentStepData = steps[step - 1];
    const CurrentIcon = currentStepData.icon;

    const handleInputChange = (e) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            [currentStepData.field]: value
        });
    };

    const handleNext = () => {
        if (formData[currentStepData.field].trim()) {
            if (step < steps.length) {
                setStep(step + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onSetupComplete(formData);
        }, 1500);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    return (
        <div className="financial-setup-page">
            <FloatingParticles />

            <div className="setup-container">
                {/* Progress Section */}
                <div className="setup-progress">
                    <div className="progress-header">
                        <h2>Set Up Your Financial Profile</h2>
                        <p>Step {step} of {steps.length}</p>
                    </div>

                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${(step / steps.length) * 100}%` }}></div>
                    </div>

                    {/* Step Indicators */}
                    <div className="step-indicators">
                        {steps.map((s) => (
                            <div key={s.number} className="step-indicator-item">
                                <div 
                                    className={`step-indicator-circle ${step >= s.number ? 'active' : ''}`}
                                    style={step >= s.number ? { background: s.color } : {}}
                                >
                                    {step > s.number ? (
                                        <Check size={16} color="white" />
                                    ) : (
                                        s.number
                                    )}
                                </div>
                                <p className="step-label">{s.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className="setup-form-section">
                    <div className="setup-card">
                        {/* Step Content */}
                        <div className="step-content">
                            <div className="step-icon-container" style={{ borderColor: currentStepData.color }}>
                                <CurrentIcon size={48} style={{ color: currentStepData.color }} />
                            </div>

                            <h3 className="step-title">{currentStepData.title}</h3>
                            
                            <p className="step-description">
                                {step === 1 && "Enter your total monthly income from all sources"}
                                {step === 2 && "Enter your total monthly expenses and bills"}
                                {step === 3 && "Enter your total existing loan amount"}
                                {step === 4 && "Enter your current savings amount"}
                                {step === 5 && "Enter your total current investments value"}
                            </p>

                            <div className="input-group">
                                <label>Amount (USD)</label>
                                <div className="currency-input-wrapper">
                                    <span className="currency-symbol">$</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData[currentStepData.field]}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="100"
                                    />
                                </div>
                                {formData[currentStepData.field] && (
                                    <div className="amount-display">
                                        {formatCurrency(parseInt(formData[currentStepData.field]))}
                                    </div>
                                )}
                            </div>

                            {/* Quick suggestions */}
                            <div className="suggestions">
                                <p className="suggestions-label">Quick estimate:</p>
                                <div className="suggestion-buttons">
                                    {step === 1 && (
                                        <>
                                            <button onClick={() => setFormData({...formData, monthlyIncome: '3000'})}>$3,000</button>
                                            <button onClick={() => setFormData({...formData, monthlyIncome: '5000'})}>$5,000</button>
                                            <button onClick={() => setFormData({...formData, monthlyIncome: '8000'})}>$8,000</button>
                                        </>
                                    )}
                                    {step === 2 && (
                                        <>
                                            <button onClick={() => setFormData({...formData, monthlyExpenses: '1500'})}>$1,500</button>
                                            <button onClick={() => setFormData({...formData, monthlyExpenses: '2500'})}>$2,500</button>
                                            <button onClick={() => setFormData({...formData, monthlyExpenses: '4000'})}>$4,000</button>
                                        </>
                                    )}
                                    {step === 3 && (
                                        <>
                                            <button onClick={() => setFormData({...formData, existingLoans: '10000'})}>$10,000</button>
                                            <button onClick={() => setFormData({...formData, existingLoans: '50000'})}>$50,000</button>
                                            <button onClick={() => setFormData({...formData, existingLoans: '100000'})}>$100,000</button>
                                        </>
                                    )}
                                    {step === 4 && (
                                        <>
                                            <button onClick={() => setFormData({...formData, savings: '5000'})}>$5,000</button>
                                            <button onClick={() => setFormData({...formData, savings: '20000'})}>$20,000</button>
                                            <button onClick={() => setFormData({...formData, savings: '50000'})}>$50,000</button>
                                        </>
                                    )}
                                    {step === 5 && (
                                        <>
                                            <button onClick={() => setFormData({...formData, currentInvestments: '5000'})}>$5,000</button>
                                            <button onClick={() => setFormData({...formData, currentInvestments: '25000'})}>$25,000</button>
                                            <button onClick={() => setFormData({...formData, currentInvestments: '100000'})}>$100,000</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="setup-actions">
                            <button 
                                className="btn-secondary"
                                onClick={handlePrevious}
                                disabled={step === 1}
                            >
                                <ArrowLeft size={18} />
                                Previous
                            </button>

                            <button 
                                className={`btn-primary ${!formData[currentStepData.field].trim() ? 'disabled' : ''}`}
                                onClick={handleNext}
                                disabled={!formData[currentStepData.field].trim() || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span>Processing...</span>
                                    </>
                                ) : step === steps.length ? (
                                    <>
                                        <Check size={18} />
                                        Complete Setup
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialSetup;
