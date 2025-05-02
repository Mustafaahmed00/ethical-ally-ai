import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-6">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        href="/"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/chat"
                        className="px-4 py-2 bg-white border border-indigo-300 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                        Go to Chat
                    </Link>
                </div>
            </div>
        </div>
    );
} 