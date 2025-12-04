'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Leaf, LayoutDashboard, Sprout, Package, FlaskConical, Box, FileCheck, BarChart3, Settings,
    Search, Bell, Menu, ChevronDown, AlertCircle, Factory, QrCode, User
} from 'lucide-react';

interface Batch {
    id: string;
    herbName: string;
    quantity: string;
    status: 'New' | 'In Progress' | 'Completed';
}

interface ProcessingStage {
    name: string;
    count: number;
    batches: Batch[];
}

export default function ProcessingPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userName] = useState('Ramesh Kumar');
    const [userRole] = useState('Processor');

    const [stages, setStages] = useState<ProcessingStage[]>([
        {
            name: 'Received',
            count: 6,
            batches: [
                { id: 'FARM-2025-ASH-001', herbName: 'Ashwagandha', quantity: '150kg', status: 'New' },
                { id: 'FARM-2025-ASH-001', herbName: 'Ashwagandha', quantity: '150kg', status: 'New' }
            ]
        },
        {
            name: 'Drying',
            count: 4,
            batches: [
                { id: 'FARM-2025-ASH-001', herbName: 'Tulsi', quantity: '200kg', status: 'In Progress' }
            ]
        },
        {
            name: 'Grinding',
            count: 4,
            batches: [
                { id: 'FARM-2025-ASH-001', herbName: 'Tulsi', quantity: '200kg', status: 'In Progress' }
            ]
        }
    ]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Sprout, label: 'Collection', href: '/dashboard/collection' },
        { icon: Package, label: 'Batches', href: '/dashboard/batches' },
        { icon: FlaskConical, label: 'Lab Testing', href: '/dashboard/lab-testing' },
        { icon: Factory, label: 'Processing', href: '/dashboard/processing', active: true },
        { icon: Box, label: 'Packaging', href: '/dashboard/packaging' },
        { icon: FileCheck, label: 'Compliance', href: '/dashboard/compliance' },
        { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-purple-500 text-white';
            case 'In Progress': return 'bg-orange-500 text-white';
            case 'Completed': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const generateQRCode = () => {
        alert('QR Code generated!\n\nQR Code contains:\n- Processing stage data\n- Batch information\n- Quality parameters\n- Traceability chain');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Sidebar */}
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
                            <User className="w-5 h-5" />
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
                {/* Header */}
                <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Leaf className="w-6 h-6" />
                        <div>
                            <h1 className="text-sm font-bold">Government of India | भारत सरकार</h1>
                            <p className="text-xs text-teal-100">Ministry of AYUSH | आयुष मंत्रालय</p>
                        </div>
                    </div>
                </header>

                {/* Dashboard Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Processor Dashboard</h2>
                                <p className="text-sm text-gray-600">Batch Processing Overview</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-64 text-gray-900 placeholder-gray-400" />
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 h-32"></div>
                        ))}
                    </div>

                    {/* Batch Processing Pipeline */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Batch Processing pipeline</h3>
                        <p className="text-sm text-gray-600 mb-6">Track batches through processing stages</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stages.map((stage) => (
                                <div key={stage.name} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Factory className="w-5 h-5 text-teal-600" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                                            <p className="text-sm text-gray-600">{stage.count} batches</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        {stage.batches.map((batch, idx) => (
                                            <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                                                <p className="text-xs text-gray-600 mb-1">{batch.id}</p>
                                                <p className="font-semibold text-gray-900 mb-1">{batch.herbName}</p>
                                                <p className="text-sm text-gray-600 mb-2">{batch.quantity}</p>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                                                    {batch.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                                        View All
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                            <button
                                onClick={generateQRCode}
                                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
                            >
                                <QrCode className="w-4 h-4" />
                                Generate QR code
                            </button>
                        </div>
                        <div className="h-32 bg-gray-50 rounded-lg"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}
