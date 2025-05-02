'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-indigo-600">Ethical Ally</span>
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <Link
                            href="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/chat"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/chat'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600'
                                }`}
                        >
                            Chat
                        </Link>
                        <Link
                            href="/scenarios"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/scenarios' || pathname.startsWith('/scenario/')
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600'
                                }`}
                        >
                            Scenarios
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
} 