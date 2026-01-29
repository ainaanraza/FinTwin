import React from 'react';

const FloatingParticles = () => {
    return (
        <>
            <div className="floating-particles">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${10 + Math.random() * 10}s`,
                        }}
                    />
                ))}
            </div>

            <style>{`
                .floating-particles {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }

                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: var(--accent-gradient);
                    opacity: 0.4;
                    animation: float linear infinite;
                    box-shadow: var(--accent-glow);
                }

                @keyframes float {
                    0% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.4;
                    }
                    90% {
                        opacity: 0.4;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(50px) scale(0.5);
                        opacity: 0;
                    }
                }

                @media (max-width: 640px) {
                    .particle {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
};

export default FloatingParticles;
