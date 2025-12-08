'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#014848] shadow-md">
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
                            <Link href="/about" className="text-white hover:text-teal-200 text-sm font-medium transition-colors">About Us</Link>
                            <Link href="/contact" className="text-white font-bold border-b-2 border-white text-sm transition-colors">Contact</Link>
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
                        <span className="text-teal-600 font-bold tracking-wider text-sm uppercase mb-4 block">Get in Touch</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            We're Here to <span className="text-teal-600">Help</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Have questions about the ANVESHA initiative, traceability platform, or partnership opportunities? Reach out to us.
                        </p>
                    </div>
                </section>

                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Information */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-teal-100 p-3 rounded-lg text-2xl">📍</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Headquarters</h4>
                                            <p className="text-gray-600 mt-1">
                                                Ministry of AYUSH, AYUSH Bhawan<br />
                                                B Block, GPO Complex, INA<br />
                                                New Delhi - 110023, India
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-teal-100 p-3 rounded-lg text-2xl">📞</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Phone</h4>
                                            <p className="text-gray-600 mt-1">1800-11-22-33 (Toll Free)</p>
                                            <p className="text-gray-600">+91-11-24651655</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-teal-100 p-3 rounded-lg text-2xl">✉️</div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Email</h4>
                                            <p className="text-gray-600 mt-1">webmanager-ayush@gov.in</p>
                                            <p className="text-gray-600">support@anvesha.gov.in</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-4">Office Hours</h4>
                                <div className="space-y-2 text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Monday - Friday</span>
                                        <span className="font-medium">9:00 AM - 5:30 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Saturday - Sunday</span>
                                        <span className="font-medium">Closed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all">
                                        <option>General Inquiry</option>
                                        <option>Technical Support</option>
                                        <option>Partnership Proposal</option>
                                        <option>Report an Issue</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="button" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl">
                                    Send Message
                                </button>
                            </form>
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

