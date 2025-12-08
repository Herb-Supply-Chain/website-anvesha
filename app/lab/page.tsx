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
    withanolides: string // For Ashwagandha

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
        { id: 'physical', label: 'Physical & Organoleptic' },
        { id: 'chemical', label: 'Chemical Analysis' },
        { id: 'microbial', label: 'Microbial Analysis' },
        { id: 'advanced', label: 'Advanced Tests' },
        { id: 'quality', label: 'Quality Assessment' }
    ]

    const handleInputChange = (field: keyof TestData, value: string) => {
        setTestData({ ...testData, [field]: value })
    }

    const handleGenerateCertificate = async () => {
        if (!testData.overallGrade || !testData.technicianName) {
            alert('Please complete quality assessment before generating certificate')
            return
        }

        // Here you would typically save to database
        alert('Certificate generated successfully!')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg p-1.5">
                            <img src="/logo.png" alt="ANVESHA" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">ANVESHA</h1>
                            <p className="text-sm text-teal-100">LABORATORY</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                {/* Sample Information Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-teal-800 mb-4">Sample Information</h2>
                    <div className="grid grid-cols-5 gap-6">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Sample ID</div>
                            <div className="font-semibold text-teal-600">{sampleData.sampleId}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Source Farm</div>
                            <div className="font-semibold text-gray-900">{sampleData.sourceFarm}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Herb</div>
                            <div className="font-semibold text-gray-900">{sampleData.herb}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Quantity Received</div>
                            <div className="font-semibold text-gray-900">{sampleData.quantityReceived}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Priority</div>
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                                {sampleData.priority}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Testing Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-teal-800 mb-6">
                        Testing Form - {sampleData.sampleId}
                    </h2>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 font-semibold transition-all ${activeTab === tab.id
                                        ? 'text-white bg-teal-600 rounded-t-lg'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Physical & Organoleptic Tests */}
                    {activeTab === 'physical' && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-teal-800 text-lg">Physical & Organoleptic Tests</h3>
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Maximum limit: 2%</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chemical Analysis */}
                    {activeTab === 'chemical' && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-teal-800 text-lg">Chemical Analysis</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Lead (ppm)
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.lead}
                                        onChange={(e) => handleInputChange('lead', e.target.value)}
                                        placeholder="Enter lead content"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Maximum limit: 10 ppm</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Arsenic (ppm)
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.arsenic}
                                        onChange={(e) => handleInputChange('arsenic', e.target.value)}
                                        placeholder="Enter arsenic content"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Maximum limit: 3 ppm</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cadmium (ppm)
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.cadmium}
                                        onChange={(e) => handleInputChange('cadmium', e.target.value)}
                                        placeholder="Enter cadmium content"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Maximum limit: 0.3 ppm</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mercury (ppm)
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.mercury}
                                        onChange={(e) => handleInputChange('mercury', e.target.value)}
                                        placeholder="Enter mercury content"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Maximum limit: 1 ppm</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Pesticide Residues
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.pesticides}
                                        onChange={(e) => handleInputChange('pesticides', e.target.value)}
                                        placeholder="Enter pesticide detection results"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Should be below detection limit</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Aflatoxins (ppb)
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.aflatoxin}
                                        onChange={(e) => handleInputChange('aflatoxin', e.target.value)}
                                        placeholder="Enter aflatoxin level"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Maximum limit: 20 ppb</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Microbial Analysis */}
                    {activeTab === 'microbial' && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-teal-800 text-lg">Microbial Analysis</h3>
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                            <h3 className="font-bold text-teal-800 text-lg">Advanced Tests</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        DNA Barcoding
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.dnaBarcoding}
                                        onChange={(e) => handleInputChange('dnaBarcoding', e.target.value)}
                                        placeholder="Enter DNA barcoding results"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Species authentication</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        HPLC Analysis
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.hplcAnalysis}
                                        onChange={(e) => handleInputChange('hplcAnalysis', e.target.value)}
                                        placeholder="Enter HPLC results"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Marker compound analysis</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        TLC Fingerprinting
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.tlcFingerprinting}
                                        onChange={(e) => handleInputChange('tlcFingerprinting', e.target.value)}
                                        placeholder="Enter TLC results"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Chemical fingerprint</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Withanolides Content (%)
                                    </label>
                                    <input
                                        type="text"
                                        value={testData.withanolides}
                                        onChange={(e) => handleInputChange('withanolides', e.target.value)}
                                        placeholder="Enter withanolides percentage"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Minimum: 0.3% (for Ashwagandha)</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quality Assessment */}
                    {activeTab === 'quality' && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-teal-800 text-lg">Quality Assessment</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Overall Grade
                                    </label>
                                    <select
                                        value={testData.overallGrade}
                                        onChange={(e) => handleInputChange('overallGrade', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generate Certificate Button */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleGenerateCertificate}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                            Generate Certificate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
