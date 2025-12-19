'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import QRCode from 'qrcode'
import { Batch, Package } from '@/lib/types/batch'
import { generatePackagePDF, downloadPDF } from '@/lib/pdf-generator'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')
const API_URL = APP_URL ? `${APP_URL}/api` : '/api'

export default function PackagingPage() {
    const router = useRouter()
    const [readyBatches, setReadyBatches] = useState<Batch[]>([])
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [packages, setPackages] = useState<Package[]>([])
    const [packageSize, setPackageSize] = useState('25')
    const [qrSize, setQrSize] = useState('Medium')
    const [qrColor, setQrColor] = useState('Primary')
    const [isGenerating, setIsGenerating] = useState(false)
    const [qrCodePreview, setQrCodePreview] = useState<string>('')
    const [isDownloading, setIsDownloading] = useState<string | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        if (selectedBatch) {
            generateQRPreview()
        }
    }, [selectedBatch])

    const loadData = async () => {
        try {
            const [batchesRes, packagesRes] = await Promise.all([
                axios.get(`${API_URL}/batches?status=approved`),
                axios.get(`${API_URL}/packages`)
            ])
            setReadyBatches(batchesRes.data)
            setPackages(packagesRes.data)
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }

    const generateQRPreview = async () => {
        if (!selectedBatch) return

        try {
            const qrData = `${APP_URL || ''}/consumer-portal?batch=${selectedBatch.id}`
            const qrDataUrl = await QRCode.toDataURL(qrData, {
                width: 200,
                margin: 2,
                color: {
                    dark: qrColor === 'Primary' ? '#0d9488' : qrColor === 'Secondary' ? '#0891b2' : '#000000',
                    light: '#FFFFFF'
                }
            })
            setQrCodePreview(qrDataUrl)
        } catch (error) {
            console.error('Error generating QR preview:', error)
        }
    }

    const handleGenerateQR = async () => {
        if (!selectedBatch) return

        setIsGenerating(true)
        try {
            const numPackages = Math.ceil(selectedBatch.weight / parseInt(packageSize))

            for (let i = 0; i < numPackages; i++) {
                const qrData = `${APP_URL || ''}/consumer-portal?package=PKG-${selectedBatch.id}-${i + 1}`

                await axios.post(`${API_URL}/packages`, {
                    batchId: selectedBatch.id,
                    size: parseInt(packageSize),
                    qrCode: qrData,
                    qrStatus: 'generated',
                    status: 'pending'
                })
            }

            alert(`Successfully generated ${numPackages} QR codes!`)
            loadData()
        } catch (error) {
            console.error('Error generating QR codes:', error)
            alert('Failed to generate QR codes')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleDownloadPDF = async (pkg: Package) => {
        setIsDownloading(pkg.id)
        try {
            // Get the batch data for this package
            const batch = readyBatches.find(b => b.id === pkg.batchId)
            if (!batch) {
                alert('Batch data not found')
                return
            }

            // Generate PDF
            const pdfBlob = await generatePackagePDF(batch, pkg)

            // Download PDF
            const filename = `${pkg.id}_Traceability_Certificate.pdf`
            downloadPDF(pdfBlob, filename)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Failed to generate PDF')
        } finally {
            setIsDownloading(null)
        }
    }

    const handleDownloadAllPDFs = async () => {
        if (!selectedBatch) return

        const batchPackages = packages.filter(p => p.batchId === selectedBatch.id)
        if (batchPackages.length === 0) {
            alert('No packages found for this batch')
            return
        }

        setIsDownloading('all')
        try {
            for (const pkg of batchPackages) {
                const pdfBlob = await generatePackagePDF(selectedBatch, pkg)
                const filename = `${pkg.id}_Traceability_Certificate.pdf`
                downloadPDF(pdfBlob, filename)
                // Small delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500))
            }
        } catch (error) {
            console.error('Error generating PDFs:', error)
            alert('Failed to generate all PDFs')
        } finally {
            setIsDownloading(null)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 shadow-lg">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/processor')}
                            className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Back To Dashboard</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                        <h1 className="text-3xl font-bold text-gray-900">QR Code & Packaging Module</h1>
                    </div>
                    <p className="text-gray-600 ml-7">Generate QR codes and download traceability certificates for approved batches</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Left Panel */}
                    <div className="space-y-6">
                        {/* Batches Ready for Packaging */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm">📋</span>
                                </div>
                                <h2 className="font-bold text-gray-900 text-lg">Batches Ready for Packaging</h2>
                            </div>
                            <div className="space-y-3">
                                {readyBatches.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <div className="text-4xl mb-2">📦</div>
                                        <p>No batches ready for packaging</p>
                                    </div>
                                ) : (
                                    readyBatches.map((batch) => (
                                        <div
                                            key={batch.id}
                                            onClick={() => setSelectedBatch(batch)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedBatch?.id === batch.id
                                                ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md'
                                                : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{batch.processorBatchId || batch.id}</div>
                                                    <div className="text-sm text-gray-600 mt-1">{batch.herb}</div>
                                                    <div className="text-sm text-gray-500 mt-1">{batch.weight}kg • {batch.createdAt}</div>
                                                </div>
                                                {selectedBatch?.id === batch.id && (
                                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
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

                        {/* QR Code Configuration */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm">⚙️</span>
                                </div>
                                <h2 className="font-bold text-gray-900 text-lg">QR Code Configuration</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Package Size</label>
                                    <select
                                        value={packageSize}
                                        onChange={(e) => setPackageSize(e.target.value)}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                    >
                                        <option value="25">25kg</option>
                                        <option value="50">50kg</option>
                                        <option value="100">100kg</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">QR Code Size</label>
                                    <div className="flex gap-2">
                                        {['Small', 'Medium', 'Large'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setQrSize(size)}
                                                className={`flex-1 px-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-200 ${qrSize === size
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-md'
                                                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">QR Code Color</label>
                                    <div className="flex gap-2">
                                        {['Black', 'Primary', 'Secondary'].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => { setQrColor(color); generateQRPreview(); }}
                                                className={`flex-1 px-4 py-2.5 rounded-lg border-2 font-medium transition-all duration-200 ${qrColor === color
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-md'
                                                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700'
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

                    {/* Right Panel */}
                    <div className="space-y-6">
                        {/* Batch Information */}
                        {selectedBatch && (
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm">ℹ️</span>
                                    </div>
                                    <h2 className="font-bold text-gray-900 text-lg">Batch Information</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg">
                                        <div className="text-gray-600 text-xs mb-1">Source Farm</div>
                                        <div className="font-semibold text-gray-900">{selectedBatch.farmId}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg">
                                        <div className="text-gray-600 text-xs mb-1">Processor Batch</div>
                                        <div className="font-semibold text-gray-900">{selectedBatch.processorBatchId || 'N/A'}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-lg">
                                        <div className="text-emerald-700 text-xs mb-1">Herb</div>
                                        <div className="font-semibold text-gray-900">{selectedBatch.herb}</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 rounded-lg">
                                        <div className="text-emerald-700 text-xs mb-1">Total Quantity</div>
                                        <div className="font-semibold text-gray-900">{selectedBatch.weight}kg</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg">
                                        <div className="text-blue-700 text-xs mb-1">📦 Package Size</div>
                                        <div className="font-semibold text-gray-900">{packageSize}kg sacks</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg">
                                        <div className="text-blue-700 text-xs mb-1">Number of Packages</div>
                                        <div className="font-semibold text-gray-900">{Math.ceil(selectedBatch.weight / parseInt(packageSize))}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* QR Code Preview */}
                        {selectedBatch && (
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm">📱</span>
                                    </div>
                                    <h2 className="font-bold text-gray-900 text-lg">QR Code Preview</h2>
                                </div>
                                <div className="border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 rounded-xl p-8 text-center">
                                    {qrCodePreview ? (
                                        <div>
                                            <div className="bg-white p-4 rounded-lg inline-block shadow-md mb-4">
                                                <img src={qrCodePreview} alt="QR Code Preview" className="w-48 h-48 mx-auto" />
                                            </div>
                                            <div className="text-base font-semibold text-gray-900">{selectedBatch.herb} Root Powder</div>
                                            <div className="text-sm text-emerald-700 mt-1">Organic • ✓ AYUSH Certified</div>
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <div className="text-sm text-gray-600">Net Wt: <span className="font-semibold">{packageSize}kg</span></div>
                                                <div className="text-sm text-gray-600">Batch: <span className="font-semibold">{selectedBatch.processorBatchId || selectedBatch.id}</span></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <div className="text-6xl mb-3">📱</div>
                                            <div className="text-gray-400">Select a batch to preview QR code</div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleGenerateQR}
                                        disabled={isGenerating || !selectedBatch}
                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                                    >
                                        {isGenerating ? '⏳ Generating...' : '✨ Generate QR Codes'}
                                    </button>
                                    <button
                                        onClick={handleDownloadAllPDFs}
                                        disabled={!selectedBatch || isDownloading === 'all'}
                                        className="px-6 py-3 border-2 border-emerald-500 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDownloading === 'all' ? '⏳ Downloading...' : '📄 Download All PDFs'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Generated Packages */}
                        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm">📋</span>
                                </div>
                                <h2 className="font-bold text-gray-900 text-lg">Generated Packages</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900">Package ID</th>
                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900">Size</th>
                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900">QR Status</th>
                                            <th className="px-4 py-3 text-left font-semibold text-emerald-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {packages.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                                                    <div className="text-5xl mb-2">📦</div>
                                                    <p>No packages generated yet</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            packages.map((pkg) => (
                                                <tr key={pkg.id} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{pkg.id}</td>
                                                    <td className="px-4 py-3 text-gray-600">{pkg.size}kg</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${pkg.qrStatus === 'printed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {pkg.qrStatus === 'printed' ? '✓ Printed' : '⚡ Generated'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() => handleDownloadPDF(pkg)}
                                                            disabled={isDownloading === pkg.id}
                                                            className="text-emerald-600 hover:text-emerald-700 font-semibold disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            {isDownloading === pkg.id ? '⏳ Downloading...' : '📄 Download PDF'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


