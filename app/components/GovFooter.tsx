import Link from 'next/link'

const socialLinks = [
    {
        name: 'X (Twitter)',
        href: 'https://twitter.com/moayush',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M18.9 3H21l-4.6 5.2L21.8 21h-4.3l-3.1-7.1L10 21H2.2l4.9-5.6L2.2 3h4.4l2.8 6.4L18.9 3z"
                />
            </svg>
        ),
    },
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/moayush',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M13 22v-7h3l1-4h-4V8.5C13 7.4 13.3 7 14.7 7H17V3h-3c-3.6 0-5 1.6-5 4.3V11H6v4h3v7h4z"
                />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/moayush',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M12 7.3A4.7 4.7 0 1 0 16.7 12 4.7 4.7 0 0 0 12 7.3zm0 7.7A3 3 0 1 1 15 12a3 3 0 0 1-3 3zm5-7.9a1.1 1.1 0 1 1-1.1-1.1A1.1 1.1 0 0 1 17 7.1z"
                />
                <path
                    fill="currentColor"
                    d="M17.8 3H6.2A3.2 3.2 0 0 0 3 6.2v11.6A3.2 3.2 0 0 0 6.2 21h11.6a3.2 3.2 0 0 0 3.2-3.2V6.2A3.2 3.2 0 0 0 17.8 3zm1.6 14.8a1.6 1.6 0 0 1-1.6 1.6H6.2a1.6 1.6 0 0 1-1.6-1.6V6.2A1.6 1.6 0 0 1 6.2 4.6h11.6a1.6 1.6 0 0 1 1.6 1.6z"
                />
            </svg>
        ),
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/@moayush',
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path
                    fill="currentColor"
                    d="M21.6 7.2a2.2 2.2 0 0 0-1.6-1.6C18.3 5.2 12 5.2 12 5.2s-6.3 0-8 .4A2.2 2.2 0 0 0 2.4 7.2 23 23 0 0 0 2 12a23 23 0 0 0 .4 4.8 2.2 2.2 0 0 0 1.6 1.6c1.7.4 8 .4 8 .4s6.3 0 8-.4a2.2 2.2 0 0 0 1.6-1.6A23 23 0 0 0 22 12a23 23 0 0 0-.4-4.8zM10 15.2V8.8L15.2 12z"
                />
            </svg>
        ),
    },
]

export function GovFooter() {
    return (
        <footer className="bg-gradient-to-r from-teal-900 to-teal-800 text-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-teal-700/50 mb-4">
                            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                                <img
                                    src="/logo.png"
                                    alt="ANVESHA logo"
                                    className="w-7 h-7 object-contain"
                                />
                            </div>
                            <span className="font-bold text-sm sm:text-base tracking-wide">
                                ANVESHA
                            </span>
                        </div>
                        <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
                            Blockchain-enabled traceability and quality assurance platform under the
                            Ministry of AYUSH, Government of India.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-3 sm:mb-4 text-teal-50 text-sm sm:text-base">
                            Quick Links
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-teal-200">
                            <li>
                                <Link href="/" className="hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/consumer-portal"
                                    className="hover:text-white transition-colors"
                                >
                                    Consumer Verification
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-3 sm:mb-4 text-teal-50 text-sm sm:text-base">
                            Official Portals
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-teal-200">
                            <li>
                                <Link
                                    href="/processor"
                                    className="hover:text-white transition-colors"
                                >
                                    Processor Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="/lab" className="hover:text-white transition-colors">
                                    Lab Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/manufacturing"
                                    className="hover:text-white transition-colors"
                                >
                                    Manufacturer Portal
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="hover:text-white transition-colors">
                                    Admin Console
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-3 sm:mb-4 text-teal-50 text-sm sm:text-base">
                            Connect with Ministry of AYUSH
                        </h4>
                        <p className="text-teal-200 text-xs sm:text-sm leading-relaxed mb-3">
                            Ministry of AYUSH, AYUSH Bhawan, B Block,
                            <br />
                            GPO Complex, INA, New Delhi - 110023, India
                        </p>

                        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-3">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-teal-600/70 bg-teal-800/40 hover:bg-white/10 hover:border-white transition-colors text-[11px] sm:text-xs text-teal-100"
                                >
                                    <span className="text-teal-100">{item.icon}</span>
                                    <span>{item.name}</span>
                                </a>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs text-teal-200">
                            <a
                                href="https://www.india.gov.in"
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-2 hover:text-white"
                            >
                                National Portal of India
                            </a>
                            <span className="opacity-70">|</span>
                            <a
                                href="https://www.mygov.in"
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-2 hover:text-white"
                            >
                                MyGov
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-5 sm:pt-6 border-t border-teal-800 text-center text-[11px] sm:text-xs text-teal-300 px-2">
                    <p>
                        © {new Date().getFullYear()} Ministry of AYUSH, Government of India. All
                        rights reserved.
                    </p>
                    <p className="mt-1 opacity-80">Designed and developed for ANVESHA platform.</p>
                </div>
            </div>
        </footer>
    )
}


