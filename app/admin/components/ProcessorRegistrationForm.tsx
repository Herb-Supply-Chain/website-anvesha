import React from 'react';

export default function ProcessorRegistrationForm() {
    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 max-w-4xl mx-auto font-serif">
            <div className="border-b-2 border-[#014848] pb-6 mb-8 text-center">
                <h2 className="text-3xl font-bold text-[#014848] uppercase tracking-wide">Processor Registration Form</h2>
                <p className="text-gray-500 mt-2 italic">Application for AYUSH Processing Unit Registration</p>
            </div>

            <form className="space-y-10">
                {/* Section 1: Business Information */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">1</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Business Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Business Name</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Trade Name</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Type of Business</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Year of Establishment</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" placeholder="YYYY" />
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Contact Information</h4>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Owner/Partner Name</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                            <input type="email" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Primary Phone</label>
                            <input type="tel" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Alternate Contact</label>
                            <input type="tel" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Location</h4>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Registered Office Address</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Processing Unit Address</label>
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
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">GPS Coordinates</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" placeholder="Lat, Long" />
                        </div>
                    </div>
                </section>

                {/* Section 2: Licenses & Certifications */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">2</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Licenses & Certifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 col-span-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-orange-800 mb-1">FSSAI License Number</label>
                                    <input type="text" className="w-full border-b border-orange-300 bg-transparent focus:border-orange-600 outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-orange-800 mb-1">License Category</label>
                                    <input type="text" className="w-full border-b border-orange-300 bg-transparent focus:border-orange-600 outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-orange-800 mb-1">Date of Issue</label>
                                    <input type="date" className="w-full border-b border-orange-300 bg-transparent focus:border-orange-600 outline-none py-1" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-orange-800 mb-1">Valid Until</label>
                                    <input type="date" className="w-full border-b border-orange-300 bg-transparent focus:border-orange-600 outline-none py-1" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">GSTIN</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Date of Registration</label>
                            <input type="date" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Other Licenses</label>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    'Factory License', 'Trade License', 'Pollution Control', 'Fire Safety', 'MSME Registration', 'APEDA Registration'
                                ].map((lic) => (
                                    <label key={lic} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-gray-700 text-sm">{lic}</span>
                                    </label>
                                ))}
                                <label className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                    <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                    <span className="text-gray-700 text-sm">Other:</span>
                                    <input type="text" className="border-b border-gray-300 focus:border-[#014848] outline-none bg-transparent w-24 text-sm" />
                                </label>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Quality Certifications</label>
                            <div className="flex flex-wrap gap-4">
                                {['ISO 22000', 'GMP', 'HACCP', 'Organic Certification'].map((cert) => (
                                    <label key={cert} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-gray-700 text-sm">{cert}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Processing Facilities */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">3</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Processing Facilities</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Facility Type</label>
                            <div className="space-y-2">
                                {['Dedicated Processing Unit', 'Contract Processor', 'Co-processing Facility'].map(type => (
                                    <label key={type} className="flex items-center gap-3">
                                        <input type="radio" name="facility_type" className="w-4 h-4 text-[#014848] border-gray-300 focus:ring-[#014848]" />
                                        <span className="text-sm text-gray-700">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Processing Methods</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    'Sun Drying', 'Machine Drying', 'Grinding/Pulverizing', 'Steam Sterilization',
                                    'Extraction', 'Powder Blending', 'Tableting', 'Capsule Filling'
                                ].map(method => (
                                    <label key={method} className="flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-xs text-gray-700">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Capacity Details</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Total Area (sq.ft)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-gray-700" />
                                </div>
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Daily Cap (kg)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-gray-700" />
                                </div>
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Storage (kg)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-gray-700" />
                                </div>
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Cold Storage</label>
                                    <select className="w-full border border-gray-200 rounded p-1 text-center font-bold text-gray-700 text-sm">
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Warehouse (sq.ft)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-gray-700" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Equipment Details */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">4</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Equipment Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h4 className="font-bold text-gray-700 mb-3 text-sm">Drying & Grinding</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Solar Dryers (units)</span><input type="number" className="w-16 border rounded p-1 text-center" /></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Tray Dryers (units)</span><input type="number" className="w-16 border rounded p-1 text-center" /></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Spray Dryer</span><input type="checkbox" className="w-4 h-4" /></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Hammer Mills (units)</span><input type="number" className="w-16 border rounded p-1 text-center" /></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Pulverizers (units)</span><input type="number" className="w-16 border rounded p-1 text-center" /></div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h4 className="font-bold text-gray-700 mb-3 text-sm">QC & Packaging</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {['Moisture Analyzer', 'Precision Scale', 'Metal Detector', 'Sieve Shaker', 'pH Meter',
                                    'Filling Machine', 'Sealing Machine', 'Labeling Machine', 'Shrink Wrapping'].map(eq => (
                                        <label key={eq} className="flex items-center gap-2">
                                            <input type="checkbox" className="w-3 h-3 text-[#014848] rounded" />
                                            <span className="text-xs text-gray-600">{eq}</span>
                                        </label>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 5: Staff & Training */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">5</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Staff & Training</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-3 border rounded-lg"><p className="text-xs text-gray-500">Technicians</p><input type="number" className="w-full text-center font-bold" placeholder="0" /></div>
                        <div className="p-3 border rounded-lg"><p className="text-xs text-gray-500">QC Officers</p><input type="number" className="w-full text-center font-bold" placeholder="0" /></div>
                        <div className="p-3 border rounded-lg"><p className="text-xs text-gray-500">Supervisors</p><input type="number" className="w-full text-center font-bold" placeholder="0" /></div>
                        <div className="p-3 border rounded-lg"><p className="text-xs text-gray-500">Total Staff</p><input type="number" className="w-full text-center font-bold" placeholder="0" /></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <h4 className="font-bold text-sm text-gray-700 mb-2">Training Status</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" /><span className="text-sm">Staff trained in GMP</span></label>
                                <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" /><span className="text-sm">Regular training conducted</span></label>
                                <div className="flex items-center gap-2 mt-2"><span className="text-sm text-gray-600">Last Training:</span><input type="date" className="border rounded px-2 py-0.5 text-xs" /></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-700 mb-2">Hygiene & Safety</h4>
                            <div className="space-y-2">
                                <select className="w-full border rounded p-1 text-sm"><option>Medical Checkups: Regular</option><option>Irregular</option><option>None</option></select>
                                <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" /><span className="text-sm">Safety equipment provided</span></label>
                                <label className="flex items-center gap-2"><input type="checkbox" className="w-4 h-4" /><span className="text-sm">First aid available</span></label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 6: Document Upload */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">6</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Document Upload</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            'FSSAI License', 'GST Registration', 'Business Registration', 'PAN Card', 'Trade License',
                            'Factory Photos (Min 10)', 'Layout Plan', 'Equipment List', 'Capacity Certificate',
                            'Quality Manual', 'SOPs', 'Staff Training Records', 'Pest Control Records',
                            'Pollution Control', 'Fire Safety', 'Weights & Measures'
                        ].map((doc) => (
                            <div key={doc} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#014848] transition-colors group">
                                <span className="text-sm text-gray-700 font-medium">{doc}</span>
                                <button type="button" className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm text-gray-600 group-hover:text-[#014848] group-hover:border-[#014848] transition-all">
                                    Upload
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Declaration */}
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
