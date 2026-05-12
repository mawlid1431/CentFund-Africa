import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, MapPin, Calendar, Eye, EyeOff, ArrowRight, Upload, FileText, Globe, GraduationCap, Home, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

interface CompleteRegistrationProps {
    darkMode: boolean;
    eligibilityData: {
        age: string;
        country: string;
        education: string;
    };
    onSuccess: (userId: string, email: string, name: string) => void;
}

// List of all countries excluding USA, European countries, China, Japan, Korea, Canada, Saudi Arabia
const ELIGIBLE_COUNTRIES = [
    'Afghanistan', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Azerbaijan',
    'Bahrain', 'Bangladesh', 'Benin', 'Bhutan', 'Bolivia', 'Botswana', 'Brazil',
    'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic',
    'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Côte d\'Ivoire',
    'Cuba', 'Djibouti', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
    'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Fiji', 'Gabon',
    'Gambia', 'Georgia', 'Ghana', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel',
    'Jamaica', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos',
    'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Malaysia',
    'Maldives', 'Mali', 'Mauritania', 'Mauritius', 'Mexico', 'Mongolia', 'Morocco',
    'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria',
    'Oman', 'Pakistan', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
    'Philippines', 'Qatar', 'Rwanda', 'Senegal', 'Seychelles', 'Sierra Leone',
    'Singapore', 'Somalia', 'South Africa', 'South Sudan', 'Sri Lanka', 'Sudan',
    'Suriname', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
    'Togo', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda',
    'United Arab Emirates', 'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam',
    'Yemen', 'Zambia', 'Zimbabwe'
];

export function CompleteRegistration({ darkMode, eligibilityData, onSuccess }: CompleteRegistrationProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [nationality, setNationality] = useState(eligibilityData.country);
    const [residentCountry, setResidentCountry] = useState(eligibilityData.country);
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [educationLevel, setEducationLevel] = useState(eligibilityData.education);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [idDocument, setIdDocument] = useState<File | null>(null);
    const [idPreview, setIdPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid image (JPG, PNG) or PDF file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setIdDocument(file);
            setError('');

            // Create preview for images
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!fullName || !email || !phone || !dateOfBirth || !nationality || !residentCountry ||
            !city || !address || !password || !confirmPassword || !idDocument) {
            setError('Please fill in all required fields');
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

        // Add timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
            setLoading(false);
            setError('Request timed out. Please check your internet connection and try again.');
        }, 30000); // 30 second timeout

        try {
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone,
                    }
                }
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('Failed to create user');

            // 2. Upload ID document to storage
            const fileExt = idDocument.name.split('.').pop();
            const fileName = `${authData.user.id}_${Date.now()}.${fileExt}`;
            const filePath = `id-documents/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('student-documents')
                .upload(filePath, idDocument);

            if (uploadError) throw uploadError;

            // 3. Get public URL for the uploaded document
            const { data: { publicUrl } } = supabase.storage
                .from('student-documents')
                .getPublicUrl(filePath);

            // 4. Create student profile
            const { error: profileError } = await supabase
                .from('students')
                .insert({
                    id: authData.user.id,
                    email,
                    full_name: fullName,
                    phone,
                    date_of_birth: dateOfBirth,
                    nationality,
                    resident_country: residentCountry,
                    city,
                    address,
                    education_level: educationLevel,
                    id_document_url: publicUrl,
                    eligibility_age: eligibilityData.age,
                    eligibility_country: eligibilityData.country,
                    eligibility_education: eligibilityData.education,
                    registration_status: 'pending',
                    created_at: new Date().toISOString()
                });

            if (profileError) throw profileError;

            // Success!
            clearTimeout(timeoutId);
            onSuccess(authData.user.id, email, fullName);

        } catch (err: any) {
            clearTimeout(timeoutId);
            console.error('Registration error:', err);

            // Handle rate limiting error
            if (err.message?.includes('can only request this after')) {
                setError('Too many registration attempts. Please wait 30 seconds and try again.');
            } else if (err.message?.includes('User already registered')) {
                setError('This email is already registered. Please use a different email or login instead.');
            } else if (err.message?.includes('row-level security policy')) {
                setError('Database permission error. Please contact support or check the database setup guide.');
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
                        Create Your Account
                    </h2>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
                        Complete your registration to continue with your application
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
                                {/* Full Name */}
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

                                {/* Email */}
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

                                {/* Phone */}
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

                                {/* Date of Birth */}
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Date of Birth *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            required
                                        />
                                    </div>
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
                                {/* Nationality */}
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
                                            {ELIGIBLE_COUNTRIES.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Resident Country */}
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Country of Residence *
                                    </label>
                                    <div className="relative">
                                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={residentCountry}
                                            onChange={(e) => setResidentCountry(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            required
                                        >
                                            <option value="">Select your country of residence</option>
                                            {ELIGIBLE_COUNTRIES.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* City */}
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

                                {/* Address */}
                                <div>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                        Address *
                                    </label>
                                    <div className="relative">
                                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-white border-gray-300 text-gray-900'
                                                } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            placeholder="Enter your address"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Education Level */}
                        <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                <GraduationCap className="w-5 h-5" />
                                Education Information
                            </h3>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Highest Level of Education *
                                </label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={educationLevel}
                                        onChange={(e) => setEducationLevel(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white'
                                            : 'bg-white border-gray-300 text-gray-900'
                                            } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                        required
                                    >
                                        <option value="">Select education level</option>
                                        <option value="High School">High School</option>
                                        <option value="Associate Degree">Associate Degree</option>
                                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ID Document Upload */}
                        <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                <FileText className="w-5 h-5" />
                                Identity Verification
                            </h3>

                            <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                    Upload Passport or National ID *
                                </label>
                                <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'
                                    } rounded-lg p-6`}>
                                    <input
                                        type="file"
                                        id="id-upload"
                                        accept="image/jpeg,image/jpg,image/png,application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        required
                                    />
                                    <label
                                        htmlFor="id-upload"
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

                        {/* Password Section */}
                        <div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                                <Lock className="w-5 h-5" />
                                Account Security
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Password */}
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

                                {/* Confirm Password */}
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
                                    Create Account
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
