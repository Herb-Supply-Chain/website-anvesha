'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProcessorPage() {
    const router = useRouter()
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://server-anvesha.onrender.com'
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [numberOfBarcodes, setNumberOfBarcodes] = useState('10')
    const [isGenerating, setIsGenerating] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        batchId: '',
        processType: '',
        startTime: '',
        endTime: '',
        temperature: '',
        outputWeight: '',
        ipfsHash: '',
        remarks: ''
    })
    const [formErrors, setFormErrors] = useState({
        batchId: '',
        processType: '',
        startTime: '',
        endTime: '',
        temperature: '',
        outputWeight: '',
        ipfsHash: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Helper function to get token from cookies or localStorage
    const getToken = () => {
        if (typeof document === 'undefined') return null
        
        // Try cookies first
        const cookies = document.cookie.split(';')
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=')
            if (name === 'jwt_token') {
                try {
                    const decoded = decodeURIComponent(value || '')
                    if (decoded && decoded.trim() !== '') {
                        return decoded
                    }
                } catch {
                    if (value && value.trim() !== '') {
                        return value
                    }
                }
            }
        }
        
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwt_token')
            if (token && token.trim() !== '') {
                return token
            }
        }
        
        return null
    }   

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            const token = getToken()
            return token !== null
        }

        const authenticated = checkAuth()
        setIsAuthenticated(authenticated)

        // If not authenticated, redirect to login
        if (!authenticated) {
            router.push('/')
        }
    }, [router])

    const handleGenerateAndDownload = async () => {
        const count = parseInt(numberOfBarcodes)
        if (isNaN(count) || count <= 0 || count > 1000) {
            alert('Please enter a valid number between 1 and 1000')
            return
        }
        setIsGenerating(true)

        try {
            // Send count to server
            const token = getToken()
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            }
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            // Send count to server and get batch IDs
            let batchIds: string[] = []
            
            try {
                const response = await fetch(`${API_BASE}/api/batch-ids`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        count: count
                    }),
                })

                const data = await response.json()
                console.log('Batch IDs API response:', data)

                if (response.ok && data.success && data.data?.batchIds) {
                    batchIds = data.data.batchIds
                    console.log('Received batch IDs:', batchIds)
                } else {
                    throw new Error(data?.message || 'Failed to get batch IDs from server')
                }
            } catch (apiError) {
                console.error('Error getting batch IDs from server:', apiError)
                alert('Failed to get batch IDs from server. Please try again.')
                setIsGenerating(false)
                return
            }

            if (batchIds.length === 0) {
                alert('No batch IDs received from server')
                setIsGenerating(false)
                return
            }

            // Dynamically import jsPDF and jsbarcode
            const { default: jsPDF } = await import('jspdf')
            const jsbarcodeModule: any = await import('jsbarcode')
            const JsBarcode: any = jsbarcodeModule.default || jsbarcodeModule

            // Create PDF
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            // Add header
            doc.setFontSize(18)
            doc.setTextColor(1, 72, 72) // Teal color
            doc.text('ANVESHA - Barcode Report', 105, 20, { align: 'center' })
            
            doc.setFontSize(12)
            doc.setTextColor(0, 0, 0)
            doc.text('Ministry of AYUSH, Government of India', 105, 28, { align: 'center' })
            doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 34, { align: 'center' })
            doc.text(`Total Barcodes: ${batchIds.length}`, 105, 40, { align: 'center' })

            // Add barcodes in a grid layout
            const startY = 50
            const margin = 15 // Increased margin from edges
            const pageWidth = 210 // A4 width in mm
            const barcodeImageWidth = 50 // Width for barcode image in mm
            const barcodeImageHeight = 20 // Height for barcode image in mm
            const textHeight = 5 // Height for text below barcode
            const totalItemHeight = barcodeImageHeight + textHeight + 8 // Increased vertical spacing between rows
            const horizontalSpacing = 10 // Increased horizontal spacing between barcodes
            const verticalSpacing = 8 // Increased vertical spacing between rows
            const colsPerRow = Math.floor((pageWidth - 2 * margin) / (barcodeImageWidth + horizontalSpacing))
            let currentX = margin
            let currentY = startY

            doc.setFontSize(7)
            doc.setTextColor(0, 0, 0)

            // Generate barcode images and add to PDF
            for (let i = 0; i < batchIds.length; i++) {
                const batchId = batchIds[i]
                
                // Check if we need a new page
                if (currentY + totalItemHeight > 280) {
                    doc.addPage()
                    currentY = 20
                }

                // Create a canvas element to generate barcode
                const canvas = document.createElement('canvas')
                
                // EAN-13 requires exactly 13 digits with a valid checksum
                // Calculate EAN-13 checksum (positions are 1-indexed)
                const calculateEAN13Checksum = (digits: string): string => {
                    // Take first 12 digits
                    let first12 = digits.substring(0, 12).padStart(12, '0')
                    
                    // EAN-13 checksum algorithm:
                    // Sum digits at positions 1, 3, 5, 7, 9, 11 (1-indexed)
                    // Sum digits at positions 2, 4, 6, 8, 10, 12 (1-indexed) and multiply by 3
                    // Checksum = (10 - (total % 10)) % 10
                    
                    let sumOdd = 0  // Positions 1, 3, 5, 7, 9, 11 (1-indexed) = indices 0, 2, 4, 6, 8, 10 (0-indexed)
                    let sumEven = 0 // Positions 2, 4, 6, 8, 10, 12 (1-indexed) = indices 1, 3, 5, 7, 9, 11 (0-indexed)
                    
                    for (let i = 0; i < 12; i++) {
                        const digit = parseInt(first12[i])
                        if (i % 2 === 0) {
                            // Odd positions (1-indexed: 1, 3, 5, 7, 9, 11)
                            sumOdd += digit
                        } else {
                            // Even positions (1-indexed: 2, 4, 6, 8, 10, 12)
                            sumEven += digit
                        }
                    }
                    
                    const total = sumOdd + (sumEven * 3)
                    const checksum = (10 - (total % 10)) % 10
                    const ean13 = first12 + checksum.toString()
                    
                    // Validate the generated EAN-13
                    console.log(`Batch ID: ${digits}, EAN-13: ${ean13}, Checksum: ${checksum}`)
                    
                    return ean13
                }
                
                // Format batch ID for EAN-13
                let batchIdStr = batchId.toString().replace(/\D/g, '') // Remove non-digits
                
                // If batch ID is less than 12 digits, pad with leading zeros
                if (batchIdStr.length < 12) {
                    batchIdStr = batchIdStr.padStart(12, '0')
                } else if (batchIdStr.length > 12) {
                    // If longer than 12, take first 12 digits
                    batchIdStr = batchIdStr.substring(0, 12)
                }
                
                // Calculate EAN-13 code with checksum
                const ean13Code = calculateEAN13Checksum(batchIdStr)
                
                try {
                    // Validate EAN-13 format before generating
                    if (!/^\d{13}$/.test(ean13Code)) {
                        throw new Error(`Invalid EAN-13 format: ${ean13Code}`)
                    }
                    
                    // Call JsBarcode function with EAN-13 format
                    const barcodeFunc = typeof JsBarcode === 'function' ? JsBarcode : ((JsBarcode as any).default || JsBarcode)
                    
                    barcodeFunc(canvas, ean13Code, {
                        format: 'EAN13',
                        width: 2,
                        height: 50,
                        displayValue: true,
                        margin: 5,
                        fontSize: 12,
                        valid: function(valid: boolean) {
                            if (!valid) {
                                console.warn('EAN-13 validation failed for:', ean13Code, 'from batch ID:', batchId)
                            }
                        }
                    })
                    
                    // Verify canvas has content
                    if (!canvas.width || !canvas.height) {
                        throw new Error('Canvas not initialized properly')
                    }
                } catch (barcodeError: any) {
                    console.error('Error generating EAN-13 barcode for', batchId, ':', barcodeError)
                    console.error('Generated EAN-13 code:', ean13Code)
                    
                    // Fallback: Use CODE128 format which is more flexible
                    try {
                        const barcodeFunc = typeof JsBarcode === 'function' ? JsBarcode : ((JsBarcode as any).default || JsBarcode)
                        barcodeFunc(canvas, batchId.toString(), {
                            format: 'CODE128',
                            width: 2,
                            height: 50,
                            displayValue: true,
                            margin: 5,
                            fontSize: 12
                        })
                        console.log('Used CODE128 fallback for batch ID:', batchId)
                    } catch (fallbackError) {
                        console.error('Fallback barcode generation also failed:', fallbackError)
                        // Last resort: create a simple text representation
                        const ctx = canvas.getContext('2d')
                        if (ctx) {
                            canvas.width = 200
                            canvas.height = 50
                            ctx.fillStyle = 'black'
                            ctx.font = '12px Arial'
                            ctx.fillText(batchId.toString(), 10, 25)
                        }
                    }
                }

                // Convert canvas to image data URL
                const barcodeDataUrl = canvas.toDataURL('image/png')

                // Add barcode image to PDF
                doc.addImage(
                    barcodeDataUrl,
                    'PNG',
                    currentX,
                    currentY,
                    barcodeImageWidth,
                    barcodeImageHeight
                )

                // Add batch ID text below barcode
                doc.text(
                    batchId,
                    currentX + barcodeImageWidth / 2,
                    currentY + barcodeImageHeight + textHeight,
                    { align: 'center' }
                )

                // Move to next position
                currentX += barcodeImageWidth + horizontalSpacing
                if ((i + 1) % colsPerRow === 0) {
                    currentX = margin
                    currentY += totalItemHeight + verticalSpacing
                }
            }

            // Add footer on last page
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(8)
                doc.setTextColor(128, 128, 128)
                doc.text(
                    `Page ${i} of ${pageCount} | ANVESHA Traceability System`,
                    105,
                    290,
                    { align: 'center' }
                )
            }

            // Download PDF
            const timestamp = Date.now()
            const fileName = `barcodes_${new Date().toISOString().split('T')[0]}_${timestamp}.pdf`
            doc.save(fileName)

            alert(`✅ Successfully generated and downloaded ${batchIds.length} barcodes as PDF!`)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Error generating PDF. Please try again.')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            batchId: '',
            processType: '',
            startTime: '',
            endTime: '',
            temperature: '',
            outputWeight: '',
            ipfsHash: ''
        }
        let isValid = true

        const requiredFields: (keyof typeof errors)[] = ['batchId', 'processType', 'startTime', 'endTime', 'temperature', 'outputWeight', 'ipfsHash']
        requiredFields.forEach((field) => {
            if (!formData[field].trim()) {
                errors[field] = 'Required'
                isValid = false
            }
        })

        const temp = parseFloat(formData.temperature)
        if (formData.temperature && (isNaN(temp))) {
            errors.temperature = 'Enter a valid number'
            isValid = false
        }

        const output = parseFloat(formData.outputWeight)
        if (formData.outputWeight && (isNaN(output) || output <= 0)) {
            errors.outputWeight = 'Must be a positive number'
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

            const payload = {
                batchId: formData.batchId,
                processType: formData.processType,
                startTime: formData.startTime,
                endTime: formData.endTime,
                temperature: formData.temperature ? Number(formData.temperature) : null,
                outputWeight: formData.outputWeight ? Number(formData.outputWeight) : null,
                ipfsHash: formData.ipfsHash,
                remarks: formData.remarks || ''
            }

            const res = await fetch(`${API_BASE}/api/processing/upload`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data?.message || 'Failed to upload processing data')
            }

            alert('✅ Processing data uploaded')
            setFormData({
                batchId: '',
                processType: '',
                startTime: '',
                endTime: '',
                temperature: '',
                outputWeight: '',
                ipfsHash: '',
                remarks: ''
            })
            setShowForm(false)
        } catch (error) {
            console.error('Error submitting form:', error)
            alert('Error adding data. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCloseForm = () => {
        setFormData({
            batchId: '',
            processType: '',
            startTime: '',
            endTime: '',
            temperature: '',
            outputWeight: '',
            ipfsHash: '',
            remarks: ''
        })
        setFormErrors({
            batchId: '',
            processType: '',
            startTime: '',
            endTime: '',
            temperature: '',
            outputWeight: '',
            ipfsHash: ''
        })
        setShowForm(false)
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center font-inter">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Checking authentication...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white font-inter">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#014848] to-[#016868] text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                            <Link href="/" aria-label="Go to home" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-xl p-1 shadow-lg block">
                                <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                            </Link>
                            <div className="hidden sm:block">
                                <h1 className="text-xs sm:text-sm lg:text-base font-bold">Government of India | भारत सरकार</h1>
                                <p className="text-[10px] sm:text-xs font-medium text-teal-100">Ministry of AYUSH | आयुष मंत्रालय</p>
                                <p className="text-[10px] sm:text-xs font-semibold text-teal-100">ANVESHA Processor | अन्वेषा</p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className="text-xs font-bold">ANVESHA</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2 sm:py-2.5 px-3 sm:px-4 lg:px-6 rounded-lg border border-white/20 hover:border-white/40 transition-all shadow-sm hover:shadow-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span className="hidden sm:inline">Add Data</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl mb-4 sm:mb-6 shadow-lg">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
                        Processor Portal
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Generate barcodes and manage processing data for your batches
                    </p>
                </div>

                {/* Generate Barcode Card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 sm:px-8 py-6 sm:py-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h8.01M19 12v-2.01M12 12H9.99M12 8H8.01M12 8V5.99M12 16v-1m-6 0h2m6 0h2v-4m0 4v3m0 0h.01M12 20h-2.01M5 12H2.99M12 12h-2.01M8 12H5.99M12 16H8.01" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white">Barcode Generation</h3>
                                <p className="text-sm text-teal-100 mt-1">Create unique barcodes for your processed batches</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="text-center mb-8">
                            {/* Barcode Generation Inputs */}
                            <div className="max-w-md mx-auto mb-6 space-y-2">
                                <label className="block text-sm font-semibold text-gray-900">
                                    Number of Barcodes to Generate
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={numberOfBarcodes}
                                        onChange={(e) => setNumberOfBarcodes(e.target.value)}
                                        min="1"
                                        max="1000"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all hover:border-gray-300 font-semibold"
                                        placeholder="Enter number"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Enter a number between 1 and 1000</p>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerateAndDownload}
                                disabled={isGenerating}
                                className="w-full max-w-md mx-auto bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-4 sm:py-5 rounded-xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base sm:text-lg transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Generating PDF...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Generate Barcode & Download PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-6 sm:p-8 border-2 border-teal-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">How it works</h3>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                Enter the number of barcodes you need, click the button, and a PDF file will be automatically generated and downloaded. Each barcode is unique and can be used for package identification in the traceability system.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Data Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between rounded-t-3xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-white">Add Process Data</h3>
                            </div>
                            <button
                                onClick={handleCloseForm}
                                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
                                    <label htmlFor="batchId" className="block text-sm font-bold text-gray-900 mb-3">
                                        Batch ID <span className="text-red-500">*</span>
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
                                        placeholder="Enter batch ID"
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

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
                                    <label htmlFor="processType" className="block text-sm font-bold text-gray-900 mb-3">
                                        Process Type <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="processType"
                                        name="processType"
                                        value={formData.processType}
                                        onChange={handleFormChange}
                                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold text-gray-900 text-base ${
                                            formErrors.processType
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 bg-white hover:border-gray-300'
                                        }`}
                                        placeholder="Drying / Milling / Packaging"
                                    />
                                    {formErrors.processType && (
                                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formErrors.processType}
                                        </p>
                                    )}
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
                                    <label className="block text-sm font-bold text-gray-900 mb-3">
                                        Processing Window <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="datetime-local"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleFormChange}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold text-gray-900 text-base ${
                                                formErrors.startTime
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                    : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 bg-white hover:border-gray-300'
                                            }`}
                                        />
                                        <input
                                            type="datetime-local"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleFormChange}
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold text-gray-900 text-base ${
                                                formErrors.endTime
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                    : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 bg-white hover:border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {(formErrors.startTime || formErrors.endTime) && (
                                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formErrors.startTime || formErrors.endTime}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
                                    <label htmlFor="temperature" className="block text-sm font-bold text-gray-900 mb-3">
                                        Temperature (°C) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="temperature"
                                        name="temperature"
                                        value={formData.temperature}
                                        onChange={handleFormChange}
                                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold text-gray-900 text-base ${
                                            formErrors.temperature
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 bg-white hover:border-gray-300'
                                        }`}
                                        placeholder="Enter temperature"
                                    />
                                    {formErrors.temperature && (
                                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formErrors.temperature}
                                        </p>
                                    )}
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
                                    <label htmlFor="outputWeight" className="block text-sm font-bold text-gray-900 mb-3">
                                        Output Weight (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="outputWeight"
                                        name="outputWeight"
                                        value={formData.outputWeight}
                                        onChange={handleFormChange}
                                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold text-gray-900 text-base ${
                                            formErrors.outputWeight
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 bg-white hover:border-gray-300'
                                        }`}
                                        placeholder="Enter output weight"
                                    />
                                    {formErrors.outputWeight && (
                                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formErrors.outputWeight}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
                                    <label htmlFor="ipfsHash" className="block text-sm font-bold text-gray-900 mb-3">
                                        IPFS Hash <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="ipfsHash"
                                        name="ipfsHash"
                                        value={formData.ipfsHash}
                                        onChange={handleFormChange}
                                        className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold text-gray-900 text-base ${
                                            formErrors.ipfsHash
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-100 bg-red-50'
                                                : 'border-gray-200 focus:border-teal-500 focus:ring-teal-100 bg-white hover:border-gray-300'
                                        }`}
                                        placeholder="Enter IPFS hash"
                                    />
                                    {formErrors.ipfsHash && (
                                        <p className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {formErrors.ipfsHash}
                                        </p>
                                    )}
                                </div>
                                <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100">
                                    <label htmlFor="remarks" className="block text-sm font-bold text-gray-900 mb-3">
                                        Remarks (optional)
                                    </label>
                                    <textarea
                                        id="remarks"
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleFormChange}
                                        rows={3}
                                        className="w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-semibold text-gray-900 text-base border-gray-200 focus:border-teal-500 focus:ring-teal-100 bg-white hover:border-gray-300 resize-none"
                                        placeholder="Add any notes"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t-2 border-gray-100">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Submit</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
