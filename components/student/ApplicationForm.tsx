import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, FileText, Upload, CheckCircle } from 'lucide-react';

interface ApplicationFormProps {
    darkMode: boolean;
    projectId: string;
    projectName: string;
    onSubmit: (data: any) => void;
    onBack: () => void;
}

export function ApplicationForm({ darkMode, projectId, projectName, onSubmit, onBack }: ApplicationFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Personal Information
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',

        // Address
        address: '',
        city: '',
        country: 'Somaliland',
        postalCode: '',

        // Education
        highestEducation: '',
        institution: '',
        graduationYear: '',
        fieldOfStudy: '',

        // Motivation
        whyApply: '',
        careerGoals: '',
        howWillHelp: '',

        // Documents
        idCard: null as File | null,
        educationCertificate: null as File | null,
        motivationLetter: null as File | null,
    });

    const handleInputChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleFileChange = (field: string, file: File | null) => {
        setFormData({ ...formData, [field]: file });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, projectId, projectName });
    };

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.fullName && formData.email && formData.phone && formData.dateOfBirth && formData.gender;
            case 2:
                return formData.address && formData.city && formData.country;
            case 3:
                return formData.highestEducation && formData.institution && formData.graduationYear;
            case 4:
                return formData.whyApply && formData.careerGoals && formData.howWillHelp;
            case 5:
                return formData.idCard && formData.educationCertificate;
            default:
                return false;
        }
    };

    return (
        <div className={`max-w-4xl mx-auto px-4 py-8`}>
            <div className={`p-8 rounded-2xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}>
                {/* Header */}
                <div className="mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Application Form
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {projectName}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s <= step
                                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white'
                                        : darkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                                </div>
                                {s < 5 && (
                                    <div className={`flex-1 h-1 mx-2 ${s < step
                                            ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f]'
                                            : darkMode ? 'bg-white/10' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Personal</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Education</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Motivation</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Documents</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Personal Information
                            </h3>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Phone *
                                    </label>
                                    <div className="relative">
                                        <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Date of Birth *
                                    </label>
                                    <div className="relative">
                                        <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                        <input
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Gender *
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Address */}
                    {step === 2 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Address Information
                            </h3>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Street Address *
                                </label>
                                <div className="relative">
                                    <MapPin className={`absolute left-3 top-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        rows={3}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.postalCode}
                                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Education */}
                    {step === 3 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Education Background
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Highest Education Level *
                                    </label>
                                    <select
                                        value={formData.highestEducation}
                                        onChange={(e) => handleInputChange('highestEducation', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value="high-school">High School</option>
                                        <option value="diploma">Diploma</option>
                                        <option value="bachelors">Bachelor's Degree</option>
                                        <option value="masters">Master's Degree</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Graduation Year *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.graduationYear}
                                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        min="1950"
                                        max={new Date().getFullYear()}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Institution Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => handleInputChange('institution', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Field of Study
                                </label>
                                <input
                                    type="text"
                                    value={formData.fieldOfStudy}
                                    onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Motivation */}
                    {step === 4 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Motivation & Goals
                            </h3>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Why do you want to apply for this certification? *
                                </label>
                                <textarea
                                    value={formData.whyApply}
                                    onChange={(e) => handleInputChange('whyApply', e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    What are your career goals? *
                                </label>
                                <textarea
                                    value={formData.careerGoals}
                                    onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    How will this certification help you achieve your goals? *
                                </label>
                                <textarea
                                    value={formData.howWillHelp}
                                    onChange={(e) => handleInputChange('howWillHelp', e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    required
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5: Documents */}
                    {step === 5 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Required Documents
                            </h3>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    ID Card / Passport *
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-300 hover:border-gray-400'
                                    }`}>
                                    <Upload className={`w-12 h-12 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange('idCard', e.target.files?.[0] || null)}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        id="idCard"
                                        required
                                    />
                                    <label htmlFor="idCard" className="cursor-pointer">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {formData.idCard ? formData.idCard.name : 'Click to upload or drag and drop'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Education Certificate *
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-300 hover:border-gray-400'
                                    }`}>
                                    <Upload className={`w-12 h-12 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange('educationCertificate', e.target.files?.[0] || null)}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        id="educationCertificate"
                                        required
                                    />
                                    <label htmlFor="educationCertificate" className="cursor-pointer">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {formData.educationCertificate ? formData.educationCertificate.name : 'Click to upload or drag and drop'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Motivation Letter (Optional)
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-300 hover:border-gray-400'
                                    }`}>
                                    <Upload className={`w-12 h-12 mx-auto mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange('motivationLetter', e.target.files?.[0] || null)}
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        id="motivationLetter"
                                    />
                                    <label htmlFor="motivationLetter" className="cursor-pointer">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {formData.motivationLetter ? formData.motivationLetter.name : 'Click to upload or drag and drop'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-8">
                        {step > 1 && (
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStep(step - 1)}
                                className={`flex-1 px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                Previous
                            </motion.button>
                        )}

                        {step < 5 ? (
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setStep(step + 1)}
                                disabled={!isStepValid()}
                                className={`flex-1 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-6 py-3 rounded-lg font-medium ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                Next
                            </motion.button>
                        ) : (
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!isStepValid()}
                                className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium ${!isStepValid() ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                Submit Application
                            </motion.button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
