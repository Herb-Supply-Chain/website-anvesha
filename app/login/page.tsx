'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth-service'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const roles = [
        'Processor',
        'Lab QA',
        'Manufacturer',
        'Admin'
    ]

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
                // Validate role matches
                if (result.user.role !== role) {
                    setError('Invalid role selected for this user')
                    setIsLoading(false)
                    return
                }

                // Redirect based on role
                if (result.user.role === 'Admin') {
                    router.push('/admin')
                } else {
                    // For now, other users go to dashboard (or back to home if dashboard not implemented completely)
                    // Ideally this would be dynamic based on role like /dashboard/processor etc.
                    router.push('/')
                    // Showing alert for demo since we haven't built specific dashboards
                    setTimeout(() => alert(`Welcome back, ${result.user?.name}! Login successful.`), 500)
                }
            } else {
                setError(result.message)
                setIsLoading(false)
            }
        } catch (err) {
            setError('An unexpected error occurred.')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block text-white hover:text-gray-300 transition-colors mb-6">
                        <span className="text-sm">← Back to Home</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            disabled={isLoading}
                            className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors disabled:opacity-50"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            disabled={isLoading}
                            className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors disabled:opacity-50"
                        />
                    </div>

                    {/* Role Selection Dropdown */}
                    <div>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors appearance-none cursor-pointer disabled:opacity-50"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '1.5rem'
                            }}
                        >
                            <option value="" disabled className="bg-gray-800 text-gray-500">
                                Please Select User Role
                            </option>
                            {roles.map((roleName, index) => (
                                <option key={index} value={roleName} className="bg-gray-800 text-gray-300">
                                    {roleName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    {/* Admin Shortcut Hint (For verification convenience) */}
                    <div className="text-center">
                        <p className="text-xs text-gray-600 mt-2">
                            (Demo Admin: admin@ayush.gov.in / admin123)
                        </p>
                    </div>
                </form>

                {/* Footer Links */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-teal-500 hover:text-teal-400 font-medium">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

