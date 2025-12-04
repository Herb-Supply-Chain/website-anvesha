'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Leaf, LayoutDashboard, Sprout, Package, FlaskConical, Box, FileCheck, BarChart3, Settings,
    Search, Bell, Menu, ChevronDown, AlertCircle, TrendingUp, Download
} from 'lucide-react';

export default function ReportsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userName] = useState('Ramesh Kumar');
    const [userRole] = useState('Farmer');

    const [reports] = useState([
        { name: 'Monthly Collection Report', date: '2024-12-01', type: 'Collection', size: '2.4 MB' },
        { name: 'Quality Test Summary', date: '2024-11-30', type: 'Lab Testing', size: '1.8 MB' },
        { name: 'Compliance Audit', date: '2024-11-28', type: 'Compliance', size: '3.2 MB' },
        { name: 'Batch Processing Report', date: '2024-11-25', type: 'Batches', size: '2.1 MB' }
    ]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Sprout, label: 'Collection', href: '/dashboard/collection' },
        { icon: Package, label: 'Batches', href: '/dashboard/batches' },
        { icon: FlaskConical, label: 'Lab Testing', href: '/dashboard/lab-testing' },
        { icon: Box, label: 'Packaging', href: '/dashboard/packaging' },
        { icon: FileCheck, label: 'Compliance', href: '/dashboard/compliance' },
        { icon: BarChart3, label: 'Reports', href: '/dashboard/reports', active: true },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
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
                                <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
                                <p className="text-sm text-gray-400">View and download reports</p>
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
                    {/* Analytics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-gray-400 text-sm">Total Collections</p>
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">145</p>
                            <p className="text-xs text-green-400">+12% from last month</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-gray-400 text-sm">Batches Processed</p>
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">48</p>
                            <p className="text-xs text-green-400">+8% from last month</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-gray-400 text-sm">Tests Completed</p>
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">96</p>
                            <p className="text-xs text-green-400">+15% from last month</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-gray-400 text-sm">Compliance Rate</p>
                                <TrendingUp className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">98%</p>
                            <p className="text-xs text-green-400">+2% from last month</p>
                        </div>
                    </div>

                    {/* Available Reports */}
                    <div className="bg-gray-800 rounded-lg border border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-700">
                            <h3 className="text-xl font-bold text-white">Available Reports</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {reports.map((report, index) => (
                                    <div key={index} className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                                                <BarChart3 className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">{report.name}</h4>
                                                <p className="text-sm text-gray-400">{report.type} • {report.date} • {report.size}</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
