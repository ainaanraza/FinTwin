import React, { useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

const SmartSpendView = ({ onClose }) => {
    const [scanResult, setScanResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const performMockScan = () => {
        setAnalyzing(true);
        setTimeout(() => {
            fetch('/api/smartspend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 650, category: 'Shopping' })
            })
                .then(res => res.json())
                .then(data => {
                    setScanResult({
                        item: "Sony Headphones",
                        price: 650,
                        category: "Shopping",
                        ...data
                    });
                    setAnalyzing(false);
                })
                .catch(err => {
                    console.error(err);
                    setAnalyzing(false);
                });
        }, 2000);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(15,23,42,0.92) 50%, rgba(212,175,55,0.15) 100%)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(1rem, 4vw, 2rem)',
            animation: 'fadeIn 0.3s ease-out',
            overflow: 'auto'
        }}>
            {/* Close Button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 'clamp(1rem, 3vw, 2rem)',
                    right: 'clamp(1rem, 3vw, 2rem)',
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: 'clamp(40px, 8vw, 48px)',
                    height: 'clamp(40px, 8vw, 48px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                aria-label="Close"
            >
                <X size={clamp(24, 6, 32)} />
            </button>

            {!scanResult ? (
                <div style={{
                    textAlign: 'center',
                    color: 'white',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-family)',
                        fontWeight: 300,
                        lineHeight: 1.2
                    }}>
                        Smart<span style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>Spend</span>
                    </h2>
                    <p style={{
                        marginBottom: 'clamp(2rem, 6vw, 4rem)',
                        opacity: 0.8,
                        letterSpacing: '0.05em',
                        fontSize: 'clamp(0.85rem, 2vw, 1rem)'
                    }}>
                        Scan product to analyze budget fit.
                    </p>

                    <div className="prompt-row" style={{
                        justifyContent: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <span className="context-chip" style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)'
                        }}>
                            Budget Guard
                        </span>
                        <span className="context-chip" style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)'
                        }}>
                            Real-time Alerts
                        </span>
                    </div>

                    <button
                        onClick={performMockScan}
                        disabled={analyzing}
                        style={{
                            width: 'clamp(180px, 40vw, 220px)',
                            height: 'clamp(180px, 40vw, 220px)',
                            borderRadius: '50%',
                            background: analyzing ? 'transparent' : 'black',
                            border: '2px solid var(--accent-gold)',
                            color: 'var(--accent-gold)',
                            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            boxShadow: analyzing ? '0 0 50px rgba(212, 175, 55, 0.4)' : '0 10px 40px rgba(0,0,0,0.5)',
                            transition: 'all 0.4s ease',
                            animation: analyzing ? 'pulse 1.5s infinite' : 'none',
                            textTransform: 'uppercase',
                            cursor: analyzing ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {analyzing ? 'Scanning...' : 'TAP TO SCAN'}
                    </button>
                </div>
            ) : (
                <div
                    className="card-float"
                    style={{
                        animation: 'slideUp 0.4s ease-out',
                        maxWidth: '500px',
                        width: '100%',
                        margin: 'auto'
                    }}
                >
                    {/* Scan Result Header */}
                    <div style={{
                        textAlign: 'center',
                        paddingBottom: '1.5rem',
                        borderBottom: '1px solid #f3f4f6'
                    }}>
                        <p style={{
                            color: '#9ca3af',
                            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                            marginBottom: '0.5rem'
                        }}>
                            Scanned Item
                        </p>
                        <h3 style={{
                            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                            margin: '0.5rem 0',
                            fontWeight: 700
                        }}>
                            {scanResult.item}
                        </h3>
                        <p style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                            fontWeight: 700,
                            color: '#1f2937'
                        }}>
                            ${scanResult.price}
                        </p>
                    </div>

                    {/* Result Content */}
                    <div style={{
                        padding: 'clamp(1.5rem, 4vw, 2rem) clamp(0.75rem, 2vw, 1rem)',
                        textAlign: 'center'
                    }}>
                        {scanResult.allowed ? (
                            <div style={{
                                color: 'var(--text-main)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    border: '2px solid #000',
                                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                                    borderRadius: '50%',
                                    color: '#000'
                                }}>
                                    <Check size={clamp(28, 6, 32)} />
                                </div>
                                <h3 style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    fontWeight: 700
                                }}>
                                    Safe to Buy
                                </h3>
                                <p style={{
                                    color: '#666',
                                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                                }}>
                                    This fits within your monthly budget.
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                color: 'var(--text-main)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    border: '2px solid #000',
                                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                                    borderRadius: '50%',
                                    color: '#000'
                                }}>
                                    <AlertTriangle size={clamp(28, 6, 32)} />
                                </div>
                                <h3 style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    fontWeight: 700
                                }}>
                                    Over Budget
                                </h3>
                                <p style={{
                                    color: '#666',
                                    fontWeight: 500,
                                    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)'
                                }}>
                                    {scanResult.alert}
                                </p>
                                <div style={{
                                    background: '#fafafa',
                                    border: '1px solid #eee',
                                    padding: 'clamp(0.85rem, 2vw, 1rem)',
                                    borderRadius: '1rem',
                                    marginTop: '0.5rem',
                                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                                    color: '#333',
                                    textAlign: 'left'
                                }}>
                                    <strong style={{ color: 'var(--accent-gold)' }}>Suggestion:</strong> {scanResult.suggestion}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{
                            marginTop: '1.5rem',
                            display: 'flex',
                            gap: '0.75rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                className="btn-secondary"
                                onClick={performMockScan}
                                style={{
                                    background: 'white',
                                    color: '#0f172a',
                                    flex: '1 1 120px'
                                }}
                            >
                                Rescan
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={onClose}
                                style={{
                                    background: '#0f172a',
                                    color: 'var(--accent-gold)',
                                    borderColor: 'var(--accent-gold)',
                                    flex: '1 1 120px'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse { 
                    0% { transform: scale(1); opacity: 1; } 
                    50% { transform: scale(1.05); opacity: 0.85; } 
                    100% { transform: scale(1); opacity: 1; } 
                }
                @keyframes slideUp { 
                    from { transform: translateY(50px); opacity: 0; } 
                    to { transform: translateY(0); opacity: 1; } 
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

// Helper function for responsive sizing
function clamp(min, vw, max) {
    return Math.max(min, Math.min(max, (vw * window.innerWidth) / 100));
}

export default SmartSpendView;
