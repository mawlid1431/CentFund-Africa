import { motion } from 'motion/react';
import { useState } from 'react';
import { FileText, Upload, ArrowRight, CheckCircle, User, Mail, Phone, MapPin, Building } from 'lucide-react';
import { toast } from 'sonner';

interface SponsorApplicationPageProps {
    darkMode: boolean;
    onNavigate: (page: string) => void;
}

export function SponsorApplicationPage({ darkMode, onNavigate }: SponsorApplicationPageProps) {
    const [formData, setFormData] = useState({
        fullName: sessionStorage.getItem('sponsorName') || '',
        email: sessionStorage.getItem('sponsorEmail') || '',
        phone: '',
        address: '',
        city: '',
        country: '',
        organization: '',
        idDocument: null as File | null,
        proofOfFunds: null as File | null,
        agreement: false,
    });

    const selectedProject = JSON.parse(sessionStorage.getItem('selectedProject') || '{}');
    const sponsorAmount = sessionStorage.getItem('sponsorAmount') || '0';

    const handleFileChange = (field: 'idDocument' | 'proofOfFunds', file: File | null) => {
        setFormData({ ...formData, [field]: file });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.idDocument || !formData.proofOfFunds) {
            toast.error('Please upload all required documents');
            return;
        }

        if (!formData.agreement) {
            toast.error('Please accept the sponsor agreement');
            return;
        }

        // Store application data
        sessionStorage.setItem('sponsorApplication', JSON.stringify(formData));

        toast.success('Application submitted successfully!');
        onNavigate('sponsor-success');
    };

    return (
        <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.span
                        className="inline-block px-4 py-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange mb-4"
                    >
                        Step 4 of 4
                    </motion.span>
                    <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        Complete Sponsor Application
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Fill in your details and upload required documents
                    </p>
                </motion.div>

                {/* Summary Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-6 mb-8 ${darkMode ? 'bg-gradient-to-r from-accent-orange/20 to-accent-orange-light/20 border border-accent-orange/30' : 'bg-gradient-to-r from-accent-orange/10 to-accent-orange-light/10 border border-accent-orange/20'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm mb-1 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                Sponsoring
                            </p>
                            <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                {selectedProject.name}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm mb-1 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                Amount
                            </p>
                            <p className="text-2xl font-bold text-accent-orange">
                                ${sponsorAmount}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-2xl p-8 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'}`}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                                    ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                    : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                                    ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                    : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                                    ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                    : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                        Organization (Optional)
                                    </label>
                                    <div className="relative">
                                        <Building className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            value={formData.organization}
                                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                                    ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                    : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                                }`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Address Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                        Street Address *
                                    </label>
                                    <div className="relative">
                                        <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                                    ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                    : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-xl border transition-all ${darkMode
                                                    ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                    : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                                }`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-xl border transition-all ${darkMode
                                                    ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                    : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div>
                            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                Required Documents
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                        Government ID / Passport *
                                    </label>
                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${formData.idDocument
                                            ? 'border-accent-orange bg-accent-orange/5'
                                            : darkMode
                                                ? 'border-white/20 hover:border-white/40'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <input
                                            type="file"
                                            id="idDocument"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange('idDocument', e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                        <label htmlFor="idDocument" className="cursor-pointer">
                                            {formData.idDocument ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <CheckCircle className="w-6 h-6 text-accent-orange" />
                                                    <span className={darkMode ? 'text-white' : 'text-black'}>
                                                        {formData.idDocument.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                                    <p className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                                                        Click to upload ID document
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                        Proof of Funds / Bank Statement *
                                    </label>
                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${formData.proofOfFunds
                                            ? 'border-accent-orange bg-accent-orange/5'
                                            : darkMode
                                                ? 'border-white/20 hover:border-white/40'
                                                : 'border-gray-300 hover:border-gray-400'
                                        }`}>
                                        <input
                                            type="file"
                                            id="proofOfFunds"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileChange('proofOfFunds', e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                        <label htmlFor="proofOfFunds" className="cursor-pointer">
                                            {formData.proofOfFunds ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <CheckCircle className="w-6 h-6 text-accent-orange" />
                                                    <span className={darkMode ? 'text-white' : 'text-black'}>
                                                        {formData.proofOfFunds.name}
                                                    </span>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                                    <p className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                                                        Click to upload proof of funds
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agreement */}
                        <div className={`p-6 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.agreement}
                                    onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-accent-orange focus:ring-accent-orange"
                                    required
                                />
                                <span className={`text-sm ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                    I agree to the sponsor terms and conditions. I understand that my sponsorship will be used to fund the selected certification program for eligible students. I agree to receive updates about the sponsored student's progress.
                                </span>
                            </label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg"
                        >
                            <FileText className="w-5 h-5" />
                            <span>Submit Application</span>
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
