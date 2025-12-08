'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import QRCode from 'qrcode'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface ProcessorBatch {
    id: string
    processorBatchId: string
    herb: string
    weight: number
    farmId: string
    labResults?: {
        approved: boolean
        purity: number
        moisture: number
    }
    labTestDate?: string
    processorData?: {
        processorName: string
        processingDate: string
        packageSize: string
    }
}

interface PackageConfig {
    size: number
    quantity: number
    unit: string
}

interface FinalPackage {
    id: string
    weight: number
    qrCode: string
    packageNumber: number
}

export default function ManufacturingPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedBatch, setSelectedBatch] = useState<ProcessorBatch | null>(null)
    const [availableBatches, setAvailableBatches] = useState<ProcessorBatch[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [verificationData, setVerificationData] = useState<any>(null)

    // Step 2: Packaging Configuration
    const [packageConfigs, setPackageConfigs] = useState<PackageConfig[]>([
        { size: 100, quantity: 0, unit: 'g' },
        { size: 250, quantity: 0, unit: 'g' },
        { size: 500, quantity: 0, unit: 'g' },
        { size: 1, quantity: 0, unit: 'kg' }
    ])
    const [customPackageSize, setCustomPackageSize] = useState('')
    const [customPackageUnit, setCustomPackageUnit] = useState('g')

    // Step 3: QR Code Generation
    const [finalPackages, setFinalPackages] = useState<FinalPackage[]>([])
    const [blockchainTxHash, setBlockchainTxHash] = useState('')
    const [qrGenerationProgress, setQrGenerationProgress] = useState(0)

    // Step 4: Product Info
    const [productInfo, setProductInfo] = useState({
        productName: '',
        description: '',
        benefits: '',
        usage: '',
        manufacturerName: '',
        manufacturerLicense: '',
        expiryMonths: '24'
    })

    // Step 5: Dispatch
    const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split('T')[0])
    const [dispatchNotes, setDispatchNotes] = useState('')

    useEffect(() => {
        loadAvailableBatches()
    }, [])

    const loadAvailableBatches = async () => {
        setIsLoading(true)
        try {
            // Mock data for demonstration
            const mockBatches: ProcessorBatch[] = [
                {
                    id: 'BATCH-001',
                    processorBatchId: 'PROC-2024-001',
                    herb: 'Ashwagandha',
                    weight: 50,
                    farmId: 'FARM-UK-001',
                    labResults: {
                        approved: true,
                        purity: 98.5,
                        moisture: 8.2
                    },
                    labTestDate: '2024-12-01',
                    processorData: {
                        processorName: 'Green Valley Processing',
                        processingDate: '2024-12-05',
                        packageSize: '50kg bulk'
                    }
                },
                {
                    id: 'BATCH-002',
                    processorBatchId: 'PROC-2024-002',
                    herb: 'Tulsi',
                    weight: 25,
                    farmId: 'FARM-HP-002',
                    labResults: {
                        approved: true,
                        purity: 96.8,
                        moisture: 9.1
                    },
                    labTestDate: '2024-12-02',
                    processorData: {
                        processorName: 'Himalayan Herbs Processor',
                        processingDate: '2024-12-06',
                        packageSize: '25kg bulk'
                    }
                }
            ]
            setAvailableBatches(mockBatches)
        } catch (error) {
            console.error('Error loading batches:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Step 1: Verify Batch
    const handleVerifyBatch = async () => {
        if (!selectedBatch) return

        setIsLoading(true)
        try {
            // API Call: POST /api/manufacturer/verify
            // Mock response for demonstration
            const mockVerification = {
                verified: true,
                supplyChainHistory: [
                    {
                        stage: 'Farm',
                        date: '2024-11-20',
                        location: selectedBatch.farmId,
                        details: `${selectedBatch.weight}kg of ${selectedBatch.herb} harvested`
                    },
                    {
                        stage: 'Lab Testing',
                        date: selectedBatch.labTestDate,
                        location: 'NABL Certified Lab',
                        details: `Purity: ${selectedBatch.labResults?.purity}%, Approved`
                    },
                    {
                        stage: 'Processing',
                        date: selectedBatch.processorData?.processingDate,
                        location: selectedBatch.processorData?.processorName,
                        details: `Processed into ${selectedBatch.processorData?.packageSize}`
                    }
                ]
            }

            setVerificationData(mockVerification)
            setProductInfo(prev => ({
                ...prev,
                productName: `${selectedBatch.herb} Extract Premium`,
                description: `Premium quality ${selectedBatch.herb} sourced from certified organic farms`
            }))
            setCurrentStep(2)
        } catch (error) {
            console.error('Verification error:', error)
            alert('Failed to verify batch')
        } finally {
            setIsLoading(false)
        }
    }

    // Step 2: Calculate Packages
    const calculateTotalPackages = () => {
        if (!selectedBatch) return 0
        const totalWeightInGrams = selectedBatch.weight * 1000
        let totalPackages = 0

        packageConfigs.forEach(config => {
            const sizeInGrams = config.unit === 'kg' ? config.size * 1000 : config.size
            totalPackages += config.quantity
        })

        return totalPackages
    }

    const calculateUsedWeight = () => {
        let usedWeight = 0
        packageConfigs.forEach(config => {
            const sizeInGrams = config.unit === 'kg' ? config.size * 1000 : config.size
            usedWeight += (sizeInGrams * config.quantity) / 1000
        })
        return usedWeight
    }

    const addCustomPackage = () => {
        if (!customPackageSize) return
        const size = parseFloat(customPackageSize)
        if (size > 0) {
            setPackageConfigs([...packageConfigs, { size, quantity: 0, unit: customPackageUnit }])
            setCustomPackageSize('')
        }
    }

    const updatePackageQuantity = (index: number, quantity: number) => {
        const updated = [...packageConfigs]
        updated[index].quantity = Math.max(0, quantity)
        setPackageConfigs(updated)
    }

    const proceedToQRGeneration = () => {
        const totalPackages = calculateTotalPackages()
        if (totalPackages === 0) {
            alert('Please configure at least one package')
            return
        }
        setCurrentStep(3)
    }

    // Step 3: Generate QR Codes
    const generateFinalQRCodes = async () => {
        if (!selectedBatch) return

        setIsLoading(true)
        setQrGenerationProgress(0)

        try {
            const packages: FinalPackage[] = []
            let packageNumber = 1

            for (const config of packageConfigs) {
                for (let i = 0; i < config.quantity; i++) {
                    const packageId = `${selectedBatch.processorBatchId}-PKG-${packageNumber.toString().padStart(4, '0')}`
                    const qrData = JSON.stringify({
                        packageId,
                        batchId: selectedBatch.processorBatchId,
                        herb: selectedBatch.herb,
                        weight: `${config.size}${config.unit}`,
                        farmId: selectedBatch.farmId,
                        labApproved: selectedBatch.labResults?.approved,
                        purity: selectedBatch.labResults?.purity,
                        verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/consumer-portal?package=${packageId}`
                    })

                    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
                        width: 200,
                        margin: 2,
                        color: { dark: '#014848', light: '#FFFFFF' }
                    })

                    packages.push({
                        id: packageId,
                        weight: config.unit === 'kg' ? config.size * 1000 : config.size,
                        qrCode: qrCodeDataUrl,
                        packageNumber
                    })

                    packageNumber++
                    setQrGenerationProgress(Math.round((packageNumber / calculateTotalPackages()) * 100))
                }
            }

            // Mock blockchain transaction hash
            const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
            setBlockchainTxHash(mockTxHash)
            setFinalPackages(packages)

            setTimeout(() => setCurrentStep(4), 500)
        } catch (error) {
            console.error('QR generation error:', error)
            alert('Failed to generate QR codes')
        } finally {
            setIsLoading(false)
        }
    }

    // Step 5: Print & Dispatch
    const handlePrintLabels = () => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const labelsHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    @media print {
                        .page-break { page-break-after: always; }
                    }
                    body { font-family: Arial, sans-serif; }
                    .label {
                        width: 10cm;
                        height: 7cm;
                        border: 2px solid #014848;
                        padding: 15px;
                        margin: 10px;
                        display: inline-block;
                        page-break-inside: avoid;
                    }
                    .header { text-align: center; color: #014848; font-weight: bold; font-size: 18px; margin-bottom: 10px; }
                    .qr-code { text-align: center; margin: 10px 0; }
                    .info { font-size: 11px; line-height: 1.4; }
                    .info strong { color: #014848; }
                </style>
            </head>
            <body>
                ${finalPackages.map(pkg => `
                    <div class="label">
                        <div class="header">🌿 ANVESHA</div>
                        <div class="info">
                            <strong>Product:</strong> ${productInfo.productName}<br>
                            <strong>Herb:</strong> ${selectedBatch?.herb}<br>
                            <strong>Weight:</strong> ${pkg.weight < 1000 ? pkg.weight + 'g' : (pkg.weight / 1000) + 'kg'}<br>
                            <strong>Package:</strong> ${pkg.id}<br>
                            <strong>Purity:</strong> ${selectedBatch?.labResults?.purity}%
                        </div>
                        <div class="qr-code">
                            <img src="${pkg.qrCode}" width="120" />
                            <div style="font-size: 9px; margin-top: 5px;">Scan for traceability</div>
                        </div>
                    </div>
                `).join('')}
            </body>
            </html>
        `

        printWindow.document.write(labelsHTML)
        printWindow.document.close()
        printWindow.print()
    }

    const handleDispatch = async () => {
        if (!productInfo.manufacturerName) {
            alert('Please fill in manufacturer details')
            return
        }

        setIsLoading(true)
        try {
            // API Call: POST /api/manufacturer/dispatch
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 1000))

            alert(`✅ Successfully dispatched ${finalPackages.length} packages!\n\nInventory updated and packages marked as dispatched.`)

            // Reset workflow
            setCurrentStep(1)
            setSelectedBatch(null)
            setVerificationData(null)
            setFinalPackages([])
            setPackageConfigs([
                { size: 100, quantity: 0, unit: 'g' },
                { size: 250, quantity: 0, unit: 'g' },
                { size: 500, quantity: 0, unit: 'g' },
                { size: 1, quantity: 0, unit: 'kg' }
            ])
        } catch (error) {
            console.error('Dispatch error:', error)
            alert('Failed to dispatch packages')
        } finally {
            setIsLoading(false)
        }
    }

    const steps = [
        { number: 1, title: 'Verify Batch', icon: '✓' },
        { number: 2, title: 'Configure Packaging', icon: '📦' },
        { number: 3, title: 'Generate QR Codes', icon: '📱' },
        { number: 4, title: 'Product Details', icon: '📋' },
        { number: 5, title: 'Print & Dispatch', icon: '🚚' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#014848] text-white p-6 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg p-2">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">ANVESHA</h1>
                            <p className="text-sm opacity-90">Manufacturing Portal</p>
                        </div>
                    </div>
                    <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${currentStep > step.number
                                            ? 'bg-green-500 text-white'
                                            : currentStep === step.number
                                                ? 'bg-[#014848] text-white ring-4 ring-teal-100'
                                                : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {currentStep > step.number ? '✓' : step.icon}
                                    </div>
                                    <div className={`mt-2 text-sm font-semibold text-center ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                        {step.title}
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`h-1 flex-1 mx-4 rounded transition-all ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-8">
                {/* Step 1: Verify Batch */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Processor Batch to Verify</h2>

                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading batches...</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {availableBatches.map(batch => (
                                        <div
                                            key={batch.id}
                                            onClick={() => setSelectedBatch(batch)}
                                            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${selectedBatch?.id === batch.id
                                                    ? 'border-[#014848] bg-teal-50 shadow-md'
                                                    : 'border-gray-200 hover:border-teal-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="font-bold text-lg text-gray-900">{batch.processorBatchId}</div>
                                                    <div className="text-teal-700 font-semibold mt-1">🌿 {batch.herb}</div>
                                                </div>
                                                {selectedBatch?.id === batch.id && (
                                                    <div className="w-6 h-6 bg-[#014848] rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="bg-white p-2 rounded">
                                                    <span className="text-gray-500">Weight:</span>
                                                    <span className="font-semibold text-gray-900 ml-1">{batch.weight}kg</span>
                                                </div>
                                                <div className="bg-white p-2 rounded">
                                                    <span className="text-gray-500">Purity:</span>
                                                    <span className="font-semibold text-green-600 ml-1">{batch.labResults?.purity}%</span>
                                                </div>
                                                <div className="bg-white p-2 rounded col-span-2">
                                                    <span className="text-gray-500">Processor:</span>
                                                    <span className="font-semibold text-gray-900 ml-1 text-xs">{batch.processorData?.processorName}</span>
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                    ✓ Lab Approved
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedBatch && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleVerifyBatch}
                                    disabled={isLoading}
                                    className="bg-[#014848] hover:bg-[#003636] text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all disabled:opacity-50"
                                >
                                    Verify Batch & Continue →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Configure Packaging */}
                {currentStep === 2 && selectedBatch && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Final Packaging</h2>
                            <p className="text-gray-600 mb-6">Convert bulk package ({selectedBatch.weight}kg) into retail sizes</p>

                            {/* Supply Chain Timeline */}
                            {verificationData && (
                                <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                                    <h3 className="font-bold text-teal-900 mb-3">✓ Batch Verified - Supply Chain History</h3>
                                    <div className="space-y-2">
                                        {verificationData.supplyChainHistory.map((stage: any, index: number) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900">{stage.stage}</div>
                                                    <div className="text-sm text-gray-600">{stage.details}</div>
                                                    <div className="text-xs text-gray-500">{stage.date} • {stage.location}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Package Configuration */}
                            <div className="space-y-4">
                                {packageConfigs.map((config, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">
                                                {config.size}{config.unit} Packages
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Total: {((config.unit === 'kg' ? config.size * 1000 : config.size) * config.quantity / 1000).toFixed(2)}kg
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updatePackageQuantity(index, config.quantity - 1)}
                                                className="w-8 h-8 bg-white border-2 border-gray-300 rounded-lg hover:border-teal-500 transition-colors font-bold"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={config.quantity}
                                                onChange={(e) => updatePackageQuantity(index, parseInt(e.target.value) || 0)}
                                                className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 font-bold text-gray-900"
                                            />
                                            <button
                                                onClick={() => updatePackageQuantity(index, config.quantity + 1)}
                                                className="w-8 h-8 bg-white border-2 border-gray-300 rounded-lg hover:border-teal-500 transition-colors font-bold"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Custom Package Size */}
                                <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <input
                                        type="number"
                                        value={customPackageSize}
                                        onChange={(e) => setCustomPackageSize(e.target.value)}
                                        placeholder="Custom size"
                                        className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-semibold"
                                    />
                                    <select
                                        value={customPackageUnit}
                                        onChange={(e) => setCustomPackageUnit(e.target.value)}
                                        className="border-2 border-gray-300 rounded-lg px-4 py-2 text-gray-900 font-semibold"
                                    >
                                        <option value="g">g</option>
                                        <option value="kg">kg</option>
                                    </select>
                                    <button
                                        onClick={addCustomPackage}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border-2 border-teal-200">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-teal-700">{calculateTotalPackages()}</div>
                                        <div className="text-sm text-gray-600">Total Packages</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-teal-700">{calculateUsedWeight().toFixed(2)}kg</div>
                                        <div className="text-sm text-gray-600">Weight Used</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-600">{(selectedBatch.weight - calculateUsedWeight()).toFixed(2)}kg</div>
                                        <div className="text-sm text-gray-600">Remaining</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={proceedToQRGeneration}
                                className="bg-[#014848] hover:bg-[#003636] text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all"
                            >
                                Generate QR Codes →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Generate QR Codes */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Final QR Codes</h2>

                            {finalPackages.length === 0 ? (
                                <div className="text-center py-12">
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                            <p className="text-lg font-semibold text-gray-900">Generating QR Codes...</p>
                                            <div className="mt-4 max-w-md mx-auto">
                                                <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                                                    <div
                                                        className="bg-teal-600 h-full transition-all duration-300"
                                                        style={{ width: `${qrGenerationProgress}%` }}
                                                    />
                                                </div>
                                                <p className="mt-2 text-sm text-gray-600">{qrGenerationProgress}% Complete</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-6xl mb-4">📱</div>
                                            <p className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate QR Codes</p>
                                            <p className="text-gray-600 mb-6">
                                                {calculateTotalPackages()} unique QR codes will be generated with blockchain verification
                                            </p>
                                            <button
                                                onClick={generateFinalQRCodes}
                                                className="bg-[#014848] hover:bg-[#003636] text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all"
                                            >
                                                Generate {calculateTotalPackages()} QR Codes
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-bold text-green-900">Successfully Generated {finalPackages.length} QR Codes</span>
                                        </div>
                                        <div className="text-sm text-green-800">
                                            <strong>Blockchain Transaction:</strong>
                                            <code className="ml-2 text-xs bg-white px-2 py-1 rounded">{blockchainTxHash}</code>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                                        {finalPackages.slice(0, 12).map(pkg => (
                                            <div key={pkg.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                                                <img src={pkg.qrCode} alt={pkg.id} className="w-full mb-2" />
                                                <div className="text-xs font-semibold text-gray-900">{pkg.id}</div>
                                                <div className="text-xs text-gray-600">{pkg.weight < 1000 ? pkg.weight + 'g' : (pkg.weight / 1000) + 'kg'}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {finalPackages.length > 12 && (
                                        <p className="text-center text-sm text-gray-500 mt-4">
                                            Showing 12 of {finalPackages.length} packages
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {finalPackages.length > 0 && (
                            <div className="flex justify-between">
                                <button
                                    onClick={() => setCurrentStep(2)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={() => setCurrentStep(4)}
                                    className="bg-[#014848] hover:bg-[#003636] text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all"
                                >
                                    Add Product Details →
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Product Details */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Information</h2>

                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Product Name *</label>
                                        <input
                                            type="text"
                                            value={productInfo.productName}
                                            onChange={(e) => setProductInfo({ ...productInfo, productName: e.target.value })}
                                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                            placeholder="e.g., Ashwagandha Root Extract"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Manufacturer Name *</label>
                                        <input
                                            type="text"
                                            value={productInfo.manufacturerName}
                                            onChange={(e) => setProductInfo({ ...productInfo, manufacturerName: e.target.value })}
                                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                            placeholder="Company name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        value={productInfo.description}
                                        onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
                                        rows={3}
                                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                        placeholder="Product description..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Benefits</label>
                                    <textarea
                                        value={productInfo.benefits}
                                        onChange={(e) => setProductInfo({ ...productInfo, benefits: e.target.value })}
                                        rows={3}
                                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                        placeholder="Key benefits..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Usage Instructions</label>
                                    <textarea
                                        value={productInfo.usage}
                                        onChange={(e) => setProductInfo({ ...productInfo, usage: e.target.value })}
                                        rows={2}
                                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                        placeholder="How to use..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">License Number</label>
                                        <input
                                            type="text"
                                            value={productInfo.manufacturerLicense}
                                            onChange={(e) => setProductInfo({ ...productInfo, manufacturerLicense: e.target.value })}
                                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                            placeholder="Manufacturing license"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Shelf Life</label>
                                        <select
                                            value={productInfo.expiryMonths}
                                            onChange={(e) => setProductInfo({ ...productInfo, expiryMonths: e.target.value })}
                                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                        >
                                            <option value="12">12 Months</option>
                                            <option value="18">18 Months</option>
                                            <option value="24">24 Months</option>
                                            <option value="36">36 Months</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(3)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={() => setCurrentStep(5)}
                                className="bg-[#014848] hover:bg-[#003636] text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg transition-all"
                            >
                                Proceed to Dispatch →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Print & Dispatch */}
                {currentStep === 5 && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Print Labels & Dispatch</h2>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-lg border-2 border-teal-200">
                                    <div className="text-4xl font-bold text-teal-700 mb-2">{finalPackages.length}</div>
                                    <div className="text-gray-700 font-semibold">Total Packages Ready</div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                                    <div className="text-4xl font-bold text-blue-700 mb-2">{calculateUsedWeight().toFixed(2)}kg</div>
                                    <div className="text-gray-700 font-semibold">Total Weight</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Dispatch Date</label>
                                    <input
                                        type="date"
                                        value={dispatchDate}
                                        onChange={(e) => setDispatchDate(e.target.value)}
                                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Dispatch Notes (Optional)</label>
                                    <textarea
                                        value={dispatchNotes}
                                        onChange={(e) => setDispatchNotes(e.target.value)}
                                        rows={3}
                                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-900 font-semibold focus:border-teal-500 outline-none"
                                        placeholder="Add any dispatch notes..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handlePrintLabels}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print All Labels
                                </button>
                                <button
                                    onClick={handleDispatch}
                                    disabled={isLoading || !productInfo.manufacturerName}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {isLoading ? 'Processing...' : 'Mark as Dispatched'}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep(4)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold transition-colors"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
