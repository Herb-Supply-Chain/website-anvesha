import React, { useState } from 'react';

export default function QuickManufacturerRegistrationForm() {
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        fssaiNumber: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Manufacturer Registration:', formData);
        alert('Registration submitted successfully! Admin will review and approve.');
    };

    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 max-w-2xl mx-auto">
            <div className="border-b-2 border-[#014848] pb-6 mb-8 text-center">
                <h2 className="text-2xl font-bold text-[#014848]">Manufacturer Quick Registration</h2>
                <p className="text-gray-500 mt-2 text-sm">Fill essential details for fast approval</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Company/Manufacturer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold"
                        placeholder="Enter company name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Contact Person Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold"
                        placeholder="Enter contact person name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold"
                        placeholder="contact@manufacturer.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold"
                        placeholder="+91 XXXXX XXXXX"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        FSSAI License Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.fssaiNumber}
                        onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold"
                        placeholder="FSSAI-XXXXXXXXXXXXX"
                    />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-orange-800">
                            After submission, admin will review your application and create your login credentials. You'll receive an email with access details.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        className="bg-[#014848] text-white px-12 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-[#003636] transform hover:scale-105 transition-all"
                    >
                        Submit Registration
                    </button>
                </div>
            </form>
        </div>
    );
}
