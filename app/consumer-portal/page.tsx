'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Camera, ArrowLeft, CheckCircle, MapPin, Download, Shield } from 'lucide-react';
import { useTraceability } from '@/app/context/TraceabilityContext';

export default function ConsumerPortalPage() {
  const [activeTab, setActiveTab] = useState('Consumer Portal');
  const [verificationMode, setVerificationMode] = useState<'camera' | 'manual'>('camera');
  const [batchCode, setBatchCode] = useState('');
  const [showResults, setShowResults] = useState(false);

  const { getCompleteTraceability } = useTraceability();

  const tabs = [
    { name: 'Farmer Login', href: '/farmer-auth' },
    { name: 'Lab portal', href: '/lab-auth' },
    { name: 'Consumer Portal', href: '/consumer-portal', active: true },
    { name: 'Admin portal', href: '/admin-auth' }
  ];

  const startCameraScan = () => {
    alert('Camera scanning initiated...\n\nPoint your camera at the QR code on the product packaging.');
    // Simulate QR scan
    setTimeout(() => {
      setBatchCode('AYU-2025-BATCH-001');
      setShowResults(true);
    }, 2000);
  };

  const verifyCode = () => {
    if (!batchCode) {
      alert('Please enter a batch code');
      return;
    }

    // Get complete traceability data
    const traceData = getCompleteTraceability('BATCH-001');
    setShowResults(true);
  };



  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-4">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6" />
          <div>
            <h1 className="text-sm font-bold">Government of India | भारत सरकार</h1>
            <p className="text-xs text-teal-100">Ministry of AYUSH | आयुष मंत्रालय</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {!showResults ? (
          <>
            {/* Verify Herb Authenticity */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Verify Herb Authenticity</h3>

              {verificationMode === 'camera' ? (
                <div>
                  {/* Camera Scan Area */}
                  <div className="bg-gray-50 rounded-lg p-12 mb-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                    <Camera className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-sm">Camera input would appear here</p>
                  </div>

                  <button
                    onClick={startCameraScan}
                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition mb-4"
                  >
                    Start Camera Scan
                  </button>

                  <button
                    onClick={() => setVerificationMode('manual')}
                    className="w-full text-teal-700 hover:text-teal-800 text-sm font-medium"
                  >
                    Or Enter Code manually
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Verify Herb Authenticity</h4>
                  <p className="text-sm text-gray-600 mb-4">Scan the QR code on the herb packaging to verify its authenticity</p>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Herb Batch Code</label>
                    <input
                      type="text"
                      value={batchCode}
                      onChange={(e) => setBatchCode(e.target.value)}
                      placeholder="AYU-2025-BATCH-001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setVerificationMode('camera')}
                      className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Back to Camera
                    </button>
                    <button
                      onClick={verifyCode}
                      className="flex-1 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition"
                    >
                      Verify Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* After Verification Page */}
            <div className="mb-6">
              <button
                onClick={() => setShowResults(false)}
                className="flex items-center gap-2 text-teal-700 hover:text-teal-800 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Verification</span>
              </button>
            </div>

            {/* Product Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{traceabilityData?.product.name || 'Organic Ashwagandha Root Powder'}</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">Verified</span>
                  </div>
                  <p className="text-sm text-gray-600">Batch: {traceabilityData?.product.batchId || '2345'} | Harvested: {traceabilityData?.origin.collectionDate || '2024-01-15'}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Column - Supply Chain Journey */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg border-2 border-blue-400 p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Supply Chain Journey</h3>

                  <div className="space-y-6">
                    {/* Harvest */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Harvest</h4>
                        <p className="text-sm text-gray-600">{traceabilityData?.origin.collectionDate || '2024-01-15'}</p>
                        <p className="text-sm text-gray-500">{traceabilityData?.origin.location || 'Bihar, MP'}</p>
                      </div>
                    </div>

                    {/* Collection */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Collection</h4>
                        <p className="text-sm text-gray-600">2024-01-16</p>
                        <p className="text-sm text-gray-500">Bihar, MP</p>
                      </div>
                    </div>

                    {/* Lab Testing */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <FlaskConical className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Lab Testing</h4>
                        <p className="text-sm text-gray-600">{traceabilityData?.labTest.testDate || '2024-01-17'}</p>
                        <p className="text-sm text-gray-500">Bihar, MP</p>
                      </div>
                    </div>

                    {/* Processing */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Factory className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Processing</h4>
                        <p className="text-sm text-gray-600">{traceabilityData?.processing.processDate || '2024-01-18'}</p>
                        <p className="text-sm text-gray-500">Bihar, MP</p>
                      </div>
                    </div>

                    {/* Packaging */}
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Box className="w-6 h-6 text-teal-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Packaging</h4>
                        <p className="text-sm text-gray-600">{traceabilityData?.product.packageDate || '2024-01-19'}</p>
                        <p className="text-sm text-gray-500">Bihar, MP</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Origin Map */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Origin Map</h3>
                  <div className="bg-gray-100 rounded-lg h-64 flex flex-col items-center justify-center">
                    <MapPin className="w-16 h-16 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Interactive map showing harvest location</p>
                    <p className="text-xs text-gray-500 mt-1">GPS: {traceabilityData?.origin.gps || '21.7051° N, 77.8548° E'}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Farmer Profile */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Farmer Profile</h3>
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                      <User className="w-10 h-10 text-teal-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">{traceabilityData?.origin.farmer || 'Ramesh Kumar'}</h4>
                    <p className="text-sm text-gray-600">Madhya Pradesh</p>
                  </div>
                  <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    View Full Story
                  </button>
                </div>

                {/* Sustainability */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sustainability</h3>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Eco Score</span>
                      <span className="text-2xl font-bold text-teal-600">85/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-teal-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Carbon Footprint</span>
                      <span className="text-sm font-semibold text-gray-900">2.3 kg of CO2</span>
                    </div>
                  </div>
                </div>

                {/* Report an Issue */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900">Report an Issue</h3>
                      <p className="text-sm text-red-700 mt-1">Found something suspicious? Report it here.</p>
                    </div>
                  </div>
                  <button className="w-full py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition">
                    Report Fake Product
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}