'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthService, UserRole } from '@/lib/auth-service'

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<UserRole | ''>('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const roles: UserRole[] = [
        'Processor',
        'Lab QA',
        'Manufacturer',
        'Admin'
    ]

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!role) {
            setError('Please select a role')
            return
        }

        setIsLoading(true)

        try {
            const result = await AuthService.register({
                name,
                email,
                password,
                role: role as UserRole
            })

            if (result.success) {
                setSuccess(true)
                // Optional: Redirect after delay
            } else {
                setError(result.message)
            }
        } catch (err) {
            setError('An unexpected error occurred.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-teal-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                        ✅
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Registration Successful</h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                        Your account has been created and is currently <span className="text-yellow-400 font-semibold">PENDING APPROVAL</span>.
                        <br /><br />
                        Please wait for an administrator to approve your account before you can log in.
                    </p>
                    <Link href="/login">
                        <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors">
                            Return to Login
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/login" className="inline-block text-gray-400 hover:text-white transition-colors mb-6 text-sm">
                        ← Back to Login
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Join the Traceability Network</p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-5 bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                    {error && (
                        <div className="bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors disabled:opacity-50"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors disabled:opacity-50"
                            placeholder="name@organization.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            required
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors appearance-none cursor-pointer disabled:opacity-50"
                        >
                            <option value="" disabled className="text-gray-500">Select your role</option>
                            {roles.map((r) => (
                                <option key={r} value={r} className="bg-gray-900">{r}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 rounded-lg transition-colors mt-2 shadow-lg hover:shadow-teal-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

