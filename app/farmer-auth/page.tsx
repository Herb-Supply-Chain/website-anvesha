'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, User, Phone, Lock, Mail } from 'lucide-react';

export default function FarmerAuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        farmerId: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: ''
    });

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login and redirect to dashboard
        window.location.href = '/dashboard';
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate registration and redirect to dashboard
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-3">
                    <Link href="/" className="flex items-center gap-3">
                        <Leaf className="w-8 h-8" />
                        <div>
                            <h1 className="text-lg font-bold">Government of India | www.gov.in</h1>
                            <p className="text-xs text-teal-100">Ministry of AYUSH | Farmer Portal</p>
                        </div>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Title Section */}
                    <div className="text-center py-8 px-6 border-b bg-gradient-to-br from-teal-50 to-white">
                        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-10 h-10 text-teal-700" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLogin ? 'Farmer Login' : 'Farmer Registration'}
                        </h2>
                        <p className="text-gray-600 text-sm">
                            {isLogin
                                ? 'Access your collection records and blockchain entries'
                                : 'Join the blockchain-based traceability system'}
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition ${isLogin
                                    ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition ${!isLogin
                                    ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Login Form */}
                    {isLogin && (
                        <form onSubmit={handleLogin} className="p-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Farmer ID / Mobile Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter your ID or mobile"
                                            value={formData.farmerId}
                                            onChange={(e) => setFormData({ ...formData, farmerId: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password / OTP
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-gray-600">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                                        Forgot password?
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
                                >
                                    Login to Dashboard
                                </button>

                                <p className="text-center text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(false)}
                                        className="text-teal-600 hover:text-teal-700 font-medium"
                                    >
                                        Register here
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* Registration Form */}
                    {!isLogin && (
                        <form onSubmit={handleRegister} className="p-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            placeholder="Enter 10-digit mobile number"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address (Optional)
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Create Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            placeholder="Re-enter password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                                    <p className="text-xs text-teal-800">
                                        <strong>Note:</strong> By registering, you agree to participate in the blockchain-based
                                        traceability system for Ayurvedic herbs. Your collection data will be recorded on an
                                        immutable ledger.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
                                >
                                    Create Account
                                </button>

                                <p className="text-center text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsLogin(true)}
                                        className="text-teal-600 hover:text-teal-700 font-medium"
                                    >
                                        Login here
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}
                </div>

                {/* Bottom Link */}
                <div className="text-center mt-6">
                    <Link href="/access-portal" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                        ← Back to Access Portal
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-teal-100">© 2024 Ministry of AYUSH, Government of India. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
