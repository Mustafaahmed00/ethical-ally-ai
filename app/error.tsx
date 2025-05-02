'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Runtime error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">
                        We encountered an unexpected error. Please try again or return home.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => reset()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Try again
                        </button>
                        <Link
                            href="/"
                            className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 