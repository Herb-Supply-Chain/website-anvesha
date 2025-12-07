'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ConsumerPortal() {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [showScanner, setShowScanner] = useState(false)
    const [productData, setProductData] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'origin' | 'lab' | 'sustainability' | 'journey'>('origin')
    const [scanning, setScanning] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

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
            icon: '📍'
        },
        {
            title: 'Lab Reports',
            description: 'Quality certificates and test results',
            icon: '🧪'
        },
        {
            title: 'Sustainability',
            description: 'Eco-score and carbon footprint',
            icon: '🌱'
        },
        {
            title: 'Supply Chain',
            description: 'Complete journey from farm to shelf',
            icon: '🚚'
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

        // Simulate QR code detection after 3 seconds
        setTimeout(() => {
            stopCamera()
            setProductData(sampleProductData)
        }, 3000)
    }

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
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
        <div className="min-h-screen bg-[#FDFBF7]">
            {/* Header */}
            <header className="border-b border-teal-800 py-5 px-6 bg-[#064E3B] sticky top-0 z-50 shadow-md">
                <div className="max-w-6xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-teal-50 hover:text-white transition-colors text-sm font-medium">
                        <span>←</span>
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
                                <h1 className="text-4xl font-serif font-bold text-[#1C1917] mb-3">
                                    Verify Product Authenticity
                                </h1>
                                <p className="text-[#57534E] leading-relaxed">
                                    Enter your batch ID or scan the QR code to access complete product<br />
                                    provenance and certification data.
                                </p>
                            </div>

                            <div className="bg-white border border-[#E7E5E4] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                                {/* Phone Number Input */}
                                <div className="mb-5">
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="Enter your registered phone number to receive an OTP"
                                        className="w-full px-4 py-3.5 border border-[#D6D3D1] rounded-lg focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B] text-[#1C1917] placeholder:text-[#A8A29E] bg-[#FAFAF9]"
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleVerify}
                                        disabled={!phoneNumber}
                                        className="bg-[#064E3B] hover:bg-[#065F46] text-white py-3.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-[#064E3B]/20"
                                    >
                                        Verify
                                    </button>
                                    <button
                                        onClick={handleQRScan}
                                        className="bg-[#FAFAF9] hover:bg-[#F5F5F4] text-[#1C1917] py-3.5 rounded-lg font-medium border border-[#D6D3D1] transition-colors"
                                    >
                                        Scan QR
                                    </button>
                                </div>
                            </div>

                            {/* QR Scanner Modal */}
                            {showScanner && (
                                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Scan QR Code</h3>
                                        <div className="bg-black rounded-xl overflow-hidden mb-4 relative">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                className="w-full h-64 object-cover"
                                            />
                                            {scanning && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="w-48 h-48 border-4 border-white rounded-2xl shadow-lg"></div>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 text-center mb-4">
                                            Position the QR code within the frame
                                        </p>
                                        <button
                                            onClick={stopCamera}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* What You Can Verify Section */}
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-3xl font-serif font-bold text-[#1C1917] text-center mb-12">
                                What You can verify
                            </h2>
                            <div className="grid md:grid-cols-4 gap-5">
                                {verificationCategories.map((category, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-[#E7E5E4] rounded-xl p-6 text-center hover:shadow-lg hover:shadow-[#064E3B]/5 transition-all duration-300 group"
                                    >
                                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                                        <h3 className="font-semibold text-[#1C1917] mb-2">{category.title}</h3>
                                        <p className="text-sm text-[#57534E] leading-relaxed">{category.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    // Product Details View
                    <div className="space-y-8">
                        {/* Product Header */}
                        <div className="bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#047857] rounded-3xl p-10 text-white shadow-xl shadow-[#064E3B]/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
                            <div className="flex items-start justify-between flex-wrap gap-6">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>Verified Authentic</span>
                                    </div>
                                    <h2 className="text-4xl font-bold mb-3">{productData.productName}</h2>
                                    <div className="space-y-1 text-teal-50">
                                        <p className="font-medium">Batch ID: <span className="font-normal">{productData.batchId}</span></p>
                                        <p className="font-medium">Harvested: <span className="font-normal">{productData.harvestDate}</span></p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setProductData(null)}
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg transition-colors font-medium border border-white/20"
                                >
                                    New Search
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="flex border-b border-[#E7E5E4] overflow-x-auto bg-white/50 backdrop-blur-sm">
                                <button
                                    onClick={() => setActiveTab('origin')}
                                    className={`flex-1 px-6 py-5 font-medium transition-all whitespace-nowrap text-sm tracking-wide ${activeTab === 'origin'
                                        ? 'text-[#064E3B] border-b-2 border-[#064E3B] bg-[#064E3B]/5'
                                        : 'text-[#57534E] hover:text-[#064E3B] hover:bg-[#064E3B]/5'
                                        }`}
                                >
                                    Origin & GPS
                                </button>
                                <button
                                    onClick={() => setActiveTab('lab')}
                                    className={`flex-1 px-6 py-5 font-medium transition-all whitespace-nowrap text-sm tracking-wide ${activeTab === 'lab'
                                        ? 'text-[#064E3B] border-b-2 border-[#064E3B] bg-[#064E3B]/5'
                                        : 'text-[#57534E] hover:text-[#064E3B] hover:bg-[#064E3B]/5'
                                        }`}
                                >
                                    Lab Reports
                                </button>
                                <button
                                    onClick={() => setActiveTab('sustainability')}
                                    className={`flex-1 px-6 py-5 font-medium transition-all whitespace-nowrap text-sm tracking-wide ${activeTab === 'sustainability'
                                        ? 'text-[#064E3B] border-b-2 border-[#064E3B] bg-[#064E3B]/5'
                                        : 'text-[#57534E] hover:text-[#064E3B] hover:bg-[#064E3B]/5'
                                        }`}
                                >
                                    Sustainability
                                </button>
                                <button
                                    onClick={() => setActiveTab('journey')}
                                    className={`flex-1 px-6 py-5 font-medium transition-all whitespace-nowrap text-sm tracking-wide ${activeTab === 'journey'
                                        ? 'text-[#064E3B] border-b-2 border-[#064E3B] bg-[#064E3B]/5'
                                        : 'text-[#57534E] hover:text-[#064E3B] hover:bg-[#064E3B]/5'
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
                                            <h3 className="text-2xl font-serif font-bold text-[#1C1917] mb-6">Origin & GPS Location</h3>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="bg-[#FAFAF9] border border-[#E7E5E4] p-6 rounded-xl">
                                                    <h4 className="font-semibold text-[#1C1917] mb-4 text-lg">Farmer Details</h4>
                                                    <div className="space-y-3 text-[#57534E]">
                                                        <div className="flex justify-between">
                                                            <span className="text-[#878481]">Name</span>
                                                            <span className="font-medium text-[#1C1917]">{productData.origin.farmerName}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#878481]">Experience</span>
                                                            <span className="font-medium text-[#1C1917]">{productData.origin.yearsOfExperience} years</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#878481]">Location</span>
                                                            <span className="font-medium text-[#1C1917]">{productData.origin.farmLocation}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#878481]">Method</span>
                                                            <span className="font-medium text-[#1C1917]">{productData.origin.harvestMethod}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-[#064E3B]/5 border border-[#064E3B]/20 p-6 rounded-xl">
                                                    <h4 className="font-semibold text-[#064E3B] mb-4 text-lg">GPS Coordinates</h4>
                                                    <div className="space-y-3 text-[#1C1917] mb-4">
                                                        <div className="flex justify-between">
                                                            <span className="text-[#57534E]">Latitude</span>
                                                            <span className="font-mono font-medium">{productData.origin.latitude}°N</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-[#57534E]">Longitude</span>
                                                            <span className="font-mono font-medium">{productData.origin.longitude}°E</span>
                                                        </div>
                                                    </div>
                                                    <div className="inline-flex items-center gap-2 bg-[#064E3B]/10 text-[#064E3B] px-4 py-2 rounded-lg text-sm font-medium border border-[#064E3B]/20">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>{productData.origin.geofenceStatus}</span>
                                                    </div>
                                                    <p className="text-xs text-[#57534E] mt-3 italic">
                                                        Location verified within authorized geofence boundary
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Interactive Map */}
                                            <div className="rounded-xl overflow-hidden border border-[#E7E5E4] h-[500px] shadow-sm">
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
                                        <h3 className="text-2xl font-serif font-bold text-[#1C1917] mb-6">Laboratory Reports</h3>

                                        <div className="space-y-4">
                                            {productData.labReports.map((report: any) => (
                                                <div key={report.id} className="border border-[#E7E5E4] rounded-xl p-6 hover:border-[#064E3B] hover:shadow-md transition-all duration-300 group bg-[#FAFAF9] hover:bg-white">
                                                    <div className="flex items-start justify-between flex-wrap gap-4">
                                                        <div className="flex-1">
                                                            <h4 className="text-lg font-semibold text-[#1C1917] mb-2 group-hover:text-[#064E3B] transition-colors">{report.name}</h4>
                                                            <p className="text-[#57534E] mb-3">{report.lab}</p>
                                                            <div className="flex items-center gap-4 flex-wrap">
                                                                <span className="text-sm text-[#878481]">{report.date}</span>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${report.status === 'Passed' || report.status === 'Verified'
                                                                    ? 'bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/20'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {report.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDownloadReport(report)}
                                                            className="bg-[#1C1917] hover:bg-[#064E3B] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-black/5"
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
                                        <h3 className="text-2xl font-serif font-bold text-[#1C1917] mb-6">Sustainability Metrics</h3>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Eco Score */}
                                            <div className="bg-gradient-to-br from-[#064E3B]/5 to-[#065F46]/5 border border-[#064E3B]/20 p-8 rounded-xl text-center">
                                                <h4 className="font-semibold text-[#1C1917] mb-6 text-lg">Eco-Score</h4>
                                                <div className="text-7xl font-bold text-[#064E3B] mb-3">{productData.sustainability.ecoScore}</div>
                                                <div className="text-[#57534E] mb-6">out of 100</div>
                                                <div className="bg-[#E7E5E4] rounded-full h-2.5 overflow-hidden">
                                                    <div className="bg-[#059669] h-full transition-all duration-1000" style={{ width: `${productData.sustainability.ecoScore}%` }}></div>
                                                </div>
                                            </div>

                                            {/* Carbon Footprint */}
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8 rounded-xl text-center">
                                                <h4 className="font-semibold text-[#1C1917] mb-6 text-lg">Carbon Footprint</h4>
                                                <div className="text-7xl font-bold text-[#1E40AF] mb-3">{productData.sustainability.carbonFootprint}</div>
                                                <div className="text-[#57534E] mb-6">kg CO₂ equivalent</div>
                                                <div className="inline-flex items-center gap-2 bg-[#DBEAFE] text-[#1E40AF] px-4 py-2 rounded-lg text-sm font-medium border border-[#93C5FD]">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Low Impact</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-5">
                                            <div className="bg-[#FAFAF9] border border-[#E7E5E4] p-6 rounded-xl text-center hover:border-[#D6D3D1] transition-colors">
                                                <div className="text-4xl mb-3">💧</div>
                                                <div className="font-semibold text-[#1C1917] mb-1">Water Usage</div>
                                                <div className="text-[#57534E]">{productData.sustainability.waterUsage}</div>
                                            </div>
                                            <div className="bg-[#FAFAF9] border border-[#E7E5E4] p-6 rounded-xl text-center hover:border-[#D6D3D1] transition-colors">
                                                <div className="text-4xl mb-3">🌿</div>
                                                <div className="font-semibold text-[#1C1917] mb-1">Organic Certified</div>
                                                <div className="text-[#064E3B] font-semibold">Yes</div>
                                            </div>
                                            <div className="bg-[#FAFAF9] border border-[#E7E5E4] p-6 rounded-xl text-center hover:border-[#D6D3D1] transition-colors">
                                                <div className="text-4xl mb-3">🤝</div>
                                                <div className="font-semibold text-[#1C1917] mb-1">Fair Trade</div>
                                                <div className="text-[#1E40AF] font-semibold">Yes</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Supply Chain Journey Tab */}
                                {activeTab === 'journey' && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-serif font-bold text-[#1C1917] mb-6">Supply Chain Journey</h3>

                                        <div className="relative">
                                            {productData.supplyChain.map((stage: any, index: number) => (
                                                <div key={index} className="flex gap-6 mb-6 last:mb-0">
                                                    {/* Timeline */}
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm shadow-md ${stage.status === 'Completed' ? 'bg-[#064E3B] ring-4 ring-[#064E3B]/10' : 'bg-[#1E40AF] ring-4 ring-[#1E40AF]/10'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                        {index < productData.supplyChain.length - 1 && (
                                                            <div className="w-0.5 h-16 bg-[#D6D3D1] my-1"></div>
                                                        )}
                                                    </div>

                                                    {/* Stage Details */}
                                                    <div className="flex-1 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl p-6 hover:border-[#064E3B]/30 hover:shadow-sm transition-all duration-300">
                                                        <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                                                            <div>
                                                                <h4 className="text-lg font-semibold text-[#1C1917] mb-1">{stage.stage}</h4>
                                                                <p className="text-[#57534E]">{stage.location}</p>
                                                            </div>
                                                            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border ${stage.status === 'Completed'
                                                                ? 'bg-[#064E3B]/10 text-[#064E3B] border-[#064E3B]/20'
                                                                : 'bg-blue-100 text-blue-800 border-blue-200'
                                                                }`}>
                                                                {stage.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-6 text-sm text-[#878481] flex-wrap">
                                                            <span>{stage.date}</span>
                                                            <span>{stage.time}</span>
                                                            <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#E7E5E4]">{stage.gps}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-[#064E3B]/5 border border-[#064E3B]/20 p-6 rounded-xl">
                                            <div className="flex items-center justify-center gap-3 text-[#1C1917]">
                                                <svg className="w-5 h-5 text-[#064E3B]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="font-semibold">Blockchain Verified</span>
                                                <span className="text-[#57534E]">— All transactions recorded on immutable ledger</span>
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
