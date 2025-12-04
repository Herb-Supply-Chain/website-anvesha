'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Leaf, LayoutDashboard, Sprout, Package, FlaskConical, Box, FileCheck, BarChart3, Settings,
    Search, Bell, Menu, Plus, ChevronDown, AlertCircle, QrCode
} from 'lucide-react';

interface Batch {
    id: string;
    herbName: string;
    quantity: string;
    collectionDate: string;
    batchDate: string;
    status: 'active' | 'completed' | 'processing';
    qrCode: string;
}

export default function BatchesPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userName] = useState('Ramesh Kumar');
    const [userRole] = useState('Farmer');

    const [batches, setBatches] = useState<Batch[]>([
        {
            id: 'BATCH-001',
            herbName: 'Ashwagandha',
            quantity: '150 kg',
            collectionDate: '2024-12-01',
            batchDate: '2024-12-04',
            status: 'completed',
            qrCode: 'QR-ASH-2024-001'
        },
        {
            id: 'BATCH-002',
            herbName: 'Tulsi',
            quantity: '90 kg',
            collectionDate: '2024-12-02',
            batchDate: '2024-12-04',
            status: 'processing',
            qrCode: 'QR-TUL-2024-002'
        },
        {
            id: 'BATCH-003',
            herbName: 'Neem',
            quantity: '120 kg',
            collectionDate: '2024-12-03',
            batchDate: '2024-12-04',
            status: 'active',
            qrCode: 'QR-NEM-2024-003'
        }
    ]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Sprout, label: 'Collection', href: '/dashboard/collection' },
        { icon: Package, label: 'Batches', href: '/dashboard/batches', active: true },
        { icon: FlaskConical, label: 'Lab Testing', href: '/dashboard/lab-testing' },
        { icon: Box, label: 'Packaging', href: '/dashboard/packaging' },
        { icon: FileCheck, label: 'Compliance', href: '/dashboard/compliance' },
        { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-900/30';
            case 'processing': return 'text-yellow-400 bg-yellow-900/30';
            case 'active': return 'text-blue-400 bg-blue-900/30';
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
                                <h2 className="text-2xl font-bold text-white">Batch Management</h2>
                                <p className="text-sm text-gray-400">Track and manage herb batches</p>
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
                                    <p className="text-gray-400 text-sm mb-1">Total Batches</p>
                                    <p className="text-3xl font-bold text-white">{batches.length}</p>
                                </div>
                                <Package className="w-12 h-12 text-teal-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Completed</p>
                                    <p className="text-3xl font-bold text-green-400">{batches.filter(b => b.status === 'completed').length}</p>
                                </div>
                                <QrCode className="w-12 h-12 text-green-400" />
                            </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm mb-1">Processing</p>
                                    <p className="text-3xl font-bold text-yellow-400">{batches.filter(b => b.status === 'processing').length}</p>
                                </div>
                                <Package className="w-12 h-12 text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg border border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">All Batches</h3>
                            <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                New Batch
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Batch ID</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Herb Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Quantity</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Collection Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Batch Date</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">QR Code</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {batches.map((batch) => (
                                            <tr key={batch.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                                <td className="py-4 px-4 text-sm font-medium text-white">{batch.id}</td>
                                                <td className="py-4 px-4 text-sm font-medium text-white">{batch.herbName}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{batch.quantity}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{batch.collectionDate}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{batch.batchDate}</td>
                                                <td className="py-4 px-4 text-sm text-gray-400">{batch.qrCode}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                                                        {batch.status}
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
