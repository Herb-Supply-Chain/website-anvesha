'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LabTestingPage() {
    const router = useRouter()
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://server-anvesha.onrender.com'
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [formData, setFormData] = useState({
        batchId: '',
        moistureContent: '',
        phLevel: '',
        colorCheck: '',
        odorCheck: '',
        foreignMatter: '',
        sampleCondition: '',
        packagingIntegrity: '',
        samplingDate: '',
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

    const getToken = () => {
        if (typeof document === 'undefined') return null
        const cookies = document.cookie.split(';')
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=')
            if (name === 'jwt_token') {
                try {
                    const decoded = decodeURIComponent(value || '')
                    if (decoded && decoded.trim() !== '') return decoded
                } catch {
                    if (value && value.trim() !== '') return value
                }
            }
        }
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwt_token')
            if (token && token.trim() !== '') return token
        }
        return null
    }
    const handlePrint = () => {
        if (typeof document === 'undefined') return
        const content = document.getElementById('pdf-report')?.innerHTML
        if (!content) {
            alert('PDF content not ready. Please check the Report tab.')
            return
        }
        const popup = window.open('', '_blank', 'width=900,height=1200')
        if (!popup) {
            alert('Popup blocked. Please allow popups to generate the PDF.')
            return
        }

        const styles = `
            <style>
                * { font-family: 'Inter', Arial, sans-serif; }
                body { margin: 24px; color: #0f172a; }
                h1, h2, h3, h4 { margin: 0; }
                .header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                .tag { font-size: 12px; padding: 4px 10px; border-radius: 9999px; background: #e0f2fe; color: #0ea5e9; font-weight: 700; }
                .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
                .row { display: flex; justify-content: space-between; align-items: center; margin: 6px 0; }
                .label { font-weight: 600; }
                .muted { color: #64748b; font-size: 12px; }
                .value { color: #0f766e; font-weight: 700; }
                .section-title { margin-bottom: 8px; font-size: 16px; }
                .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
                .divider { height: 1px; background: #e2e8f0; margin: 12px 0; }
            </style>
        `

        popup.document.write(`
            <html>
                <head>
                    <title>Lab Test Report</title>
                    ${styles}
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `)
        popup.document.close()
        popup.focus()
        popup.print()
    }

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
            const token = getToken()
            const headers: HeadersInit = { 'Content-Type': 'application/json' }
            if (token) headers['Authorization'] = `Bearer ${token}`

            const res = await fetch(`${API_BASE}/api/lab-data`, {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data?.message || 'Failed to submit lab data')

            alert('✅ Lab test data submitted successfully!')
            setFormData({
                batchId: '',
                moistureContent: '',
                phLevel: '',
                colorCheck: '',
                odorCheck: '',
                foreignMatter: '',
                sampleCondition: '',
                packagingIntegrity: '',
                samplingDate: '',
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
                <div className="max-w-7xl mx-auto px-2.5 sm:px-3.5 lg:px-5 py-2.5 sm:py-3.5">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                            <Link href="/" className="block">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg p-1 shadow-lg hover:shadow-xl transition-all">
                                    <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                                </div>
                            </Link>
                            <div className="hidden sm:block leading-tight">
                                <h1 className="text-xs sm:text-sm lg:text-base font-bold">Government of India | भारत सरकार</h1>
                                <p className="text-[11px] sm:text-xs text-teal-100">Ministry of AYUSH | आयुष मंत्रालय</p>
                                <p className="text-[11px] sm:text-xs text-teal-100 font-semibold">ANVESHA Laboratory | अन्वेषा</p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className="text-xs font-bold">ANVESHA Lab</h1>
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
                {/* Hidden printable block */}
                <div id="pdf-report" className="hidden">
                    <div className="header">
                        <div>
                            <h2>ANVESHA Laboratory</h2>
                            <p className="muted">Quality & Compliance Report</p>
                        </div>
                        <span className="tag">PDF</span>
                    </div>
                    <div className="card">
                        <h3 className="section-title">Batch & Basics</h3>
                        <div className="row">
                            <span className="label">Batch ID</span>
                            <span className="value">{formData.batchId || '—'}</span>
                        </div>
                        <div className="divider"></div>
                        <div className="grid">
                            {[
                                { label: 'Moisture Content (%)', value: formData.moistureContent || '—', note: 'Std: 5-10%' },
                                { label: 'pH Level', value: formData.phLevel || '—', note: 'Range: 5.5 - 7.5' },
                                { label: 'Color Check', value: formData.colorCheck || '—', note: 'Expected: Light brown' },
                                { label: 'Odor Check', value: formData.odorCheck || '—', note: 'Characteristic earthy odor' },
                                { label: 'Foreign Matter (%)', value: formData.foreignMatter || '—', note: 'Max 2%' }
                            ].map((item) => (
                                <div key={item.label} className="card">
                                    <p className="label">{item.label}</p>
                                    <p className="value">{item.value}</p>
                                    <p className="muted">{item.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="section-title">Chemical Analysis</h3>
                        <div className="grid">
                            {[
                                { label: 'Lead (ppm)', value: formData.lead || '—', limit: 'Max 10 ppm' },
                                { label: 'Arsenic (ppm)', value: formData.arsenic || '—', limit: 'Max 3 ppm' },
                                { label: 'Cadmium (ppm)', value: formData.cadmium || '—', limit: 'Max 0.3 ppm' },
                                { label: 'Mercury (ppm)', value: formData.mercury || '—', limit: 'Max 1 ppm' },
                                { label: 'Pesticide Residues', value: formData.pesticides || '—', limit: 'Below detection' },
                                { label: 'Aflatoxins (ppb)', value: formData.aflatoxin || '—', limit: 'Max 20 ppb' }
                            ].map((item) => (
                                <div key={item.label} className="card">
                                    <p className="label">{item.label}</p>
                                    <p className="value">{item.value}</p>
                                    <p className="muted">{item.limit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="section-title">Microbial Analysis</h3>
                        <div className="grid">
                            {[
                                { label: 'Total Bacterial Count (CFU/g)', value: formData.totalBacterialCount || '—', limit: '≤ 10^5 CFU/g' },
                                { label: 'Yeast & Mold (CFU/g)', value: formData.yeastMold || '—', limit: '≤ 10^3 CFU/g' },
                                { label: 'Salmonella', value: formData.salmonella || '—', limit: 'Absent in 25g' },
                                { label: 'E. coli', value: formData.ecoli || '—', limit: 'Absent in 1g' }
                            ].map((item) => (
                                <div key={item.label} className="card">
                                    <p className="label">{item.label}</p>
                                    <p className="value">{item.value}</p>
                                    <p className="muted">{item.limit}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card">
                        <h3 className="section-title">Technician & Remarks</h3>
                        <div className="row">
                            <span className="label">Technician</span>
                            <span className="value">{formData.technicianName || '—'}</span>
                        </div>
                        <div className="divider"></div>
                        <p className="muted">{formData.remarks || 'No remarks provided.'}</p>
                    </div>
                </div>
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
                                    { id: 'phLevel', label: 'pH Level', placeholder: 'Enter pH level', hint: 'Typical range: 5.5 - 7.5' },
                                    { id: 'colorCheck', label: 'Color Check', placeholder: 'Enter observed color', hint: 'Expected: Light brown to brown' },
                                    { id: 'odorCheck', label: 'Odor Check', placeholder: 'Describe odor characteristics', hint: 'Expected: Characteristic earthy odor' },
                                    { id: 'foreignMatter', label: 'Foreign Matter (%)', placeholder: 'Enter foreign matter percentage', hint: 'Maximum limit: 2%' },
                                    { id: 'sampleCondition', label: 'Sample Condition', placeholder: 'e.g., Intact / Damaged / Moist', hint: 'Physical state upon receipt' },
                                    { id: 'packagingIntegrity', label: 'Packaging Integrity', placeholder: 'e.g., Sealed / Compromised', hint: 'Seal and tamper status' },
                                    { id: 'samplingDate', label: 'Sampling Date', placeholder: 'Select sampling date', hint: 'Date when sample was collected', type: 'date' }
                                ].map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <label htmlFor={field.id} className="block text-sm font-semibold text-gray-900">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type || 'text'}
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
