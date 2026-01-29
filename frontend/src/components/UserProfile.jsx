import React from 'react';
import { Shield, Target } from 'lucide-react';

const UserProfile = () => {
    const [profile, setProfile] = React.useState(null);

    React.useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => setProfile(data))
            .catch(err => console.error("Profile Fetch Error", err));
    }, []);

    if (!profile) {
        return (
            <div className="fade-in" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                color: 'var(--text-secondary)'
            }}>
                Loading profile...
            </div>
        );
    }

    return (
        <div className="fade-in" style={{
            padding: 'clamp(1.5rem, 4vw, 2rem)',
            paddingBottom: 'clamp(2rem, 5vw, 3rem)'
        }}>
            {/* Profile Header */}
            <header style={{
                marginBottom: 'clamp(2rem, 5vw, 3rem)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: 'clamp(80px, 18vw, 100px)',
                    height: 'clamp(80px, 18vw, 100px)',
                    borderRadius: '50%',
                    background: '#000',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                    fontWeight: 300,
                    margin: '0 auto clamp(1rem, 3vw, 1.5rem)',
                    border: '4px solid var(--accent-gold)'
                }}>
                    {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 style={{
                    fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
                    fontWeight: 700,
                    marginBottom: '0.5rem'
                }}>
                    {profile.name}
                </h2>
                <p style={{
                    color: '#666',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                }}>
                    Software Engineer
                </p>
            </header>

            {/* Profile Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'clamp(1.25rem, 3vw, 2rem)',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Financial Overview Card */}
                <div className="card-float" style={{
                    borderTop: '4px solid #000'
                }}>
                    <h3 style={{
                        marginBottom: '1.5rem',
                        fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)'
                    }}>
                        Financial Overview
                    </h3>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid #f3f4f6',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <span style={{
                                color: '#666',
                                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                            }}>
                                Income
                            </span>
                            <span style={{
                                fontWeight: 700,
                                fontSize: 'clamp(1.1rem, 2.5vw, 1.2rem)',
                                whiteSpace: 'nowrap'
                            }}>
                                ${profile.income}/mo
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: '1rem',
                            borderBottom: '1px solid #f3f4f6',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <span style={{
                                color: '#666',
                                fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                            }}>
                                Savings
                            </span>
                            <span style={{
                                fontWeight: 700,
                                fontSize: 'clamp(1.1rem, 2.5vw, 1.2rem)',
                                color: 'var(--accent-gold)',
                                whiteSpace: 'nowrap'
                            }}>
                                ${profile.savings}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Financial Health Card */}
                <div className="card-float" style={{
                    borderTop: '4px solid #000'
                }}>
                    <h3 style={{
                        marginBottom: '1.5rem',
                        fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)'
                    }}>
                        Financial Health
                    </h3>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        {/* Financial Score */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(1rem, 3vw, 1.5rem)'
                        }}>
                            <div style={{
                                padding: 'clamp(0.65rem, 2vw, 0.75rem)',
                                background: '#000',
                                borderRadius: '50%',
                                color: 'var(--accent-gold)',
                                flexShrink: 0
                            }}>
                                <Shield size={clamp(20, 5, 24)} />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <h4 style={{
                                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '0.25rem'
                                }}>
                                    Financial Score
                                </h4>
                                <p style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    fontWeight: 700,
                                    margin: 0
                                }}>
                                    780
                                    <span style={{
                                        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                                        fontWeight: 400,
                                        color: 'var(--accent-gold)',
                                        marginLeft: '0.5rem'
                                    }}>
                                        EXCELLENT
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Goals On Track */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'clamp(1rem, 3vw, 1.5rem)'
                        }}>
                            <div style={{
                                padding: 'clamp(0.65rem, 2vw, 0.75rem)',
                                background: '#000',
                                borderRadius: '50%',
                                color: 'var(--accent-gold)',
                                flexShrink: 0
                            }}>
                                <Target size={clamp(20, 5, 24)} />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <h4 style={{
                                    fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                                    color: '#666',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '0.25rem'
                                }}>
                                    Goals On Track
                                </h4>
                                <p style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    fontWeight: 700,
                                    margin: 0
                                }}>
                                    {profile.goals.length}
                                    <span style={{
                                        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                                        fontWeight: 400,
                                        marginLeft: '0.5rem'
                                    }}>
                                        ACTIVE
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Profile Sections (Optional) */}
            <div style={{
                marginTop: 'clamp(2rem, 5vw, 3rem)',
                maxWidth: '1200px',
                margin: 'clamp(2rem, 5vw, 3rem) auto 0'
            }}>
                <div className="card-float" style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h3 style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        color: 'rgba(255,255,255,0.9)'
                    }}>
                        Quick Stats
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{
                                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                                color: 'rgba(255,255,255,0.6)',
                                marginBottom: '0.5rem'
                            }}>
                                Active Goals
                            </div>
                            <div style={{
                                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                                fontWeight: 700,
                                color: 'var(--accent-gold)'
                            }}>
                                {profile.goals.length}
                            </div>
                        </div>
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <div style={{
                                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                                color: 'rgba(255,255,255,0.6)',
                                marginBottom: '0.5rem'
                            }}>
                                Monthly Income
                            </div>
                            <div style={{
                                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                                fontWeight: 700,
                                color: 'white'
                            }}>
                                ${profile.income}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (min-width: 641px) {
                    /* Tablet adjustments */
                }

                @media (min-width: 1024px) {
                    /* Desktop adjustments */
                }
            `}</style>
        </div>
    );
};

// Helper function for responsive icon sizing
function clamp(min, vw, max) {
    if (typeof window !== 'undefined') {
        return Math.max(min, Math.min(max, (vw * window.innerWidth) / 100));
    }
    return max;
}

export default UserProfile;
