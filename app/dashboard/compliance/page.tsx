'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Leaf, LayoutDashboard, Sprout, Package, FlaskConical, Box, FileCheck, BarChart3, Settings,
    Search, Bell, Menu, Plus, ChevronDown, AlertCircle, Shield, CheckCircle
} from 'lucide-react';

interface ComplianceRecord {
    id: string;
    category: string;
    requirement: string;
    status: 'compliant' | 'non-compliant' | 'pending';
    lastChecked: string;
    nextReview: string;
}

export default function CompliancePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userName] = useState('Ramesh Kumar');
    const [userRole] = useState('Farmer');

    const [compliance, setCompliance] = useState<ComplianceRecord[]>([
        {
            id: 'COMP-001',
            category: 'Quality Standards',
            requirement: 'DNA Barcode Testing',
            status: 'compliant',
            lastChecked: '2024-12-04',
            nextReview: '2025-01-04'
        },
        {
            id: 'COMP-002',
            category: 'Safety',
            requirement: 'Pesticide Residue Test',
            status: 'compliant',
            lastChecked: '2024-12-03',
            nextReview: '2025-01-03'
        },
        {
            id: 'COMP-003',
            category: 'Documentation',
            requirement: 'Collection Records',
            status: 'pending',
            lastChecked: '2024-12-02',
            nextReview: '2024-12-09'
        }
    ]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Sprout, label: 'Collection', href: '/dashboard/collection' },
        { icon: Package, label: 'Batches', href: '/dashboard/batches' },
        { icon: FlaskConical, label: 'Lab Testing', href: '/dashboard/lab-testing' },
        { icon: Box, label: 'Packaging', href: '/dashboard/packaging' },
        { icon: FileCheck, label: 'Compliance', href: '/dashboard/compliance', active: true },
        { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'compliant': return 'text-green-400 bg-green-900/30';
            case 'non-compliant': return 'text-red-400 bg-red-900/30';
            case 'pending': return 'text-yellow-400 bg-yellow-900/30';
            default: return 'text-gray-400 bg-gray-900/30';
        }
    };

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
                                <h2 className="text-2xl font-bold text-white">Compliance</h2>
                                <p className="text-sm text-gray-400">Regulatory compliance tracking</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Total Checks</p>
                                    <p className="text-3xl font-bold text-white">{compliance.length}</p>
                                </div>
                                <Shield className="w-12 h-12 text-teal-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Compliant</p>
                                    <p className="text-3xl font-bold text-green-400">{compliance.filter(c => c.status === 'compliant').length}</p>
                                </div>
                                <CheckCircle className="w-12 h-12 text-green-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-400">{compliance.filter(c => c.status === 'pending').length}</p>
                                </div>
                                <AlertCircle className="w-12 h-12 text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg border border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Compliance Records</h3>
                            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                New Check
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Category</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Requirement</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Last Checked</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Next Review</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {compliance.map((record) => (
                                            <tr key={record.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                                <td className="py-4 px-4 text-sm font-medium text-white">{record.id}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{record.category}</td>
                                                <td className="py-4 px-4 text-sm font-medium text-white">{record.requirement}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{record.lastChecked}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{record.nextReview}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
