'use client'

import { useState } from 'react'
import Link from 'next/link'
import QuickLabRegistrationForm from './components/QuickLabRegistrationForm'
import QuickProcessorRegistrationForm from './components/QuickProcessorRegistrationForm'
import QuickManufacturerRegistrationForm from './components/QuickManufacturerRegistrationForm'

interface PendingRegistration {
    id: number
    type: 'Laboratory' | 'Processor' | 'Manufacturer'
    name: string
    contact: string
    email: string
    phone: string
    submittedDate: string
    nablNumber?: string
    licenseNumber?: string
    fssaiNumber?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
}

export default function AdminPage() {
    const [activeSection, setActiveSection] = useState('new-registration')
    const [registrationRole, setRegistrationRole] = useState('')
    const [showApprovals, setShowApprovals] = useState(false)
    const [selectedRegistration, setSelectedRegistration] = useState<PendingRegistration | null>(null)

    // Mock pending registrations data with more details
    const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([
        {
            id: 1,
            type: 'Laboratory',
            name: 'AYUSH Quality Labs',
            contact: 'Dr. Sharma',
            email: 'sharma@ayushlab.com',
            phone: '+91 98765 43210',
            submittedDate: '2025-12-07',
            nablNumber: 'NABL-123456',
            address: '123 Lab Street',
            city: 'Bhopal',
            state: 'Madhya Pradesh',
            pincode: '462001'
        },
        {
            id: 2,
            type: 'Processor',
            name: 'Herbal Processing Unit',
            contact: 'Mr. Kumar',
            email: 'kumar@herbprocess.com',
            phone: '+91 98765 43211',
            submittedDate: '2025-12-06',
            licenseNumber: 'PROC-789012',
            address: '456 Processing Lane',
            city: 'Indore',
            state: 'Madhya Pradesh',
            pincode: '452001'
        },
        {
            id: 3,
            type: 'Manufacturer',
            name: 'Vedic Pharma Ltd',
            contact: 'Ms. Patel',
            email: 'patel@vedicpharma.com',
            phone: '+91 98765 43212',
            submittedDate: '2025-12-05',
            fssaiNumber: 'FSSAI-345678',
            licenseNumber: 'MFG-901234',
            address: '789 Manufacturing Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
        }
    ])

    const handleApprove = (id: number) => {
        const registration = pendingRegistrations.find(r => r.id === id)
        if (registration) {
            // Generate credentials
            const generatedEmail = registration.email
            const generatedPassword = 'Temp@' + Math.random().toString(36).slice(-8)

            // In a real application, this would send an API request to create the user account
            // and send credentials via email
            alert(`✅ Approved!\n\nCredentials Generated:\nEmail: ${generatedEmail}\nPassword: ${generatedPassword}\n\nCredentials will be sent to the registered email.`)

            // Remove from pending list
            setPendingRegistrations(prev => prev.filter(r => r.id !== id))
            setSelectedRegistration(null)
        }
    }

    const handleReject = (id: number) => {
        if (confirm('Are you sure you want to reject this registration?')) {
            setPendingRegistrations(prev => prev.filter(r => r.id !== id))
            setSelectedRegistration(null)
            alert('Registration rejected.')
        }
    }

    // Handle new registration submission
    const handleNewRegistration = (data: any, type: 'Laboratory' | 'Processor' | 'Manufacturer') => {
        const newRegistration: PendingRegistration = {
            id: Date.now(),
            type: type,
            name: data.labName || data.processorName || data.manufacturerName,
            contact: data.contactPerson,
            email: data.email,
            phone: data.phone,
            submittedDate: new Date().toISOString().split('T')[0],
            nablNumber: data.nablNumber,
            licenseNumber: data.licenseNumber,
            fssaiNumber: data.fssaiNumber,
            address: data.address,
            city: data.city,
            state: data.state,
            pincode: data.pincode
        }

        setPendingRegistrations(prev => [newRegistration, ...prev])

        // Show success message and reset form
        alert('✅ Registration submitted successfully! It will be reviewed by the admin.')
        setRegistrationRole('')
    }

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
            id: 'farmer-data',
            label: 'Farmer Data',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
            id: 'manufacturer-mgmt',
            label: 'Manufacturer',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#014848] text-white z-50 flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg p-1.5 flex items-center justify-center">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">ANVESHA</h1>
                            <p className="text-[10px] text-teal-100 uppercase tracking-wider">Admin Console</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id)
                                setRegistrationRole('')
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id
                                ? 'bg-white text-[#014848]'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 bg-[#003838]">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-9 h-9 rounded-full bg-teal-800 flex items-center justify-center text-xs font-bold">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-medium">Administrator</p>
                            <p className="text-xs text-teal-200">admin@ayush.gov.in</p>
                        </div>
                    </div>
                    <Link href="/" className="flex items-center justify-center gap-2 w-full py-2 text-xs bg-white/10 hover:bg-red-500/80 rounded-md transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 bg-gray-50">
                <header className="mb-8 bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-50 rounded-lg text-[#014848]">
                            {sidebarItems.find(i => i.id === activeSection)?.icon}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {sidebarItems.find(i => i.id === activeSection)?.label}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Manage system operations</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-lg border border-gray-200 min-h-[600px] p-8">
                    {/* New Registration Section */}
                    {activeSection === 'new-registration' && (
                        <div>
                            {!registrationRole ? (
                                <div className="max-w-3xl mx-auto">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
                                            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-3">New Registration</h3>
                                        <p className="text-gray-600 text-lg">Register new facilities in the ANVESHA ecosystem</p>
                                    </div>

                                    <div className="bg-teal-50 rounded-lg p-8 mb-8 border border-teal-200">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Who Can Register?
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Quality Testing Laboratories</p>
                                                    <p className="text-sm text-gray-600">AYUSH-approved labs for herb quality testing and certification</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Processing Units</p>
                                                    <p className="text-sm text-gray-600">Licensed facilities for herb processing, drying, and packaging</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Manufacturers</p>
                                                    <p className="text-sm text-gray-600">FSSAI-licensed manufacturers of Ayurvedic products</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        <button
                                            onClick={() => setRegistrationRole('select')}
                                            className="inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Start New Registration
                                        </button>

                                        <button
                                            onClick={() => setShowApprovals(true)}
                                            className="inline-flex items-center gap-3 bg-gray-700 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-lg transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            View Pending Approvals
                                            {pendingRegistrations.length > 0 && (
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    {pendingRegistrations.length}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : showApprovals ? (
                                <div className="max-w-6xl mx-auto">
                                    <div className="mb-8">
                                        <button
                                            onClick={() => {
                                                setShowApprovals(false)
                                                setSelectedRegistration(null)
                                            }}
                                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Back
                                        </button>
                                        <h3 className="text-2xl font-bold text-gray-900">Pending Approvals</h3>
                                        <p className="text-gray-600 mt-1">Review and approve new facility registrations</p>
                                    </div>

                                    {pendingRegistrations.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-gray-500 text-lg font-semibold">No pending registrations</p>
                                            <p className="text-gray-400 text-sm mt-2">All registrations have been processed</p>
                                        </div>
                                    ) : selectedRegistration ? (
                                        // Detailed View
                                        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                                            <div className="bg-gradient-to-r from-[#016868] to-[#014d4d] p-6 text-white">
                                                <button
                                                    onClick={() => setSelectedRegistration(null)}
                                                    className="flex items-center gap-2 text-white/80 hover:text-white font-medium mb-4"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                    Back to List
                                                </button>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full">
                                                        {selectedRegistration.type}
                                                    </span>
                                                    <span className="text-sm text-white/80">
                                                        Submitted: {selectedRegistration.submittedDate}
                                                    </span>
                                                </div>
                                                <h3 className="text-3xl font-bold">{selectedRegistration.name}</h3>
                                            </div>

                                            <div className="p-8">
                                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-lg font-bold text-gray-900 border-b-2 border-[#016868] pb-2">Contact Information</h4>
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Contact Person</p>
                                                            <p className="text-gray-900 font-bold">{selectedRegistration.contact}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Email Address</p>
                                                            <p className="text-gray-900 font-bold">{selectedRegistration.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 font-semibold">Phone Number</p>
                                                            <p className="text-gray-900 font-bold">{selectedRegistration.phone}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <h4 className="text-lg font-bold text-gray-900 border-b-2 border-[#016868] pb-2">Facility Details</h4>
                                                        {selectedRegistration.nablNumber && (
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-semibold">NABL Accreditation Number</p>
                                                                <p className="text-gray-900 font-bold">{selectedRegistration.nablNumber}</p>
                                                            </div>
                                                        )}
                                                        {selectedRegistration.licenseNumber && (
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-semibold">License Number</p>
                                                                <p className="text-gray-900 font-bold">{selectedRegistration.licenseNumber}</p>
                                                            </div>
                                                        )}
                                                        {selectedRegistration.fssaiNumber && (
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-semibold">FSSAI Number</p>
                                                                <p className="text-gray-900 font-bold">{selectedRegistration.fssaiNumber}</p>
                                                            </div>
                                                        )}
                                                        {selectedRegistration.address && (
                                                            <div>
                                                                <p className="text-sm text-gray-500 font-semibold">Address</p>
                                                                <p className="text-gray-900 font-bold">
                                                                    {selectedRegistration.address}<br />
                                                                    {selectedRegistration.city}, {selectedRegistration.state} - {selectedRegistration.pincode}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                                                    <button
                                                        onClick={() => handleApprove(selectedRegistration.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Approve & Generate Credentials
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(selectedRegistration.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
                                                    >
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Reject Application
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // List View
                                        <div className="space-y-4">
                                            {pendingRegistrations.map((registration) => (
                                                <div key={registration.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#016868] hover:shadow-md transition-all">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <span className="px-3 py-1 bg-[#016868]/10 text-[#016868] text-xs font-bold rounded-full border-2 border-[#016868]/30">
                                                                    {registration.type}
                                                                </span>
                                                                <span className="text-xs text-gray-500 font-semibold">
                                                                    Submitted: {registration.submittedDate}
                                                                </span>
                                                            </div>

                                                            <h4 className="text-xl font-bold text-gray-900 mb-3">{registration.name}</h4>

                                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-gray-500 font-semibold">Contact Person</p>
                                                                    <p className="font-bold text-gray-900">{registration.contact}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500 font-semibold">Email</p>
                                                                    <p className="font-bold text-gray-900">{registration.email}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500 font-semibold">Phone</p>
                                                                    <p className="font-bold text-gray-900">{registration.phone}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-2 ml-6">
                                                            <button
                                                                onClick={() => setSelectedRegistration(registration)}
                                                                className="flex items-center gap-2 bg-[#016868] hover:bg-[#014d4d] text-white font-bold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                View Details
                                                            </button>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleApprove(registration.id)}
                                                                    className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                                                                    title="Approve"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(registration.id)}
                                                                    className="flex-1 flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                                                                    title="Reject"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : registrationRole === 'select' ? (
                                <div className="max-w-4xl mx-auto">
                                    <div className="mb-8">
                                        <button
                                            onClick={() => setRegistrationRole('')}
                                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Back
                                        </button>
                                        <h3 className="text-2xl font-bold text-gray-900">Select Facility Type</h3>
                                        <p className="text-gray-600 mt-1">Choose the type of facility you want to register</p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <button
                                            onClick={() => setRegistrationRole('lab')}
                                            className="group p-6 border-2 border-gray-200 rounded-lg hover:border-teal-500 transition-colors text-left"
                                        >
                                            <div className="w-14 h-14 bg-blue-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center mb-4 transition-colors">
                                                <svg className="w-8 h-8 text-blue-600 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-lg text-gray-900 mb-2">Laboratory</h4>
                                            <p className="text-sm text-gray-600">Quality testing and certification facility</p>
                                        </button>

                                        <button
                                            onClick={() => setRegistrationRole('processor')}
                                            className="group p-6 border-2 border-gray-200 rounded-lg hover:border-teal-500 transition-colors text-left"
                                        >
                                            <div className="w-14 h-14 bg-purple-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center mb-4 transition-colors">
                                                <svg className="w-8 h-8 text-purple-600 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-lg text-gray-900 mb-2">Processor</h4>
                                            <p className="text-sm text-gray-600">Herb processing and packaging unit</p>
                                        </button>

                                        <button
                                            onClick={() => setRegistrationRole('manufacturer')}
                                            className="group p-6 border-2 border-gray-200 rounded-lg hover:border-teal-500 transition-colors text-left"
                                        >
                                            <div className="w-14 h-14 bg-orange-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center mb-4 transition-colors">
                                                <svg className="w-8 h-8 text-orange-600 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <h4 className="font-bold text-lg text-gray-900 mb-2">Manufacturer</h4>
                                            <p className="text-sm text-gray-600">Ayurvedic product manufacturing facility</p>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <button
                                        onClick={() => setRegistrationRole('select')}
                                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-6"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Back to Selection
                                    </button>

                                    <div>
                                        {registrationRole === 'lab' && <QuickLabRegistrationForm />}
                                        {registrationRole === 'processor' && <QuickProcessorRegistrationForm />}
                                        {registrationRole === 'manufacturer' && <QuickManufacturerRegistrationForm />}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Farmer Data Section */}
                    {activeSection === 'farmer-data' && (
                        <div className="space-y-6">
                            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
                                <div className="flex items-center gap-3">
                                    <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Farmer Mobile App Data</h3>
                                        <p className="text-sm text-gray-600">Data submitted by farmers through the mobile application</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Total Farmers</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Active Batches</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">89</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">Total Herbs Supplied</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">12,450 kg</p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-500">This Month</p>
                                    <p className="text-2xl font-bold text-purple-600 mt-1">2,340 kg</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900">Recent Farmer Submissions</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Farmer Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Herb Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {[
                                                { name: 'Ramesh Kumar', location: 'Uttarakhand', herb: 'Ashwagandha', qty: '150 kg', date: '2025-12-07', status: 'Sent to Lab' },
                                                { name: 'Priya Devi', location: 'Himachal Pradesh', herb: 'Brahmi', qty: '80 kg', date: '2025-12-07', status: 'In Testing' },
                                                { name: 'Suresh Patel', location: 'Gujarat', herb: 'Tulsi', qty: '200 kg', date: '2025-12-06', status: 'Approved' },
                                                { name: 'Lakshmi Reddy', location: 'Karnataka', herb: 'Neem', qty: '120 kg', date: '2025-12-06', status: 'Sent to Lab' },
                                                { name: 'Vijay Singh', location: 'Rajasthan', herb: 'Giloy', qty: '95 kg', date: '2025-12-05', status: 'Approved' }
                                            ].map((farmer, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{farmer.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{farmer.location}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">{farmer.herb}</td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{farmer.qty}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{farmer.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${farmer.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                            farmer.status === 'In Testing' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {farmer.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lab Management Section */}
                    {activeSection === 'lab-mgmt' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Total Batches Received</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">24</p>
                                    <p className="text-xs text-gray-500 mt-1">From farmers via app</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Tests Completed</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">18</p>
                                    <p className="text-xs text-gray-500 mt-1">Certificates issued</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">In Testing</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">6</p>
                                    <p className="text-xs text-gray-500 mt-1">Currently processing</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Lab Activities Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Receive Batches from Farmers</h4>
                                            <p className="text-sm text-gray-600 mt-1">Batches are sent from farmers through the mobile app. Lab receives notifications and batch details including herb type, quantity, and farm location.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Conduct Quality Testing</h4>
                                            <p className="text-sm text-gray-600 mt-1">Perform comprehensive tests including physical parameters, chemical analysis (heavy metals, pesticides), microbial testing, and advanced DNA barcoding.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Issue Quality Certificates</h4>
                                            <p className="text-sm text-gray-600 mt-1">Generate AYUSH-compliant quality certificates with test results, quality grade (A+, A, B), and compliance status. Certificates are digitally signed and stored.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Forward to Processors</h4>
                                            <p className="text-sm text-gray-600 mt-1">Approved batches with quality certificates are made available to registered processors for further processing and packaging.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Processor Management Section */}
                    {activeSection === 'processor-mgmt' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Batches Received</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">18</p>
                                    <p className="text-xs text-gray-500 mt-1">Lab-tested batches</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Packages Created</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">342</p>
                                    <p className="text-xs text-gray-500 mt-1">With QR codes</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Ready to Ship</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">298</p>
                                    <p className="text-xs text-gray-500 mt-1">Packaged units</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Processor Activities Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Receive Lab-Tested Batches</h4>
                                            <p className="text-sm text-gray-600 mt-1">Access batches that have passed lab quality tests with certificates. View quality grades, test results, and lab certificate details before processing.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Process & Package Herbs</h4>
                                            <p className="text-sm text-gray-600 mt-1">Clean, dry, grind, and package herbs according to specifications. Create packages in various sizes (25kg, 50kg, 100kg) based on requirements.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Generate QR Codes</h4>
                                            <p className="text-sm text-gray-600 mt-1">Create unique QR codes for each package containing batch information, quality certificate, processing date, and traceability data. Print and apply labels.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Supply to Manufacturers</h4>
                                            <p className="text-sm text-gray-600 mt-1">Make packaged herbs available to registered manufacturers. Track inventory, manage orders, and maintain supply chain transparency.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Manufacturer Management Section */}
                    {activeSection === 'manufacturer-mgmt' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Packages Received</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">298</p>
                                    <p className="text-xs text-gray-500 mt-1">From processors</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Products Created</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">156</p>
                                    <p className="text-xs text-gray-500 mt-1">Ayurvedic formulations</p>
                                </div>

                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-semibold text-gray-700">Ready for Market</h4>
                                        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">142</p>
                                    <p className="text-xs text-gray-500 mt-1">FSSAI approved</p>
                                </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Manufacturer Activities Overview</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Source Quality Herbs</h4>
                                            <p className="text-sm text-gray-600 mt-1">Receive packaged herbs from processors with complete traceability. Scan QR codes to verify quality certificates, batch information, and origin details.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Manufacture Ayurvedic Products</h4>
                                            <p className="text-sm text-gray-600 mt-1">Create traditional Ayurvedic formulations (churnas, tablets, capsules, oils) using verified quality herbs. Follow GMP standards and traditional recipes.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Quality Assurance & Compliance</h4>
                                            <p className="text-sm text-gray-600 mt-1">Ensure FSSAI compliance, maintain batch records, conduct in-house quality checks, and maintain complete documentation for regulatory requirements.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">Market Distribution</h4>
                                            <p className="text-sm text-gray-600 mt-1">Distribute finished products to retailers, pharmacies, and consumers. Maintain complete supply chain transparency with herb origin traceability.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Section */}
                    {activeSection === 'settings' && (
                        <div className="space-y-6">
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">System Configuration</h3>
                                <div className="space-y-6">
                                    {/* Website Control */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Website Control</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Maintenance Mode</p>
                                                    <p className="text-sm text-gray-500">Temporarily disable website access for maintenance</p>
                                                </div>
                                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">New Registrations</p>
                                                    <p className="text-sm text-gray-500">Allow new facility registrations</p>
                                                </div>
                                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600 transition-colors hover:bg-teal-700">
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Management */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">User Management</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Auto-Approve Labs</p>
                                                    <p className="text-sm text-gray-500">Automatically approve NABL-certified labs</p>
                                                </div>
                                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors hover:bg-gray-300">
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">Email Notifications</p>
                                                    <p className="text-sm text-gray-500">Send email notifications to users</p>
                                                </div>
                                                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-teal-600 transition-colors hover:bg-teal-700">
                                                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Management */}
                                    <div className="border-b border-gray-200 pb-6">
                                        <h4 className="font-semibold text-gray-900 mb-4">Data Management</h4>
                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-between p-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <p className="font-medium text-gray-900">Export All Data</p>
                                                        <p className="text-xs text-gray-600">Download complete database as CSV</p>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                            <button className="w-full flex items-center justify-between p-4 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                    <div className="text-left">
                                                        <p className="font-medium text-gray-900">Generate Reports</p>
                                                        <p className="text-xs text-gray-600">Monthly analytics and statistics</p>
                                                    </div>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* System Information */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-4">System Information</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Version</p>
                                                <p className="font-semibold text-gray-900 mt-1">ANVESHA v2.0.1</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Last Updated</p>
                                                <p className="font-semibold text-gray-900 mt-1">Dec 8, 2025</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Total Users</p>
                                                <p className="font-semibold text-gray-900 mt-1">1,342</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Database Size</p>
                                                <p className="font-semibold text-gray-900 mt-1">2.4 GB</p>
                                            </div>
                                        </div>
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
