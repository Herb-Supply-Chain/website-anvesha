'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SampleData {
    sampleId: string
    sourceFarm: string
    herb: string
    quantityReceived: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface TestData {
    // Physical & Organoleptic Tests
    moistureContent: string
    colorCheck: string
    odorCheck: string
    foreignMatter: string

    // Chemical Analysis
    lead: string
    arsenic: string
    cadmium: string
    mercury: string
    pesticides: string
    aflatoxin: string

    // Microbial Analysis
    totalBacterialCount: string
    yeastMold: string
    salmonella: string
    ecoli: string

    // Advanced Tests
    dnaBarcoding: string
    hplcAnalysis: string
    tlcFingerprinting: string
    withanolides: string

    // Quality Assessment
    overallGrade: string
    ayushCompliance: string
    fssaiCompliance: string
    remarks: string
    technicianName: string
}

export default function LabTestingPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('physical')

    const [sampleData, setSampleData] = useState<SampleData>({
        sampleId: 'LAB-2024-ASH-001',
        sourceFarm: 'FARM-2024-ASH-001',
        herb: 'Ashwagandha Root',
        quantityReceived: '600g',
        priority: 'HIGH'
    })

    const [testData, setTestData] = useState<TestData>({
        moistureContent: '',
        colorCheck: '',
        odorCheck: '',
        foreignMatter: '',
        lead: '',
        arsenic: '',
        cadmium: '',
        mercury: '',
        pesticides: '',
        aflatoxin: '',
        totalBacterialCount: '',
        yeastMold: '',
        salmonella: '',
        ecoli: '',
        dnaBarcoding: '',
        hplcAnalysis: '',
        tlcFingerprinting: '',
        withanolides: '',
        overallGrade: '',
        ayushCompliance: '',
        fssaiCompliance: '',
        remarks: '',
        technicianName: ''
    })

    const tabs = [
        { id: 'physical', label: 'Physical & Organoleptic', icon: '🔬' },
        { id: 'chemical', label: 'Chemical Analysis', icon: '⚗️' },
        { id: 'microbial', label: 'Microbial Analysis', icon: '🦠' },
        { id: 'advanced', label: 'Advanced Tests', icon: '🧬' },
        { id: 'quality', label: 'Quality Assessment', icon: '✓' }
    ]

    const handleInputChange = (field: keyof TestData, value: string) => {
        setTestData({ ...testData, [field]: value })
    }

    const handleGenerateCertificate = async () => {
        if (!testData.overallGrade || !testData.technicianName) {
            alert('Please complete quality assessment before generating certificate')
            return
        }
        alert('Certificate generated successfully!')
    }

    return (
        <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
            {/* Header */}
            <header className="bg-[#176a6a] shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                                <img src="/logo.png" alt="ANVESHA" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">ANVESHA Laboratory</h1>
                                <p className="text-sm text-teal-100">Quality Assurance & Testing</p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 text-sm font-semibold text-white hover:text-teal-100 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Sample Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-[#176a6a]">📋</span>
                        Sample Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sample ID</div>
                            <div className="text-base font-bold text-[#176a6a]">{sampleData.sampleId}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Source Farm</div>
                            <div className="text-base font-semibold text-gray-900">{sampleData.sourceFarm}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Herb</div>
                            <div className="text-base font-semibold text-gray-900">{sampleData.herb}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</div>
                            <div className="text-base font-semibold text-gray-900">{sampleData.quantityReceived}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</div>
                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${sampleData.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                sampleData.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                {sampleData.priority}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Testing Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#176a6a] to-[#1a7d7d] px-6 py-4">
                        <h2 className="text-xl font-bold text-white">
                            Testing Form - {sampleData.sampleId}
                        </h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[180px] px-6 py-4 font-semibold text-sm transition-all ${activeTab === tab.id
                                    ? 'bg-white text-[#176a6a] border-b-2 border-[#176a6a]'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* Physical & Organoleptic Tests */}
                        {activeTab === 'physical' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-2">Physical & Organoleptic Tests</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Moisture Content (%)
                                        </label>
                                        <input
                                            type="text"
                                            value={testData.moistureContent}
                                            onChange={(e) => handleInputChange('moistureContent', e.target.value)}
                                            placeholder="Enter moisture content"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Standard range: 5-10%</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Color Check
                                        </label>
                                        <input
                                            type="text"
                                            value={testData.colorCheck}
                                            onChange={(e) => handleInputChange('colorCheck', e.target.value)}
                                            placeholder="Enter observed color"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Expected: Light brown to brown</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Odor Check
                                        </label>
                                        <input
                                            type="text"
                                            value={testData.odorCheck}
                                            onChange={(e) => handleInputChange('odorCheck', e.target.value)}
                                            placeholder="Describe odor characteristics"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Expected: Characteristic earthy odor</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Foreign Matter (%)
                                        </label>
                                        <input
                                            type="text"
                                            value={testData.foreignMatter}
                                            onChange={(e) => handleInputChange('foreignMatter', e.target.value)}
                                            placeholder="Enter foreign matter percentage"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Maximum limit: 2%</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Chemical Analysis */}
                        {activeTab === 'chemical' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-2">Chemical Analysis</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { field: 'lead', label: 'Lead (ppm)', limit: '10 ppm' },
                                        { field: 'arsenic', label: 'Arsenic (ppm)', limit: '3 ppm' },
                                        { field: 'cadmium', label: 'Cadmium (ppm)', limit: '0.3 ppm' },
                                        { field: 'mercury', label: 'Mercury (ppm)', limit: '1 ppm' },
                                        { field: 'pesticides', label: 'Pesticide Residues', limit: 'Below detection limit' },
                                        { field: 'aflatoxin', label: 'Aflatoxins (ppb)', limit: '20 ppb' }
                                    ].map((item) => (
                                        <div key={item.field}>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                {item.label}
                                            </label>
                                            <input
                                                type="text"
                                                value={testData[item.field as keyof TestData]}
                                                onChange={(e) => handleInputChange(item.field as keyof TestData, e.target.value)}
                                                placeholder={`Enter ${item.label.toLowerCase()}`}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Maximum limit: {item.limit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Microbial Analysis */}
                        {activeTab === 'microbial' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-2">Microbial Analysis</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Total Bacterial Count (CFU/g)
                                        </label>
                                        <input
                                            type="text"
                                            value={testData.totalBacterialCount}
                                            onChange={(e) => handleInputChange('totalBacterialCount', e.target.value)}
                                            placeholder="Enter bacterial count"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Maximum limit: 10^5 CFU/g</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Yeast & Mold (CFU/g)
                                        </label>
                                        <input
                                            type="text"
                                            value={testData.yeastMold}
                                            onChange={(e) => handleInputChange('yeastMold', e.target.value)}
                                            placeholder="Enter yeast & mold count"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Maximum limit: 10^3 CFU/g</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Salmonella
                                        </label>
                                        <select
                                            value={testData.salmonella}
                                            onChange={(e) => handleInputChange('salmonella', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        >
                                            <option value="">Select result</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Present">Present</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Should be absent in 25g</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            E. coli
                                        </label>
                                        <select
                                            value={testData.ecoli}
                                            onChange={(e) => handleInputChange('ecoli', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        >
                                            <option value="">Select result</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Present">Present</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Should be absent in 1g</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Advanced Tests */}
                        {activeTab === 'advanced' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-2">Advanced Tests</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { field: 'dnaBarcoding', label: 'DNA Barcoding', hint: 'Species authentication' },
                                        { field: 'hplcAnalysis', label: 'HPLC Analysis', hint: 'Marker compound analysis' },
                                        { field: 'tlcFingerprinting', label: 'TLC Fingerprinting', hint: 'Chemical fingerprint' },
                                        { field: 'withanolides', label: 'Withanolides Content (%)', hint: 'Minimum: 0.3% (for Ashwagandha)' }
                                    ].map((item) => (
                                        <div key={item.field}>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                {item.label}
                                            </label>
                                            <input
                                                type="text"
                                                value={testData[item.field as keyof TestData]}
                                                onChange={(e) => handleInputChange(item.field as keyof TestData, e.target.value)}
                                                placeholder={`Enter ${item.label.toLowerCase()}`}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">{item.hint}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quality Assessment */}
                        {activeTab === 'quality' && (
                            <div className="space-y-6">
                                <h3 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-2">Quality Assessment</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Overall Grade
                                        </label>
                                        <select
                                            value={testData.overallGrade}
                                            onChange={(e) => handleInputChange('overallGrade', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        >
                                            <option value="">Select grade</option>
                                            <option value="A+">A+ (Premium Quality)</option>
                                            <option value="A">A (Excellent)</option>
                                            <option value="B">B (Good)</option>
                                            <option value="C">C (Acceptable)</option>
                                            <option value="REJECT">REJECT</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            AYUSH Compliance
                                        </label>
                                        <select
                                            value={testData.ayushCompliance}
                                            onChange={(e) => handleInputChange('ayushCompliance', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        >
                                            <option value="">Select status</option>
                                            <option value="Compliant">Compliant</option>
                                            <option value="Non-Compliant">Non-Compliant</option>
                                            <option value="Pending Review">Pending Review</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            FSSAI Compliance
                                        </label>
                                        <select
                                            value={testData.fssaiCompliance}
                                            onChange={(e) => handleInputChange('fssaiCompliance', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        >
                                            <option value="">Select status</option>
                                            <option value="Compliant">Compliant</option>
                                            <option value="Non-Compliant">Non-Compliant</option>
                                            <option value="Pending Review">Pending Review</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Technician Name
                                        </label>
                                        <input
                                            type="text"
                                            value={testData.technicianName}
                                            onChange={(e) => handleInputChange('technicianName', e.target.value)}
                                            placeholder="Enter technician name"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Remarks / Notes
                                        </label>
                                        <textarea
                                            value={testData.remarks}
                                            onChange={(e) => handleInputChange('remarks', e.target.value)}
                                            placeholder="Enter any additional observations or remarks"
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#176a6a] focus:ring-2 focus:ring-[#176a6a]/20 outline-none transition-all text-black font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Generate Certificate Button */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleGenerateCertificate}
                                className="w-full bg-[#176a6a] hover:bg-[#145555] text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.01]"
                            >
                                Generate Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
