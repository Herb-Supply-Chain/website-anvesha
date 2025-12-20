'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [gstNumber, setGstNumber] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://server-anvesha.onrender.com'

  const roles = ['PROCESSOR', 'LAB', 'MANUFACTURER', 'ADMIN']

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!role) {
      setError('Please select a role')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/api/approval/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          companyName,
          phone: phone || null,
          contactPerson: contactPerson || null,
          licenseNumber,
          gstNumber,
        }),
      })

      const data = await response.json()

      if (response.ok && data?.success) {
        setSuccess(true)
      } else {
        setError(data?.message || 'Registration failed')
      }
    } catch (err: any) {
      console.error('REGISTER ERROR:', err)
      setError('Unable to connect to server. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white font-inter">
        {/* Navigation */}
        <nav className="bg-[#014848] text-white shadow-md">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-4">
              <Link href="/" aria-label="Go to home" className="w-16 h-16 bg-white rounded-xl p-1 shadow-md block">
                <img src="/image.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
              </Link>
              <div>
                <h1 className="text-sm font-bold">Government of India | भारत सरकार</h1>
                <p className="text-xs font-medium">Ministry of AYUSH | आयुष मंत्रालय</p>
                <p className="text-xs font-medium">ANVESHA | अन्वेषा</p>
              </div>
            </div>
          </div>
        </nav>

        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-2xl text-center border border-gray-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold mb-4 text-gray-900">
              Registration Successful
            </h2>
            <p className="text-gray-600 mb-8 text-base leading-relaxed">
              Your account registration has been submitted successfully. It is now pending admin approval. You will receive an email once your account is approved.
            </p>
            <Link href="/">
              <button className="w-full bg-[#014848] hover:bg-[#013636] text-white py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105">
                Return to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Navigation */}
      <nav className="bg-[#014848] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <Link href="/" aria-label="Go to home" className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-white rounded-xl p-1 shadow-md block">
                  <img src="/logo.png" alt="ANVESHA Logo" className="w-full h-full object-contain" />
                </Link>
              <div className="hidden sm:block">
                <h1 className="text-xs sm:text-sm font-bold">Government of India | भारत सरकार</h1>
                <p className="text-[10px] sm:text-xs font-medium">Ministry of AYUSH | आयुष मंत्रालय</p>
                <p className="text-[10px] sm:text-xs font-medium">ANVESHA | अन्वेषा</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-xs font-bold">ANVESHA</h1>
              </div>
            </div>
            <Link href="/" className="text-white/90 hover:text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4 tracking-tight">
            Create Account
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Join the ANVESHA Traceability Network and become part of India's premier blockchain-based herbal supply chain ecosystem
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-10">
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {/* Role Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Your Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 lg:py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm sm:text-base text-gray-900 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300"
                >
                  <option value="" className="text-gray-500">Choose your role...</option>
                  {roles.map((r) => (
                    <option key={r} value={r} className="font-medium">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300 font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300 font-medium"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300 font-medium"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Company/Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300 font-medium"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300 font-medium"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="Name of contact person"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300 font-medium"
                />
              </div>

              {/* License Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter license number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300 font-medium"
                />
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter GST number"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all hover:border-gray-300 font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#014848] hover:bg-[#013636] text-white py-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>

            {/* Footer Text */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/" className="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-teal-50 border-2 border-teal-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Registration Process</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                After submitting your registration, your account will be reviewed by our admin team. You will receive an email notification once your account is approved. This process typically takes 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
