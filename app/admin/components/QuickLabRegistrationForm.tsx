import React, { useState } from 'react';
import axios from 'axios';

export default function QuickLabRegistrationForm() {
    const [formData, setFormData] = useState({
        labName: '',
        contactPerson: '',
        email: '',
        phone: '',
        nablNumber: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            // Send data to backend API
            const response = await axios.post('http://10.80.62.80:3000/labregistration', {
                labName: formData.labName,
                contactPerson: formData.contactPerson,
                email: formData.email,
                phone: formData.phone,
                nablNumber: formData.nablNumber,
                submittedAt: new Date().toISOString()
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 seconds timeout
            });

            console.log('Lab Registration Response:', response.data);

            setSubmitStatus({
                type: 'success',
                message: 'Registration submitted successfully! Admin will review and approve your application.'
            });

            // Reset form after successful submission
            setFormData({
                labName: '',
                contactPerson: '',
                email: '',
                phone: '',
                nablNumber: ''
            });

        } catch (error) {
            console.error('Lab Registration Error:', error);

            let errorMessage = 'Failed to submit registration. Please try again.';

            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    errorMessage = 'Request timeout. Please check your connection and try again.';
                } else if (error.code === 'ERR_NETWORK') {
                    errorMessage = 'Cannot connect to server. Please check if the server is running.';
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
            }

            setSubmitStatus({
                type: 'error',
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 max-w-2xl mx-auto">
            <div className="border-b-2 border-[#014848] pb-6 mb-8 text-center">
                <h2 className="text-2xl font-bold text-[#014848]">Laboratory Quick Registration</h2>
                <p className="text-gray-500 mt-2 text-sm">Fill essential details for fast approval</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Messages */}
                {submitStatus.type && (
                    <div className={`p-4 rounded-lg border ${submitStatus.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        <div className="flex items-start gap-3">
                            {submitStatus.type === 'success' ? (
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            <p className="text-sm font-semibold">{submitStatus.message}</p>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Laboratory Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.labName}
                        onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                        disabled={isSubmitting}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter laboratory name"
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
                        disabled={isSubmitting}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                        disabled={isSubmitting}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="contact@laboratory.com"
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
                        disabled={isSubmitting}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="+91 XXXXX XXXXX"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        NABL Accreditation Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.nablNumber}
                        onChange={(e) => setFormData({ ...formData, nablNumber: e.target.value })}
                        disabled={isSubmitting}
                        className="w-full border-2 border-gray-300 focus:border-[#014848] outline-none py-3 px-4 rounded-lg transition-colors text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="NABL-XXXXXX"
                    />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-800">
                            After submission, admin will review your application and create your login credentials. You'll receive an email with access details.
                        </p>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#014848] text-white px-12 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-[#003636] transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            'Submit Registration'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
