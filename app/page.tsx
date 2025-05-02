import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                        Ethical Ally
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Your AI companion for navigating complex ethical decisions with confidence and clarity.
                    </p>
                    <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <div className="rounded-md shadow">
                            <Link
                                href="/chat"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                            >
                                Start Chat
                            </Link>
                        </div>
                        <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                            <Link
                                href="/scenarios"
                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                            >
                                Browse Scenarios
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-3">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900">Healthcare</h3>
                        <p className="mt-2 text-gray-500">
                            Navigate complex medical ethics decisions with confidence.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900">Emergency Services</h3>
                        <p className="mt-2 text-gray-500">
                            Make critical decisions under pressure with ethical clarity.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900">Education</h3>
                        <p className="mt-2 text-gray-500">
                            Address academic integrity and ethical challenges in education.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
} 