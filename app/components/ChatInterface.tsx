'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/chat';

export default function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [domain, setDomain] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialLoadComplete = useRef(false);

    // Ensure component is fully mounted
    useEffect(() => {
        setIsReady(true);
    }, []);

    // Load prompt from session storage if available
    useEffect(() => {
        if (initialLoadComplete.current) return;
        initialLoadComplete.current = true;

        // Delay to ensure client-side hydration has completed
        setTimeout(() => {
            const storedPrompt = sessionStorage.getItem('selectedPrompt');
            const storedDomain = sessionStorage.getItem('scenarioDomain');

            if (storedPrompt) {
                // Set the input field
                setInput(storedPrompt);

                // Clear the stored prompt so it doesn't persist across page reloads
                sessionStorage.removeItem('selectedPrompt');

                // Auto-submit the stored prompt after a short delay
                const timer = setTimeout(() => {
                    const userMessage: ChatMessage = {
                        role: 'user',
                        content: storedPrompt,
                        timestamp: new Date(),
                    };

                    setMessages([userMessage]);
                    setInput('');
                    setIsLoading(true);

                    // Make API call with the stored prompt
                    fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: storedPrompt,
                            context: {
                                domain: storedDomain
                            }
                        }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            // Create assistant message with formatted content
                            const aiMessage: ChatMessage = {
                                role: 'assistant',
                                content: formatAIResponse(data.response),
                                timestamp: new Date(),
                                isHtml: true
                            };

                            setMessages(prev => [...prev, aiMessage]);

                            // Display ethical frameworks if provided
                            if (data.suggestedFrameworks && data.suggestedFrameworks.length > 0) {
                                const frameworkMessage: ChatMessage = {
                                    role: 'assistant',
                                    content: `<div class="frameworks-container">
                                    <h4 class="frameworks-title">Relevant Ethical Frameworks</h4>
                                    <ul class="frameworks-list">
                                        ${data.suggestedFrameworks.map((framework: string) =>
                                        `<li class="framework-item">${framework}</li>`
                                    ).join('')}
                                    </ul>
                                </div>`,
                                    timestamp: new Date(),
                                    isFramework: true
                                };

                                setMessages(prev => [...prev, frameworkMessage]);
                            }

                            // Display follow-up questions if provided
                            if (data.followUpQuestions && data.followUpQuestions.length > 0) {
                                const questionsMessage: ChatMessage = {
                                    role: 'assistant',
                                    content: `<div class="questions-container">
                                        <h4 class="questions-title">Questions to Consider</h4>
                                        <ul class="questions-list">
                                            ${data.followUpQuestions.map((question: string, index: number) =>
                                        `<li class="question-item">
                                            <button class="question-button" data-question="${encodeURIComponent(question)}" data-question-id="${index}">
                                                ${question.replace(/'/g, "&apos;")}
                                            </button>
                                        </li>`
                                    ).join('')}
                                        </ul>
                                    </div>`,
                                    timestamp: new Date(),
                                    isFramework: true
                                };

                                setMessages(prev => [...prev, questionsMessage]);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            setMessages(prev => [
                                ...prev,
                                {
                                    role: 'assistant',
                                    content: 'Sorry, I encountered an error. Please try again.',
                                    timestamp: new Date(),
                                },
                            ]);
                        })
                        .finally(() => {
                            setIsLoading(false);
                        });
                }, 300);

                return () => clearTimeout(timer);
            }

            if (storedDomain) {
                setDomain(storedDomain);
                sessionStorage.removeItem('scenarioDomain');
            }
        }, 0);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add event listener for follow-up question clicks
    useEffect(() => {
        const handleQuestionClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('question-button')) {
                const question = target.getAttribute('data-question');
                if (question) {
                    setInput(decodeURIComponent(question));
                    const chatInput = document.getElementById('chat-input');
                    if (chatInput) {
                        chatInput.focus();
                    }
                }
            }
        };

        document.addEventListener('click', handleQuestionClick);

        return () => {
            document.removeEventListener('click', handleQuestionClick);
        };
    }, []);

    // Function to format AI responses with better visual structure
    function formatAIResponse(response: string): string {
        // Split the response into sections (assuming sections start with headers like "1. Rights-Based Ethics:")
        const sections = response.split(/\*\*\d+\.\s([^:]+):\*\*/g).filter(Boolean);

        if (sections.length <= 1) {
            // If no clear sections detected, apply basic formatting
            return `<div class="ai-response">
                ${response.replace(/\n\n/g, '</p><p>')
                    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                    .replace(/\n\*\s/g, '<br/><li class="ml-4 my-1">')
                    .replace(/\n-\s/g, '<br/><li class="ml-4 my-1">')}
            </div>`;
        }

        // Process the header and sections
        let formattedContent = '<div class="ai-response">';

        // First section is usually an intro
        formattedContent += `<p class="mb-4">${sections[0]}</p>`;

        // Process remaining sections in pairs (title and content)
        for (let i = 1; i < sections.length; i += 2) {
            const title = sections[i];
            const content = sections[i + 1] || '';

            formattedContent += `
                <div class="framework-box my-4 p-4 rounded-lg border border-indigo-200 bg-indigo-50/50">
                    <h3 class="font-semibold text-indigo-800 mb-2">${title}</h3>
                    <div>
                        ${content.split(/\*\s([^:]+):\*\s/).map((part, index) => {
                if (index % 2 === 0) return part;
                return `<h4 class="font-medium text-indigo-700 mt-2">${part}</h4>`;
            }).join('')
                    .replace(/\*\s([^*]+)\*/g, '<strong>$1</strong>')
                    .replace(/\n\*\s/g, '<br/><li class="ml-4 my-1">')
                    .replace(/\n-\s/g, '<br/><li class="ml-4 my-1">')}
                    </div>
                </div>
            `;
        }

        // Add a section for tensions if it exists
        const tensionsMatch = response.match(/\*\*Tensions and Contradictions:\*\*([^*]+)/);
        if (tensionsMatch) {
            formattedContent += `
                <div class="tensions-box my-4 p-4 rounded-lg border border-amber-200 bg-amber-50/50">
                    <h3 class="font-semibold text-amber-800 mb-2">Tensions and Contradictions</h3>
                    <p>${tensionsMatch[1]}</p>
                </div>
            `;
        }

        // Add a section for factors to consider if it exists
        const factorsMatch = response.match(/\*\*Factors to Consider:\*\*([^*]+)/);
        if (factorsMatch) {
            formattedContent += `
                <div class="factors-box my-4 p-4 rounded-lg border border-emerald-200 bg-emerald-50/50">
                    <h3 class="font-semibold text-emerald-800 mb-2">Factors to Consider</h3>
                    <ul class="list-disc pl-5">
                        ${factorsMatch[1].split(/\n\*\s/).filter(Boolean).map(item =>
                `<li class="my-1">${item}</li>`
            ).join('')}
                    </ul>
                </div>
            `;
        }

        // Add conclusion if it exists
        const lastParagraphMatch = response.match(/This is a profoundly difficult decision.+$/);
        if (lastParagraphMatch) {
            formattedContent += `
                <div class="conclusion-box my-4 p-4 rounded-lg border border-gray-200 bg-white">
                    <p class="text-gray-700">${lastParagraphMatch[0]}</p>
                </div>
            `;
        }

        formattedContent += '</div>';
        return formattedContent;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    context: {
                        domain: domain as 'HEALTHCARE' | 'EMERGENCY' | 'EDUCATION' | 'GENERAL' | null
                    }
                }),
            });

            const data = await response.json();

            // Create assistant message with formatted content
            const aiMessage: ChatMessage = {
                role: 'assistant',
                content: formatAIResponse(data.response),
                timestamp: new Date(),
                isHtml: true
            };

            setMessages((prev) => [...prev, aiMessage]);

            // Display ethical frameworks as a system message if provided
            if (data.suggestedFrameworks && data.suggestedFrameworks.length > 0) {
                const frameworkMessage: ChatMessage = {
                    role: 'assistant',
                    content: `<div class="frameworks-container">
                        <h4 class="frameworks-title">Relevant Ethical Frameworks</h4>
                        <ul class="frameworks-list">
                            ${data.suggestedFrameworks.map((framework: string) =>
                        `<li class="framework-item">${framework}</li>`
                    ).join('')}
                        </ul>
                    </div>`,
                    timestamp: new Date(),
                    isFramework: true
                };

                setMessages((prev) => [...prev, frameworkMessage]);
            }

            // Display follow-up questions if provided
            if (data.followUpQuestions && data.followUpQuestions.length > 0) {
                const questionsMessage: ChatMessage = {
                    role: 'assistant',
                    content: `<div class="questions-container">
                        <h4 class="questions-title">Questions to Consider</h4>
                        <ul class="questions-list">
                            ${data.followUpQuestions.map((question: string, index: number) =>
                        `<li class="question-item">
                            <button class="question-button" data-question="${encodeURIComponent(question)}" data-question-id="${index}">
                                ${question.replace(/'/g, "&apos;")}
                            </button>
                        </li>`
                    ).join('')}
                        </ul>
                    </div>`,
                    timestamp: new Date(),
                    isFramework: true
                };

                setMessages((prev) => [...prev, questionsMessage]);
            }

        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-gradient-to-b from-indigo-50 to-blue-50">
            {domain && (
                <div className="px-4 py-3 bg-indigo-100 border-b border-indigo-200 text-sm text-indigo-700 font-medium flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Context: <span className="font-semibold">{domain}</span></span>
                </div>
            )}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {!isReady ? (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-indigo-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Ethical Ally</h3>
                            <p className="text-gray-600 mb-6">
                                I'll help you navigate complex ethical dilemmas by exploring different ethical frameworks and perspectives.
                            </p>
                            <div className="text-left text-sm text-gray-500 bg-indigo-50/70 p-4 rounded-md">
                                <p className="font-medium text-gray-700 mb-2">I can help you with:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Exploring multiple ethical viewpoints</li>
                                    <li>Comparing different ethical frameworks</li>
                                    <li>Identifying key stakeholders and considerations</li>
                                    <li>Formulating thoughtful ethical reasoning</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${message.role === 'user'
                                    ? 'bg-indigo-600 text-white'
                                    : message.isFramework
                                        ? 'bg-amber-50/90 backdrop-blur-sm border border-amber-100 text-gray-800'
                                        : 'bg-white/90 backdrop-blur-sm border border-indigo-100 text-gray-800'
                                    }`}
                            >
                                {message.isFramework || message.isHtml ? (
                                    <div dangerouslySetInnerHTML={{ __html: message.content }} className={message.isFramework ? "frameworks-wrapper" : "formatted-response"} />
                                ) : (
                                    <>
                                        <p className={`text-base leading-relaxed ${message.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                                            {message.content}
                                        </p>
                                        <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                            {message.timestamp.toLocaleTimeString()}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>
            <div className="p-4 border-t border-indigo-100 bg-white/80 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        id="chat-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your ethical question or dilemma here..."
                        className="flex-1 p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 text-gray-700"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                            }`}
                    >
                        {isLoading ? 'Thinking...' : 'Send'}
                    </button>
                </form>
            </div>

            <style jsx global>{`
                .frameworks-container {
                    margin-bottom: 0.5rem;
                }
                
                .frameworks-title {
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: #4f46e5;
                    font-size: 0.875rem;
                }
                
                .frameworks-list {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                }
                
                .framework-item {
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                }

                .questions-container {
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .questions-title {
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    color: #4f46e5;
                    font-size: 0.875rem;
                }
                
                .questions-list {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .question-item {
                    margin-bottom: 0.25rem;
                }
                
                .question-button {
                    text-align: left;
                    background-color: rgba(79, 70, 229, 0.1);
                    border: 1px solid rgba(79, 70, 229, 0.2);
                    color: #4338ca;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                    transition: all 0.2s;
                    width: 100%;
                    cursor: pointer;
                }
                
                .question-button:hover {
                    background-color: rgba(79, 70, 229, 0.2);
                }

                /* Formatted response styles */
                .formatted-response {
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .ai-response p {
                    margin-bottom: 1rem;
                }

                .framework-box, .tensions-box, .factors-box, .conclusion-box {
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    transition: all 0.2s;
                }

                .framework-box:hover, .tensions-box:hover, .factors-box:hover, .conclusion-box:hover {
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }

                .framework-box h3, .tensions-box h3, .factors-box h3 {
                    font-size: 1.1rem;
                }

                .framework-box h4 {
                    font-size: 0.95rem;
                }

                .ai-response li {
                    margin: 0.5rem 0;
                    list-style-type: disc;
                    margin-left: 1.5rem;
                }

                .ai-response strong {
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
} 