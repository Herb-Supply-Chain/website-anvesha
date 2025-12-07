'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import QRCode from 'qrcode'
import { Batch } from '@/lib/types/batch'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface LabTest {
    // Physical & Organoleptic
    moistureContent: string
    colorCheck: string
    odorCheck: string
    foreignMatter: string

    // Chemical Analysis
    purity: string
    contamination: string
    heavyMetals: string
    pesticides: string

    // Microbial Analysis
    microbialLoad: string
    aflatoxins: string

    // Advanced Tests
    hplcAnalysis: string
    tlcFingerprinting: string
    spectroscopy: string
    chromatography: string

    // Quality Assessment
    overallGrade: string
    complianceStatus: string
    ayushCompliance: string
    fssaiCompliance: string
    remarks: string
}

export default function LabTestingPage() {
    const router = useRouter()
    const [batches, setBatches] = useState<Batch[]>([])
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [activeTab, setActiveTab] = useState('physical')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [labTest, setLabTest] = useState<LabTest>({
        moistureContent: '',
        colorCheck: '',
        odorCheck: '',
        foreignMatter: '',
        purity: '',
        contamination: '',
        heavyMetals: '',
        pesticides: '',
        microbialLoad: '',
        aflatoxins: '',
        hplcAnalysis: '',
        tlcFingerprinting: '',
        spectroscopy: '',
        chromatography: '',
        overallGrade: '',
        complianceStatus: '',
        ayushCompliance: '',
        fssaiCompliance: '',
        remarks: ''
    })

    useEffect(() => {
        loadBatches()
    }, [])

    useEffect(() => {
        if (selectedBatch?.labResults) {
            // Load existing lab results if available
            setLabTest({
                moistureContent: selectedBatch.labResults.moisture?.toString() || '',
                colorCheck: selectedBatch.labResults.colorCheck || '',
                odorCheck: selectedBatch.labResults.odorCheck || '',
                foreignMatter: selectedBatch.labResults.foreignMatter?.toString() || '',
                purity: selectedBatch.labResults.purity?.toString() || '',
                contamination: selectedBatch.labResults.contamination || '',
                heavyMetals: selectedBatch.labResults.heavyMetals?.toString() || '',
                pesticides: selectedBatch.labResults.pesticides?.toString() || '',
                microbialLoad: selectedBatch.labResults.microbialLoad?.toString() || '',
                aflatoxins: selectedBatch.labResults.aflatoxins?.toString() || '',
                hplcAnalysis: '',
                tlcFingerprinting: '',
                spectroscopy: '',
                chromatography: '',
                overallGrade: '',
                complianceStatus: '',
                ayushCompliance: '',
                fssaiCompliance: '',
                remarks: selectedBatch.labResults.remarks || ''
            })
        } else {
            // Reset form for new batch
            setLabTest({
                moistureContent: '',
                colorCheck: '',
                odorCheck: '',
                foreignMatter: '',
                purity: '',
                contamination: '',
                heavyMetals: '',
                pesticides: '',
                microbialLoad: '',
                aflatoxins: '',
                hplcAnalysis: '',
                tlcFingerprinting: '',
                spectroscopy: '',
                chromatography: '',
                overallGrade: '',
                complianceStatus: '',
                ayushCompliance: '',
                fssaiCompliance: '',
                remarks: ''
            })
        }
    }, [selectedBatch])

    const loadBatches = async () => {
        setIsLoading(true)
        try {
            // Load batches that are ready for lab testing (status: ready or testing)
            const response = await axios.get(`${API_URL}/batches`)
            // Filter batches that are ready for testing or currently being tested
            const testingBatches = response.data.filter((batch: Batch) =>
                batch.status === 'ready' || batch.status === 'testing' || batch.labStatus === 'in_progress'
            )
            setBatches(testingBatches)
        } catch (error) {
            console.error('Error loading batches:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBatchSelect = (batch: Batch) => {
        setSelectedBatch(batch)
        // Update batch status to in_progress if it's not already
        if (batch.labStatus !== 'in_progress' && batch.labStatus !== 'completed') {
            updateBatchStatus(batch.id, 'in_progress')
        }
    }

    const updateBatchStatus = async (batchId: string, status: 'in_progress' | 'completed') => {
        try {
            await axios.patch(`${API_URL}/batches`, {
                id: batchId,
                labStatus: status
            })
        } catch (error) {
            console.error('Error updating batch status:', error)
        }
    }

    const generateLabSampleId = (batch: Batch): string => {
        const year = new Date().getFullYear()
        const herbCode = batch.herb.substring(0, 3).toUpperCase()
        const batchNumber = batch.id.split('-').pop()?.padStart(3, '0') || '001'
        return `LAB-${year}-${herbCode}-${batchNumber}`
    }

    const handleInputChange = (field: keyof LabTest, value: string) => {
        setLabTest(prev => ({ ...prev, [field]: value }))
    }

    const generateCertificatePDF = async (batch: Batch, sampleId: string) => {
        try {
            // Generate QR Code
            const qrData = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/consumer-portal?batch=${batch.id}&lab=${sampleId}`
            const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
                width: 200,
                margin: 2,
                color: {
                    dark: '#0d9488',
                    light: '#FFFFFF'
                }
            })

            // Create a simple HTML certificate
            const certificateHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; }
                        .certificate { border: 3px solid #0d9488; padding: 30px; max-width: 800px; margin: 0 auto; }
                        .header { text-align: center; color: #0d9488; margin-bottom: 30px; }
                        .qr-code { text-align: center; margin: 20px 0; }
                        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                        .info-item { padding: 10px; background: #f0fdfa; border-radius: 5px; }
                        .label { font-weight: bold; color: #0d9488; }
                        .pass-stamp { color: #10b981; font-size: 48px; font-weight: bold; text-align: center; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="certificate">
                        <div class="header">
                            <h1>ANVESHA LABORATORY</h1>
                            <h2>Quality Test Certificate</h2>
                            <p>Sample ID: ${sampleId}</p>
                        </div>
                        <div class="pass-stamp">✓ PASSED</div>
                        <div class="info-grid">
                            <div class="info-item"><span class="label">Herb:</span> ${batch.herb}</div>
                            <div class="info-item"><span class="label">Batch ID:</span> ${batch.processorBatchId || batch.id}</div>
                            <div class="info-item"><span class="label">Farm ID:</span> ${batch.farmId}</div>
                            <div class="info-item"><span class="label">Quantity:</span> ${batch.weight}kg</div>
                            <div class="info-item"><span class="label">Test Date:</span> ${new Date().toLocaleDateString()}</div>
                            <div class="info-item"><span class="label">Grade:</span> ${labTest.overallGrade || 'N/A'}</div>
                            <div class="info-item"><span class="label">Moisture:</span> ${labTest.moistureContent}%</div>
                            <div class="info-item"><span class="label">Purity:</span> ${labTest.purity}%</div>
                            <div class="info-item"><span class="label">AYUSH:</span> ${labTest.ayushCompliance || 'N/A'}</div>
                            <div class="info-item"><span class="label">FSSAI:</span> ${labTest.fssaiCompliance || 'N/A'}</div>
                        </div>
                        <div class="qr-code">
                            <img src="${qrCodeDataUrl}" alt="QR Code" />
                            <p>Scan for full traceability</p>
                        </div>
                    </div>
                </body>
                </html>
            `

            // Open certificate in new window for printing/saving
            const printWindow = window.open('', '_blank')
            if (printWindow) {
                printWindow.document.write(certificateHTML)
                printWindow.document.close()
                printWindow.print()
            }
        } catch (error) {
            console.error('Error generating certificate PDF:', error)
        }
    }

    const handleGenerateCertificate = async () => {
        if (!selectedBatch) return

        // Validate required fields
        if (!labTest.moistureContent || !labTest.purity) {
            alert('Please fill in at least Moisture Content and Purity fields')
            return
        }

        // Validate Pass/Fail/Hold selection
        if (!labTest.complianceStatus) {
            alert('⚠️ Please select Overall Test Result (PASS/FAIL/HOLD) in the Quality Assessment tab')
            return
        }

        setIsSaving(true)
        try {
            const sampleId = generateLabSampleId(selectedBatch)

            // Determine final status based on test result
            let finalStatus: 'approved' | 'rejected' | 'testing' = 'testing'
            let approved = false

            if (labTest.complianceStatus === 'PASS') {
                finalStatus = 'approved'
                approved = true
            } else if (labTest.complianceStatus === 'FAIL') {
                finalStatus = 'rejected'
                approved = false
            } else {
                // HOLD - keep in testing status
                finalStatus = 'testing'
                approved = false
            }

            // Update batch with comprehensive lab results
            await axios.patch(`${API_URL}/batches`, {
                id: selectedBatch.id,
                labStatus: 'completed',
                labTestDate: new Date().toISOString().split('T')[0],
                labResults: {
                    // Physical & Organoleptic
                    moisture: parseFloat(labTest.moistureContent) || 0,
                    colorCheck: labTest.colorCheck || '',
                    odorCheck: labTest.odorCheck || '',
                    foreignMatter: parseFloat(labTest.foreignMatter) || 0,

                    // Chemical Analysis
                    purity: parseFloat(labTest.purity) || 0,
                    contamination: labTest.contamination || 'None detected',
                    heavyMetals: parseFloat(labTest.heavyMetals) || 0,
                    pesticides: parseFloat(labTest.pesticides) || 0,

                    // Microbial Analysis
                    microbialLoad: parseFloat(labTest.microbialLoad) || 0,
                    aflatoxins: parseFloat(labTest.aflatoxins) || 0,

                    // Overall approval
                    approved: approved,
                    remarks: labTest.remarks || `Test Result: ${labTest.complianceStatus}`
                },
                status: finalStatus // approved, rejected, or testing
            })

            // Generate certificate and QR code only for PASS results
            if (labTest.complianceStatus === 'PASS') {
                await generateCertificatePDF(selectedBatch, sampleId)
                alert(`✅ Lab test PASSED! Certificate generated successfully.\n\nBatch is now approved and ready for packaging/manufacturing.`)
            } else if (labTest.complianceStatus === 'FAIL') {
                alert(`❌ Lab test FAILED!\n\nBatch has been rejected and will not proceed to packaging.`)
            } else {
                alert(`⏸️ Lab test result: HOLD\n\nBatch requires further review before proceeding.`)
            }

            // Reload batches and clear selection
            await loadBatches()
            setSelectedBatch(null)
            setActiveTab('physical')
        } catch (error) {
            console.error('Error saving lab results:', error)
            alert('❌ Failed to save lab results. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const tabs = [
        { id: 'physical', label: 'Physical & Organoleptic', icon: '🔬' },
        { id: 'chemical', label: 'Chemical Analysis', icon: '⚗️' },
        { id: 'microbial', label: 'Microbial Analysis', icon: '🦠' },
        { id: 'advanced', label: 'Advanced Tests', icon: '🧪' },
        { id: 'quality', label: 'Quality Assessment', icon: '✓' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-[#01aeae] text-white p-6 shadow-lg">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-3xl">🧬</span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">ANVESHA</div>
                            <div className="text-sm opacity-90">LABORATORY</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Sidebar - Batch List */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm">📋</span>
                                </div>
                                <h2 className="font-bold text-gray-900 text-lg">Pending Tests</h2>
                            </div>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {isLoading ? (
                                    <div className="text-center py-8 text-gray-400">Loading...</div>
                                ) : batches.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <div className="text-4xl mb-2">🧪</div>
                                        <p>No batches for testing</p>
                                    </div>
                                ) : (
                                    batches.map((batch) => (
                                        <div
                                            key={batch.id}
                                            onClick={() => handleBatchSelect(batch)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedBatch?.id === batch.id
                                                ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-md'
                                                : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 text-sm">
                                                        {batch.processorBatchId || batch.id}
                                                    </div>
                                                    <div className="text-xs text-teal-700 mt-1">🌿 {batch.herb}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {batch.weight}kg • {batch.farmId}
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${batch.labStatus === 'in_progress'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {batch.labStatus === 'in_progress' ? '⏳ In Progress' : '🔴 HIGH'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {selectedBatch?.id === batch.id && (
                                                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-2 space-y-6">
                        {selectedBatch ? (
                            <>
                                {/* Sample Information */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <h2 className="text-lg font-bold text-teal-800 mb-4">Sample Information</h2>
                                    <div className="grid grid-cols-5 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Sample ID</div>
                                            <div className="font-semibold text-teal-600">
                                                {generateLabSampleId(selectedBatch)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Source Farm</div>
                                            <div className="font-semibold text-gray-900">{selectedBatch.farmId}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Herb</div>
                                            <div className="font-semibold text-gray-900">{selectedBatch.herb}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Quantity Received</div>
                                            <div className="font-semibold text-gray-900">{selectedBatch.weight}kg</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Priority</div>
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                HIGH
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Testing Form */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <h2 className="text-xl font-bold text-teal-800 mb-4">
                                        Testing Form - {selectedBatch.processorBatchId || selectedBatch.id}
                                    </h2>

                                    {/* Tabs */}
                                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <span className="mr-2">{tab.icon}</span>
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Physical & Organoleptic Tests */}
                                    {activeTab === 'physical' && (
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-teal-800 text-lg">Physical & Organoleptic Tests</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Moisture Content (%)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.moistureContent}
                                                        onChange={(e) => handleInputChange('moistureContent', e.target.value)}
                                                        placeholder="Enter moisture content"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Color Check
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.colorCheck}
                                                        onChange={(e) => handleInputChange('colorCheck', e.target.value)}
                                                        placeholder="Enter observed color"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Odor Check
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.odorCheck}
                                                        onChange={(e) => handleInputChange('odorCheck', e.target.value)}
                                                        placeholder="Describe odor characteristics"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Foreign Matter (%)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.foreignMatter}
                                                        onChange={(e) => handleInputChange('foreignMatter', e.target.value)}
                                                        placeholder="Enter foreign matter percentage"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Chemical Analysis */}
                                    {activeTab === 'chemical' && (
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-teal-800 text-lg">Chemical Analysis</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Purity (%)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.purity}
                                                        onChange={(e) => handleInputChange('purity', e.target.value)}
                                                        placeholder="Enter purity percentage"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Contamination
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.contamination}
                                                        onChange={(e) => handleInputChange('contamination', e.target.value)}
                                                        placeholder="Enter contamination details"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Heavy Metals (ppm)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.heavyMetals}
                                                        onChange={(e) => handleInputChange('heavyMetals', e.target.value)}
                                                        placeholder="Enter heavy metals level"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Pesticides (ppm)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.pesticides}
                                                        onChange={(e) => handleInputChange('pesticides', e.target.value)}
                                                        placeholder="Enter pesticide residue level"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Microbial Analysis */}
                                    {activeTab === 'microbial' && (
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-teal-800 text-lg">Microbial Analysis</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Microbial Load (CFU/g)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.microbialLoad}
                                                        onChange={(e) => handleInputChange('microbialLoad', e.target.value)}
                                                        placeholder="Enter microbial load"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Aflatoxins (ppb)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.aflatoxins}
                                                        onChange={(e) => handleInputChange('aflatoxins', e.target.value)}
                                                        placeholder="Enter aflatoxin level"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Advanced Tests */}
                                    {activeTab === 'advanced' && (
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-teal-800 text-lg">Advanced Tests</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        HPLC Analysis
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.hplcAnalysis}
                                                        onChange={(e) => handleInputChange('hplcAnalysis', e.target.value)}
                                                        placeholder="Enter HPLC analysis results"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        TLC Fingerprinting
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.tlcFingerprinting}
                                                        onChange={(e) => handleInputChange('tlcFingerprinting', e.target.value)}
                                                        placeholder="Enter TLC fingerprinting results"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Spectroscopy
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.spectroscopy}
                                                        onChange={(e) => handleInputChange('spectroscopy', e.target.value)}
                                                        placeholder="Enter spectroscopy results"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Chromatography
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={labTest.chromatography}
                                                        onChange={(e) => handleInputChange('chromatography', e.target.value)}
                                                        placeholder="Enter chromatography results"
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quality Assessment */}
                                    {activeTab === 'quality' && (
                                        <div className="space-y-6">
                                            <h3 className="font-bold text-teal-800 text-lg">Quality Assessment</h3>

                                            {/* Overall Result Status */}
                                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border-2 border-teal-200">
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    Overall Test Result *
                                                </label>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {['PASS', 'FAIL', 'HOLD'].map((status) => (
                                                        <button
                                                            key={status}
                                                            type="button"
                                                            onClick={() => handleInputChange('complianceStatus', status)}
                                                            className={`px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${labTest.complianceStatus === status
                                                                ? status === 'PASS'
                                                                    ? 'bg-green-500 text-white shadow-lg scale-105'
                                                                    : status === 'FAIL'
                                                                        ? 'bg-red-500 text-white shadow-lg scale-105'
                                                                        : 'bg-yellow-500 text-white shadow-lg scale-105'
                                                                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-teal-400'
                                                                }`}
                                                        >
                                                            {status === 'PASS' && '✓'} {status === 'FAIL' && '✗'} {status === 'HOLD' && '⏸'} {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Overall Grade
                                                    </label>
                                                    <select
                                                        value={labTest.overallGrade}
                                                        onChange={(e) => handleInputChange('overallGrade', e.target.value)}
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    >
                                                        <option value="">Select Grade</option>
                                                        <option value="A+">A+ (Excellent)</option>
                                                        <option value="A">A (Very Good)</option>
                                                        <option value="B">B (Good)</option>
                                                        <option value="C">C (Acceptable)</option>
                                                        <option value="D">D (Below Standard)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        AYUSH Compliance
                                                    </label>
                                                    <select
                                                        value={labTest.ayushCompliance}
                                                        onChange={(e) => handleInputChange('ayushCompliance', e.target.value)}
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    >
                                                        <option value="">Select Status</option>
                                                        <option value="Compliant">✓ Compliant</option>
                                                        <option value="Non-Compliant">✗ Non-Compliant</option>
                                                        <option value="Pending">⏳ Pending Review</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        FSSAI Compliance
                                                    </label>
                                                    <select
                                                        value={labTest.fssaiCompliance}
                                                        onChange={(e) => handleInputChange('fssaiCompliance', e.target.value)}
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    >
                                                        <option value="">Select Status</option>
                                                        <option value="Compliant">✓ Compliant</option>
                                                        <option value="Non-Compliant">✗ Non-Compliant</option>
                                                        <option value="Pending">⏳ Pending Review</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Remarks / Notes
                                                    </label>
                                                    <textarea
                                                        value={labTest.remarks}
                                                        onChange={(e) => handleInputChange('remarks', e.target.value)}
                                                        placeholder="Enter any additional remarks or observations"
                                                        rows={4}
                                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Generate Certificate Button */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={handleGenerateCertificate}
                                            disabled={isSaving}
                                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-6 py-4 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? '⏳ Saving...' : '✨ Generate Certificate'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-12 border border-gray-100 text-center">
                                <div className="text-6xl mb-4">🧬</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Batch to Test</h3>
                                <p className="text-gray-600">Choose a batch from the left sidebar to begin testing</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

