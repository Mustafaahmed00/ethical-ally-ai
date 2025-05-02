import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Ethical Ally - Your AI Companion for Ethical Decision Making',
    description: 'Navigate complex ethical dilemmas with confidence using AI-powered guidance through different ethical frameworks.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navbar />
                <main>{children}</main>
            </body>
        </html>
    );
} 