'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Leaf, LayoutDashboard, Sprout, Package, FlaskConical, Box, FileCheck, BarChart3, Settings,
  Search, Bell, Menu, ChevronDown, AlertCircle, QrCode, ArrowLeft, Check, Printer, RefreshCw
} from 'lucide-react';

interface BatchForPackaging {
  id: string;
  herbName: string;
  quantity: string;
  date: string;
  selected: boolean;
}

interface PackageInfo {
  sourceFarm: string;
  processorBatch: string;
  herb: string;
  totalQuantity: string;
  packageSize: string;
  numberOfPackages: number;
}

interface GeneratedPackage {
  id: string;
  size: string;
  qrStatus: 'Printed' | 'Generated' | 'Pending';
  status: 'Applied' | 'Pending';
}

export default function PackagingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName] = useState('Ramesh Kumar');
  const [userRole] = useState('Packaging');

  const [batchesReady, setBatchesReady] = useState<BatchForPackaging[]>([
    { id: 'PROC-2025-ASH-001', herbName: 'Ashwagandha', quantity: '150kg', date: '2025-01-28', selected: true },
    { id: 'PROC-2025-ASH-001', herbName: 'Brahmi', quantity: '150kg', date: '2025-01-28', selected: false },
    { id: 'PROC-2025-ASH-001', herbName: 'Tulsi', quantity: '150kg', date: '2025-01-28', selected: false }
  ]);

  const [packageInfo, setPackageInfo] = useState<PackageInfo>({
    sourceFarm: 'FARM-2024-ASH-001',
    processorBatch: 'PROC-2024-ASH-001',
    herb: 'Ashwagandha Root Powder',
    totalQuantity: '150kg',
    packageSize: '25kg sacks',
    numberOfPackages: 6
  });

  const [qrConfig, setQrConfig] = useState({
    packageSize: '25kg',
    qrSize: 'Medium',
    qrColor: 'Primary'
  });

  const [generatedPackages, setGeneratedPackages] = useState<GeneratedPackage[]>([
    { id: 'PKG-2025-ASH-001-01', size: '25kg', qrStatus: 'Printed', status: 'Applied' },
    { id: 'PKG-2025-ASH-001-02', size: '25kg', qrStatus: 'Printed', status: 'Applied' },
    { id: 'PKG-2025-ASH-001-03', size: '25kg', qrStatus: 'Printed', status: 'Pending' },
    { id: 'PKG-2025-ASH-001-04', size: '25kg', qrStatus: 'Generated', status: 'Pending' },
    { id: 'PKG-2025-ASH-001-05', size: '25kg', qrStatus: 'Generated', status: 'Pending' },
    { id: 'PKG-2025-ASH-001-06', size: '25kg', qrStatus: 'Generated', status: 'Pending' }
  ]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Sprout, label: 'Collection', href: '/dashboard/collection' },
    { icon: Package, label: 'Batches', href: '/dashboard/batches' },
    { icon: FlaskConical, label: 'Lab Testing', href: '/dashboard/lab-testing' },
    { icon: Box, label: 'Packaging', href: '/dashboard/packaging', active: true },
    { icon: FileCheck, label: 'Compliance', href: '/dashboard/compliance' },
    { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
  ];

  const generateQRCodes = () => {
    alert('Generating QR codes for all packages...\n\nQR codes will contain:\n- Batch traceability\n- Product information\n- Lab test results\n- Processing data');
  };

  const printLabel = () => {
    alert('Printing package labels...');
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
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-4">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6" />
            <div>
              <h1 className="text-sm font-bold">Government of India | भारत सरकार</h1>
              <p className="text-xs text-teal-100">Ministry of AYUSH | आयुष मंत्रालय</p>
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back To Dashboard</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">QR Code & Packaging Module</h2>
          <p className="text-sm text-gray-600">Generate and manage package QR codes</p>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Batches Ready for Packaging */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Batches Ready for Packaging</h3>
                <div className="space-y-3">
                  {batchesReady.map((batch) => (
                    <div
                      key={batch.id}
                      className={`p-4 rounded-lg border-2 transition cursor-pointer ${batch.selected ? 'bg-teal-50 border-teal-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => {
                        setBatchesReady(batchesReady.map(b =>
                          b.id === batch.id ? { ...b, selected: !b.selected } : { ...b, selected: false }
                        ));
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">{batch.id}</p>
                          <p className="font-semibold text-gray-900">{batch.herbName}</p>
                          <p className="text-sm text-gray-600">{batch.quantity} | {batch.date}</p>
                        </div>
                        {batch.selected && <Check className="w-5 h-5 text-teal-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code Configuration */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">QR Code Configuration</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Package Size</label>
                    <select
                      value={qrConfig.packageSize}
                      onChange={(e) => setQrConfig({ ...qrConfig, packageSize: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    >
                      <option>25kg</option>
                      <option>50kg</option>
                      <option>100kg</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Size</label>
                    <div className="flex gap-2">
                      {['Small', 'Medium', 'Large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => setQrConfig({ ...qrConfig, qrSize: size })}
                          className={`flex-1 px-4 py-2 rounded-lg border transition ${qrConfig.qrSize === size
                              ? 'bg-teal-100 border-teal-500 text-teal-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Color</label>
                    <div className="flex gap-2">
                      {['Black', 'Primary', 'Secondary'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setQrConfig({ ...qrConfig, qrColor: color })}
                          className={`flex-1 px-4 py-2 rounded-lg border transition ${qrConfig.qrColor === color
                              ? 'bg-teal-100 border-teal-500 text-teal-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Batch Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Batch Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Source Farm</p>
                    <p className="text-sm font-semibold text-gray-900">{packageInfo.sourceFarm}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Processor Batch</p>
                    <p className="text-sm font-semibold text-gray-900">{packageInfo.processorBatch}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Herb</p>
                    <p className="text-sm font-semibold text-gray-900">{packageInfo.herb}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Quantity</p>
                    <p className="text-sm font-semibold text-gray-900">{packageInfo.totalQuantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Package Size</p>
                    <p className="text-sm font-semibold text-gray-900">{packageInfo.packageSize}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Number of Packages</p>
                    <p className="text-sm font-semibold text-gray-900">{packageInfo.numberOfPackages}</p>
                  </div>
                </div>
              </div>

              {/* Package Label Preview */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Package Label Preview</h3>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-300">
                    <QrCode className="w-20 h-20 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">{packageInfo.herb}</p>
                    <p className="text-xs text-gray-600 mb-1">Organic • AYUSH Certified</p>
                    <p className="text-xs text-gray-600 mb-1">Net Wt: 25kg</p>
                    <p className="text-xs text-gray-600 mb-1">Batch: {packageInfo.processorBatch}</p>
                    <p className="text-xs text-gray-600">Exp: 01/2026</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={generateQRCodes}
                    className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
                  >
                    Generate QR codes
                  </button>
                  <button
                    onClick={printLabel}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Packages */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Generated Packages</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Package ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">QR Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{pkg.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{pkg.size}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${pkg.qrStatus === 'Printed' ? 'bg-teal-100 text-teal-700' :
                            pkg.qrStatus === 'Generated' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                          }`}>
                          {pkg.qrStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${pkg.status === 'Applied' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="p-2 hover:bg-gray-100 rounded transition">
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}