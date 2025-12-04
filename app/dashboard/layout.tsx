'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, Users, FlaskConical, Layers, Package, GitBranch, BarChart3, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Collector', href: '/dashboard/collector' },
    { icon: FlaskConical, label: 'Test Lab', href: '/dashboard/test-lab' },
    { icon: Layers, label: 'Lab Testing', href: '/dashboard/lab-testing' },
    { icon: Package, label: 'Processing', href: '/dashboard/processing' },
    { icon: Package, label: 'Packaging', href: '/dashboard/packaging' },
    { icon: GitBranch, label: 'Compliance', href: '/dashboard/compliance' },
    { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-teal-800 to-teal-900 text-white flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-teal-700">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h1 className="font-bold text-lg">ANVESHA</h1>
              <p className="text-xs text-teal-300">Blockchain Traceability</p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-teal-700">
          <div className="flex items-center gap-3 bg-teal-700 bg-opacity-50 rounded-lg p-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">RK</span>
            </div>
            <div className="flex-grow">
              <p className="text-sm font-semibold">Ramesh Kumar</p>
              <p className="text-xs text-teal-300">Processor</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3 transition ${
                  isActive
                    ? 'bg-teal-700 border-l-4 border-teal-400 text-white'
                    : 'text-teal-200 hover:bg-teal-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-teal-700">
          <p className="text-xs text-teal-300 text-center">© 2024 Ministry of AYUSH</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        {children}
      </main>
    </div>
  );
}