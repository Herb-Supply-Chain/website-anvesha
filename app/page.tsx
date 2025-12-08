'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth-service'

function LoginCard() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
        try {
            const result = await AuthService.login(email, password)
            if (result.success && result.user) {
                if (result.user.role === 'Admin') router.push('/admin')
                else if (result.user.role === 'Lab QA') router.push('/lab')
                else router.push('/processor')
            } else {
                setError(result.message)
                setIsLoading(false)
            }
        } catch (err) {
            setError('An error occurred')
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-200 hover:shadow-3xl transition-shadow duration-300">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-white rounded-xl p-2 shadow-lg">
                        <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                    </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Government Login</h3>
                <p className="text-sm text-gray-500">Authorized Personnel Only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center border border-red-200 animate-shake">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@ayush.gov.in"
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 hover:border-gray-300"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 hover:border-gray-300"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : 'Sign In'}
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <p className="text-xs text-center text-blue-800 font-medium mb-2">
                            🔒 Secure Government Portal
                        </p>
                        <p className="text-xs text-center text-gray-600">
                            Demo: processor@ayush.gov.in / pass123
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false)
    const [activeInitiative, setActiveInitiative] = useState(0)
    const [language, setLanguage] = useState<'en' | 'hi'>('en')

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en')
    }

    const t = {
        en: {
            navHome: 'Home',
            navAbout: 'About',
            navContact: 'Contact',
            navPortals: 'Portals',
            navRegister: 'Register',
            govtIndia: 'Government of India | AYUSH Ministry',
            tagline: 'A national initiative by the Ministry of AYUSH to ensure authenticity, quality, and sustainable sourcing across India\'s herbal value chain.',
            consumerVerification: 'Consumer Product Verification',
            loginGov: 'Login / GOV',
            keyInitiatives: 'Key Initiatives',
            keyInitiativesDesc: 'Comprehensive solutions for transparent and sustainable herb sourcing',
            processFlow: 'Process Flow',
            processFlowDesc: 'End-to-end journey from farm to consumer',
            nationalStandards: 'Aligned with National Standards',
            nationalStandardsDesc: 'Compliant with regulatory and quality frameworks',
            pilotImpact: 'Pilot Impact',
            pilotImpactDesc: 'Real-world results from our blockchain traceability system'
        },
        hi: {
            navHome: 'होम',
            navAbout: 'हमारे बारे में',
            navContact: 'संपर्क करें',
            navPortals: 'पोर्टल',
            navRegister: 'पंजीकरण',
            govtIndia: 'भारत सरकार | आयुष मंत्रालय',
            tagline: 'आयुष मंत्रालय द्वारा भारत की हर्बल मूल्य श्रृंखला में प्रामाणिकता, गुणवत्ता और टिकाऊ सोर्सिंग सुनिश्चित करने के लिए एक राष्ट्रीय पहल।',
            consumerVerification: 'उपभोक्ता उत्पाद सत्यापन',
            loginGov: 'लॉगिन / सरकार',
            keyInitiatives: 'मुख्य पहल',
            keyInitiativesDesc: 'पारदर्शी और टिकाऊ हर्बल सोर्सिंग के लिए व्यापक समाधान',
            processFlow: 'प्रक्रिया प्रवाह',
            processFlowDesc: 'खेत से उपभोक्ता तक की संपूर्ण यात्रा',
            nationalStandards: 'राष्ट्रीय मानकों के साथ संरेखित',
            nationalStandardsDesc: 'नियामक और गुणवत्ता ढांचे के अनुरूप',
            pilotImpact: 'पायलट प्रभाव',
            pilotImpactDesc: 'हमारे ब्लॉकचेन ट्रेसेबिलिटी सिस्टम से वास्तविक दुनिया के परिणाम'
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveInitiative((prev) => (prev + 1) % 3)
        }, 5000)
        return () => clearInterval(interval)
    }, [])



    const initiatives = [
        {
            title: 'End-to-End Traceability',
            description: 'Track herbs from farm to shelf with blockchain-verified provenance',
            icon: 'T'
        },
        {
            title: 'Quality Assured by Labs',
            description: 'Laboratory testing and certification at every processing stage',
            icon: 'Q'
        },
        {
            title: 'Blockchain-Immutable Records',
            description: 'Tamper-proof ledger ensuring data integrity and transparency',
            icon: 'B'
        },
        {
            title: 'Sustainable Sourcing',
            description: 'Geo-fencing and conservation compliance for ethical harvesting',
            icon: 'S'
        },
        {
            title: 'Farmer Empowerment',
            description: 'Direct market access and fair pricing for smallholder farmers',
            icon: 'F'
        },
        {
            title: 'Consumer Confidence',
            description: 'QR-code verification for authenticity and complete transparency',
            icon: 'C'
        }
    ]

    const processSteps = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Source Verification',
            description: 'Geo-tagged harvesting at origin with farmer identity verification and sustainable practice compliance checks.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            title: 'Quality Analysis',
            description: 'Rigorous NABL-accredited laboratory testing for active principles, pesticide residues, and heavy metals.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            title: 'Standardized Processing',
            description: 'GMP-compliant processing and storage with continuous environmental monitoring to preserve potency.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: 'Digital Certification',
            description: 'Immutable blockchain records generated at every step, creating a tamper-proof certificate of analysis.'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Consumer Validation',
            description: 'End-users verify product authenticity and provenance details instantly via secure QR code scanning.'
        }
    ]

    const standards = [
        { name: 'NMPB', full: 'National Medicinal Plants Board', desc: 'Sustainable harvesting guidelines' },
        { name: 'GACP', full: 'Good Agricultural & Collection Practices', desc: 'Quality cultivation standards' },
        { name: 'AQR', full: 'Ayurvedic Quality Requirements', desc: 'AYUSH Ministry compliance' },
        { name: 'DII', full: 'Data Integrity & Interoperability', desc: 'FHIR-based metadata exchange' }
    ]

    const stats = [
        { value: '5,000+', label: 'Farmers Onboarded' },
        { value: '12,000+', label: 'Batches Traced' },
        { value: '98%', label: 'Quality Pass Rate' },
        { value: '50,000+', label: 'Consumer Scans' }
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-[#014848]'
                } `}>
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-md">
                                <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className={`text-sm font-bold transition-colors ${scrolled ? 'text-gray-800' : 'text-white'
                                    } `}>
                                    Government of India | भारत सरकार
                                </h1>
                                <p className={`text-xs font-medium transition-colors ${scrolled ? 'text-gray-600' : 'text-white/90'
                                    } `}>
                                    Ministry of AYUSH | आयुष मंत्रालय
                                </p>
                                <p className={`text-xs font-medium transition-colors ${scrolled ? 'text-gray-600' : 'text-white/90'
                                    } `}>
                                    ANVESHA | अन्वेषा
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all hover:scale-105 ${language === 'en'
                                    ? 'bg-white text-teal-700 shadow-md'
                                    : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
                                    }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLanguage('hi')}
                                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all hover:scale-105 ${language === 'hi'
                                    ? 'bg-white text-teal-700 shadow-md'
                                    : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
                                    }`}
                            >
                                हिंदी
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Hero Section - New Design */}
            <section className="relative min-h-screen bg-white pt-20 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full opacity-10 pointer-events-none select-none z-0 flex items-center justify-center">
                    <img
                        src="/pixel-tree.png"
                        alt=""
                        className="w-[60000px] h-[60000px] object-contain grayscale translate-x-[15px]"
                        aria-hidden="true"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side - Branding */}
                        <div className="space-y-8">


                            {/* ANVESHA Title */}
                            <div className="space-y-4">
                                <h1 className="text-6xl lg:text-7xl font-bold text-teal-600 tracking-wide">
                                    ANVESHA
                                </h1>
                                <h2 className="text-3xl lg:text-4xl font-bold text-teal-800">
                                    for Ayurvedic Herbs
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                                    A national initiative ensuring <span className="font-bold text-teal-600">authenticity</span>, <span className="font-bold text-teal-600">quality</span>, and <span className="font-bold text-teal-600">sustainable sourcing</span> across India's herbal value chain.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mt-12">
                                <Link href="/consumer-portal">
                                    <button className="bg-[#014848] hover:bg-[#013636] text-white px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2">

                                        <span>Verify Product</span>
                                    </button>
                                </Link>
                                <Link href="/contact">
                                    <button className="bg-white hover:bg-gray-50 text-teal-700 px-8 py-4 rounded-lg font-semibold border-2 border-teal-600 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2">
                                        <span>Contact Us</span>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Side - Login Card */}
                        <div className="flex justify-center lg:justify-end">
                            <LoginCard />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
            </section>

            {/* Key Initiatives */}
            < section className="py-20 px-6 bg-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="font-playfair text-5xl font-bold text-gray-900 mb-4">
                            {t[language].keyInitiatives}
                        </h3>
                        <div className="h-1 w-24 bg-teal-600 rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-xl max-w-3xl mx-auto">{t[language].keyInitiativesDesc}</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {initiatives.map((initiative, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mb-5 text-2xl font-bold group-hover:bg-teal-700 transition-colors duration-300">{initiative.icon}</div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors font-playfair">{initiative.title}</h4>
                                <p className="text-gray-600 leading-relaxed text-base">{initiative.description}</p>
                                <div className="mt-4 text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn more →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Process Flow */}
            < section className="py-24 px-6 bg-gradient-to-br from-teal-50/50 to-white relative overflow-hidden" >
                {/* Background Pattern */}
                < div className="absolute inset-0 opacity-5 pointer-events-none" >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div >

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase mb-3 block">From Farm to Consumer</span>
                        <h3 className="font-playfair text-5xl font-bold text-gray-900 mb-6">
                            Verified Supply Chain
                        </h3>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full mx-auto mb-8"></div>
                        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                            A completely transparent, blockchain-secured journey ensuring every herb's authenticity and quality.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 w-full animate-shimmer bg-[length:200%_100%]"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 relative">
                            {processSteps.map((step, index) => (
                                <div key={index} className="group relative flex flex-col items-center">
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-12 opacity-10 font-[1000] text-6xl text-teal-900 select-none group-hover:opacity-20 transition-opacity">
                                        {index + 1}
                                    </div>

                                    {/* Icon Container */}
                                    <div className="w-24 h-24 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center mb-6 relative z-10 group-hover:border-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                        <div className="text-teal-600 group-hover:text-teal-700 transition-colors">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center px-2">
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors font-playfair">
                                            {step.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* Aligned with National Standards */}
            < section className="py-20 px-6 bg-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="font-playfair text-5xl font-bold text-gray-900 mb-4">
                            Aligned with National Standards
                        </h3>
                        <div className="h-1 w-24 bg-teal-600 rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-xl max-w-3xl mx-auto">Compliant with regulatory and quality frameworks</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {standards.map((standard, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-teal-500"
                            >
                                <div className="text-3xl font-bold text-teal-600 mb-3 font-playfair">{standard.name}</div>
                                <div className="text-sm font-semibold text-gray-800 mb-2">{standard.full}</div>
                                <div className="text-xs text-gray-600 leading-relaxed">{standard.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Pilot Impact */}
            < section className="py-20 px-6 bg-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="font-playfair text-5xl font-bold text-gray-900 mb-4">Pilot Impact</h3>
                        <div className="h-1 w-24 bg-teal-600 rounded-full mx-auto mb-6"></div>
                        <p className="text-gray-600 text-xl max-w-3xl mx-auto">Real-world results from our blockchain traceability system</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                            >
                                <div className="text-5xl font-bold text-teal-600 mb-2">{stat.value}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white rounded-3xl p-12 max-w-4xl mx-auto shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                        <p className="text-lg text-center leading-relaxed mb-8 text-gray-700 italic">
                            "This initiative has been transformative in ensuring the authenticity and quality of our herbal products. The blockchain-enabled traceability system has empowered our farmers and given our consumers complete confidence in the products they purchase. It represents the perfect synergy between traditional knowledge and modern technology."
                        </p>
                        <div className="text-center">
                            <div className="font-bold text-xl text-gray-900">Joint Secretary, Ministry of AYUSH</div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-12 px-6" >
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-700/50 mb-4">
                                <span className="text-xl">🌿</span>
                                <span className="font-bold text-lg">ANVESHA</span>
                            </div>
                            <p className="text-teal-100 text-sm leading-relaxed">
                                Empowering the Ayurvedic ecosystem with blockchain-based traceability and quality assurance.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-teal-50">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-teal-200">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><Link href="/consumer-portal" className="hover:text-white transition-colors">Verify Product</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-teal-50">Portals</h4>
                            <ul className="space-y-2 text-sm text-teal-200">
                                <li><Link href="/processor" className="hover:text-white transition-colors">Processor Login</Link></li>
                                <li><Link href="/lab" className="hover:text-white transition-colors">Lab Dashboard</Link></li>
                                <li><Link href="/manufacturer" className="hover:text-white transition-colors">Manufacturer Portal</Link></li>
                                <li><Link href="/admin" className="hover:text-white transition-colors">Admin Console</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-teal-50">Contact</h4>
                            <p className="text-teal-200 text-sm leading-relaxed">
                                Ministry of AYUSH<br />
                                AYUSH Bhawan, B Block<br />
                                GPO Complex, INA<br />
                                Mumbai - 400099
                            </p>
                            <div className="mt-4 flex gap-4">
                                <a href="#" className="text-teal-200 hover:text-white transition-colors text-xl">𝕏</a>
                                <a href="#" className="text-teal-200 hover:text-white transition-colors text-xl">📘</a>
                                <a href="#" className="text-teal-200 hover:text-white transition-colors text-xl">📸</a>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-teal-800 text-center text-sm text-teal-400">
                        © 2024 Ministry of AYUSH, Government of India. All rights reserved.
                        🪶 By CrackedDevs.
                    </div>
                </div>
            </footer >
        </div >
    )
}


