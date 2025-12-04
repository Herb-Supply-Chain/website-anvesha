'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Leaf, LayoutDashboard, Sprout, Package, FlaskConical, Box, FileCheck, BarChart3, Settings,
    Search, Bell, Menu, ChevronDown, AlertCircle, User, Lock, Globe, Palette, Save
} from 'lucide-react';

export default function SettingsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userName, setUserName] = useState('Ramesh Kumar');
    const [userRole] = useState('Farmer');
    const [email, setEmail] = useState('ramesh.kumar@example.com');
    const [phone, setPhone] = useState('+91 98765 43210');
    const [language, setLanguage] = useState('english');
    const [theme, setTheme] = useState('dark');

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Sprout, label: 'Collection', href: '/dashboard/collection' },
        { icon: Package, label: 'Batches', href: '/dashboard/batches' },
        { icon: FlaskConical, label: 'Lab Testing', href: '/dashboard/lab-testing' },
        { icon: Box, label: 'Packaging', href: '/dashboard/packaging' },
        { icon: FileCheck, label: 'Compliance', href: '/dashboard/compliance' },
        { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings', active: true }
    ];

    return (
        <div className="min-h-screen bg-gray-900 flex">
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 flex flex-col border-r border-gray-700`}>
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <Leaf className="w-8 h-8 text-teal-400" />
                        {isSidebarOpen && (
                            <div>
                                <h1 className="text-xl font-bold italic">anvesha</h1>
                                <p className="text-xs text-gray-400">Dashboard</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold">RK</span>
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{userName}</p>
                                <p className="text-xs text-gray-400">{userRole}</p>
                            </div>
                        )}
                        {isSidebarOpen && <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-400" />}
                    </div>
                </div>

                <nav className="flex-1 py-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-6 py-3 transition ${item.active ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {isSidebarOpen && (
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>1 Issue</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Ministry of AYUSH</p>
                    </div>
                )}
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-700 rounded-lg transition">
                                <Menu className="w-5 h-5 text-gray-300" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Settings</h2>
                                <p className="text-sm text-gray-400">Manage your account and preferences</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-64 text-white placeholder-gray-400" />
                            </div>
                            <button className="p-2 hover:bg-gray-700 rounded-lg transition relative">
                                <Bell className="w-5 h-5 text-gray-300" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-4xl space-y-6">
                        {/* Profile Settings */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-3">
                                <User className="w-5 h-5 text-teal-400" />
                                <h3 className="text-xl font-bold text-white">Profile Information</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-3">
                                <Lock className="w-5 h-5 text-teal-400" />
                                <h3 className="text-xl font-bold text-white">Security</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-gray-800 rounded-lg border border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-3">
                                <Palette className="w-5 h-5 text-teal-400" />
                                <h3 className="text-xl font-bold text-white">Preferences</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    >
                                        <option value="english">English</option>
                                        <option value="hindi">हिंदी (Hindi)</option>
                                        <option value="marathi">मराठी (Marathi)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                                    <select
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                                    >
                                        <option value="dark">Dark</option>
                                        <option value="light">Light</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition flex items-center gap-2">
                                <Save className="w-5 h-5" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
