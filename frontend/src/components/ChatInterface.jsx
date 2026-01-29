import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const STORAGE_KEY = 'twin-chat-history';

const ChatInterface = ({ initialPrompt = '', onPromptConsumed = () => {} }) => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: 'Hello! I am your Financial Digital Twin. Ask about spending, run simulations, or get budgeting advice.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatRef = useRef(null);

    const promptIdeas = [
        'Where can I cut 10% this month?',
        'How much can I invest without breaking my budget?',
        'Summarize my top 3 expenses.',
        'Project cash flow for next quarter.'
    ];

    // Auto-scroll effect
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // Load chat history
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.warn('Unable to read saved chat history');
            }
        }
    }, []);

    // Save chat history
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    const sendPrompt = async (text) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), type: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg.text })
            });

            const data = await response.json();
            const botMsg = { id: Date.now() + 1, type: 'bot', text: data.response, context: data.context };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error('Chat Error', err);
            const errorMsg = { id: Date.now() + 1, type: 'bot', text: 'Sorry, I am having trouble connecting to the financial brain right now.' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        await sendPrompt(input);
    };

    const handlePrompt = (text) => {
        setInput(text);
    };

    useEffect(() => {
        if (initialPrompt) {
            sendPrompt(initialPrompt);
            onPromptConsumed();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPrompt]);

    return (
        <div className="fade-in" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            maxHeight: '100%',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div className="header-curve" style={{ 
                padding: 'clamp(1.5rem, 4vw, 2rem) 1rem 1rem', 
                borderRadius: '0 0 2rem 2rem', 
                marginBottom: 0,
                flexShrink: 0
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ 
                        fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', 
                        fontWeight: 700 
                    }}>
                        AI Advisor
                    </h2>
                    <p style={{ 
                        opacity: 0.8, 
                        fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' 
                    }}>
                        Powered by IBM Granite
                    </p>
                </div>
            </div>

            {/* Chat Container */}
            <div className="main-content" style={{ 
                marginTop: '-1rem', 
                paddingTop: 0, 
                paddingBottom: '1rem',
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1,
                minHeight: 0,
                zIndex: 20,
                overflow: 'hidden'
            }}>
                <div className="card-float" style={{ 
                    flex: 1,
                    display: 'flex', 
                    flexDirection: 'column', 
                    margin: '0 auto', 
                    maxWidth: '880px',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    minHeight: 0
                }}>
                    {/* Messages Area */}
                    <div 
                        className="chat-shell" 
                        ref={chatRef} 
                        style={{ 
                            flex: 1,
                            overflowY: 'auto',
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Prompt Ideas */}
                        <div className="prompt-row" style={{ 
                            flexShrink: 0,
                            marginBottom: '1rem'
                        }}>
                            {promptIdeas.map((idea) => (
                                <button 
                                    key={idea} 
                                    className="prompt-btn" 
                                    onClick={() => handlePrompt(idea)}
                                >
                                    {idea}
                                </button>
                            ))}
                        </div>

                        {/* Messages */}
                        {messages.map((msg) => (
                            <div 
                                key={msg.id} 
                                className="message-row" 
                                style={{ 
                                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                    flexShrink: 0
                                }}
                            >
                                <div className={`message-bubble ${msg.type === 'user' ? 'message-user' : 'message-bot'}`}>
                                    <p style={{ margin: 0, wordBreak: 'break-word' }}>{msg.text}</p>
                                    {msg.context && msg.context.length > 0 && (
                                        <div style={{ 
                                            marginTop: '0.75rem', 
                                            display: 'flex', 
                                            gap: '0.5rem', 
                                            flexWrap: 'wrap' 
                                        }}>
                                            {msg.context.slice(0, 3).map((ctx, idx) => (
                                                <span key={idx} className="context-chip">{ctx}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="message-row" style={{ flexShrink: 0 }}>
                                <div className="message-bubble message-bot">
                                    <span 
                                        className="shimmer-text" 
                                        style={{
                                            background: 'linear-gradient(90deg, var(--text-secondary) 0%, #f0f0f0 50%, var(--text-secondary) 100%)',
                                            backgroundSize: '200% 100%',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent',
                                            animation: 'shimmer 1.5s infinite linear',
                                            fontSize: '0.85rem',
                                            display: 'block'
                                        }}
                                    >
                                        Thinking...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form 
                        onSubmit={handleSend} 
                        style={{ 
                            padding: 'clamp(0.75rem, 2vw, 1rem)', 
                            background: 'rgba(248,250,252,0.95)', 
                            borderTop: '1px solid var(--border)', 
                            backdropFilter: 'blur(10px)',
                            flexShrink: 0
                        }}
                    >
                        <div className="input-shell">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a financial question..."
                            />
                            <button type="submit" className="send-btn" disabled={loading}>
                                <Send size={20} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @media (min-width: 641px) {
                    .chat-shell {
                        padding: 1.25rem 1.75rem !important;
                    }
                }

                @media (min-width: 1024px) {
                    .chat-shell {
                        padding: 1.5rem 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ChatInterface;
