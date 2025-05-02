'use client';

import { useState } from 'react';
import Link from 'next/link';
import { scenarios } from '../data/scenarios';

export default function ScenariosPage() {
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

    const domains = [
        { id: 'HEALTHCARE', name: 'Healthcare' },
        { id: 'EMERGENCY', name: 'Emergency Services' },
        { id: 'EDUCATION', name: 'Education' },
        { id: 'GENERAL', name: 'General' },
    ];

    const filteredScenarios = selectedDomain
        ? scenarios.filter((scenario) => scenario.domain === selectedDomain)
        : scenarios;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Ethical Scenarios
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Browse through common ethical dilemmas in different fields
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <button
                        onClick={() => setSelectedDomain(null)}
                        className={`px-4 py-2 rounded-md ${selectedDomain === null
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                    >
                        All
                    </button>
                    {domains.map((domain) => (
                        <button
                            key={domain.id}
                            onClick={() => setSelectedDomain(domain.id)}
                            className={`px-4 py-2 rounded-md ${selectedDomain === domain.id
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-800'
                                }`}
                        >
                            {domain.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScenarios.map((scenario) => (
                        <div
                            key={scenario.id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="inline-block px-2 py-1 mb-4 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                {scenario.domain}
                            </div>
                            <h2 className="text-xl font-semibold mb-2">{scenario.title}</h2>
                            <p className="text-gray-600 mb-4">{scenario.description}</p>
                            <Link
                                href={`/scenario/${scenario.id}`}
                                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Explore Scenario
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 