'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Camera, Upload } from 'lucide-react';

export default function ConsumerAccessPortal() {
  const [activeTab, setActiveTab] = useState('farmer');
  const [qrInput, setQrInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleImageUpload = () => {
    // Simulate image upload and redirect to verification
    window.location.href = '/consumer-portal';
  };

  const handleManualVerify = () => {
    // Simulate manual verification
    if (qrInput) {
      window.location.href = '/consumer-portal';
    }
  };

  const handlePhoneVerify = () => {
    // Simulate phone verification
    if (phoneNumber) {
      window.location.href = '/consumer-portal';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white mb-8">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Leaf className="w-8 h-8" />
            <div>
              <h1 className="text-lg font-bold">Government of India | www.gov.in</h1>
              <p className="text-xs text-teal-100">Ministry of AYUSH | Consumer Access Portal</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Title Section */}
          <div className="text-center py-8 px-6 border-b">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Access Your Portal</h2>
            <p className="text-gray-600">
              Secure authentication for all stakeholders in the traceability system
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('farmer')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition ${activeTab === 'farmer'
                ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Farmer Login
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition ${activeTab === 'lab'
                ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Lab artist
            </button>
            <button
              onClick={() => setActiveTab('consumer')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition ${activeTab === 'consumer'
                ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Consumer Portal
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition ${activeTab === 'admin'
                ? 'border-b-2 border-teal-600 text-teal-700 bg-teal-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Admin portal
            </button>
          </div>

          {/* Consumer Portal Content */}
          {activeTab === 'consumer' && (
            <div className="p-8">
              {/* Image Upload Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Verify Herb Authenticity
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-teal-500 transition cursor-pointer bg-gray-50">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload or drag QR code image here</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="qr-upload"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="qr-upload"
                    className="inline-block px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium cursor-pointer transition mt-2"
                  >
                    Upload Image
                  </label>
                </div>
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                  <input type="checkbox" id="remember" className="mr-2" />
                  <label htmlFor="remember">Enter Code manually</label>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Manual Entry Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Verify Herb Authenticity
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the QR code or Lot number manually to authenticity
                </p>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="e.g QR00-XXXXX-001"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  onClick={handleManualVerify}
                  disabled={!qrInput}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Verify Code
                </button>
              </div>
            </div>
          )}

          {/* Farmer Login Content */}
          {activeTab === 'farmer' && (
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Farmer Portal Access
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Login to access your collection records and blockchain entries
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farmer ID / Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your ID or mobile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password / OTP
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  onClick={() => window.location.href = '/farmer-auth'}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition"
                >
                  Login
                </button>
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/farmer-auth" className="text-teal-600 hover:text-teal-700 font-medium">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Lab Artist Content */}
          {activeTab === 'lab' && (
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Laboratory Portal Access
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Access lab testing and quality analysis dashboard
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lab ID / Email
                  </label>
                  <input
                    type="text"
                    placeholder="Enter lab ID or email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  onClick={() => window.location.href = '/dashboard/lab-testing'}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition"
                >
                  Login to Lab Portal
                </button>
              </div>
            </div>
          )}

          {/* Admin Portal Content */}
          {activeTab === 'admin' && (
            <div className="p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Administrator Access
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Secure login for system administrators and AYUSH officials
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter admin email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter secure password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2FA Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 2FA code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition"
                >
                  Secure Login
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}