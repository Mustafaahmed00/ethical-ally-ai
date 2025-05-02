'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { scenarios } from '../../data/scenarios';

export default function ScenarioPage() {
    const params = useParams();
    const router = useRouter();
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const scenarioId = params?.id as string;
    const scenario = scenarios.find(s => s.id === scenarioId);

    if (!scenario) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Scenario Not Found</h1>
                    <Link href="/scenarios" className="text-indigo-600 hover:text-indigo-800">
                        Return to Scenarios
                    </Link>
                </div>
            </div>
        );
    }

    const handleSelectPrompt = (prompt: string) => {
        setSelectedPrompt(prompt);
    };

    const handleStartChat = async () => {
        if (selectedPrompt) {
            setIsLoading(true);

            try {
                // Store the prompt and domain in sessionStorage
                sessionStorage.setItem('selectedPrompt', selectedPrompt);
                sessionStorage.setItem('scenarioDomain', scenario.domain);

                // Pre-fetch the chat response before navigation
                // This ensures the API call has started before we navigate
                fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: selectedPrompt,
                        context: {
                            domain: scenario.domain
                        }
                    }),
                });

                // Add a small delay to ensure sessionStorage is set
                // before navigation occurs
                await new Promise(resolve => setTimeout(resolve, 100));

                // Navigate to chat page
                router.push('/chat');
            } catch (error) {
                console.error("Error preparing chat:", error);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-md">
                    <div className="mb-6">
                        <Link href="/scenarios" className="text-indigo-600 hover:text-indigo-800">
                            ← Back to Scenarios
                        </Link>
                    </div>

                    <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {scenario.domain}
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{scenario.title}</h1>
                    <p className="text-xl text-gray-600 mb-8">{scenario.description}</p>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Select a prompt to start:</h2>
                        <div className="space-y-3">
                            {scenario.prompts.map((prompt, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelectPrompt(prompt)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedPrompt === prompt
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                >
                                    {prompt}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleStartChat}
                        disabled={!selectedPrompt || isLoading}
                        className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center ${selectedPrompt && !isLoading
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="flex space-x-2 items-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                                    <span className="ml-2">Preparing Chat...</span>
                                </div>
                            </>
                        ) : (
                            'Start Chat with Selected Prompt'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
} 