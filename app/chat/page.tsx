'use client';

import ChatInterface from '../components/ChatInterface';
import { useEffect, useState } from 'react';

export default function ChatPage() {
    const [isClient, setIsClient] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // This ensures hydration issues don't occur
    useEffect(() => {
        setIsClient(true);

        // Add a small delay to ensure everything is properly loaded
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 flex items-center justify-center">
                <div className="p-4 bg-white rounded-lg shadow-md">
                    <div className="animate-pulse flex space-x-2">
                        <div className="rounded-full bg-indigo-200 h-3 w-3 animate-bounce"></div>
                        <div className="rounded-full bg-indigo-200 h-3 w-3 animate-bounce delay-100"></div>
                        <div className="rounded-full bg-indigo-200 h-3 w-3 animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-indigo-100">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Ethical Ally Chat
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Discuss your ethical dilemmas and get guidance through different ethical frameworks.
                        </p>
                    </div>
                    {isReady && <ChatInterface key="chat-interface" />}
                </div>
            </div>
        </div>
    );
} 