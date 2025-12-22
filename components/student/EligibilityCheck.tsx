import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, ArrowRight, Globe, GraduationCap, Wifi, Monitor } from 'lucide-react';

interface EligibilityCheckProps {
    darkMode: boolean;
    onEligible: (data: { age: string; country: string; education: string }) => void;
    onNotEligible: (reason: string) => void;
}

// Eligible countries (excluding USA, Europe, China, Japan, Korea, Canada, Saudi Arabia)
const ELIGIBLE_COUNTRIES = [
    'Afghanistan', 'Algeria', 'Angola', 'Argentina', 'Armenia', 'Azerbaijan',
    'Bahrain', 'Bangladesh', 'Benin', 'Bhutan', 'Bolivia', 'Botswana', 'Brazil',
    'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic',
    'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Djibouti',
    'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
    'Eswatini', 'Ethiopia', 'Fiji', 'Gabon', 'Gambia', 'Georgia', 'Ghana', 'Guatemala',
    'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'India', 'Indonesia', 'Iran',
    'Iraq', 'Jamaica', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos',
    'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives',
    'Mali', 'Mauritania', 'Mauritius', 'Mexico', 'Mongolia', 'Morocco', 'Mozambique',
    'Myanmar', 'Namibia', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Oman', 'Pakistan',
    'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Qatar',
    'Rwanda', 'Senegal', 'Sierra Leone', 'Somalia', 'Somaliland', 'South Africa', 'South Sudan',
    'Sri Lanka', 'Sudan', 'Suriname', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste',
    'Togo', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'United Arab Emirates', 'Uruguay',
    'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const EDUCATION_LEVELS = [
    'No formal education',
    'Primary education',
    'Secondary education (High School)',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate (PhD)'
];

export function EligibilityCheck({ darkMode, onEligible, onNotEligible }: EligibilityCheckProps) {
    const [age, setAge] = useState('');
    const [country, setCountry] = useState('');
    const [education, setEducation] = useState('');
    const [hasComputer, setHasComputer] = useState<boolean | null>(null);
    const [hasInternet, setHasInternet] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            // Check age (must be 19-31)
            const ageNum = parseInt(age);
            if (ageNum < 19) {
                onNotEligible('You must be at least 19 years old to apply.');
                setLoading(false);
                return;
            }
            if (ageNum > 31) {
                onNotEligible('This program is for students aged 19-31 years old.');
                setLoading(false);
                return;
            }

            // Check education (Master's or PhD not eligible)
            if (education === 'Master\'s Degree' || education === 'Doctorate (PhD)') {
                onNotEligible('This program is designed for students without advanced degrees. You already have a Master\'s or PhD.');
                setLoading(false);
                return;
            }

            // Check computer access
            if (!hasComputer) {
                onNotEligible('You need access to a computer to complete online certifications.');
                setLoading(false);
                return;
            }

            // Check internet access
            if (!hasInternet) {
                onNotEligible('You need reliable internet access to complete online certifications.');
                setLoading(false);
                return;
            }

            // All checks passed
            setLoading(false);
            onEligible({ age, country, education });
        }, 1000);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-2xl w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}
            >
                <div className="text-center mb-8">
                    <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Eligibility Check
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Please answer the following questions to check if you're eligible for this program.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Age */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            What is your age? *
                        </label>
                        <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                            min="19"
                            max="31"
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                }`}
                            placeholder="Enter your age (19-31)"
                        />
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            You must be between 19 and 31 years old
                        </p>
                    </div>

                    {/* Country */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Globe className="w-4 h-4 inline mr-2" />
                            Where are you currently located? *
                        </label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                }`}
                        >
                            <option value="">Select your country...</option>
                            {ELIGIBLE_COUNTRIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Note: USA, European countries, China, Japan, Korea, Canada, and Saudi Arabia are not eligible
                        </p>
                    </div>

                    {/* Education Level */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <GraduationCap className="w-4 h-4 inline mr-2" />
                            What is your highest level of education? *
                        </label>
                        <select
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                }`}
                        >
                            <option value="">Select...</option>
                            {EDUCATION_LEVELS.map((level) => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        {(education === 'Master\'s Degree' || education === 'Doctorate (PhD)') && (
                            <p className={`text-xs mt-1 text-red-500`}>
                                ⚠️ Students with Master's or PhD degrees are not eligible for this program
                            </p>
                        )}
                    </div>

                    {/* Computer Access */}
                    <div>
                        <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Monitor className="w-4 h-4 inline mr-2" />
                            Do you have access to a computer? *
                        </label>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${hasComputer === true
                                ? 'border-accent-orange bg-accent-orange/10'
                                : darkMode
                                    ? 'border-white/10 hover:border-white/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="computer"
                                    checked={hasComputer === true}
                                    onChange={() => setHasComputer(true)}
                                    className="sr-only"
                                    required
                                />
                                <div className="text-center">
                                    <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${hasComputer === true ? 'text-accent-orange' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Yes</span>
                                </div>
                            </label>
                            <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${hasComputer === false
                                ? 'border-red-500 bg-red-500/10'
                                : darkMode
                                    ? 'border-white/10 hover:border-white/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="computer"
                                    checked={hasComputer === false}
                                    onChange={() => setHasComputer(false)}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <XCircle className={`w-6 h-6 mx-auto mb-2 ${hasComputer === false ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Internet Access */}
                    <div>
                        <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Wifi className="w-4 h-4 inline mr-2" />
                            Do you have reliable internet access? *
                        </label>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${hasInternet === true
                                ? 'border-accent-orange bg-accent-orange/10'
                                : darkMode
                                    ? 'border-white/10 hover:border-white/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="internet"
                                    checked={hasInternet === true}
                                    onChange={() => setHasInternet(true)}
                                    className="sr-only"
                                    required
                                />
                                <div className="text-center">
                                    <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${hasInternet === true ? 'text-accent-orange' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Yes</span>
                                </div>
                            </label>
                            <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${hasInternet === false
                                ? 'border-red-500 bg-red-500/10'
                                : darkMode
                                    ? 'border-white/10 hover:border-white/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="internet"
                                    checked={hasInternet === false}
                                    onChange={() => setHasInternet(false)}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <XCircle className={`w-6 h-6 mx-auto mb-2 ${hasInternet === false ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Check Eligibility'}
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
