'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ConsumerPortal() {
    const searchParams = useSearchParams()
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://server-anvesha.onrender.com'
    const [phoneNumber, setPhoneNumber] = useState('')
    const [showScanner, setShowScanner] = useState(false)
    const [productData, setProductData] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'origin' | 'lab' | 'sustainability' | 'journey'>('origin')
    const [scanning, setScanning] = useState(false)
    const [verifying, setVerifying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const scanFrameRef = useRef<number | null>(null)
    const barcodeDetectorRef = useRef<BarcodeDetector | null>(null)

    // Sample product data
    const sampleProductData = {
        batchId: 'AYUSH-2024-001234',
        productName: 'Ashwagandha Root',
        harvestDate: '2024-11-15',
        origin: {
            farmerName: 'Ramesh Kumar',
            farmLocation: 'Madhya Pradesh, India',
            latitude: 23.2599,
            longitude: 77.4126,
            yearsOfExperience: 15,
            geofenceStatus: 'Verified',
            harvestMethod: 'Organic Hand-Harvesting'
        },
        labReports: [
            {
                id: 1,
                name: 'Quality Analysis Report',
                lab: 'AYUSH Certified Lab - Bhopal',
                date: '2024-11-18',
                status: 'Passed',
                downloadUrl: '#'
            },
            {
                id: 2,
                name: 'Pesticide Residue Test',
                lab: 'National Testing Laboratory',
                date: '2024-11-19',
                status: 'Passed',
                downloadUrl: '#'
            },
            {
                id: 3,
                name: 'DNA Authentication Certificate',
                lab: 'Botanical Research Institute',
                date: '2024-11-20',
                status: 'Verified',
                downloadUrl: '#'
            }
        ],
        sustainability: {
            ecoScore: 92,
            carbonFootprint: 2.4,
            waterUsage: 'Low',
            organicCertified: true,
            fairTrade: true
        },
        supplyChain: [
            {
                stage: 'Harvesting',
                location: 'Farmer Field - Madhya Pradesh',
                date: '2024-11-15',
                time: '06:30 AM',
                status: 'Completed',
                gps: '23.2599, 77.4126'
            },
            {
                stage: 'Collection Event',
                location: 'Collection Center - Bhopal',
                date: '2024-11-16',
                time: '10:00 AM',
                status: 'Completed',
                gps: '23.2599, 77.4126'
            },
            {
                stage: 'Processing',
                location: 'Processing Unit - Bhopal',
                date: '2024-11-17',
                time: '02:00 PM',
                status: 'Completed',
                gps: '23.2599, 77.4126'
            },
            {
                stage: 'Laboratory Testing',
                location: 'AYUSH Lab - Bhopal',
                date: '2024-11-18',
                time: '09:00 AM',
                status: 'Completed',
                gps: '23.2599, 77.4126'
            },
            {
                stage: 'Packaging',
                location: 'Packaging Facility - Indore',
                date: '2024-11-21',
                time: '11:00 AM',
                status: 'Completed',
                gps: '22.7196, 75.8577'
            },
            {
                stage: 'Distribution',
                location: 'Distribution Hub - Mumbai',
                date: '2024-11-23',
                time: '08:00 AM',
                status: 'In Transit',
                gps: '19.0760, 72.8777'
            }
        ]
    }

    const verificationCategories = [
        {
            title: 'Origin & GPS',
            description: 'Farm location and harvest details',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            title: 'Lab Reports',
            description: 'Quality certificates and test results',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            title: 'Sustainability',
            description: 'Eco-score and carbon footprint',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            )
        },
        {
            title: 'Supply Chain',
            description: 'Complete journey from farm to shelf',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            )
        }
    ]

    const handleVerify = () => {
        if (phoneNumber) {
            setTimeout(() => {
                setProductData(sampleProductData)
            }, 1000)
        }
    }

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream
                setScanning(true)
            }
        } catch (err) {
            console.error('Error accessing camera:', err)
            alert('Unable to access camera. Please ensure you have granted camera permissions.')
        }
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        setScanning(false)
        setShowScanner(false)
    }

    const handleQRScan = async () => {
        setShowScanner(true)
        await startCamera()
    }

    const fetchProductByQr = async (qrValue: string) => {
        setVerifying(true)
        try {
            const res = await fetch(`${API_BASE}/api/consumer/verify-qr?code=${encodeURIComponent(qrValue)}`)
            if (!res.ok) throw new Error('Verification failed')
            const data = await res.json()
            // Adjust according to actual response shape
            setProductData(data?.data || data || sampleProductData)
        } catch (err) {
            console.warn('QR verify failed, using sample data', err)
            setProductData(sampleProductData)
        } finally {
            setVerifying(false)
        }
    }

    // Auto-verify when QR URL contains ?package=...
    useEffect(() => {
        const pkg = searchParams.get('package')
        if (pkg) {
            fetchProductByQr(pkg)
        }
    }, [searchParams])

    useEffect(() => {
        // Prepare barcode detector if supported
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
            try {
                barcodeDetectorRef.current = new BarcodeDetector({ formats: ['qr_code'] })
            } catch (err) {
                console.warn('BarcodeDetector init failed', err)
            }
        }
    }, [])

    useEffect(() => {
        // Scanning loop using BarcodeDetector
        const detect = async () => {
            if (!scanning || !videoRef.current || !canvasRef.current || !barcodeDetectorRef.current) {
                return
            }
            const video = videoRef.current
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            if (!ctx || video.readyState < 2) {
                scanFrameRef.current = requestAnimationFrame(detect)
                return
            }
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            try {
                const codes = await barcodeDetectorRef.current.detect(canvas)
                if (codes && codes.length) {
                    stopCamera()
                    const qrValue = codes[0].rawValue || ''
                    await fetchProductByQr(qrValue)
                    return
                }
            } catch (err) {
                console.warn('QR detection error', err)
            }
            scanFrameRef.current = requestAnimationFrame(detect)
        }

        if (scanning && barcodeDetectorRef.current) {
            scanFrameRef.current = requestAnimationFrame(detect)
        }

        return () => {
            if (scanFrameRef.current) cancelAnimationFrame(scanFrameRef.current)
        }
    }, [scanning])

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
            if (scanFrameRef.current) cancelAnimationFrame(scanFrameRef.current)
        }
    }, [])

    const handleDownloadReport = (report: any) => {
        // Create a simple text-based report content
        const reportContent = `
AYUSH MINISTRY - LABORATORY REPORT
=====================================

Report: ${report.name}
Laboratory: ${report.lab}
Date: ${report.date}
Status: ${report.status}

Batch ID: ${productData.batchId}
Product: ${productData.productName}
Harvest Date: ${productData.harvestDate}

Farmer Details:
- Name: ${productData.origin.farmerName}
- Location: ${productData.origin.farmLocation}
- Experience: ${productData.origin.yearsOfExperience} years

Test Results: ${report.status}

This is an official laboratory report certified by ${report.lab}.
All tests have been conducted as per AYUSH Ministry guidelines.

Report ID: ${report.id}
Generated: ${new Date().toLocaleString()}

---
Government of India | Ministry of AYUSH
Blockchain-Verified Traceability System
        `.trim()

        // Create a blob and download
        const blob = new Blob([reportContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${report.name.replace(/\s+/g, '_')}_${productData.batchId}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            {/* Header */}
            <header className="border-b border-gray-200 py-5 px-6 bg-[#016868] sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-semibold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Home</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-16">
                {!productData ? (
                    <>
                        {/* Verification Form */}
                        <div className="max-w-xl mx-auto mb-20">
                            <div className="text-center mb-10">
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                    Verify Product Authenticity
                                </h1>
                                <p className="text-gray-600 leading-relaxed font-semibold">
                                    Enter your batch ID or scan the QR code to access complete product<br />
                                    provenance and certification data.
                                </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                                {/* Phone Number Input */}
                                <div className="mb-5">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter your registered phone number to receive an OTP"
                                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-lg focus:border-[#016868] focus:outline-none focus:ring-2 focus:ring-[#016868]/20 text-gray-900 placeholder:text-gray-400 bg-gray-50 font-semibold"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleVerify}
                                        disabled={!phoneNumber}
                                        className="bg-[#016868] hover:bg-[#014d4d] text-white py-3.5 rounded-lg font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                    >
                                        Verify
                                    </button>
                                    <button
                                        onClick={handleQRScan}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-lg font-bold border-2 border-gray-300 transition-all hover:border-gray-400"
                                    >
                                        Scan QR
                                    </button>
                                </div>
                            </div>

                            {/* QR Scanner Modal */}
                            {showScanner && (
                                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Scan QR Code</h3>
                                        <div className="bg-black rounded-xl overflow-hidden mb-4 relative">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-64 object-cover"
                                            />
                                            <canvas ref={canvasRef} className="hidden" />
                                            {scanning && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-48 h-48 border-4 border-white rounded-2xl shadow-lg"></div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 text-center mb-4 font-semibold">
                                            Position the QR code within the frame
                                            {verifying && <span className="ml-2 text-[#016868]">Verifying…</span>}
                                        </p>
                                        <button
                                            onClick={stopCamera}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-bold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* What You Can Verify Section */}
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                                What You Can Verify
                            </h2>
                            <div className="grid md:grid-cols-4 gap-5">
                                {verificationCategories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-[#016868] transition-all duration-300 group"
                                    >
                                        <div className="text-[#016868] mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                            {category.icon}
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed font-semibold">{category.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    // Product Details View
                    <div className="space-y-8">
                        {/* Product Header */}
                        <div className="bg-gradient-to-br from-[#016868] to-[#014d4d] rounded-2xl p-10 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
                            <div className="flex items-start justify-between flex-wrap gap-6 relative z-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Verified Authentic</span>
                                    </div>
                                    <h2 className="text-4xl font-bold mb-3">{productData.productName}</h2>
                                    <div className="space-y-1 text-white/90">
                                        <p className="font-semibold">Batch ID: <span className="font-normal">{productData.batchId}</span></p>
                                        <p className="font-semibold">Harvested: <span className="font-normal">{productData.harvestDate}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setProductData(null)}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg transition-colors font-bold border border-white/20"
                                >
                                    New Search
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-md overflow-hidden">
                            <div className="flex border-b-2 border-gray-200 overflow-x-auto bg-gray-50">
                                <button
                                    onClick={() => setActiveTab('origin')}
                                    className={`flex-1 px-6 py-5 font-bold transition-all whitespace-nowrap text-sm ${activeTab === 'origin'
                                            ? 'text-[#016868] border-b-4 border-[#016868] bg-white'
                                            : 'text-gray-600 hover:text-[#016868] hover:bg-gray-100'
                                        }`}
                                >
                                    Origin & GPS
                                </button>
                                <button
                                    onClick={() => setActiveTab('lab')}
                                    className={`flex-1 px-6 py-5 font-bold transition-all whitespace-nowrap text-sm ${activeTab === 'lab'
                                            ? 'text-[#016868] border-b-4 border-[#016868] bg-white'
                                            : 'text-gray-600 hover:text-[#016868] hover:bg-gray-100'
                                        }`}
                                >
                                    Lab Reports
                                </button>
                                <button
                                    onClick={() => setActiveTab('sustainability')}
                                    className={`flex-1 px-6 py-5 font-bold transition-all whitespace-nowrap text-sm ${activeTab === 'sustainability'
                                            ? 'text-[#016868] border-b-4 border-[#016868] bg-white'
                                            : 'text-gray-600 hover:text-[#016868] hover:bg-gray-100'
                                        }`}
                                >
                                    Sustainability
                                </button>
                                <button
                                    onClick={() => setActiveTab('journey')}
                                    className={`flex-1 px-6 py-5 font-bold transition-all whitespace-nowrap text-sm ${activeTab === 'journey'
                                            ? 'text-[#016868] border-b-4 border-[#016868] bg-white'
                                            : 'text-gray-600 hover:text-[#016868] hover:bg-gray-100'
                                        }`}
                                >
                                    Supply Chain
                                </button>
                            </div>

                            <div className="p-10">
                                {/* Origin & GPS Tab */}
                                {activeTab === 'origin' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Origin & GPS Location</h3>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl">
                                                    <h4 className="font-bold text-gray-900 mb-4 text-lg">Farmer Details</h4>
                                                    <div className="space-y-3 text-gray-700">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500 font-semibold">Name</span>
                                                            <span className="font-bold text-gray-900">{productData.origin.farmerName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500 font-semibold">Experience</span>
                                                            <span className="font-bold text-gray-900">{productData.origin.yearsOfExperience} years</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500 font-semibold">Location</span>
                                                            <span className="font-bold text-gray-900">{productData.origin.farmLocation}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500 font-semibold">Method</span>
                                                            <span className="font-bold text-gray-900">{productData.origin.harvestMethod}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-[#016868]/5 border-2 border-[#016868]/30 p-6 rounded-xl">
                                                    <h4 className="font-bold text-[#016868] mb-4 text-lg">GPS Coordinates</h4>
                                                    <div className="space-y-3 text-gray-900 mb-4">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 font-semibold">Latitude</span>
                                                            <span className="font-mono font-bold">{productData.origin.latitude}°N</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-600 font-semibold">Longitude</span>
                                                            <span className="font-mono font-bold">{productData.origin.longitude}°E</span>
                                                        </div>
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 bg-[#016868]/10 text-[#016868] px-4 py-2 rounded-lg text-sm font-bold border-2 border-[#016868]/30">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>{productData.origin.geofenceStatus}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mt-3 italic font-semibold">
                                                        Location verified within authorized geofence boundary
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Interactive Map */}
                                            <div className="rounded-xl overflow-hidden border-2 border-gray-200 h-[500px] shadow-md">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    style={{ border: 0 }}
                                                    src={`https://www.google.com/maps?q=${productData.origin.latitude},${productData.origin.longitude}&z=15&output=embed`}
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Lab Reports Tab */}
                                {activeTab === 'lab' && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Laboratory Reports</h3>

                                        <div className="space-y-4">
                                            {productData.labReports.map((report: any) => (
                                                <div key={report.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#016868] hover:shadow-lg transition-all duration-300 group bg-gray-50 hover:bg-white">
                                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#016868] transition-colors">{report.name}</h4>
                                                            <p className="text-gray-600 mb-3 font-semibold">{report.lab}</p>
                                                            <div className="flex items-center gap-4 flex-wrap">
                                                                <span className="text-sm text-gray-500 font-semibold">{report.date}</span>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${report.status === 'Passed' || report.status === 'Verified'
                                                                        ? 'bg-[#016868]/10 text-[#016868] border-2 border-[#016868]/30'
                                                                        : 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                                                                    }`}>
                                                                    {report.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDownloadReport(report)}
                                                            className="bg-[#016868] hover:bg-[#014d4d] text-white px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span>Download</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sustainability Tab */}
                                {activeTab === 'sustainability' && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Sustainability Metrics</h3>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Eco Score */}
                                            <div className="bg-gradient-to-br from-[#016868]/5 to-[#016868]/10 border-2 border-[#016868]/30 p-8 rounded-xl text-center">
                                                <h4 className="font-bold text-gray-900 mb-6 text-lg">Eco-Score</h4>
                                                <div className="text-7xl font-bold text-[#016868] mb-3">{productData.sustainability.ecoScore}</div>
                                                <div className="text-gray-600 mb-6 font-semibold">out of 100</div>
                                                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div className="bg-[#016868] h-full transition-all duration-1000" style={{ width: `${productData.sustainability.ecoScore}%` }}></div>
                                                </div>
                                            </div>

                                            {/* Carbon Footprint */}
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 p-8 rounded-xl text-center">
                                                <h4 className="font-bold text-gray-900 mb-6 text-lg">Carbon Footprint</h4>
                                                <div className="text-7xl font-bold text-blue-700 mb-3">{productData.sustainability.carbonFootprint}</div>
                                                <div className="text-gray-600 mb-6 font-semibold">kg CO₂ equivalent</div>
                                                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold border-2 border-blue-300">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Low Impact</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-5">
                                            <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl text-center hover:border-gray-300 transition-colors">
                                                <div className="mb-3">
                                                    <svg className="w-12 h-12 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <div className="font-bold text-gray-900 mb-1">Water Usage</div>
                                                <div className="text-gray-600 font-semibold">{productData.sustainability.waterUsage}</div>
                                            </div>
                                            <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl text-center hover:border-gray-300 transition-colors">
                                                <div className="mb-3">
                                                    <svg className="w-12 h-12 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                    </svg>
                                                </div>
                                                <div className="font-bold text-gray-900 mb-1">Organic Certified</div>
                                                <div className="text-[#016868] font-bold">Yes</div>
                                            </div>
                                            <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl text-center hover:border-gray-300 transition-colors">
                                                <div className="mb-3">
                                                    <svg className="w-12 h-12 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                </div>
                                                <div className="font-bold text-gray-900 mb-1">Fair Trade</div>
                                                <div className="text-blue-700 font-bold">Yes</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Supply Chain Journey Tab */}
                                {activeTab === 'journey' && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Supply Chain Journey</h3>

                                        <div className="relative">
                                            {productData.supplyChain.map((stage: any, index: number) => (
                                                <div key={index} className="flex gap-6 mb-6 last:mb-0">
                                                    {/* Timeline */}
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md ${stage.status === 'Completed' ? 'bg-[#016868] ring-4 ring-[#016868]/20' : 'bg-blue-600 ring-4 ring-blue-600/20'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                        {index < productData.supplyChain.length - 1 && (
                                                            <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
                                                        )}
                                                    </div>

                                                    {/* Stage Details */}
                                                    <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-[#016868]/50 hover:shadow-md transition-all duration-300">
                                                        <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                                                            <div>
                                                                <h4 className="text-lg font-bold text-gray-900 mb-1">{stage.stage}</h4>
                                                                <p className="text-gray-600 font-semibold">{stage.location}</p>
                                                            </div>
                                                            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap border-2 ${stage.status === 'Completed'
                                                                    ? 'bg-[#016868]/10 text-[#016868] border-[#016868]/30'
                                                                    : 'bg-blue-100 text-blue-800 border-blue-300'
                                                                }`}>
                                                                {stage.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-6 text-sm text-gray-500 flex-wrap font-semibold">
                                                            <span>{stage.date}</span>
                                                            <span>{stage.time}</span>
                                                            <span className="font-mono bg-white px-2 py-0.5 rounded border-2 border-gray-200">{stage.gps}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-[#016868]/5 border-2 border-[#016868]/30 p-6 rounded-xl">
                                            <div className="flex items-center justify-center gap-3 text-gray-900">
                                                <svg className="w-5 h-5 text-[#016868]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-bold">Blockchain Verified</span>
                                                <span className="text-gray-600 font-semibold">— All transactions recorded on immutable ledger</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

