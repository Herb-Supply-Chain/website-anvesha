'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'react-qr-code'

interface Batch {
    id: string
    herb: string
    quantity: number
    date: string
    sourceFarm: string
    labCertificateId: string
    qualityGrade: string
    labTestDate: string
}

interface Package {
    id: string
    batchId: string
    size: string
    qrStatus: 'Printed' | 'Generated'
    status: 'Applied' | 'Pending'
}

export default function ProcessorQRPackaging() {
    const router = useRouter()

    // Batches that have been tested and approved by lab
    const [batches] = useState<Batch[]>([
        {
            id: 'PROC-2025-ASH-001',
            herb: 'Ashwagandha',
            quantity: 150,
            date: '2025-01-28',
            sourceFarm: 'FARM-2024-ASH-001',
            labCertificateId: 'CERT-2024-ASH-001',
            qualityGrade: 'A+',
            labTestDate: '2025-01-27'
        },
        {
            id: 'PROC-2025-BRH-001',
            herb: 'Brahmi',
            quantity: 180,
            date: '2025-01-28',
            sourceFarm: 'FARM-2024-BRH-001',
            labCertificateId: 'CERT-2024-BRH-001',
            qualityGrade: 'A',
            labTestDate: '2025-01-26'
        },
        {
            id: 'PROC-2025-TUL-001',
            herb: 'Tulsi',
            quantity: 120,
            date: '2025-01-28',
            sourceFarm: 'FARM-2024-TUL-001',
            labCertificateId: 'CERT-2024-TUL-002',
            qualityGrade: 'A+',
            labTestDate: '2025-01-25'
        }
    ])

    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [packageSize, setPackageSize] = useState('25')
    const [numberOfPackages, setNumberOfPackages] = useState('6')
    const [qrSize, setQRSize] = useState('Medium')
    const [qrColor, setQRColor] = useState('Primary')
    const [packages, setPackages] = useState<Package[]>([])

    const handleGenerateQRCodes = () => {
        if (!selectedBatch) {
            alert('Please select a batch first')
            return
        }

        const numPackages = parseInt(numberOfPackages)
        if (isNaN(numPackages) || numPackages <= 0) {
            alert('Please enter a valid number of packages')
            return
        }

        const newPackages: Package[] = []
        for (let i = 1; i <= numPackages; i++) {
            newPackages.push({
                id: `${selectedBatch.id}-PKG-${i.toString().padStart(2, '0')}`,
                batchId: selectedBatch.id,
                size: `${packageSize}kg`,
                qrStatus: 'Generated',
                status: 'Pending'
            })
        }

        setPackages(newPackages)
        alert(`Successfully generated ${numPackages} QR codes for ${selectedBatch.herb}!`)
    }

    const handlePrint = () => {
        if (packages.length === 0) {
            alert('Please generate QR codes first')
            return
        }
        window.print()
    }

    const handleMarkAsPrinted = (packageId: string) => {
        setPackages(packages.map(pkg =>
            pkg.id === packageId ? { ...pkg, qrStatus: 'Printed' as const } : pkg
        ))
    }

    const handleMarkAsApplied = (packageId: string) => {
        setPackages(packages.map(pkg =>
            pkg.id === packageId ? { ...pkg, status: 'Applied' as const } : pkg
        ))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg p-1.5">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Government of India | भारत सरकार</h1>
                            <p className="text-sm text-teal-100">Ministry of AYUSH | आयुष मंत्रालय</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back To Dashboard
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 pb-8 space-y-6">
                {/* Page Title */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">QR Code & Packaging Module</h2>
                    <p className="text-gray-600">Generate and manage package QR codes</p>
                </div>

                {/* Batches Ready for Packaging */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Batches Ready for Packaging</h3>
                    <p className="text-sm text-gray-600 mb-4">Lab-tested and approved batches</p>
                    <div className="grid md:grid-cols-3 gap-4">
                        {batches.map((batch) => (
                            <div
                                key={batch.id}
                                onClick={() => setSelectedBatch(batch)}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedBatch?.id === batch.id
                                    ? 'border-teal-500 bg-teal-50 shadow-md'
                                    : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-teal-700">{batch.id}</div>
                                        <div className="font-semibold text-gray-900 mt-1">{batch.herb}</div>
                                    </div>
                                    {selectedBatch?.id === batch.id && (
                                        <svg className="w-6 h-6 text-teal-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span>{batch.quantity}kg</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${batch.qualityGrade === 'A+' ? 'bg-green-100 text-green-700' :
                                                batch.qualityGrade === 'A' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {batch.qualityGrade}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">Lab: {batch.labCertificateId}</div>
                                    <div className="text-xs text-gray-500">Tested: {batch.labTestDate}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Configuration & Preview Section */}
                {selectedBatch && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Left: Batch Info & Configuration */}
                        <div className="space-y-6">
                            {/* Batch Information */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Batch Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Source Farm</div>
                                        <div className="font-semibold text-gray-900">{selectedBatch.sourceFarm}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Herb</div>
                                        <div className="font-semibold text-gray-900">{selectedBatch.herb} Root Powder</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Processor Batch</div>
                                        <div className="font-semibold text-teal-600">{selectedBatch.id}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Total Quantity</div>
                                        <div className="font-semibold text-gray-900">{selectedBatch.quantity}kg</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Lab Certificate</div>
                                        <div className="font-semibold text-green-600">{selectedBatch.labCertificateId}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Quality Grade</div>
                                        <div className={`font-bold text-lg ${selectedBatch.qualityGrade === 'A+' ? 'text-green-600' :
                                            selectedBatch.qualityGrade === 'A' ? 'text-blue-600' :
                                                'text-yellow-600'
                                            }`}>{selectedBatch.qualityGrade}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Package Size</div>
                                        <div className="font-semibold text-gray-900">{packageSize}kg sacks</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Number of Packages</div>
                                        <input
                                            type="number"
                                            value={numberOfPackages}
                                            onChange={(e) => setNumberOfPackages(e.target.value)}
                                            min="1"
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none font-semibold text-teal-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* QR Code Configuration */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">QR Code Configuration</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Package Size
                                        </label>
                                        <select
                                            value={packageSize}
                                            onChange={(e) => setPackageSize(e.target.value)}
                                            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                        >
                                            <option value="25">25kg</option>
                                            <option value="50">50kg</option>
                                            <option value="100">100kg</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            QR Code Size
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Small', 'Medium', 'Large'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setQRSize(size)}
                                                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${qrSize === size
                                                        ? 'bg-teal-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            QR Code Color
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Black', 'Primary', 'Secondary'].map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setQRColor(color)}
                                                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${qrColor === color
                                                        ? 'bg-teal-600 text-white shadow-md'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

                        {/* Right: QR Preview & Actions */}
                        <div className="space-y-6">
                            {/* QR Code Preview */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">QR Code Preview</h3>
                                <div className="flex justify-center mb-6">
                                    <div className="p-6 bg-white border-2 border-gray-300 rounded-lg shadow-sm">
                                        <QRCode
                                            value={selectedBatch.id}
                                            size={qrSize === 'Small' ? 120 : qrSize === 'Medium' ? 150 : 180}
                                            fgColor={qrColor === 'Black' ? '#000000' : qrColor === 'Primary' ? '#0d9488' : '#6366f1'}
                                        />
                                    </div>
                                </div>

                                {/* Package Label Preview */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-5 border-2 border-gray-200">
                                    <h4 className="font-bold text-sm text-gray-900 mb-3 text-center">Package Label Preview</h4>
                                    <div className="bg-white rounded-lg p-4 border border-gray-300 space-y-2">
                                        <div className="font-bold text-teal-700 text-center">{selectedBatch.herb} Root Powder</div>
                                        <div className="text-sm text-gray-600 text-center">Net Wt: {packageSize}kg</div>
                                        <div className="text-xs text-gray-600 text-center">Batch: {selectedBatch.id}</div>
                                        <div className="text-xs text-gray-600 text-center">Exp: 01/2026</div>
                                        <div className="text-xs text-gray-500 text-center mt-2">Scan QR for traceability</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleGenerateQRCodes}
                                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                                >
                                    Generate QR codes
                                </button>
                                <button
                                    onClick={handlePrint}
                                    disabled={packages.length === 0}
                                    className="w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Generated Packages Table */}
                {packages.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Generated Packages</h3>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Package ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Size</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">QR Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.map((pkg) => (
                                        <tr key={pkg.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-sm text-gray-900 font-medium">{pkg.id}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{pkg.size}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pkg.qrStatus === 'Printed'
                                                    ? 'bg-teal-100 text-teal-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {pkg.qrStatus}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pkg.status === 'Applied'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {pkg.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    {pkg.qrStatus === 'Generated' && (
                                                        <button
                                                            onClick={() => handleMarkAsPrinted(pkg.id)}
                                                            className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded transition-colors"
                                                        >
                                                            Mark Printed
                                                        </button>
                                                    )}
                                                    {pkg.status === 'Pending' && pkg.qrStatus === 'Printed' && (
                                                        <button
                                                            onClick={() => handleMarkAsApplied(pkg.id)}
                                                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
                                                        >
                                                            Mark Applied
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!selectedBatch && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Batch to Begin</h3>
                        <p className="text-gray-600">Choose a batch from above to configure and generate QR codes</p>
                    </div>
                )}
            </div>
        </div>
    )
}
