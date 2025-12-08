'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import QRCode from 'qrcode'
import { Batch } from '@/lib/types/batch'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

interface ProductDescription {
    productName: string
    description: string
    benefits: string
    usage: string
    ingredients: string
    manufacturerName: string
    manufacturerLicense: string
    expiryMonths: string
}

export default function ManufacturingPage() {
    const router = useRouter()
    const [approvedBatches, setApprovedBatches] = useState<Batch[]>([])
    const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

    const [productInfo, setProductInfo] = useState<ProductDescription>({
        productName: '',
        description: '',
        benefits: '',
        usage: '',
        ingredients: '',
        manufacturerName: '',
        manufacturerLicense: '',
        expiryMonths: '24'
    })

    useEffect(() => {
        loadApprovedBatches()
    }, [])

    useEffect(() => {
        if (selectedBatch) {
            generateQRCode(selectedBatch)
            // Pre-fill product info based on herb
            setProductInfo(prev => ({
                ...prev,
                productName: `${selectedBatch.herb} Extract`,
                ingredients: selectedBatch.herb,
                description: `Premium quality ${selectedBatch.herb} sourced from certified organic farms`
            }))
        }
    }, [selectedBatch])

    const loadApprovedBatches = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_URL}/batches`)
            // Filter batches that are approved by lab
            const approved = response.data.filter((batch: Batch) =>
                batch.status === 'approved' && batch.labResults?.approved === true
            )
            setApprovedBatches(approved)
        } catch (error) {
            console.error('Error loading approved batches:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const generateQRCode = async (batch: Batch) => {
        try {
            const qrData = JSON.stringify({
                batchId: batch.id,
                processorBatchId: batch.processorBatchId,
                herb: batch.herb,
                farmId: batch.farmId,
                weight: batch.weight,
                labApproved: batch.labResults?.approved,
                labTestDate: batch.labTestDate,
                purity: batch.labResults?.purity,
                moisture: batch.labResults?.moisture,
                traceabilityUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/consumer-portal?batch=${batch.id}`
            })

            const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#059669',
                    light: '#FFFFFF'
                }
            })

            setQrCodeUrl(qrCodeDataUrl)
        } catch (error) {
            console.error('Error generating QR code:', error)
        }
    }

    const handleInputChange = (field: keyof ProductDescription, value: string) => {
        setProductInfo(prev => ({ ...prev, [field]: value }))
    }

    const handleGenerateProductLabel = async () => {
        if (!selectedBatch) return

        if (!productInfo.productName || !productInfo.manufacturerName) {
            alert('Please fill in Product Name and Manufacturer Name')
            return
        }

        setIsSaving(true)
        try {
            // Update batch with manufacturing information
            await axios.patch(`${API_URL}/batches`, {
                id: selectedBatch.id,
                manufacturingData: {
                    productName: productInfo.productName,
                    description: productInfo.description,
                    benefits: productInfo.benefits,
                    usage: productInfo.usage,
                    ingredients: productInfo.ingredients,
                    manufacturerName: productInfo.manufacturerName,
                    manufacturerLicense: productInfo.manufacturerLicense,
                    manufacturingDate: new Date().toISOString().split('T')[0],
                    expiryDate: new Date(Date.now() + parseInt(productInfo.expiryMonths) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                status: 'manufactured'
            })

            // Generate product label with QR code
            await generateProductLabel()

            alert('✅ Product label generated successfully!')
            await loadApprovedBatches()
            setSelectedBatch(null)
        } catch (error) {
            console.error('Error saving manufacturing data:', error)
            alert('❌ Failed to generate product label')
        } finally {
            setIsSaving(false)
        }
    }

    const generateProductLabel = async () => {
        if (!selectedBatch || !qrCodeUrl) return

        const labelHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; background: #f9fafb; }
                    .label { 
                        border: 3px solid #059669; 
                        padding: 30px; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        background: white;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    .header { 
                        text-align: center; 
                        color: #059669; 
                        margin-bottom: 20px; 
                        border-bottom: 2px solid #059669;
                        padding-bottom: 15px;
                    }
                    .product-name { 
                        font-size: 32px; 
                        font-weight: bold; 
                        margin: 10px 0; 
                    }
                    .section { 
                        margin: 20px 0; 
                        padding: 15px;
                        background: #f0fdf4;
                        border-radius: 8px;
                    }
                    .section-title { 
                        font-weight: bold; 
                        color: #059669; 
                        font-size: 18px;
                        margin-bottom: 8px;
                    }
                    .info-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 10px; 
                        margin: 15px 0; 
                    }
                    .info-item { 
                        padding: 8px; 
                        background: white; 
                        border-radius: 5px;
                        border-left: 3px solid #059669;
                    }
                    .label-text { font-weight: bold; color: #047857; }
                    .qr-section { 
                        text-align: center; 
                        margin: 20px 0; 
                        padding: 20px;
                        background: white;
                        border: 2px dashed #059669;
                        border-radius: 8px;
                    }
                    .footer { 
                        text-align: center; 
                        margin-top: 20px; 
                        padding-top: 15px;
                        border-top: 2px solid #059669;
                        font-size: 12px;
                        color: #6b7280;
                    }
                </style>
            </head>
            <body>
                <div class="label">
                    <div class="header">
                        <h1>🌿 ANVESHA</h1>
                        <div class="product-name">${productInfo.productName}</div>
                        <p style="margin: 5px 0; color: #6b7280;">Premium Ayurvedic Product</p>
                    </div>

                    <div class="section">
                        <div class="section-title">📋 Product Description</div>
                        <p>${productInfo.description}</p>
                    </div>

                    <div class="section">
                        <div class="section-title">✨ Benefits</div>
                        <p>${productInfo.benefits || 'Natural wellness support'}</p>
                    </div>

                    <div class="section">
                        <div class="section-title">💊 Usage Instructions</div>
                        <p>${productInfo.usage || 'As directed by healthcare professional'}</p>
                    </div>

                    <div class="section">
                        <div class="section-title">🌱 Ingredients</div>
                        <p><strong>${productInfo.ingredients}</strong></p>
                    </div>

                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label-text">Batch ID:</span> ${selectedBatch.processorBatchId || selectedBatch.id}
                        </div>
                        <div class="info-item">
                            <span class="label-text">Net Weight:</span> ${selectedBatch.weight}kg
                        </div>
                        <div class="info-item">
                            <span class="label-text">Mfg Date:</span> ${new Date().toLocaleDateString()}
                        </div>
                        <div class="info-item">
                            <span class="label-text">Expiry:</span> ${new Date(Date.now() + parseInt(productInfo.expiryMonths) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </div>
                        <div class="info-item">
                            <span class="label-text">Purity:</span> ${selectedBatch.labResults?.purity || 'N/A'}%
                        </div>
                        <div class="info-item">
                            <span class="label-text">Lab Approved:</span> ✓ Yes
                        </div>
                    </div>

                    <div class="qr-section">
                        <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 250px;" />
                        <p style="margin-top: 10px; font-weight: bold; color: #059669;">
                            📱 Scan for Complete Traceability
                        </p>
                        <p style="font-size: 12px; color: #6b7280;">
                            Track from farm to your hands
                        </p>
                    </div>

                    <div class="footer">
                        <p><strong>Manufactured by:</strong> ${productInfo.manufacturerName}</p>
                        <p><strong>License No:</strong> ${productInfo.manufacturerLicense}</p>
                        <p style="margin-top: 10px;">
                            <strong>Source Farm:</strong> ${selectedBatch.farmId} | 
                            <strong>Lab Test Date:</strong> ${selectedBatch.labTestDate || 'N/A'}
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `

        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(labelHTML)
            printWindow.document.close()
            printWindow.print()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-[#014848] text-white p-6 shadow-lg">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <span className="text-3xl">🏭</span>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">ANVESHA</div>
                            <div className="text-sm opacity-90">MANUFACTURING PORTAL</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-3 gap-6">
                    {/* Left Sidebar - Approved Batches */}
                    <div className="col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                </div>
                                <h2 className="font-bold text-gray-900 text-lg">Approved Batches</h2>
                            </div>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {isLoading ? (
                                    <div className="text-center py-8 text-gray-400">Loading...</div>
                                ) : approvedBatches.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <div className="text-4xl mb-2">📦</div>
                                        <p>No approved batches</p>
                                    </div>
                                ) : (
                                    approvedBatches.map((batch) => (
                                        <div
                                            key={batch.id}
                                            onClick={() => setSelectedBatch(batch)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedBatch?.id === batch.id
                                                ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-md'
                                                : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-900 text-sm">
                                                        {batch.processorBatchId || batch.id}
                                                    </div>
                                                    <div className="text-xs text-emerald-700 mt-1">🌿 {batch.herb}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {batch.weight}kg • {batch.farmId}
                                                    </div>
                                                    <div className="mt-2">
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                            ✓ Lab Approved
                                                        </span>
                                                    </div>
                                                </div>
                                                {selectedBatch?.id === batch.id && (
                                                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                                {/* Batch Information */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <h2 className="text-lg font-bold text-emerald-800 mb-4">Batch Information</h2>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-3 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Batch ID</div>
                                            <div className="font-semibold text-emerald-700">
                                                {selectedBatch.processorBatchId || selectedBatch.id}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Herb</div>
                                            <div className="font-semibold text-gray-900">{selectedBatch.herb}</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Weight</div>
                                            <div className="font-semibold text-gray-900">{selectedBatch.weight}kg</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg">
                                            <div className="text-xs text-gray-600 mb-1">Purity</div>
                                            <div className="font-semibold text-green-700">{selectedBatch.labResults?.purity || 'N/A'}%</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Information Form */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <h2 className="text-xl font-bold text-emerald-800 mb-4">Product Information</h2>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Product Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={productInfo.productName}
                                                    onChange={(e) => handleInputChange('productName', e.target.value)}
                                                    placeholder="e.g., Ashwagandha Root Extract"
                                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Ingredients
                                                </label>
                                                <input
                                                    type="text"
                                                    value={productInfo.ingredients}
                                                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                                                    placeholder="Main ingredients"
                                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Product Description
                                            </label>
                                            <textarea
                                                value={productInfo.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="Describe the product..."
                                                rows={3}
                                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Benefits
                                            </label>
                                            <textarea
                                                value={productInfo.benefits}
                                                onChange={(e) => handleInputChange('benefits', e.target.value)}
                                                placeholder="List the key benefits..."
                                                rows={3}
                                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Usage Instructions
                                            </label>
                                            <textarea
                                                value={productInfo.usage}
                                                onChange={(e) => handleInputChange('usage', e.target.value)}
                                                placeholder="How to use this product..."
                                                rows={2}
                                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Manufacturer Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={productInfo.manufacturerName}
                                                    onChange={(e) => handleInputChange('manufacturerName', e.target.value)}
                                                    placeholder="Company name"
                                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    License Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={productInfo.manufacturerLicense}
                                                    onChange={(e) => handleInputChange('manufacturerLicense', e.target.value)}
                                                    placeholder="Manufacturing license"
                                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Shelf Life (Months)
                                                </label>
                                                <select
                                                    value={productInfo.expiryMonths}
                                                    onChange={(e) => handleInputChange('expiryMonths', e.target.value)}
                                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
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

                                {/* QR Code Preview */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm">📱</span>
                                        </div>
                                        <h2 className="font-bold text-gray-900 text-lg">QR Code Preview</h2>
                                    </div>

                                    {qrCodeUrl ? (
                                        <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
                                            <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" style={{ maxWidth: '250px' }} />
                                            <p className="text-sm text-gray-600 mb-2">
                                                <strong>Scan for complete traceability</strong>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Includes batch info, lab results, and farm details
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <div className="text-4xl mb-2">📱</div>
                                            <p>QR code will appear here</p>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <button
                                            onClick={handleGenerateProductLabel}
                                            disabled={isSaving}
                                            className="w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-4 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? '⏳ Generating...' : '🏷️ Generate Product Label with QR Code'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md p-12 border border-gray-100 text-center">
                                <div className="text-6xl mb-4">🏭</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Select an Approved Batch</h3>
                                <p className="text-gray-600">Choose a lab-approved batch from the left sidebar to create product label</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


