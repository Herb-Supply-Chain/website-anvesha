'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, ArrowLeft, Save, CheckCircle } from 'lucide-react';
import { useTraceability } from '@/app/context/TraceabilityContext';

interface TestResult {
    testName: string;
    expectedValue: string;
    actualValue: string;
    status: 'pass' | 'fail' | 'pending';
}

interface TestCategory {
    name: string;
    tests: TestResult[];
}

export default function SampleTestingPage() {
    const { batches, updateLabTest } = useTraceability();

    const [sampleInfo] = useState({
        sampleId: 'LAB-2025-ASH-001',
        sourceFarm: 'FARM-2024-ASH-001',
        herb: 'Ashwagandha Root',
        quantityReceived: '500g',
        priority: 'High'
    });

    const [activeTab, setActiveTab] = useState('Physical & Organoleptic');

    const [physicalTests, setPhysicalTests] = useState<TestResult[]>([
        { testName: '1.1 Color Examination', expectedValue: 'Light Brown to Brown', actualValue: '', status: 'pending' },
        { testName: '1.2 Odor Test', expectedValue: 'Characteristic mild odor', actualValue: '', status: 'pending' },
        { testName: '1.3 Taste Test', expectedValue: 'Slightly bitter', actualValue: '', status: 'pending' },
        { testName: '1.4 Texture Analysis', expectedValue: 'Fine powder', actualValue: '', status: 'pending' }
    ]);

    const [chemicalTests, setChemicalTests] = useState<TestResult[]>([
        { testName: '2.1 Moisture Content', expectedValue: '≤ 10%', actualValue: '', status: 'pending' },
        { testName: '2.2 pH Level', expectedValue: '6.0 - 7.0', actualValue: '', status: 'pending' },
        { testName: '2.3 Ash Content', expectedValue: '≤ 5%', actualValue: '', status: 'pending' },
        { testName: '2.4 Acid Insoluble Ash', expectedValue: '≤ 1%', actualValue: '', status: 'pending' }
    ]);

    const [advancedTests, setAdvancedTests] = useState<TestResult[]>([
        { testName: '3.1 Heavy Metals (Lead)', expectedValue: '≤ 10 ppm', actualValue: '', status: 'pending' },
        { testName: '3.2 Heavy Metals (Arsenic)', expectedValue: '≤ 3 ppm', actualValue: '', status: 'pending' },
        { testName: '3.3 Pesticide Residue', expectedValue: 'Not Detected', actualValue: '', status: 'pending' },
        { testName: '3.4 Microbial Count', expectedValue: '≤ 10^5 CFU/g', actualValue: '', status: 'pending' }
    ]);

    const [qualityTests, setQualityTests] = useState<TestResult[]>([
        { testName: '4.1 Withanolides Content', expectedValue: '≥ 2.5%', actualValue: '', status: 'pending' },
        { testName: '4.2 Total Alkaloids', expectedValue: '≥ 0.3%', actualValue: '', status: 'pending' },
        { testName: '4.3 Foreign Matter', expectedValue: '≤ 2%', actualValue: '', status: 'pending' },
        { testName: '4.4 Overall Quality Grade', expectedValue: 'Grade A', actualValue: '', status: 'pending' }
    ]);

    const tabs = [
        { name: 'Physical & Organoleptic', tests: physicalTests, setter: setPhysicalTests },
        { name: 'Chemical Analysis', tests: chemicalTests, setter: setChemicalTests },
        { name: 'Advanced Tests', tests: advancedTests, setter: setAdvancedTests },
        { name: 'Quality Assessment', tests: qualityTests, setter: setQualityTests }
    ];

    const updateTestValue = (tabName: string, testName: string, value: string) => {
        const tab = tabs.find(t => t.name === tabName);
        if (!tab) return;

        const updatedTests = tab.tests.map(test => {
            if (test.testName === testName) {
                return { ...test, actualValue: value };
            }
            return test;
        });

        tab.setter(updatedTests);
    };

    const saveResults = () => {
        // Calculate overall result
        const allTests = [...physicalTests, ...chemicalTests, ...advancedTests, ...qualityTests];
        const allPassed = allTests.every(test => test.actualValue && test.status !== 'fail');

        const result = allPassed ? 'Passed' : 'Failed';

        // Update in global context - this will sync to all pages
        updateLabTest('TEST-001', {
            result: result as 'Passed' | 'Failed',
            soilQuality: 'pH 6.5, Organic Matter 3.2%',
            cropQuality: 'Grade A, Moisture 8%',
            pesticidesUsed: chemicalTests[2].actualValue || 'Not Detected',
            climaticCondition: 'Temperature 25°C, Humidity 60%'
        });

        alert(`Test Results Saved!\n\nOverall Result: ${result}\n\n✅ Updated globally:\n- Lab Testing Queue\n- Farmer Dashboard\n- Processing Page\n- Packaging Page\n- Consumer Portal`);
    };

    const getCurrentTests = () => {
        const tab = tabs.find(t => t.name === activeTab);
        return tab ? tab.tests : [];
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-8">
                <Link href="/dashboard/lab-testing" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back To Dashboard</span>
                </Link>

                <h2 className="text-3xl font-bold text-gray-900 mb-8">Sample Testing Interface</h2>

                {/* Sample Information Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-5 gap-6">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Sample ID</p>
                            <p className="text-sm font-semibold text-gray-900">{sampleInfo.sampleId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Source Farm</p>
                            <p className="text-sm font-semibold text-gray-900">{sampleInfo.sourceFarm}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Herb</p>
                            <p className="text-sm font-semibold text-gray-900">{sampleInfo.herb}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Quantity Received</p>
                            <p className="text-sm font-semibold text-gray-900">{sampleInfo.quantityReceived}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Priority</p>
                            <p className="text-sm font-semibold text-red-600">{sampleInfo.priority}</p>
                        </div>
                    </div>
                </div>

                {/* Test Tabs */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`px-6 py-4 text-sm font-medium transition ${activeTab === tab.name
                                            ? 'bg-teal-50 text-teal-700 border-b-2 border-teal-600'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Test Content */}
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">{activeTab}</h3>

                        <div className="space-y-6">
                            {getCurrentTests().map((test, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">{test.testName}</h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Expected Color</label>
                                            <input
                                                type="text"
                                                value={test.expectedValue}
                                                disabled
                                                className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-700"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Actual Color</label>
                                            <input
                                                type="text"
                                                value={test.actualValue}
                                                onChange={(e) => updateTestValue(activeTab, test.testName, e.target.value)}
                                                placeholder="Enter observed color"
                                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-gray-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Save Button */}
                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={saveResults}
                                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Save Test Results
                            </button>
                            <button
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Complete & Approve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
