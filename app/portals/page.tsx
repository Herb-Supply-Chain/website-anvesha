'use client'

import Link from 'next/link'

export default function PortalsPage() {
    const portals = [
        {
            title: 'Consumer Verification',
            description: 'Verify the authenticity and journey of your Ayurvedic products.',
            icon: '🔍',
            link: '/consumer-portal',
            color: 'teal',
            role: 'Consumer'
        },
        {
            title: 'Processor Dashboard',
            description: 'Manage batch processing, quality checks, and packaging.',
            icon: '⚙️',
            link: '/processor',
            color: 'blue',
            role: 'Processor'
        },
        {
            title: 'Lab Portal',
            description: 'Conduct quality testing and generate analysis reports.',
            icon: '🧪',
            link: '/lab',
            color: 'purple',
            role: 'Lab Technician'
        },
        {
            title: 'Manufacturer Portal',
            description: 'Track raw material inventory and manufacturing processes.',
            icon: '🏭',
            link: '/manufacturer',
            color: 'orange',
            role: 'Manufacturer'
        },
        {
            title: 'Admin Console',
            description: 'System-wide monitoring, user management, and analytics.',
            icon: '🛡️',
            link: '/admin',
            color: 'red',
            role: 'Administrator'
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#014848] shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                                    <span className="text-lg font-semibold text-teal-700">AN</span>
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
                            <Link href="/contact" className="text-white hover:text-teal-200 text-sm font-medium transition-colors">Contact</Link>
                            <Link href="/portals" className="text-white font-bold border-b-2 border-white text-sm transition-colors">Portals</Link>
                            <Link href="/consumer-portal">
                                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                                    Verify Product
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-teal-600 font-bold tracking-wider text-sm uppercase mb-4 block">Central Access Point</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Stakeholder <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Portals</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Secure access gateways for all participants in the Ayurvedic supply chain ecosystem.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {portals.map((portal, index) => (
                            <Link href={portal.link} key={index} className="group">
                                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-${portal.color}-50 text-${portal.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                        {portal.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                        {portal.title}
                                    </h3>
                                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
                                        For {portal.role}s
                                    </div>
                                    <p className="text-gray-600 flex-grow leading-relaxed">
                                        {portal.description}
                                    </p>
                                    <div className="mt-8 flex items-center text-teal-600 font-medium group-hover:translate-x-2 transition-transform">
                                        Access Portal
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Security Notice */}
                    <div className="mt-20 bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4 items-start max-w-3xl mx-auto">
                        <div className="text-blue-600 text-2xl">🛡️</div>
                        <div>
                            <h4 className="font-bold text-blue-900 mb-1">Secure Access Protocol</h4>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                All portals are secured with multi-factor authentication and role-based access control. use your official government credentials for administrative access. For technical support, please verify your identity through the central helpdesk.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-teal-200 text-sm">© 2024 Ministry of AYUSH, Government of India. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}


