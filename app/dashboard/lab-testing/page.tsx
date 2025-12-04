'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Leaf, LayoutDashboard, Sprout, Package, FlaskConical, Box, FileCheck, BarChart3, Settings,
  Search, Bell, Menu, ChevronDown, AlertCircle, User, Play, Download, QrCode
} from 'lucide-react';
import { useTraceability } from '@/app/context/TraceabilityContext';

interface Sample {
  id: string;
  batchId: string;
  herb: string;
  received: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  status: 'Pending' | 'Testing' | 'Completed';
}

export default function LabTestingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userName] = useState('Dr. Sharma');
  const [userRole] = useState('Lab Technician');

  // Get data from global context
  const { batches, labTests, updateLabTest, addLabTest } = useTraceability();

  // Create samples from batches that need testing
  const [samples, setSamples] = useState<Sample[]>([
    {
      id: 'SAMPLE-001',
      batchId: 'BATCH-001',
      herb: 'Ashwagandha',
      received: '2024-12-04',
      priority: 'High',
      assignedTo: 'Dr. Sharma',
      status: 'Completed'
    },
    {
      id: 'SAMPLE-002',
      batchId: 'BATCH-002',
      herb: 'Tulsi',
      received: '2024-12-04',
      priority: 'Medium',
      assignedTo: 'Dr. Patel',
      status: 'Testing'
    },
    {
      id: 'SAMPLE-003',
      batchId: 'BATCH-003',
      herb: 'Brahmi',
      received: '2024-12-03',
      priority: 'Low',
      assignedTo: 'Dr. Kumar',
      status: 'Pending'
    }
  ]);

  const [priorityFilter, setPriorityFilter] = useState('All Priorities');

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Sprout, label: 'Collection', href: '/dashboard/collection' },
    { icon: Package, label: 'Batches', href: '/dashboard/batches' },
    { icon: FlaskConical, label: 'Lab Testing', href: '/dashboard/lab-testing', active: true },
    { icon: Box, label: 'Processing', href: '/dashboard/processing' },
    { icon: Box, label: 'Packaging', href: '/dashboard/packaging' },
    { icon: FileCheck, label: 'Compliance', href: '/dashboard/compliance' },
    { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'Testing': return 'text-blue-600 bg-blue-50';
      case 'Pending': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const startTesting = (sampleId: string) => {
    // Update sample status to Testing
    setSamples(samples.map(s =>
      s.id === sampleId ? { ...s, status: 'Testing' } : s
    ));
    alert(`Started testing for ${sampleId}\n\nThis will:\n- Begin quality analysis\n- Track test progress\n- Update status in real-time`);
  };

  const completeTest = (sampleId: string, result: 'Passed' | 'Failed') => {
    const sample = samples.find(s => s.id === sampleId);
    if (!sample) return;

    // Update sample status
    setSamples(samples.map(s =>
      s.id === sampleId ? { ...s, status: 'Completed' } : s
    ));

    // Update lab test in global context - this will update Processing and Packaging pages
    const existingTest = labTests.find(t => t.batchId === sample.batchId);
    if (existingTest) {
      updateLabTest(existingTest.id, { result });
    }

    alert(`Test completed for ${sampleId}\n\nResult: ${result}\n\n✅ Updated globally:\n- Farmer Dashboard\n- Processing Page\n- Packaging Page\n- Consumer Portal`);
  };

  const downloadLabReport = (sampleId: string) => {
    alert(`Downloading Lab Report for ${sampleId}\n\nReport includes:\n- Soil quality analysis\n- Crop quality assessment\n- Pesticide test results\n- Climatic conditions\n- Test certification`);
  };

  const generateQRCode = (sampleId: string) => {
    alert(`QR Code generated for ${sampleId}\n\nQR Code contains:\n- Complete lab test data\n- Batch traceability\n- Test results\n- Certification details\n- Timestamp`);
  };

  const filteredSamples = priorityFilter === 'All Priorities'
    ? samples
    : samples.filter(s => s.priority === priorityFilter);

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
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
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
          <div className="flex items-center gap-3">
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
                <h2 className="text-2xl font-bold text-gray-900">Lab Testing Dashboard</h2>
                <p className="text-sm text-gray-600">Quality Testing & Certification</p>
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">Total Samples</p>
              <p className="text-3xl font-bold text-gray-900">{samples.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{samples.filter(s => s.status === 'Pending').length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">Testing</p>
              <p className="text-3xl font-bold text-blue-600">{samples.filter(s => s.status === 'Testing').length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{samples.filter(s => s.status === 'Completed').length}</p>
            </div>
          </div>

          {/* Sample Queue */}
          <div className="bg-white rounded-lg border-2 border-blue-400 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Sample Queue</h3>
              <div className="flex items-center gap-3">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-700"
                >
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sample ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Batch ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Herb</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Received</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assigned To</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSamples.map((sample) => (
                    <tr key={sample.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{sample.id}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{sample.batchId}</td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{sample.herb}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{sample.received}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(sample.priority)}`}>
                          {sample.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">{sample.assignedTo}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
                          {sample.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {sample.status === 'Pending' && (
                            <button
                              onClick={() => startTesting(sample.id)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                              title="Start Testing"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          {sample.status === 'Testing' && (
                            <>
                              <button
                                onClick={() => completeTest(sample.id, 'Passed')}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs"
                              >
                                Pass
                              </button>
                              <button
                                onClick={() => completeTest(sample.id, 'Failed')}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                              >
                                Fail
                              </button>
                            </>
                          )}
                          {sample.status === 'Completed' && (
                            <>
                              <button
                                onClick={() => downloadLabReport(sample.id)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                                title="Download Report"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => generateQRCode(sample.id)}
                                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition"
                                title="Generate QR"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
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