'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GovFooter } from './components/GovFooter'
import { useRouter } from 'next/navigation'
import { DownloadButton } from './components/DownloadButton'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || ''

interface LoginCardProps {
    language: 'en' | 'hi'
    t: any
}

function LoginCard({ language, t }: LoginCardProps) {
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
            const response = await fetch(`${APP_URL}/api/auth/email/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok && data) {
                // Store token if available
                console.log('Login response:', data)
                const token = data.data?.token || data.token
                
                if (token) {
                    // Set cookie with proper encoding and attributes
                    const expires = new Date()
                    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
                    
                    document.cookie = `jwt_token=${encodeURIComponent(token)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
                    
                    // Also store in localStorage as backup
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('jwt_token', token)
                    }
                    
                    console.log('✅ Token stored in cookie and localStorage')
                } else {
                    console.warn('⚠️ No token found in response:', data)
                }

                // Get user role - check multiple possible locations and formats
                const userRole = data.user?.role || data.role || data.data?.user?.role || 'Admin'
                const roleUpper = userRole.toUpperCase()
                
                console.log('User role detected:', userRole, 'Normalized:', roleUpper)

                // Redirect based on role
                let redirectPath = '/'
                
                if (roleUpper === 'ADMIN' || roleUpper === 'ADMINISTRATOR') {
                    redirectPath = '/admin'
                } else if (roleUpper === 'LAB' || roleUpper === 'LAB QA' || roleUpper === 'LABORATORY') {
                    redirectPath = '/lab'
                } else if (roleUpper === 'PROCESSOR') {
                    redirectPath = '/processor'
                } else if (roleUpper === 'MANUFACTURER' || roleUpper === 'MANUFACTURING') {
                    redirectPath = '/manufacturing'
                }
                
                console.log('Redirecting to:', redirectPath)
                
                // Use both router.push and window.location as fallback
                setIsLoading(false)
                router.push(redirectPath)
                
                // Fallback redirect after a short delay
                setTimeout(() => {
                    if (typeof window !== 'undefined' && window.location.pathname === '/') {
                        window.location.href = redirectPath
                    }
                }, 100)
            } else {
                setError(data?.message || 'Login failed. Please check your credentials.')
                setIsLoading(false)
            }
        } catch (err) {
            setError('Unable to connect to server. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-md border border-gray-200 hover:shadow-3xl transition-shadow duration-300">
            <div className="text-center mb-6 sm:mb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl p-2 shadow-lg">
                        <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                    </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t[language].govtLogin}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{t[language].authorizedOnly}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5 lg:space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-600 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm text-center border border-red-200 animate-shake">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">{t[language].emailAddress}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@ayush.gov.in"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 hover:border-gray-300"
                        required
                    />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">{t[language].password}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 hover:border-gray-300"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 sm:py-3.5 lg:py-4 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t[language].processing}
                        </span>
                    ) : t[language].signIn}
                </button>
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
            // Navigation
            navHome: 'Home',
            navAbout: 'About',
            navContact: 'Contact',
            navPortals: 'Portals',
            navRegister: 'Register',

            // Hero Section
            govtIndia: 'Government of India | AYUSH Ministry',
            heroTitle: 'ANVESHA',
            heroSubtitle: 'for Ayurvedic Herbs',
            tagline: 'A national initiative ensuring authenticity, quality, and sustainable sourcing across India\'s herbal value chain.',
            verifyProduct: 'Verify Product',
            contactUs: 'Contact Us',

            // Login Card
            govtLogin: 'Government Login',
            authorizedOnly: 'Authorized Personnel Only',
            emailAddress: 'Email Address',
            password: 'Password',
            signIn: 'Sign In',
            processing: 'Processing...',
            securePortal: '🔒 Secure Government Portal',

            // Key Initiatives
            keyInitiatives: 'Key Initiatives',
            keyInitiativesDesc: 'Comprehensive solutions for transparent and sustainable herb sourcing',
            initiative1Title: 'End-to-End Traceability',
            initiative1Desc: 'Track herbs from farm to shelf with blockchain-verified provenance',
            initiative2Title: 'Quality Assured by Labs',
            initiative2Desc: 'Laboratory testing and certification at every processing stage',
            initiative3Title: 'Blockchain-Immutable Records',
            initiative3Desc: 'Tamper-proof ledger ensuring data integrity and transparency',
            initiative4Title: 'Sustainable Sourcing',
            initiative4Desc: 'Geo-fencing and conservation compliance for ethical harvesting',
            initiative5Title: 'Farmer Empowerment',
            initiative5Desc: 'Direct market access and fair pricing for smallholder farmers',
            initiative6Title: 'Consumer Confidence',
            initiative6Desc: 'QR-code verification for authenticity and complete transparency',
            learnMore: 'Learn more →',

            // Process Flow
            processFlowTag: 'From Farm to Consumer',
            processFlow: 'Verified Supply Chain',
            processFlowDesc: 'A completely transparent, blockchain-secured journey ensuring every herb\'s authenticity and quality.',
            step1Title: 'Source Verification',
            step1Desc: 'Geo-tagged harvesting at origin with farmer identity verification and sustainable practice compliance checks.',
            step2Title: 'Quality Analysis',
            step2Desc: 'Rigorous NABL-accredited laboratory testing for active principles, pesticide residues, and heavy metals.',
            step3Title: 'Standardized Processing',
            step3Desc: 'GMP-compliant processing and storage with continuous environmental monitoring to preserve potency.',
            step4Title: 'Digital Certification',
            step4Desc: 'Immutable blockchain records generated at every step, creating a tamper-proof certificate of analysis.',
            step5Title: 'Consumer Validation',
            step5Desc: 'End-users verify product authenticity and provenance details instantly via secure QR code scanning.',

            // National Standards
            nationalStandards: 'Aligned with National Standards',
            nationalStandardsDesc: 'Compliant with regulatory and quality frameworks',
            nmpbFull: 'National Medicinal Plants Board',
            nmpbDesc: 'Sustainable harvesting guidelines',
            gacpFull: 'Good Agricultural & Collection Practices',
            gacpDesc: 'Quality cultivation standards',
            aqrFull: 'Ayurvedic Quality Requirements',
            aqrDesc: 'AYUSH Ministry compliance',
            diiFull: 'Data Integrity & Interoperability',
            diiDesc: 'FHIR-based metadata exchange',

            // Pilot Impact
            pilotImpact: 'Pilot Impact',
            pilotImpactDesc: 'Real-world results from our blockchain traceability system',
            stat1Value: '5,000+',
            stat1Label: 'Farmers Onboarded',
            stat2Value: '12,000+',
            stat2Label: 'Batches Traced',
            stat3Value: '98%',
            stat3Label: 'Quality Pass Rate',
            stat4Value: '50,000+',
            stat4Label: 'Consumer Scans',
            testimonial: '"This initiative has been transformative in ensuring the authenticity and quality of our herbal products. The blockchain-enabled traceability system has empowered our farmers and given our consumers complete confidence in the products they purchase. It represents the perfect synergy between traditional knowledge and modern technology."',
            testimonialAuthor: 'Joint Secretary, Ministry of AYUSH',

            // Footer
            footerTagline: 'Empowering the Ayurvedic ecosystem with blockchain-based traceability and quality assurance.',
            quickLinks: 'Quick Links',
            portals: 'Portals',
            contact: 'Contact',
            home: 'Home',
            aboutUs: 'About Us',
            processorLogin: 'Processor Login',
            labDashboard: 'Lab Dashboard',
            manufacturerPortal: 'Manufacturer Portal',
            adminConsole: 'Admin Console',
            copyright: '© 2024 Ministry of AYUSH, Government of India. All rights reserved.',
            byDevs: 'By CrackedDevs.'
        },
        hi: {
            // Navigation
            navHome: 'होम',
            navAbout: 'हमारे बारे में',
            navContact: 'संपर्क करें',
            navPortals: 'पोर्टल',
            navRegister: 'पंजीकरण',

            // Hero Section
            govtIndia: 'भारत सरकार | आयुष मंत्रालय',
            heroTitle: 'अन्वेषा',
            heroSubtitle: 'आयुर्वेदिक जड़ी-बूटियों के लिए',
            tagline: 'भारत की हर्बल मूल्य श्रृंखला में प्रामाणिकता, गुणवत्ता और टिकाऊ सोर्सिंग सुनिश्चित करने के लिए एक राष्ट्रीय पहल।',
            verifyProduct: 'उत्पाद सत्यापित करें',
            contactUs: 'संपर्क करें',

            // Login Card
            govtLogin: 'सरकारी लॉगिन',
            authorizedOnly: 'केवल अधिकृत कर्मियों के लिए',
            emailAddress: 'ईमेल पता',
            password: 'पासवर्ड',
            signIn: 'साइन इन करें',
            processing: 'प्रोसेसिंग...',
            securePortal: '🔒 सुरक्षित सरकारी पोर्टल',

            // Key Initiatives
            keyInitiatives: 'मुख्य पहल',
            keyInitiativesDesc: 'पारदर्शी और टिकाऊ हर्बल सोर्सिंग के लिए व्यापक समाधान',
            initiative1Title: 'संपूर्ण ट्रेसेबिलिटी',
            initiative1Desc: 'ब्लॉकचेन-सत्यापित उत्पत्ति के साथ खेत से शेल्फ तक जड़ी-बूटियों को ट्रैक करें',
            initiative2Title: 'प्रयोगशालाओं द्वारा गुणवत्ता आश्वासन',
            initiative2Desc: 'हर प्रसंस्करण चरण में प्रयोगशाला परीक्षण और प्रमाणन',
            initiative3Title: 'ब्लॉकचेन-अपरिवर्तनीय रिकॉर्ड',
            initiative3Desc: 'डेटा अखंडता और पारदर्शिता सुनिश्चित करने वाला छेड़छाड़-रोधी खाता',
            initiative4Title: 'टिकाऊ सोर्सिंग',
            initiative4Desc: 'नैतिक कटाई के लिए जियो-फेंसिंग और संरक्षण अनुपालन',
            initiative5Title: 'किसान सशक्तिकरण',
            initiative5Desc: 'छोटे किसानों के लिए सीधी बाजार पहुंच और उचित मूल्य निर्धारण',
            initiative6Title: 'उपभोक्ता विश्वास',
            initiative6Desc: 'प्रामाणिकता और पूर्ण पारदर्शिता के लिए QR-कोड सत्यापन',
            learnMore: 'और जानें →',

            // Process Flow
            processFlowTag: 'खेत से उपभोक्ता तक',
            processFlow: 'सत्यापित आपूर्ति श्रृंखला',
            processFlowDesc: 'हर जड़ी-बूटी की प्रामाणिकता और गुणवत्ता सुनिश्चित करने वाली पूरी तरह से पारदर्शी, ब्लॉकचेन-सुरक्षित यात्रा।',
            step1Title: 'स्रोत सत्यापन',
            step1Desc: 'किसान पहचान सत्यापन और टिकाऊ अभ्यास अनुपालन जांच के साथ मूल स्थान पर जियो-टैग की गई कटाई।',
            step2Title: 'गुणवत्ता विश्लेषण',
            step2Desc: 'सक्रिय सिद्धांतों, कीटनाशक अवशेषों और भारी धातुओं के लिए कठोर NABL-मान्यता प्राप्त प्रयोगशाला परीक्षण।',
            step3Title: 'मानकीकृत प्रसंस्करण',
            step3Desc: 'शक्ति को संरक्षित करने के लिए निरंतर पर्यावरण निगरानी के साथ GMP-अनुरूप प्रसंस्करण और भंडारण।',
            step4Title: 'डिजिटल प्रमाणन',
            step4Desc: 'हर कदम पर उत्पन्न अपरिवर्तनीय ब्लॉकचेन रिकॉर्ड, विश्लेषण का छेड़छाड़-रोधी प्रमाण पत्र बनाते हैं।',
            step5Title: 'उपभोक्ता सत्यापन',
            step5Desc: 'अंतिम उपयोगकर्ता सुरक्षित QR कोड स्कैनिंग के माध्यम से तुरंत उत्पाद प्रामाणिकता और उत्पत्ति विवरण सत्यापित करते हैं।',

            // National Standards
            nationalStandards: 'राष्ट्रीय मानकों के साथ संरेखित',
            nationalStandardsDesc: 'नियामक और गुणवत्ता ढांचे के अनुरूप',
            nmpbFull: 'राष्ट्रीय औषधीय पौधा बोर्ड',
            nmpbDesc: 'टिकाऊ कटाई दिशानिर्देश',
            gacpFull: 'अच्छी कृषि और संग्रह प्रथाएं',
            gacpDesc: 'गुणवत्ता खेती मानक',
            aqrFull: 'आयुर्वेदिक गुणवत्ता आवश्यकताएं',
            aqrDesc: 'आयुष मंत्रालय अनुपालन',
            diiFull: 'डेटा अखंडता और अंतरसंचालनीयता',
            diiDesc: 'FHIR-आधारित मेटाडेटा विनिमय',

            // Pilot Impact
            pilotImpact: 'पायलट प्रभाव',
            pilotImpactDesc: 'हमारे ब्लॉकचेन ट्रेसेबिलिटी सिस्टम से वास्तविक दुनिया के परिणाम',
            stat1Value: '5,000+',
            stat1Label: 'किसान शामिल',
            stat2Value: '12,000+',
            stat2Label: 'बैच ट्रैक किए गए',
            stat3Value: '98%',
            stat3Label: 'गुणवत्ता पास दर',
            stat4Value: '50,000+',
            stat4Label: 'उपभोक्ता स्कैन',
            testimonial: '"यह पहल हमारे हर्बल उत्पादों की प्रामाणिकता और गुणवत्ता सुनिश्चित करने में परिवर्तनकारी रही है। ब्लॉकचेन-सक्षम ट्रेसेबिलिटी सिस्टम ने हमारे किसानों को सशक्त बनाया है और हमारे उपभोक्ताओं को उनके द्वारा खरीदे गए उत्पादों में पूर्ण विश्वास दिया है। यह पारंपरिक ज्ञान और आधुनिक तकनीक के बीच सही तालमेल का प्रतिनिधित्व करता है।"',
            testimonialAuthor: 'संयुक्त सचिव, आयुष मंत्रालय',

            // Footer
            footerTagline: 'ब्लॉकचेन-आधारित ट्रेसेबिलिटी और गुणवत्ता आश्वासन के साथ आयुर्वेदिक पारिस्थितिकी तंत्र को सशक्त बनाना।',
            quickLinks: 'त्वरित लिंक',
            portals: 'पोर्टल',
            contact: 'संपर्क',
            home: 'होम',
            aboutUs: 'हमारे बारे में',
            processorLogin: 'प्रोसेसर लॉगिन',
            labDashboard: 'लैब डैशबोर्ड',
            manufacturerPortal: 'निर्माता पोर्टल',
            adminConsole: 'एडमिन कंसोल',
            copyright: '© 2024 आयुष मंत्रालय, भारत सरकार। सर्वाधिकार सुरक्षित।',
            byDevs: 'CrackedDevs द्वारा।'
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
            title: t[language].initiative1Title,
            description: t[language].initiative1Desc,
            icon: 'T'
        },
        {
            title: t[language].initiative2Title,
            description: t[language].initiative2Desc,
            icon: 'Q'
        },
        {
            title: t[language].initiative3Title,
            description: t[language].initiative3Desc,
            icon: 'B'
        },
        {
            title: t[language].initiative4Title,
            description: t[language].initiative4Desc,
            icon: 'S'
        },
        {
            title: t[language].initiative5Title,
            description: t[language].initiative5Desc,
            icon: 'F'
        },
        {
            title: t[language].initiative6Title,
            description: t[language].initiative6Desc,
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
            title: t[language].step1Title,
            description: t[language].step1Desc
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            title: t[language].step2Title,
            description: t[language].step2Desc
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            title: t[language].step3Title,
            description: t[language].step3Desc
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: t[language].step4Title,
            description: t[language].step4Desc
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: t[language].step5Title,
            description: t[language].step5Desc
        }
    ]

    const standards = [
        { name: 'NMPB', full: t[language].nmpbFull, desc: t[language].nmpbDesc },
        { name: 'GACP', full: t[language].gacpFull, desc: t[language].gacpDesc },
        { name: 'AQR', full: t[language].aqrFull, desc: t[language].aqrDesc },
        { name: 'DII', full: t[language].diiFull, desc: t[language].diiDesc }
    ]

    const stats = [
        { value: t[language].stat1Value, label: t[language].stat1Label },
        { value: t[language].stat2Value, label: t[language].stat2Label },
        { value: t[language].stat3Value, label: t[language].stat3Label },
        { value: t[language].stat4Value, label: t[language].stat4Label }
    ]

    return (
        <div className="min-h-screen bg-white font-inter">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-[#014848]'
                } `}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                            <Link href="/" aria-label="Go to home" className="block">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white rounded-lg p-1 shadow-md hover:shadow-lg transition-all">
                                    <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                                </div>
                            </Link>
                            <div className="hidden sm:block">
                                <h1 className={`text-xs sm:text-sm font-bold transition-colors ${scrolled ? 'text-gray-800' : 'text-white'
                                    } `}>
                                    Government of India | भारत सरकार
                                </h1>
                                <p className={`text-[10px] sm:text-xs font-medium transition-colors ${scrolled ? 'text-gray-600' : 'text-white/90'
                                    } `}>
                                    Ministry of AYUSH | आयुष मंत्रालय
                                </p>
                                <p className={`text-[10px] sm:text-xs font-medium transition-colors ${scrolled ? 'text-gray-600' : 'text-white/90'
                                    } `}>
                                    ANVESHA | अन्वेषा
                                </p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className={`text-xs font-bold transition-colors ${scrolled ? 'text-gray-800' : 'text-white'
                                    } `}>
                                    ANVESHA
                                </h1>
                            </div>
                        </div>
                       
                       
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div>
                                <DownloadButton/>
                            </div>
                            
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
            <section className="relative min-h-screen bg-white pt-16 sm:pt-20 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full opacity-10 pointer-events-none select-none z-0 flex items-center justify-center">
                    <img
                        src="/pixel-tree.png"
                        alt=""
                        className="w-[80000px] sm:w-[100000px] lg:w-[120000px] h-[80000px] sm:h-[100000px] lg:h-[120000px] object-contain translate-x-[40px] sm:translate-x-[60px] lg:translate-x-[80px] translate-y-[20px] sm:translate-y-[30px] scale-100 sm:scale-125 lg:scale-150"
                        aria-hidden="true"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 xl:py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
                        {/* Left Side - Branding */}
                        <div className="space-y-3 sm:space-y-4 lg:space-y-6 xl:space-y-8">


                            {/* ANVESHA Title */}
                            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-teal-600 tracking-wide">
                                    {t[language].heroTitle}
                                </h1>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-teal-800">
                                    {t[language].heroSubtitle}
                                </h2>
                                <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
                                    {t[language].tagline}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 lg:mt-12">
                                <Link href="/consumer-portal" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto bg-[#014848] hover:bg-[#013636] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base">
                                        <span>{t[language].verifyProduct}</span>
                                    </button>
                                </Link>
                                <Link href="/register" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-teal-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold border-2 border-teal-600 transition-all hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base">
                                        <span>{t[language].navRegister}</span>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Side - Login Card */}
                        <div className="flex justify-center lg:justify-end">
                            <LoginCard language={language} t={t} />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20"></div>
            </section>

            {/* Key Initiatives */}
            < section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <h3 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                            {t[language].keyInitiatives}
                        </h3>
                        <div className="h-1 w-16 sm:w-24 bg-teal-600 rounded-full mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4">{t[language].keyInitiativesDesc}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {initiatives.map((initiative, index) => (
                            <div
                                key={index}
                                className="group bg-gradient-to-br from-white to-gray-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-teal-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer"
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-teal-600 text-white rounded-full flex items-center justify-center mb-4 sm:mb-5 text-xl sm:text-2xl font-bold group-hover:bg-teal-700 transition-colors duration-300">{initiative.icon}</div>
                                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-teal-600 transition-colors font-playfair">{initiative.title}</h4>
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{initiative.description}</p>
                                <div className="mt-3 sm:mt-4 text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity text-sm sm:text-base">
                                    Learn more →
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Process Flow */}
            < section className="py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 bg-gradient-to-br from-teal-50/50 to-white relative overflow-hidden" >
                {/* Background Pattern */}
                < div className="absolute inset-0 opacity-5 pointer-events-none" >
                    <div className="absolute top-0 left-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-0 right-0 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                </div >

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
                        <span className="text-teal-600 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 sm:mb-3 block">{t[language].processFlowTag}</span>
                        <h3 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                            {t[language].processFlow}
                        </h3>
                        <div className="h-1 sm:h-1.5 w-16 sm:w-24 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
                        <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed px-4">
                            {t[language].processFlowDesc}
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gray-200 -z-10 rounded-full">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 w-full animate-shimmer bg-[length:200%_100%]"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 relative">
                            {processSteps.map((step, index) => (
                                <div key={index} className="group relative flex flex-col items-center">
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-8 sm:-top-12 opacity-10 font-[1000] text-4xl sm:text-5xl lg:text-6xl text-teal-900 select-none group-hover:opacity-20 transition-opacity">
                                        {index + 1}
                                    </div>

                                    {/* Icon Container */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center mb-4 sm:mb-6 relative z-10 group-hover:border-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                        <div className="text-teal-600 group-hover:text-teal-700 transition-colors text-2xl sm:text-3xl lg:text-4xl">
                                            {step.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center px-2">
                                        <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-teal-700 transition-colors font-playfair">
                                            {step.title}
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
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
            < section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <h3 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                            {t[language].nationalStandards}
                        </h3>
                        <div className="h-1 w-16 sm:w-24 bg-teal-600 rounded-full mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4">{t[language].nationalStandardsDesc}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {standards.map((standard, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border-2 border-transparent hover:border-teal-500"
                            >
                                <div className="text-2xl sm:text-3xl font-bold text-teal-600 mb-2 sm:mb-3 font-playfair">{standard.name}</div>
                                <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">{standard.full}</div>
                                <div className="text-xs text-gray-600 leading-relaxed">{standard.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Pilot Impact */}
            < section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                        <h3 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">{t[language].pilotImpact}</h3>
                        <div className="h-1 w-16 sm:w-24 bg-teal-600 rounded-full mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4">{t[language].pilotImpactDesc}</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100"
                            >
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-600 mb-1 sm:mb-2">{stat.value}</div>
                                <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 max-w-4xl mx-auto shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                        <p className="text-base sm:text-lg text-center leading-relaxed mb-6 sm:mb-8 text-gray-700 italic px-2">
                            {t[language].testimonial}
                        </p>
                        <div className="text-center">
                            <div className="font-bold text-lg sm:text-xl text-gray-900">{t[language].testimonialAuthor}</div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            <GovFooter />
        </div >
    )
}


