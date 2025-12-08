'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Batch } from '@/lib/types/batch'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface User {
    id: string
    name: string
    email: string
    role: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
}

export default function AdminPage() {
    const router = useRouter()
    const [activeSection, setActiveSection] = useState('new-registration')
    const [users, setUsers] = useState<User[]>([])
    const [allBatches, setAllBatches] = useState<Batch[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        setIsLoading(true)
        try {
            const [usersRes, batchesRes] = await Promise.all([
                axios.get(`${API_URL}/users`),
                axios.get(`${API_URL}/batches`)
            ])
            setUsers(usersRes.data)
            setAllBatches(batchesRes.data)
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
            // Refresh data
            const usersRes = await axios.get(`${API_URL}/users`)
            setUsers(usersRes.data)
        } catch (error) {
            console.error('Error updating user status:', error)
            alert('Failed to update user status')
        }
    }

    // derived state
    const pendingUsers = users.filter(u => u.status === 'PENDING')
    const processors = users.filter(u => u.role === 'PROCESSOR' && u.status === 'APPROVED')
    const labs = users.filter(u => u.role === 'LAB' && u.status === 'APPROVED')
    const manufacturers = users.filter(u => u.role === 'MANUFACTURER' && u.status === 'APPROVED')

    // Extract unique farmers from batches
    const farmers = Array.from(new Set(allBatches.map(b => b.farmId))).map(farmId => {
        // Find a batch with this farmId to get potential extra details if available
        // In current schema, we mainly have farmId. We'll use mocked details if missing.
        const batch = allBatches.find(b => b.farmId === farmId)
        return {
            farmId,
            name: batch?.farmerData?.farmerName || 'Unknown Farmer',
            location: batch?.farmLocation?.address || batch?.farmLocation?.district || 'Unknown Location',
            batches: allBatches.filter(b => b.farmId === farmId).length
        }
    }).filter(f => f.farmId)

    const sidebarItems = [
        {
            id: 'new-registration',
            label: 'New Registration',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            )
        },
        {
            id: 'processor-mgmt',
            label: 'Processor Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            id: 'lab-mgmt',
            label: 'Lab Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            id: 'manufacturer-mgmt',
            label: 'Manufacturer Management',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            id: 'farmer-details',
            label: 'Farmer Details',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            )
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#014848] text-white transition-all duration-300 z-50 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg p-1.5 shadow-md flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="font-playfair font-bold text-lg leading-tight tracking-wide">ANVESHA</h1>
                            <p className="text-[10px] text-teal-100 uppercase tracking-wider font-medium">Admin Console</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${activeSection === item.id
                                    ? 'bg-white text-[#014848] shadow-lg translate-x-1'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
                                }`}
                        >
                            <span className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 bg-[#003838]">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-teal-800 flex items-center justify-center text-xs font-bold ring-2 ring-white/20 shadow-inner">
                            AD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">Administrator</p>
                            <p className="text-xs text-teal-200 truncate">admin@ayush.gov.in</p>
                        </div>
                    </div>
                    <Link href="/" className="mt-4 flex items-center justify-center gap-2 w-full py-2 text-xs bg-white/10 hover:bg-red-500/80 hover:text-white rounded-md transition-all duration-200 group">
                        <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 bg-[#F8FAFC]">
                <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 rounded-xl text-[#014848]">
                            {sidebarItems.find(i => i.id === activeSection)?.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-playfair font-bold text-gray-900">
                                {sidebarItems.find(i => i.id === activeSection)?.label}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Manage system verification and actors</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="bg-[#014848]/5 text-[#014848] px-4 py-2 rounded-full text-xs font-semibold border border-[#014848]/10 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 min-h-[600px] p-8">

                    {/* New Registration Section */}
                    {activeSection === 'new-registration' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h3 className="text-lg font-bold text-gray-800">Pending Registrations</h3>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600 font-medium">{pendingUsers.length} Requests</span>
                            </div>

                            {pendingUsers.length === 0 ? (
                                <div className="text-center py-24 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-lg font-medium text-gray-500">All caught up!</p>
                                    <p className="text-sm">No pending registrations found at this time.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="p-4 border-b">Name</th>
                                                <th className="p-4 border-b">Email</th>
                                                <th className="p-4 border-b">Role</th>
                                                <th className="p-4 border-b">Date</th>
                                                <th className="p-4 border-b text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {pendingUsers.map(user => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-4 font-medium text-gray-900">{user.name}</td>
                                                    <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                                                    <td className="p-4">
                                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-500 text-sm">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 text-right flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUserApproval(user.id, true)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#014848] text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleUserApproval(user.id, false)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            Reject
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Processor Management */}
                    {activeSection === 'processor-mgmt' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h3 className="text-lg font-bold text-gray-800">Registered Processors</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {processors.map(proc => (
                                    <div key={proc.id} className="group p-6 border border-gray-200 rounded-xl hover:border-[#014848]/30 hover:shadow-lg transition-all duration-300 bg-white">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-[#014848] group-hover:text-white transition-colors duration-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-full">Active</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 mb-1">{proc.name}</h4>
                                            <p className="text-sm text-gray-500 mb-4">{proc.email}</p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Active Batches</span>
                                            <span className="font-bold text-gray-900">{allBatches.length}</span>
                                        </div>
                                    </div>
                                ))}
                                {processors.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                        No registered processors found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Lab Management */}
                    {activeSection === 'lab-mgmt' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h3 className="text-lg font-bold text-gray-800">Registered Laboratories</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {labs.map(lab => (
                                    <div key={lab.id} className="group p-6 border border-gray-200 rounded-xl hover:border-[#014848]/30 hover:shadow-lg transition-all duration-300 bg-white">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-[#014848] group-hover:text-white transition-colors duration-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 mb-1">{lab.name}</h4>
                                            <p className="text-sm text-gray-500 mb-4">{lab.email}</p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 flex gap-2">
                                            <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded border border-green-100 tracking-wide">NABL Certified</span>
                                        </div>
                                    </div>
                                ))}
                                {labs.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                        No registered laboratories found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Manufacturer Management */}
                    {activeSection === 'manufacturer-mgmt' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h3 className="text-lg font-bold text-gray-800">Registered Manufacturers</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {manufacturers.map(mfg => (
                                    <div key={mfg.id} className="group p-6 border border-gray-200 rounded-xl hover:border-[#014848]/30 hover:shadow-lg transition-all duration-300 bg-white">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-[#014848] group-hover:text-white transition-colors duration-300">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded-full">Verified</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900 mb-1">{mfg.name}</h4>
                                            <p className="text-sm text-gray-500 mb-4">{mfg.email}</p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100 text-sm">
                                            <p className="text-gray-500">Production Capacity: <span className="font-semibold text-gray-900">High Volume</span></p>
                                        </div>
                                    </div>
                                ))}
                                {manufacturers.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-gray-500">
                                        No registered manufacturers found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Farmer Details */}
                    {activeSection === 'farmer-details' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b pb-4">
                                <h3 className="text-lg font-bold text-gray-800">Farmer Directory</h3>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Sourced from Batch Data</span>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 border-b">Farm ID</th>
                                            <th className="p-4 border-b">Farmer Name</th>
                                            <th className="p-4 border-b">Location</th>
                                            <th className="p-4 border-b text-center">Harvests</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {farmers.map((farmer, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                                <td className="p-4 font-mono text-sm text-gray-500 group-hover:text-[#014848] transition-colors">{farmer.farmId}</td>
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-900">{farmer.name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        {farmer.location}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-full bg-teal-50 text-teal-700 font-bold text-sm border border-teal-100">
                                                        {farmer.batches}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {farmers.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-12 text-center text-gray-500">
                                                    No farmer data available from batches.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    {activeSection === 'settings' && (
                        <div className="space-y-8 max-w-2xl mx-auto pt-8">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-4 mb-8">System Configuration</h3>

                            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-[#014848]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive alerts when new users register</p>
                                    </div>
                                </div>
                                <button className="w-12 h-6 bg-[#014848] rounded-full relative cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Maintenance Mode</h4>
                                        <p className="text-sm text-gray-500">Temporarily disable access for non-admins</p>
                                    </div>
                                </div>
                                <button className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></div>
                                </button>
                            </div>

                            <div className="p-6 border border-red-100 rounded-xl bg-red-50/50 mt-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-red-100 rounded-lg text-red-600 mt-1">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-red-900 mb-1">Danger Zone</h4>
                                        <p className="text-sm text-red-700 mb-4">Actions here cannot be undone. Please proceed with caution.</p>
                                        <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-600 hover:text-white hover:border-red-600 text-sm font-semibold transition-all shadow-sm">
                                            Reset All System Data
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
