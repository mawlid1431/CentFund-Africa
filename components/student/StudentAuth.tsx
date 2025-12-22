import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, MapPin, Calendar, Eye, EyeOff, ArrowRight, LogIn, UserPlus, Upload, Image as ImageIcon, Globe, GraduationCap, FileText } from 'lucide-react';

interface StudentAuthProps {
    darkMode: boolean;
    onAuthSuccess: (userId: string, email: string, name: string, needsQuiz: boolean) => void;
    eligibilityData?: {
        age: string;
        country: string;
        education: string;
    };
}

export function StudentAuth({ darkMode, onAuthSuccess, eligibilityData }: StudentAuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Registration form
    const [regFullName, setRegFullName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regDateOfBirth, setRegDateOfBirth] = useState('');
    const [regNationality, setRegNationality] = useState(eligibilityData?.country || '');
    const [regResidentCountry, setRegResidentCountry] = useState(eligibilityData?.country || '');
    const [regCity, setRegCity] = useState('');
    const [regAddress, setRegAddress] = useState('');
    const [regEducationLevel, setRegEducationLevel] = useState(eligibilityData?.education || '');
    const [regIdDocument, setRegIdDocument] = useState<File | null>(null);
    const [regIdPreview, setRegIdPreview] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Implement Supabase authentication
        // Check if user exists and password matches
        // Check if user has passed eligibility quiz

        setTimeout(() => {
            // Mock login - replace with actual Supabase auth
            if (loginEmail && loginPassword) {
                // Check if user needs to take quiz
                const needsQuiz = false; // TODO: Check user_eligibility table
                onAuthSuccess('user-id-123', loginEmail, 'Student Name', needsQuiz);
            } else {
                alert('Invalid credentials');
            }
            setLoading(false);
        }, 1000);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (regPassword !== regConfirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (regPassword.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        // TODO: Implement Supabase registration
        // 1. Create user in auth.users
        // 2. Insert into users table with role='applicant'
        // 3. Create entry in user_eligibility with quiz_passed=false

        setTimeout(() => {
            // Mock registration - replace with actual Supabase
            alert('Account created successfully! Please take the eligibility quiz.');
            // New users always need to take quiz
            onAuthSuccess('new-user-id', regEmail, regFullName, true);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-md w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}
            >
                {/* Toggle Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${isLogin
                            ? 'bg-gradient-to-r from-accent-orange to-accent-orange-light text-white'
                            : darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        <LogIn className="w-5 h-5 inline mr-2" />
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${!isLogin
                            ? 'bg-gradient-to-r from-accent-orange to-accent-orange-light text-white'
                            : darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        <UserPlus className="w-5 h-5 inline mr-2" />
                        Register
                    </button>
                </div>

                {isLogin ? (
                    /* LOGIN FORM */
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Welcome Back!
                            </h2>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Login to track your applications
                            </p>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </form>
                ) : (
                    /* REGISTRATION FORM */
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Create Account
                            </h2>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Register to apply for certification programs
                            </p>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    value={regFullName}
                                    onChange={(e) => setRegFullName(e.target.value)}
                                    required
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="email"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                    required
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="your.email@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Phone Number *
                            </label>
                            <div className="relative">
                                <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="tel"
                                    value={regPhone}
                                    onChange={(e) => setRegPhone(e.target.value)}
                                    required
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="+252 61 234 5678"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={regCity}
                                    onChange={(e) => setRegCity(e.target.value)}
                                    required
                                    className={`w-full px-3 py-2.5 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="Hargeisa"
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    value={regCountry}
                                    onChange={(e) => setRegCountry(e.target.value)}
                                    required
                                    className={`w-full px-3 py-2.5 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="Somalia"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Date of Birth *
                            </label>
                            <div className="relative">
                                <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="date"
                                    value={regDateOfBirth}
                                    onChange={(e) => setRegDateOfBirth(e.target.value)}
                                    required
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className={`w-full pl-10 pr-12 py-2.5 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="Min. 8 characters"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={regConfirmPassword}
                                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                                    required
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border transition-all ${darkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                        : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                        }`}
                                    placeholder="Re-enter password"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-6"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            After registration, you'll need to pass an eligibility quiz
                        </p>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
