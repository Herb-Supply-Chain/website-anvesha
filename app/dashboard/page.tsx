'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  LayoutDashboard,
  Sprout,
  Package,
  FlaskConical,
  Factory,
  Box,
  FileCheck,
  BarChart3,
  Settings,
  Search,
  Bell,
  Menu,
  Plus,
  ChevronDown,
  AlertCircle
} from 'lucide-react';

interface CollectionStats {
  total: number;
  weeklyChange: number;
}

interface Collection {
  id: string;
  date: string;
  herb: string;
  quantity: string;
  location: string;
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName] = useState('Ramesh Kumar');
  const [userRole] = useState('Farmer');

  // Dynamic stats data
  const [stats, setStats] = useState<CollectionStats[]>([
    { total: 45, weeklyChange: 5 },
    { total: 3, weeklyChange: 5 },
    { total: 40, weeklyChange: 5 },
    { total: 12, weeklyChange: 5 }
  ]);

  // Dynamic recent collections
  const [recentCollections, setRecentCollections] = useState<Collection[]>([
    {
      id: 'COL-001',
      date: '2024-12-04',
      herb: 'Ashwagandha',
      quantity: '50 kg',
      location: 'Rajasthan'
    }
  ]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: Sprout, label: 'Collection', href: '/dashboard/collection' },
    { icon: Package, label: 'Batches', href: '/dashboard/batches' },
    { icon: FlaskConical, label: 'Lab Testing', href: '/dashboard/lab-testing' },
    { icon: Box, label: 'Packaging', href: '/dashboard/packaging' },
    { icon: FileCheck, label: 'Compliance', href: '/dashboard/compliance' },
    { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 flex flex-col border-r border-gray-700`}>
        {/* Logo Section */}
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

        {/* User Profile */}
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

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 transition ${item.active
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Issue Notification */}
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-700 rounded-lg transition"
              >
                <Menu className="w-5 h-5 text-gray-300" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                <p className="text-sm text-gray-400">Welcome back, {userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-64 text-white placeholder-gray-400"
                />
              </div>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition relative">
                <Bell className="w-5 h-5 text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-3">{stat.total}</div>
                  <div className="text-sm text-gray-400 mb-1">Total</div>
                  <div className="text-sm text-gray-400 mb-2">Collections</div>
                  <div className="text-xs text-teal-400 font-medium">+{stat.weeklyChange} this week</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Collections */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Recent Collections</h3>
              <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Collection
              </button>
            </div>
            <div className="p-6">
              {recentCollections.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">ID</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Herb</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Quantity</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-300">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCollections.map((collection) => (
                        <tr key={collection.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                          <td className="py-4 px-4 text-sm font-medium text-white">{collection.id}</td>
                          <td className="py-4 px-4 text-sm text-gray-400">{collection.date}</td>
                          <td className="py-4 px-4 text-sm font-medium text-white">{collection.herb}</td>
                          <td className="py-4 px-4 text-sm text-gray-400">{collection.quantity}</td>
                          <td className="py-4 px-4 text-sm text-gray-400">{collection.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No collections yet. Click "New Collection" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}