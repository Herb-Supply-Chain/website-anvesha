'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Factory, Lock, Mail } from 'lucide-react';

export default function ProcessorAuthPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.endsWith('@process.in')) {
            setError('Please use a valid processor email address ending with @process.in');
            return;
        }

        if (!password) {
            setError('Please enter your password');
            return;
        }

        router.push('/dashboard/processing');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-4 rounded-t-lg">
                    <Link href="/" className="flex items-center gap-3 mb-2">
                        <Leaf className="w-6 h-6" />
                        <div>
                            <h1 className="text-sm font-bold">Government of India | भारत सरकार</h1>
                            <p className="text-xs text-teal-100">Ministry of AYUSH | आयुष मंत्रालय</p>
                        </div>
                    </Link>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-b-lg p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
                            <Factory className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Processor Login</h2>
                        <p className="text-gray-400 text-sm">Access processing and manufacturing operations</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Processor Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="username@process.in"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Email must end with @process.in</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition shadow-md"
                        >
                            Login to Processor Portal
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/stakeholder-portal" className="text-teal-400 hover:text-teal-300 text-sm">
                            ← Back to Stakeholder Portal
                        </Link>
                    </div>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">
                    <p>For processor access, contact your administrator</p>
                </div>
            </div>
        </div>
    );
}
