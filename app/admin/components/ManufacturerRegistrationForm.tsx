import React from 'react';

export default function ManufacturerRegistrationForm() {
    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 max-w-4xl mx-auto font-serif">
            <div className="border-b-2 border-[#014848] pb-6 mb-8 text-center">
                <h2 className="text-3xl font-bold text-[#014848] uppercase tracking-wide">Manufacturer Registration Form</h2>
                <p className="text-gray-500 mt-2 italic">Official Application for AYUSH Manufacturing Unit Registration</p>
            </div>

            <form className="space-y-10">
                {/* Section 1: Company Information */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">1</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Company Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Brand Name(s)</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Legal Entity</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Year of Incorporation</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" placeholder="YYYY" />
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Key Personnel</h4>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">CEO/MD Name</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Plant Head</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Quality Head</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                            <input type="tel" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Address Details</h4>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Corporate Office</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Manufacturing Plant</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Warehouse Address</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">City</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pincode</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                    </div>
                </section>

                {/* Section 2: Manufacturing Licenses */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">2</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Manufacturing Licenses</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 col-span-2">
                            <h4 className="font-bold text-blue-900 mb-3 text-sm">Drug Manufacturing License</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-blue-800 mb-1">License Number</label>
                                    <input type="text" className="w-full border-b border-blue-300 bg-transparent focus:border-blue-600 outline-none py-1 text-black font-semibold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-800 mb-1">Issuing Authority</label>
                                    <input type="text" className="w-full border-b border-blue-300 bg-transparent focus:border-blue-600 outline-none py-1 text-black font-semibold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-800 mb-1">Date of Issue</label>
                                    <input type="date" className="w-full border-b border-blue-300 bg-transparent focus:border-blue-600 outline-none py-1 text-black font-semibold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-blue-800 mb-1">Valid Until</label>
                                    <input type="date" className="w-full border-b border-blue-300 bg-transparent focus:border-blue-600 outline-none py-1 text-black font-semibold" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-blue-800 mb-1">Schedule</label>
                                    <input type="text" className="w-full border-b border-blue-300 bg-transparent focus:border-blue-600 outline-none py-1 text-black font-semibold" />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">AYUSH License Number</label>
                            <input type="text" className="w-full border-b border-gray-300 focus:border-[#014848] outline-none py-2 bg-transparent transition-colors text-black font-semibold" />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2 text-sm"><input type="radio" name="cat" className="text-[#014848] focus:ring-[#014848]" /> Herbal</label>
                                <label className="flex items-center gap-2 text-sm"><input type="radio" name="cat" className="text-[#014848] focus:ring-[#014848]" /> Proprietary Medicine</label>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">International Certifications</label>
                            <div className="flex flex-wrap gap-4">
                                {['WHO-GMP Certification', 'USFDA Registration', 'EU-GMP Certification'].map((cert) => (
                                    <label key={cert} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-gray-700 text-sm">{cert}</span>
                                    </label>
                                ))}
                                <label className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                    <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                    <span className="text-gray-700 text-sm">Other:</span>
                                    <input type="text" className="border-b border-gray-300 w-24 bg-transparent outline-none text-sm text-black font-semibold" />
                                </label>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Quality Management Systems</label>
                            <div className="flex flex-wrap gap-4">
                                {['ISO 9001:2015', 'ISO 14001', 'ISO 45001'].map((iso) => (
                                    <label key={iso} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-gray-700 text-sm">{iso}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Manufacturing Capabilities */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">3</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Manufacturing Capabilities</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Plant Classification</label>
                            <div className="space-y-2">
                                {['Schedule M Compliant', 'WHO-GMP Certified', 'USFDA Approved', 'EU-GMP Approved', 'Dedicated Herbal Unit'].map(cls => (
                                    <label key={cls} className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-sm text-gray-700">{cls}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Product Forms</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    'Tablets', 'Capsules', 'Powders/Churnas', 'Syrups', 'Oils/Tailams', 'Creams/Ointments', 'Granules'
                                ].map(prod => (
                                    <label key={prod} className="flex items-center gap-2">
                                        <input type="checkbox" className="w-4 h-4 text-[#014848] border-gray-300 rounded focus:ring-[#014848]" />
                                        <span className="text-xs text-gray-700">{prod}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2 mt-4">
                            <h4 className="font-bold text-[#014848] mb-4 text-sm uppercase tracking-wider">Capacity Details</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Built-up Area (sq.m)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-black" />
                                </div>
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Mfg Area (sq.m)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-black" />
                                </div>
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Warehouse (sq.m)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-black" />
                                </div>
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Daily Cap (units)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-black" />
                                </div>
                                <div className="text-center">
                                    <label className="block text-[10px] text-gray-500 uppercase mb-1">Annual Turnover (₹)</label>
                                    <input type="number" className="w-full border border-gray-200 rounded p-1 text-center font-bold text-black" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Quality Control */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#014848] text-white flex items-center justify-center font-bold font-sans">4</div>
                        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 flex-1 pb-2">Quality Control</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-5 rounded-lg">
                            <h4 className="font-bold text-gray-700 mb-3 text-sm">QC Laboratory</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">In-house QC Lab</span><div className="flex gap-2 text-xs"><label><input type="radio" name="lab" /> Yes</label><label><input type="radio" name="lab" /> No</label></div></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Qualified Analysts</span><input type="number" className="w-16 border rounded p-1 text-center text-black font-semibold" /></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Microbial Testing</span><div className="flex gap-2 text-xs"><label><input type="radio" name="mic" /> Yes</label><label><input type="radio" name="mic" /> No</label></div></div>
                                <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Stability Chamber</span><div className="flex gap-2 text-xs"><label><input type="radio" name="stb" /> Yes</label><label><input type="radio" name="stb" /> No</label></div></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-700 mb-2 text-sm">Quality Systems</h4>
                            <div className="space-y-2">
                                {['Documented Quality Manual', 'SOPs for all processes', 'Batch Manufacturing Records', 'Stability Studies', 'Vendor Qualification', 'Product Validation'].map(sys => (
                                    <label key={sys} className="flex items-center gap-2">
                                        <input type="checkbox" className="w-3 h-3 text-[#014848] rounded" />
                                        <span className="text-sm text-gray-600">{sys}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2">
                            <h4 className="font-bold text-gray-700 mb-2 text-sm">Packaging Capabilities</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="text" placeholder="Primary Packaging Types" className="border-b border-gray-300 w-full text-sm py-1 text-black font-semibold" />
                                <input type="text" placeholder="Secondary Packaging Types" className="border-b border-gray-300 w-full text-sm py-1 text-black font-semibold" />
                                <div className="flex gap-3 text-xs justify-end">
                                    <label className="flex items-center gap-1"><input type="checkbox" /> Serialization</label>
                                    <label className="flex items-center gap-1"><input type="checkbox" /> Tamper Evd.</label>
                                    <label className="flex items-center gap-1"><input type="checkbox" /> Barcoding</label>
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
                            'Drug Manufacturing License', 'AYUSH License', 'WHO-GMP Certificate', 'Other Certificates',
                            'Plant Layout and Design', 'Facility Photographs', 'Equipment Qualification', 'HVAC Validation',
                            'Quality Manual', 'SOP Index', 'Stability Data', 'Validation Protocols',
                            'Environmental Clearance', 'Consent to Operate', 'Fire NOC', 'Factory License'
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
                    <p className="text-center text-gray-700 mb-8 italic">"I hereby declare that all information provided is true and accurate, and we comply with all applicable laws."</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Applicant Name</label>
                            <input type="text" className="w-full border-b border-gray-400 bg-transparent py-1 font-bold text-black" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Designation</label>
                            <input type="text" className="w-full border-b border-gray-400 bg-transparent py-1 text-black font-semibold" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Organization</label>
                            <input type="text" className="w-full border-b border-gray-400 bg-transparent py-1 text-black font-semibold" />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Signature</label>
                            <div className="w-full border-b border-gray-400 h-8"></div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Date</label>
                            <input type="date" className="w-full border-b border-gray-400 bg-transparent py-1 text-black font-semibold" />
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
