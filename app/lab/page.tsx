'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LabTestingPage() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [formData, setFormData] = useState({
        batchId: '',
        moistureContent: '',
        colorCheck: '',
        odorCheck: '',
        foreignMatter: '',
        lead: '',
        arsenic: '',
        cadmium: '',
        mercury: '',
        pesticides: '',
        aflatoxin: '',
        totalBacterialCount: '',
        yeastMold: '',
        salmonella: '',
        ecoli: '',
        technicianName: '',
        remarks: ''
    })
    const [formErrors, setFormErrors] = useState({
        batchId: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            if (typeof document === 'undefined') return false
            
            // Check cookies (handle encoded values)
            const cookies = document.cookie.split(';')
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=')
                if (name === 'jwt_token') {
                    try {
                        const decoded = decodeURIComponent(value || '')
                        if (decoded && decoded.trim() !== '') {
                            return true
                        }
                    } catch {
                        if (value && value.trim() !== '') {
                            return true
                        }
                    }
                }
            }
            
            // Check localStorage
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('jwt_token')
                if (token && token.trim() !== '') {
                    return true
                }
            }
            
            return false
        }

        const authenticated = checkAuth()
        setIsAuthenticated(authenticated)

        // If not authenticated, redirect to login
        if (!authenticated) {
            router.push('/')
        }
    }, [router])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const errors = {
            batchId: ''
        }
        let isValid = true

        if (!formData.batchId.trim()) {
            errors.batchId = 'Batch ID is required'
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        try {
            // TODO: Make API call here
            console.log('Lab test data:', formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            alert('✅ Lab test data submitted successfully!')
            setFormData({
                batchId: '',
                moistureContent: '',
                colorCheck: '',
                odorCheck: '',
                foreignMatter: '',
                lead: '',
                arsenic: '',
                cadmium: '',
                mercury: '',
                pesticides: '',
                aflatoxin: '',
                totalBacterialCount: '',
                yeastMold: '',
                salmonella: '',
                ecoli: '',
                technicianName: '',
                remarks: ''
            })
        } catch (error) {
            console.error('Error submitting form:', error)
            alert('Error submitting lab test data. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center font-inter">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Checking authentication...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 font-inter">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#014848] to-[#016868] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-xl p-1 shadow-lg">
                                <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-sm sm:text-base lg:text-xl font-bold">Government of India | भारत सरकार</h1>
                                <p className="text-xs sm:text-sm text-teal-100">Ministry of AYUSH | आयुष मंत्रालय</p>
                                <p className="text-xs sm:text-sm text-teal-100 font-semibold">ANVESHA Laboratory | अन्वेषा</p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className="text-sm font-bold">ANVESHA Lab</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 lg:px-6 rounded-lg border border-white/20 hover:border-white/40 transition-all shadow-sm hover:shadow-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl mb-4 sm:mb-6 shadow-lg">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                        Laboratory Testing Form
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Enter comprehensive lab test information for quality assurance and compliance
                    </p>
                </div>

                {/* Lab Testing Form */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 sm:px-8 py-6 sm:py-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white">Test Documentation</h3>
                                <p className="text-sm text-teal-100 mt-1">Complete all required fields for accurate testing records</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 lg:p-10 space-y-8">
                        {/* Batch ID Section */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Batch Information</h3>
                            </div>
                            <div>
                                <label htmlFor="batchId" className="block text-sm font-semibold text-gray-900 mb-3">
                                    Batch ID <span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="batchId"
                                    name="batchId"
                                    value={formData.batchId}
                                    onChange={handleFormChange}
                                    className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold text-gray-900 text-base ${
                                        formErrors.batchId
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                            : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 bg-white hover:border-gray-300'
                                    }`}
                                    placeholder="Enter batch ID (e.g., BATCH-2024-001)"
                                />
                                {formErrors.batchId && (
                                    <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {formErrors.batchId}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Physical & Organoleptic Tests */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Physical & Organoleptic Tests</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                {[
                                    { id: 'moistureContent', label: 'Moisture Content (%)', placeholder: 'Enter moisture content', hint: 'Standard range: 5-10%' },
                                    { id: 'colorCheck', label: 'Color Check', placeholder: 'Enter observed color', hint: 'Expected: Light brown to brown' },
                                    { id: 'odorCheck', label: 'Odor Check', placeholder: 'Describe odor characteristics', hint: 'Expected: Characteristic earthy odor' },
                                    { id: 'foreignMatter', label: 'Foreign Matter (%)', placeholder: 'Enter foreign matter percentage', hint: 'Maximum limit: 2%' }
                                ].map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <label htmlFor={field.id} className="block text-sm font-semibold text-gray-900">
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            id={field.id}
                                            name={field.id}
                                            value={formData[field.id as keyof typeof formData] as string}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all font-semibold text-gray-900 bg-white hover:border-gray-300"
                                            placeholder={field.placeholder}
                                        />
                                        <p className="text-xs text-gray-500 font-medium">{field.hint}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chemical Analysis */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Chemical Analysis</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                {[
                                    { id: 'lead', label: 'Lead (ppm)', placeholder: 'Enter lead content', hint: 'Maximum limit: 10 ppm' },
                                    { id: 'arsenic', label: 'Arsenic (ppm)', placeholder: 'Enter arsenic content', hint: 'Maximum limit: 3 ppm' },
                                    { id: 'cadmium', label: 'Cadmium (ppm)', placeholder: 'Enter cadmium content', hint: 'Maximum limit: 0.3 ppm' },
                                    { id: 'mercury', label: 'Mercury (ppm)', placeholder: 'Enter mercury content', hint: 'Maximum limit: 1 ppm' },
                                    { id: 'pesticides', label: 'Pesticide Residues', placeholder: 'Enter pesticide residues', hint: 'Should be below detection limit' },
                                    { id: 'aflatoxin', label: 'Aflatoxins (ppb)', placeholder: 'Enter aflatoxin content', hint: 'Maximum limit: 20 ppb' }
                                ].map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <label htmlFor={field.id} className="block text-sm font-semibold text-gray-900">
                                            {field.label}
                                        </label>
                                        <input
                                            type="text"
                                            id={field.id}
                                            name={field.id}
                                            value={formData[field.id as keyof typeof formData] as string}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all font-semibold text-gray-900 bg-white hover:border-gray-300"
                                            placeholder={field.placeholder}
                                        />
                                        <p className="text-xs text-gray-500 font-medium">{field.hint}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Microbial Analysis */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Microbial Analysis</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="totalBacterialCount" className="block text-sm font-semibold text-gray-900">
                                        Total Bacterial Count (CFU/g)
                                    </label>
                                    <input
                                        type="text"
                                        id="totalBacterialCount"
                                        name="totalBacterialCount"
                                        value={formData.totalBacterialCount}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all font-semibold text-gray-900 bg-white hover:border-gray-300"
                                        placeholder="Enter bacterial count"
                                    />
                                    <p className="text-xs text-gray-500 font-medium">Maximum limit: 10^5 CFU/g</p>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="yeastMold" className="block text-sm font-semibold text-gray-900">
                                        Yeast & Mold (CFU/g)
                                    </label>
                                    <input
                                        type="text"
                                        id="yeastMold"
                                        name="yeastMold"
                                        value={formData.yeastMold}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all font-semibold text-gray-900 bg-white hover:border-gray-300"
                                        placeholder="Enter yeast & mold count"
                                    />
                                    <p className="text-xs text-gray-500 font-medium">Maximum limit: 10^3 CFU/g</p>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="salmonella" className="block text-sm font-semibold text-gray-900">
                                        Salmonella
                                    </label>
                                    <select
                                        id="salmonella"
                                        name="salmonella"
                                        value={formData.salmonella}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all font-semibold text-gray-900 bg-white hover:border-gray-300"
                                    >
                                        <option value="">Select result</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Present">Present</option>
                                    </select>
                                    <p className="text-xs text-gray-500 font-medium">Should be absent in 25g</p>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="ecoli" className="block text-sm font-semibold text-gray-900">
                                        E. coli
                                    </label>
                                    <select
                                        id="ecoli"
                                        name="ecoli"
                                        value={formData.ecoli}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all font-semibold text-gray-900 bg-white hover:border-gray-300"
                                    >
                                        <option value="">Select result</option>
                                        <option value="Absent">Absent</option>
                                        <option value="Present">Present</option>
                                    </select>
                                    <p className="text-xs text-gray-500 font-medium">Should be absent in 1g</p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Additional Information</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="technicianName" className="block text-sm font-semibold text-gray-900">
                                        Technician Name
                                    </label>
                                    <input
                                        type="text"
                                        id="technicianName"
                                        name="technicianName"
                                        value={formData.technicianName}
                                        onChange={handleFormChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all font-semibold text-gray-900 bg-white hover:border-gray-300"
                                        placeholder="Enter technician name"
                                    />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <label htmlFor="remarks" className="block text-sm font-semibold text-gray-900">
                                        Remarks / Notes
                                    </label>
                                    <textarea
                                        id="remarks"
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleFormChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all font-semibold text-gray-900 resize-none bg-white hover:border-gray-300"
                                        placeholder="Enter any additional observations or remarks"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t-2 border-gray-100">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-4 sm:py-5 rounded-xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base sm:text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Submitting Test Data...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Submit Lab Test Data</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
