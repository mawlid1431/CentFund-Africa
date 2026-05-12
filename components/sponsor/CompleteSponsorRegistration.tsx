import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, ArrowRight, Upload, FileText, Globe, Building, DollarSign } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

interface CompleteSponsorRegistrationProps {
    darkMode: boolean;
    eligibilityData: {
        age: string;
        sponsorType: string;
        financialCapability: string;
        motivation: string;
    };
    onSuccess: (userId: string, email: string, name: string) => void;
}

// All countries list
const ALL_COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
    'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic',
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Denmark', 'Djibouti', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
    'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana',
    'Greece', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India',
    'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
    'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Mongolia',
    'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
    'North Korea', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
    'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
    'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain',
    'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
    'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates',
    'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

export function CompleteSponsorRegistration({ darkMode, eligibilityData, onSuccess }: CompleteSponsorRegistrationProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [age, setAge] = useState(eligibilityData.age);
    const [nationality, setNationality] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [organization, setOrganization] = useState('');
    const [sponsorType, setSponsorType] = useState(eligibilityData.sponsorType);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [idDocument, setIdDocument] = useState<File | null>(null);
    const [idPreview, setIdPreview] = useState<string | null>(null);
    const [financialProof, setFinancialProof] = useState<File | null>(null);
    const [financialProofPreview, setFinancialProofPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid image (JPG, PNG) or PDF file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setIdDocument(file);
            setError('');

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setIdPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setIdPreview(null);
            }
        }
    };

    const handleFinancialProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid image (JPG, PNG) or PDF file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setFinancialProof(file);
            setError('');

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFinancialProofPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setFinancialProofPreview(null);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!fullName || !email || !phone || !age || !nationality || !country ||
            !city || !address || !password || !confirmPassword || !idDocument || !financialProof) {
            setError('Please fill in all required fields and upload both ID and financial proof documents');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone,
                        role: 'sponsor'
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('Failed to create user');

            // 2. Upload ID document
            const fileExt = idDocument.name.split('.').pop();
            const fileName = `${authData.user.id}_id_${Date.now()}.${fileExt}`;
            const filePath = `sponsor-documents/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('sponsor-documents')
                .upload(filePath, idDocument);

            if (uploadError) throw uploadError;

            // 3. Get public URL for ID
            const { data: { publicUrl } } = supabase.storage
                .from('sponsor-documents')
                .getPublicUrl(filePath);

            // 4. Upload Financial Proof document
            const financialExt = financialProof.name.split('.').pop();
            const financialFileName = `${authData.user.id}_financial_${Date.now()}.${financialExt}`;
            const financialFilePath = `sponsor-documents/${financialFileName}`;

            const { error: financialUploadError } = await supabase.storage
                .from('sponsor-documents')
                .upload(financialFilePath, financialProof);

            if (financialUploadError) throw financialUploadError;

            // 5. Get public URL for Financial Proof
            const { data: { publicUrl: financialProofUrl } } = supabase.storage
                .from('sponsor-documents')
                .getPublicUrl(financialFilePath);

            // 6. Create sponsor profile with PENDING status
            const { error: profileError } = await supabase
                .from('sponsor_users')
                .insert({
                    id: authData.user.id,
                    email,
                    full_name: fullName,
                    phone,
                    age: parseInt(age),
                    nationality,
                    country,
                    city,
                    address,
                    organization: organization || null,
                    sponsor_type: sponsorType,
                    id_document_url: publicUrl,
                    proof_of_funds_url: financialProofUrl,
                    eligibility_motivation: eligibilityData.motivation,
                    eligibility_financial: eligibilityData.financialCapability,
                    account_status: 'pending',
                    approval_status: 'pending',
                    created_at: new Date().toISOString()
                });

            if (profileError) throw profileError;

            // Success!
            onSuccess(authData.user.id, email, fullName);

        } catch (err: any) {
            console.error('Registration error:', err);

            // Handle rate limiting error
            if (err.message?.includes('can only request this after')) {
                setError('Too many registration attempts. Please wait 30 seconds and try again.');
            } else if (err.message?.includes('User already registered')) {
                setError('This email is already registered. Please use a different email or login instead.');
            } else {
                setError(err.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-12 px-4`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
                    <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Create Sponsor Account
                    </h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                        Complete your registration. Your account will be reviewed by our admin team.
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                <User className="w-5 h-5" />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Full Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            placeholder="+1234567890"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Age *
                                    </label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                        required
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                <Globe className="w-5 h-5" />
                                Location Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Nationality *
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={nationality}
                                            onChange={(e) => setNationality(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            required
                                        >
                                            <option value="">Select your nationality</option>
                                            {ALL_COUNTRIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Country of Residence *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            required
                                        >
                                            <option value="">Select your country</option>
                                            {ALL_COUNTRIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        City *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            placeholder="Enter your city"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                        placeholder="Enter your address"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Organization (Optional) */}
                        {(sponsorType === 'organization' || sponsorType === 'foundation') && (
                            <div>
                                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                    <Building className="w-5 h-5" />
                                    Organization Details
                                </h3>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Organization Name
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={organization}
                                            onChange={(e) => setOrganization(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            placeholder="Enter organization name"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ID Document Upload */}
                        <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                <FileText className="w-5 h-5" />
                                Identity Verification
                            </h3>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Upload ID Document (Passport, National ID, or Driver's License) *
                                </label>
                                <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'
                                    } rounded-lg p-6`}>
                                    <input
                                        type="file"
                                        id="sponsor-id-upload"
                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        required
                                    />
                                    <label
                                        htmlFor="sponsor-id-upload"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        {idPreview ? (
                                            <div className="relative">
                                                <img
                                                    src={idPreview}
                                                    alt="ID Preview"
                                                    className="max-w-full h-48 object-contain rounded-lg"
                                                />
                                                <div className="mt-2 text-center">
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {idDocument?.name}
                                                    </p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                                        Click to change
                                                    </p>
                                                </div>
                                            </div>
                                        ) : idDocument ? (
                                            <div className="text-center">
                                                <FileText className="w-16 h-16 mx-auto text-orange-500 mb-2" />
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {idDocument.name}
                                                </p>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                                    Click to change
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    JPG, PNG or PDF (max 5MB)
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Financial Proof Upload */}
                        <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                <DollarSign className="w-5 h-5" />
                                Financial Capability Proof
                            </h3>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Upload Proof of Financial Capability * (Bank Statement, Payslip, or Financial Document)
                                </label>
                                <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Please upload a recent bank statement, payslip, or other financial document showing you have the capability to sponsor students ($200-$500 per student)
                                </p>
                                <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'
                                    } rounded-lg p-6`}>
                                    <input
                                        type="file"
                                        id="financial-proof-upload"
                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                        onChange={handleFinancialProofChange}
                                        className="hidden"
                                        required
                                    />
                                    <label
                                        htmlFor="financial-proof-upload"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        {financialProofPreview ? (
                                            <div className="relative">
                                                <img
                                                    src={financialProofPreview}
                                                    alt="Financial Proof Preview"
                                                    className="max-w-full h-48 object-contain rounded-lg"
                                                />
                                                <div className="mt-2 text-center">
                                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        {financialProof?.name}
                                                    </p>
                                                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                                        Click to change
                                                    </p>
                                                </div>
                                            </div>
                                        ) : financialProof ? (
                                            <div className="text-center">
                                                <FileText className="w-16 h-16 mx-auto text-green-500 mb-2" />
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {financialProof.name}
                                                </p>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                                    Click to change
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                                    Click to upload financial proof
                                                </p>
                                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    JPG, PNG or PDF (max 5MB)
                                                </p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Password Section */}
                        <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                <Lock className="w-5 h-5" />
                                Account Security
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full pl-10 pr-12 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            placeholder="Enter password (min 8 characters)"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full pl-10 pr-12 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            placeholder="Confirm your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pending Approval Notice */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-800 text-sm">
                                <strong>Note:</strong> Your account will be pending approval. Our admin team will review your application and you'll receive an email once approved. You can login only after approval.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Sponsor Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
