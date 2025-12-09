'use client'

import { useState } from 'react'
import QRCode from 'qrcode'
import Link from 'next/link'

interface GeneratedCode {
    id: string
    dataUrl: string
}

export default function ManufacturingPage() {
    const [batchId, setBatchId] = useState('')
    const [qrCount, setQrCount] = useState<number | ''>('')
    const [codes, setCodes] = useState<GeneratedCode[]>([])
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        if (!batchId.trim()) {
            alert('Batch ID is required')
            return
        }
        if (!qrCount || qrCount <= 0 || qrCount > 2000) {
            alert('Enter a valid QR count (1-2000)')
            return
        }

        setIsGenerating(true)
        try {
            const newCodes: GeneratedCode[] = []
            for (let i = 0; i < Number(qrCount); i++) {
                const id = `${batchId}-QR-${String(i + 1).padStart(4, '0')}`
                const payload = {
                    id,
                    batchId,
                    index: i + 1,
                }
                const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
                    width: 256,
                    margin: 1,
                    color: { dark: '#000000', light: '#FFFFFF' }
                })
                newCodes.push({ id, dataUrl })
            }
            setCodes(newCodes)
        } catch (err) {
            console.error('QR generation failed', err)
            alert('Failed to generate QR codes')
        } finally {
            setIsGenerating(false)
        }
    }

    const handlePrint = () => {
        if (!codes.length) return
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const html = `
        <!doctype html>
        <html>
        <head>
            <style>
                * { font-family: 'Inter', Arial, sans-serif; color: #000; }
                .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                .card { border: 1px solid #000; padding: 12px; text-align: center; page-break-inside: avoid; }
                .title { font-weight: 700; margin-bottom: 6px; font-size: 14px; }
                .id { font-size: 12px; margin-top: 6px; word-break: break-all; }
                @media print { body { margin: 12px; } }
            </style>
        </head>
        <body>
            <h2>Batch: ${batchId}</h2>
            <div class="grid">
                ${codes.map(c => `
                    <div class="card">
                        <div class="title">ANVESHA</div>
                        <img src="${c.dataUrl}" width="180" height="180" />
                        <div class="id">${c.id}</div>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
        `

        printWindow.document.write(html)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
    }

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <div className="bg-[#016868] text-white shadow-md">
                <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" aria-label="Go to home" className="w-10 h-10 bg-white rounded-lg p-1 block">
                            <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                        </Link>
                        <div>
                            <div className="text-sm font-semibold">ANVESHA</div>
                            <div className="text-xs text-white/90">QR Code Generator</div>
                        </div>
                    </div>
                    <Link href="/" className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg">
                        Home
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Generate Manufacturing QR Codes</h1>
                        <p className="text-gray-600 text-sm mt-1">Enter Batch ID and how many QR codes you need. Codes are black on white and printable/PDF-ready.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-800">Batch ID *</label>
                            <input
                                type="text"
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                                placeholder="e.g., BATCH-2024-001"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 font-semibold text-gray-900 focus:border-[#016868] focus:ring-2 focus:ring-[#016868]/20 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-800">How many QR codes? *</label>
                            <input
                                type="number"
                                min={1}
                                max={2000}
                                value={qrCount}
                                onChange={(e) => {
                                    const val = e.target.value
                                    if (val === '') setQrCount('')
                                    else setQrCount(parseInt(val) || 0)
                                }}
                                placeholder="Enter number of QR needed"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 font-semibold text-gray-900 focus:border-[#016868] focus:ring-2 focus:ring-[#016868]/20 outline-none placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="bg-[#016868] hover:bg-[#014d4d] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition disabled:opacity-60"
                        >
                            {isGenerating ? 'Generating...' : 'Generate QR Codes'}
                        </button>
                        <button
                            onClick={handlePrint}
                            disabled={!codes.length}
                            className="bg-gray-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-md transition disabled:opacity-40"
                        >
                            Print / Save as PDF
                        </button>
                        <span className="text-sm text-gray-600 self-center">
                            {codes.length ? `${codes.length} code(s) ready` : 'No codes yet'}
                        </span>
                    </div>

                    {codes.length > 0 && (
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Preview</h2>
                            <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {codes.slice(0, 12).map(code => (
                                    <div key={code.id} className="p-3 border border-gray-200 rounded-lg shadow-sm text-center">
                                        <img src={code.dataUrl} alt={code.id} className="w-full mb-2" />
                                        <div className="text-xs font-semibold text-gray-800 break-words">{code.id}</div>
                                    </div>
                                ))}
                            </div>
                            {codes.length > 12 && (
                                <p className="text-sm text-gray-500 mt-3">Showing first 12 of {codes.length}. All codes will print.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
