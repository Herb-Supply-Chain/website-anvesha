'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Batch } from '@/lib/types/batch'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface PendingUser {
    id: string
    name: string
    email: string
    role: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
}

export default function AdminPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('users')
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
    const [allBatches, setAllBatches] = useState<Batch[]>([])
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingUsers: 0,
        totalBatches: 0,
        approvedBatches: 0,
        rejectedBatches: 0,
        inTestingBatches: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        setIsLoading(true)
        try {
            // Load pending users
            const usersResponse = await axios.get(`${API_URL}/users`)
            const users = usersResponse.data
            setPendingUsers(users.filter((u: PendingUser) => u.status === 'PENDING'))

            // Load all batches
            const batchesResponse = await axios.get(`${API_URL}/batches`)
            const batches = batchesResponse.data
            setAllBatches(batches)

            // Calculate stats
            setStats({
                totalUsers: users.length,
                pendingUsers: users.filter((u: PendingUser) => u.status === 'PENDING').length,
                totalBatches: batches.length,
                approvedBatches: batches.filter((b: Batch) => b.status === 'approved').length,
                rejectedBatches: batches.filter((b: Batch) => b.status === 'rejected').length,
                inTestingBatches: batches.filter((b: Batch) => b.labStatus === 'in_progress').length
            })
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUserApproval = async (userId: string, approve: boolean) => {
        try {
            await axios.patch(`${API_URL}/users`, {
                id: userId,
                status: approve ? 'APPROVED' : 'REJECTED'
            })

            alert(approve ? '✅ User approved successfully!' : '❌ User rejected')
            await loadDashboardData()
        } catch (error) {
            console.error('Error updating user status:', error)
            alert('Failed to update user status')
        }
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'users', label: 'User Approvals', icon: '👥' },
        { id: 'batches', label: 'All Batches', icon: '📦' },
        { id: 'lab', label: 'Lab Overview', icon: '🧬' },
        { id: 'manufacturing', label: 'Manufacturing', icon: '🏭' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-[#01aeae] text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <span className="text-3xl">👑</span>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">ADMIN PORTAL</div>
                                <div className="text-sm opacity-90">Complete System Management</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm opacity-90">Logged in as</div>
                            <div className="font-semibold">Administrator</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${activeTab === tab.id
                                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="text-4xl mb-2">👥</div>
                                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                                <div className="text-blue-100 mt-1">Total Users</div>
                                {stats.pendingUsers > 0 && (
                                    <div className="mt-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                                        {stats.pendingUsers} Pending Approval
                                    </div>
                                )}
                            </div>

                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="text-4xl mb-2">📦</div>
                                <div className="text-3xl font-bold">{stats.totalBatches}</div>
                                <div className="text-emerald-100 mt-1">Total Batches</div>
                                <div className="mt-3 text-sm">
                                    <span className="bg-white/20 px-2 py-1 rounded">✓ {stats.approvedBatches} Approved</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                                <div className="text-4xl mb-2">🧬</div>
                                <div className="text-3xl font-bold">{stats.inTestingBatches}</div>
                                <div className="text-purple-100 mt-1">In Lab Testing</div>
                                <div className="mt-3 text-sm">
                                    <span className="bg-white/20 px-2 py-1 rounded">❌ {stats.rejectedBatches} Rejected</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg hover:shadow-md transition-all"
                                >
                                    <div className="text-3xl mb-2">👥</div>
                                    <div className="font-semibold text-gray-900">Approve Users</div>
                                    <div className="text-sm text-gray-600 mt-1">{stats.pendingUsers} pending</div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('batches')}
                                    className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg hover:shadow-md transition-all"
                                >
                                    <div className="text-3xl mb-2">📦</div>
                                    <div className="font-semibold text-gray-900">View Batches</div>
                                    <div className="text-sm text-gray-600 mt-1">{stats.totalBatches} total</div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('lab')}
                                    className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg hover:shadow-md transition-all"
                                >
                                    <div className="text-3xl mb-2">🧬</div>
                                    <div className="font-semibold text-gray-900">Lab Status</div>
                                    <div className="text-sm text-gray-600 mt-1">{stats.inTestingBatches} testing</div>
                                </button>

                                <button
                                    onClick={() => setActiveTab('manufacturing')}
                                    className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg hover:shadow-md transition-all"
                                >
                                    <div className="text-3xl mb-2">🏭</div>
                                    <div className="font-semibold text-gray-900">Manufacturing</div>
                                    <div className="text-sm text-gray-600 mt-1">View all</div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Approvals Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Pending User Approvals</h2>
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold">
                                {pendingUsers.length} Pending
                            </span>
                        </div>

                        {pendingUsers.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                                <p className="text-gray-600">No pending user approvals at this time</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingUsers.map((user) => (
                                    <div key={user.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                                                        <p className="text-sm text-gray-600">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                                        {user.role}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        Requested: {new Date(user.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleUserApproval(user.id, true)}
                                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-md"
                                                >
                                                    ✓ Approve
                                                </button>
                                                <button
                                                    onClick={() => handleUserApproval(user.id, false)}
                                                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md"
                                                >
                                                    ✗ Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* All Batches Tab */}
                {activeTab === 'batches' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">All Batches</h2>

                        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold text-purple-900">Batch ID</th>
                                            <th className="px-6 py-4 text-left font-semibold text-purple-900">Herb</th>
                                            <th className="px-6 py-4 text-left font-semibold text-purple-900">Farm</th>
                                            <th className="px-6 py-4 text-left font-semibold text-purple-900">Weight</th>
                                            <th className="px-6 py-4 text-left font-semibold text-purple-900">Status</th>
                                            <th className="px-6 py-4 text-left font-semibold text-purple-900">Lab Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {allBatches.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                    <div className="text-5xl mb-2">📦</div>
                                                    <p>No batches in the system</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            allBatches.map((batch) => (
                                                <tr key={batch.id} className="hover:bg-purple-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {batch.processorBatchId || batch.id}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-700">{batch.herb}</td>
                                                    <td className="px-6 py-4 text-gray-600 text-sm">{batch.farmId}</td>
                                                    <td className="px-6 py-4 text-gray-700">{batch.weight}kg</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${batch.status === 'approved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : batch.status === 'rejected'
                                                                ? 'bg-red-100 text-red-700'
                                                                : batch.status === 'testing'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {batch.status || 'pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${batch.labStatus === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : batch.labStatus === 'in_progress'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {batch.labStatus || 'pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lab Overview Tab */}
                {activeTab === 'lab' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Laboratory Overview</h2>

                        <div className="grid grid-cols-3 gap-6">
                            {allBatches.filter(b => b.labStatus === 'in_progress').map((batch) => (
                                <div key={batch.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">🧬</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{batch.processorBatchId || batch.id}</div>
                                            <div className="text-sm text-teal-700">{batch.herb}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Weight:</span>
                                            <span className="font-semibold">{batch.weight}kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Farm:</span>
                                            <span className="font-semibold text-xs">{batch.farmId}</span>
                                        </div>
                                        {batch.labResults && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Purity:</span>
                                                    <span className="font-semibold text-green-600">{batch.labResults.purity}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Moisture:</span>
                                                    <span className="font-semibold">{batch.labResults.moisture}%</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                            ⏳ In Testing
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {allBatches.filter(b => b.labStatus === 'in_progress').length === 0 && (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                                <div className="text-6xl mb-4">🧬</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Tests</h3>
                                <p className="text-gray-600">No batches currently in lab testing</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Manufacturing Tab */}
                {activeTab === 'manufacturing' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Manufacturing Overview</h2>

                        <div className="grid grid-cols-2 gap-6">
                            {allBatches.filter(b => b.status === 'manufactured' || b.manufacturingData).map((batch) => (
                                <div key={batch.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🏭</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-lg">
                                                {batch.manufacturingData?.productName || batch.herb}
                                            </div>
                                            <div className="text-sm text-gray-600">{batch.processorBatchId || batch.id}</div>
                                        </div>
                                    </div>
                                    {batch.manufacturingData && (
                                        <div className="space-y-2 text-sm">
                                            <div className="bg-emerald-50 p-3 rounded-lg">
                                                <div className="font-semibold text-emerald-900 mb-1">Manufacturer</div>
                                                <div className="text-gray-700">{batch.manufacturingData.manufacturerName}</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-gray-50 p-2 rounded">
                                                    <div className="text-xs text-gray-600">Mfg Date</div>
                                                    <div className="font-semibold">{new Date(batch.manufacturingData.manufacturingDate).toLocaleDateString()}</div>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded">
                                                    <div className="text-xs text-gray-600">Expiry</div>
                                                    <div className="font-semibold">{new Date(batch.manufacturingData.expiryDate).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            ✓ Manufactured
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {allBatches.filter(b => b.status === 'manufactured' || b.manufacturingData).length === 0 && (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                                <div className="text-6xl mb-4">🏭</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Manufactured Products</h3>
                                <p className="text-gray-600">No batches have been manufactured yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

