'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#064E3B] shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                                    <span className="text-2xl">🌿</span>
                                </div>
                                <div className="text-white">
                                    <h1 className="text-sm font-bold">Government of India</h1>
                                    <p className="text-xs text-white/90">ANVESHA</p>
                                </div>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-white hover:text-teal-200 text-sm font-medium transition-colors">Home</Link>
                            <Link href="/about" className="text-white font-bold border-b-2 border-white text-sm transition-colors">About Us</Link>
                            <Link href="/contact" className="text-white hover:text-teal-200 text-sm font-medium transition-colors">Contact</Link>
                            <Link href="/portals" className="text-white hover:text-teal-200 text-sm font-medium transition-colors">Portals</Link>
                            <Link href="/consumer-portal">
                                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                                    Verify Product
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-teal-600 font-bold tracking-wider text-sm uppercase mb-4 block">About The Initiative</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Revolutionizing Ayurvedic <br />
                            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Supply Chain Traceability</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            ANVESHA is a flagship initiative by the Ministry of AYUSH to bring transparency, authenticity, and quality assurance to the Ayurvedic herbal industry using cutting-edge blockchain technology.
                        </p>
                    </div>
                </section>

                {/* Mission & Vision */}
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="bg-teal-900 text-white p-12 rounded-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-teal-100 text-lg leading-relaxed mb-6">
                                To establish a standardized, transparent, and globally trusted ecosystem for Ayurvedic herbs, ensuring that every product reaching the consumer is authentic, safe, and sustainably sourced.
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-white/10 px-4 py-2 rounded-lg">Trust</div>
                                <div className="bg-white/10 px-4 py-2 rounded-lg">Quality</div>
                                <div className="bg-white/10 px-4 py-2 rounded-lg">Sustainability</div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg shadow-teal-900/5">
                                    <div className="text-4xl mb-4">🌾</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Farmer First</h3>
                                    <p className="text-sm text-gray-600">Empowering 5000+ farmers with fair market access and digital credentials.</p>
                                </div>
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg shadow-teal-900/5 mt-8">
                                    <div className="text-4xl mb-4">🔬</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Scientific Rigor</h3>
                                    <p className="text-sm text-gray-600">NABL-accredited labs conducting rigorous quality and authentication tests.</p>
                                </div>
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg shadow-teal-900/5">
                                    <div className="text-4xl mb-4">🔗</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Blockchain Secured</h3>
                                    <p className="text-sm text-gray-600">Immutable ledger ensuring data integrity from farm to shelf.</p>
                                </div>
                                <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-lg shadow-teal-900/5 mt-8">
                                    <div className="text-4xl mb-4">🌏</div>
                                    <h3 className="font-bold text-gray-900 mb-2">Global Standards</h3>
                                    <p className="text-sm text-gray-600">Aligned with WHO-GMP and international export compliance.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technology Stack */}
                <section className="bg-gray-50 py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Framework</h2>
                            <p className="text-gray-600">Built on robust, scalable, and secure infrastructure</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                                <div className="font-bold text-teal-800 mb-2">Hyperledger Fabric</div>
                                <p className="text-sm text-gray-600">Permissioned Blockchain Network</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                                <div className="font-bold text-teal-800 mb-2">IPFS</div>
                                <p className="text-sm text-gray-600">Decentralized Storage for Documents</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                                <div className="font-bold text-teal-800 mb-2">React & Next.js</div>
                                <p className="text-sm text-gray-600">Modern, High-Performance Frontend</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                                <div className="font-bold text-teal-800 mb-2">API Integration</div>
                                <p className="text-sm text-gray-600">Seamless System Interoperability</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-teal-200 text-sm">© 2024 Ministry of AYUSH, Government of India. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
