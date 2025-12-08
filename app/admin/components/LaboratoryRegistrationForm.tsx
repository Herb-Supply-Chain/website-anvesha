import React from 'react';

export default function LaboratoryRegistrationForm() {
    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 max-w-4xl mx-auto font-serif">
            <div className="border-b-2 border-[#014848] pb-6 mb-8 text-center">
                <h2 className="text-3xl font-bold text-[#014848] uppercase tracking-wide">Laboratory Registration Form</h2>
                <p className="text-gray-500 mt-2 italic">Official Application for AYUSH Testing Facility Registration</p>
            </div>

            <form className="space-y-10">
                {/* Section 1: Basic Information */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">1</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Laboratory Name</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" placeholder="Enter full name of the laboratory" />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Legal Entity Name</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" placeholder="Registered legal entity name" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Year of Establishment</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" placeholder="YYYY" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Website</label>
                            <input type="url" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" placeholder="https://" />
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Contact Details</h4>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Primary Contact Person</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Designation</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input type="email" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number</label>
                            <input type="tel" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Alternate Contact</label>
                            <input type="tel" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Address Information</h4>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Complete Address</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">District</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">GPS Coordinates</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" placeholder="Lat, Long" />
                        </div>
                    </div>
                </section>

                {/* Section 2: Accreditation Details */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">2</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Accreditation Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">NABL Accreditation Number</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Date of Accreditation</label>
                            <input type="date" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Valid Until</label>
                            <input type="date" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Scope of Accreditation</label>
                            <textarea className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#014848] outline-none transition-colors" rows={3}></textarea>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Certifications</label>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                    <span className="text-gray-700">ISO 9001:2015</span>
                                    <input type="text" placeholder="Certificate No" className="flex-1 border-b border-gray-300 focus:border-[#014848] outline-none py-1 bg-transparent text-sm ml-2" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                    <span className="text-gray-700">ISO/IEC 17025</span>
                                    <input type="text" placeholder="Certificate No" className="flex-1 border-b border-gray-300 focus:border-[#014848] outline-none py-1 bg-transparent text-sm ml-2" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                    <span className="text-gray-700">AYUSH Recognized Laboratory</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                    <span className="text-gray-700">Other:</span>
                                    <input type="text" className="flex-1 border-b border-gray-300 focus:border-[#014848] outline-none py-1 bg-transparent text-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Laboratory Category</label>
                            <div className="flex flex-wrap gap-4">
                                {['Government Laboratory', 'Private Accredited Laboratory', 'University/Research Laboratory', 'Hospital Laboratory'].map((cat) => (
                                    <label key={cat} className="flex items-center gap-2">
                                        <input type="radio" name="lab_category" className="w-4 h-4 text-[#014848] border-gray-300 focus:ring-[#014848]" />
                                        <span className="text-gray-700 text-sm">{cat}</span>
                                    </label>
                                ))}
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="lab_category" className="w-4 h-4 text-[#014848] border-gray-300 focus:ring-[#014848]" />
                                    <span className="text-gray-700 text-sm">Other</span>
                                    <input type="text" className="border-b border-gray-300 focus:border-[#014848] outline-none py-0.5 w-32 text-sm" />
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Testing Capabilities */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">3</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Testing Capabilities</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 block">Available Equipment</label>
                            <div className="space-y-2">
                                {[
                                    'High Performance Liquid Chromatography (HPLC)',
                                    'Gas Chromatography-Mass Spectrometry (GC-MS)',
                                    'Inductively Coupled Plasma-Mass Spectrometry (ICP-MS)',
                                    'Atomic Absorption Spectroscopy (AAS)',
                                    'UV-Visible Spectrophotometer',
                                    'Microbiological Testing Equipment',
                                    'DNA Sequencer'
                                ].map((eq) => (
                                    <label key={eq} className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-sm text-gray-700">{eq}</span>
                                    </label>
                                ))}
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                    <span className="text-sm text-gray-700">Other:</span>
                                    <input type="text" className="flex-1 border-b border-gray-300 focus:border-[#014848] outline-none py-0.5 text-sm" />
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 block">Testing Parameters Available</label>
                            <div className="space-y-2">
                                {[
                                    'Heavy Metals Analysis (Pb, As, Cd, Hg)',
                                    'Pesticide Residue Testing',
                                    'Aflatoxin Analysis',
                                    'Microbial Analysis',
                                    'DNA Barcoding',
                                    'Marker Compounds Quantification',
                                    'Physical Parameters'
                                ].map((param) => (
                                    <label key={param} className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-sm text-gray-700">{param}</span>
                                    </label>
                                ))}
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                    <span className="text-sm text-gray-700">Other:</span>
                                    <input type="text" className="flex-1 border-b border-gray-300 focus:border-[#014848] outline-none py-0.5 text-sm" />
                                </label>
                            </div>
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Capacity Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Max Samples Per Day</label>
                                    <input type="number" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Avg Turnaround (Days)</label>
                                    <input type="number" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Working Hours/Day</label>
                                    <input type="number" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Number of Shifts</label>
                                    <input type="number" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Personnel Details */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">4</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Personnel Details</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase">Laboratory Director/Head</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                                    <input type="text" className="w-full border-b border-gray-300 bg-transparent focus:border-[#014848] outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Qualification</label>
                                    <input type="text" className="w-full border-b border-gray-300 bg-transparent focus:border-[#014848] outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Registration Number</label>
                                    <input type="text" className="w-full border-b border-gray-300 bg-transparent focus:border-[#014848] outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Years of Experience</label>
                                    <input type="number" className="w-full border-b border-gray-300 bg-transparent focus:border-[#014848] outline-none py-1" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase">Technical Staff Summary</h4>
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                    <label className="block text-xs text-gray-500 mb-1">Total Technical Staff</label>
                                    <input type="number" className="w-full text-center font-bold text-xl border-none focus:ring-0" placeholder="0" />
                                </div>
                                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                    <label className="block text-xs text-gray-500 mb-1">Total Administrative</label>
                                    <input type="number" className="w-full text-center font-bold text-xl border-none focus:ring-0" placeholder="0" />
                                </div>
                                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                    <label className="block text-xs text-gray-500 mb-1">Total Support Staff</label>
                                    <input type="number" className="w-full text-center font-bold text-xl border-none focus:ring-0" placeholder="0" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 5: Document Upload */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">5</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Document Upload</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'Certificate of Incorporation/Registration',
                            'GST Registration Certificate',
                            'PAN Card Copy',
                            'NABL Accreditation Certificate',
                            'Scope of Accreditation Document',
                            'Latest Audit Report',
                            'Laboratory Director Degree Certificate',
                            'Technician Certification Documents',
                            'Staff List with Qualifications',
                            'Laboratory Layout Plan',
                            'Laboratory Photographs (Minimum 5)',
                            'Equipment List with Calibration Certificates',
                            'Quality Manual',
                            'Pollution Control Certificate',
                            'Fire Safety Certificate'
                        ].map((doc) => (
                            <div key={doc} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#014848] transition-colors group">
                                <span className="text-sm text-gray-700 font-medium">{doc}</span>
                                <button type="button" className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm text-gray-600 group-hover:text-[#014848] group-hover:border-[#014848] transition-all">
                                    Upload
                                </button>
                            </div>
                        ))}
                        <div className="col-span-1 md:col-span-2 flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#014848] transition-colors group">
                            <span className="text-sm text-gray-700 font-medium">Any other relevant certificates</span>
                            <button type="button" className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm text-gray-600 group-hover:text-[#014848] group-hover:border-[#014848] transition-all">
                                Upload
                            </button>
                        </div>
                    </div>
                </section>

                {/* Section 6: Declaration */}
                <section className="bg-[#014848]/5 p-8 rounded-xl border border-[#014848]/20">
                    <h3 className="text-lg font-bold text-[#014848] mb-4 text-center section-header">Declaration</h3>
                    <p className="text-center text-gray-700 mb-8 italic">"I hereby declare that all information provided is true and accurate."</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Applicant Name</label>
                            <input type="text" className="w-full border-b border-gray-400 bg-transparent py-1 font-bold text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Designation</label>
                            <input type="text" className="w-full border-b border-gray-400 bg-transparent py-1 text-gray-900" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Signature</label>
                            <div className="w-full border-b border-gray-400 h-8"></div>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Date</label>
                            <input type="date" className="w-full border-b border-gray-400 bg-transparent py-1 text-gray-900" />
                        </div>
                    </div>
                </section>

                <div className="flex justify-center pt-6">
                    <button type="button" className="bg-[#014848] text-white px-12 py-3 rounded-full text-lg font-bold shadow-lg hover:bg-[#003636] transform hover:scale-105 transition-all">
                        SUBMIT FOR ADMIN APPROVAL
                    </button>
                </div>

            </form>
        </div>
    );
}
