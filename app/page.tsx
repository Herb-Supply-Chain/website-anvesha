'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth-service'

function LoginCard() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const roles = ['Processor', 'Lab QA', 'Manufacturer', 'Admin']

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!role) {
            setError('Please select a user role')
            return
        }
        setIsLoading(true)
        try {
            const result = await AuthService.login(email, password)
            if (result.success && result.user) {
                if (result.user.role !== role) {
                    setError('Invalid role selected')
                    setIsLoading(false)
                    return
                }
                if (result.user.role === 'Admin') router.push('/admin')
                else router.push('/processor') // Default to processor for demo or specific dashboard
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
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-100">
            <h3 className="text-2xl font-bold text-teal-800 text-center mb-6">Login</h3>

            <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
                        required
                    >
                        <option value="" disabled>Select Role</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-70 mt-4"
                >
                    {isLoading ? 'Processing...' : 'Login'}
                </button>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-400">
                        Secure Login: This is an official government portal. Never share your credentials.
                    </p>
                    <p className="text-xs text-center text-gray-400 mt-2">
                        (Demo: processor@ayush.gov.in / pass123)
                    </p>
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
            icon: '🌿'
        },
        {
            title: 'Quality Assured by Labs',
            description: 'Laboratory testing and certification at every processing stage',
            icon: '🔬'
        },
        {
            title: 'Blockchain-Immutable Records',
            description: 'Tamper-proof ledger ensuring data integrity and transparency',
            icon: '🔗'
        },
        {
            title: 'Sustainable Sourcing',
            description: 'Geo-fencing and conservation compliance for ethical harvesting',
            icon: '🌍'
        },
        {
            title: 'Farmer Empowerment',
            description: 'Direct market access and fair pricing for smallholder farmers',
            icon: '👨‍🌾'
        },
        {
            title: 'Consumer Confidence',
            description: 'QR-code verification for authenticity and complete transparency',
            icon: '✓'
        }
    ]

    const processSteps = [
        {
            icon: '📍',
            title: 'Geo-Tagged Collection',
            description: 'GPS-verified harvesting with collector identity and timestamp'
        },
        {
            icon: '🧪',
            title: 'Laboratory Testing',
            description: 'Quality analysis for moisture, pesticides, and DNA authentication'
        },
        {
            icon: '⚙️',
            title: 'Processing & Storage',
            description: 'Controlled drying, grinding, and storage with condition monitoring'
        },
        {
            icon: '📦',
            title: 'Smart Packaging',
            description: 'Blockchain-generated QR codes for end-to-end traceability'
        },
        {
            icon: '📱',
            title: 'Consumer Verification',
            description: 'Scan QR codes to view complete provenance and quality certificates'
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
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-[#064E3B]'
                } `}>
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                                <span className="text-2xl">🌿</span>
                            </div>
                            <div>
                                <h1 className={`text-sm font-bold transition-colors ${scrolled ? 'text-gray-800' : 'text-white'
                                    } `}>
                                    {t[language].govtIndia}
                                </h1>
                                <p className={`text-xs transition-colors ${scrolled ? 'text-gray-600' : 'text-white/90'
                                    } `}>
                                    ANVESHA
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/" className={`text-sm font-medium transition-all ${scrolled ? 'text-gray-700 hover:text-teal-600' : 'text-white hover:text-teal-200'
                                } hover:scale-105`}>
                                {t[language].navHome}
                            </Link>
                            <Link href="/about" className={`text-sm font-medium transition-all ${scrolled ? 'text-gray-700 hover:text-teal-600' : 'text-white hover:text-teal-200'
                                } hover:scale-105`}>
                                {t[language].navAbout}
                            </Link>
                            <Link href="/contact" className={`text-sm font-medium transition-all ${scrolled ? 'text-gray-700 hover:text-teal-600' : 'text-white hover:text-teal-200'
                                } hover:scale-105`}>
                                {t[language].navContact}
                            </Link>
                            <Link href="/portals" className={`text-sm font-medium transition-all ${scrolled ? 'text-gray-700 hover:text-teal-600' : 'text-white hover:text-teal-200'
                                } hover:scale-105`}>
                                {t[language].navPortals}
                            </Link>
                            <button
                                onClick={toggleLanguage}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 ${scrolled
                                    ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
                                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                    }`}
                            >
                                {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
                            </button>
                            <Link href="/register">
                                <button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:scale-105">
                                    {t[language].navRegister}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - New Design */}
            <section className="relative min-h-screen bg-gradient-to-br from-[#E8F5F3] via-[#D4EDE9] to-[#C0E5DF] pt-20">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Side - Branding */}
                        <div className="space-y-8">
                            {/* Ministry Badge */}
                            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-200">
                                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-teal-800">Ministry of AYUSH Initiative</span>
                            </div>

                            {/* ANVESHA Title */}
                            <div>
                                <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-4">
                                    ANVESHA
                                </h1>
                                <h2 className="text-4xl font-bold text-teal-900 mb-6">
                                    for Ayurvedic Herbs
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    A national initiative ensuring <span className="font-semibold text-teal-700">authenticity</span>, <span className="font-semibold text-teal-700">quality</span>, and <span className="font-semibold text-teal-700">sustainable sourcing</span> across India's herbal value chain.
                                </p>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-teal-600 mb-1">100%</div>
                                    <div className="text-sm text-gray-600 font-medium">Traceable</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-teal-600 mb-1">24/7</div>
                                    <div className="text-sm text-gray-600 font-medium">Monitoring</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-teal-600 mb-1">Secure</div>
                                    <div className="text-sm text-gray-600 font-medium">Blockchain</div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Link href="/consumer-portal">
                                    <button className="bg-[#064E3B] hover:bg-[#054332] text-white px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2">
                                        
                                        <span>Verify Product</span>
                                    </button>
                                </Link>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="bg-white hover:bg-gray-50 text-teal-700 px-8 py-4 rounded-lg font-semibold border-2 border-teal-600 transition-all hover:shadow-lg hover:scale-105 flex items-center gap-2"
                                >
                                    
                                    <span>Login / GOV</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Login Card */}
                        <div className="flex justify-center lg:justify-end">
                            <LoginCard />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
            </section>

            {/* Key Initiatives */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">{t[language].keyInitiatives}</span>
                        </h3>
                        <p className="text-gray-600 text-lg">{t[language].keyInitiativesDesc}</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {initiatives.map((initiative, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                            >
                                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{initiative.icon}</div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">{initiative.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{initiative.description}</p>
                                <div className="mt-4 text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn more →
                                </div>
                            </div>
                        ))}
                    </div>
                </div >
            </section >

            {/* Process Flow */}
            < section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-teal-50" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Process Flow</span>
                        </h3>
                        <p className="text-gray-600 text-lg">End-to-end journey from farm to consumer</p>
                    </div>
                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 transform -translate-y-1/2 z-0"></div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
                            {processSteps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center text-center group">
                                    <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mb-4 border-4 border-teal-500 transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-2xl">
                                        <span className="text-3xl">{step.icon}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{step.title}</h4>
                                    <p className="text-sm text-gray-600">{step.description}</p>
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
                        <h3 className="text-4xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Aligned with National Standards</span>
                        </h3>
                        <p className="text-gray-600 text-lg">Compliant with regulatory and quality frameworks</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {standards.map((standard, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-teal-500"
                            >
                                <div className="text-3xl font-bold text-teal-600 mb-3">{standard.name}</div>
                                <div className="text-sm font-semibold text-gray-800 mb-2">{standard.full}</div>
                                <div className="text-xs text-gray-600">{standard.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Pilot Impact */}
            < section className="py-20 px-6 bg-gradient-to-br from-teal-600 via-teal-700 to-blue-600 text-white relative overflow-hidden" >
                {/* Animated background */}
                < div className="absolute inset-0 overflow-hidden pointer-events-none" >
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                </div >
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h3 className="text-4xl font-bold mb-4">Pilot Impact</h3>
                        <p className="text-teal-100 text-lg">Real-world results from our blockchain traceability system</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                            >
                                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-teal-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 max-w-4xl mx-auto border border-white/20">
                        <div className="text-6xl mb-6 text-center opacity-50">"</div>
                        <p className="text-lg text-center leading-relaxed mb-6 italic">
                            This initiative has been transformative in ensuring the authenticity and sustainability
                            of our Ayurvedic herbs. The ANVESHA traceability system has empowered our farmers and given our
                            customers complete confidence in the products they consume. It's a model that can be
                            replicated across the entire AYUSH sector.
                        </p>
                        <div className="text-center">
                            <div className="font-bold text-xl">Joint Secretary, Ministry of AYUSH</div>
                            <div className="text-teal-200 text-sm">Government of India</div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            <footer className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-12 px-6">
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
            </footer>
        </div >
    )
}
