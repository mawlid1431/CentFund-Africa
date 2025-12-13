import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Eye, EyeOff, Sun, Moon } from 'lucide-react';

interface AdminLoginProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    onLogin: (success: boolean, userType: 'admin' | 'sponsor' | 'applicant', userData?: any) => void;
}

export function AdminLogin({ darkMode, toggleDarkMode, onLogin }: AdminLoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Get credentials from environment variables
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        // Sponsor credentials
        const sponsors = [
            {
                email: import.meta.env.VITE_SPONSOR1_EMAIL,
                password: import.meta.env.VITE_SPONSOR1_PASSWORD,
                name: import.meta.env.VITE_SPONSOR1_NAME,
            },
            {
                email: import.meta.env.VITE_SPONSOR2_EMAIL,
                password: import.meta.env.VITE_SPONSOR2_PASSWORD,
                name: import.meta.env.VITE_SPONSOR2_NAME,
            },
            {
                email: import.meta.env.VITE_SPONSOR3_EMAIL,
                password: import.meta.env.VITE_SPONSOR3_PASSWORD,
                name: import.meta.env.VITE_SPONSOR3_NAME,
            },
        ];

        // Applicant credentials
        const applicants = [
            {
                email: import.meta.env.VITE_USER1_EMAIL,
                password: import.meta.env.VITE_USER1_PASSWORD,
            },
            {
                email: import.meta.env.VITE_USER2_EMAIL,
                password: import.meta.env.VITE_USER2_PASSWORD,
            },
        ];

        // Debug: Log environment variables (remove in production)
        console.log('Admin Email:', adminEmail);
        console.log('Sponsor 1 Email:', import.meta.env.VITE_SPONSOR1_EMAIL);
        console.log('Entered Email:', username);

        setTimeout(() => {
            // Check if admin
            if (username === adminEmail && password === adminPassword) {
                localStorage.setItem('userType', 'admin');
                localStorage.setItem('userEmail', username);
                onLogin(true, 'admin');
                setIsLoading(false);
                return;
            }

            // Check if sponsor
            const sponsor = sponsors.find(s => s.email === username && s.password === password);
            if (sponsor) {
                console.log('Sponsor found:', sponsor);
                localStorage.setItem('userType', 'sponsor');
                localStorage.setItem('userEmail', username);
                localStorage.setItem('userName', sponsor.name);
                onLogin(true, 'sponsor', { name: sponsor.name, email: username });
                setIsLoading(false);
                return;
            }

            // Check if applicant
            const applicant = applicants.find(a => a.email === username && a.password === password);
            if (applicant) {
                localStorage.setItem('userType', 'applicant');
                localStorage.setItem('userEmail', username);
                onLogin(true, 'applicant', { email: username });
                setIsLoading(false);
                return;
            }

            // Invalid credentials
            console.log('No match found for:', username);
            setError('Invalid email or password');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 relative">
            {/* Dark Mode Toggle */}
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className={`absolute top-4 right-4 p-3 rounded-xl transition-all shadow-lg ${darkMode
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`w-full max-w-md p-8 rounded-2xl shadow-2xl ${darkMode
                    ? 'bg-[#0a1628] border border-white/10'
                    : 'bg-white border border-gray-200'
                    }`}
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-16 h-16 bg-gradient-to-br from-[#ff6f0f] to-[#ff8f3f] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#ff6f0f]/30"
                    >
                        <Lock className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        CentFund Africa
                    </h1>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Sign in as Admin, Sponsor, or Applicant
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email
                        </label>
                        <div className="relative">
                            <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all ${darkMode
                                    ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    }`}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Password
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all ${darkMode
                                    ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    }`}
                                placeholder="Enter password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Login Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] hover:from-[#ff8f3f] hover:to-[#ffa55f] shadow-lg shadow-[#ff6f0f]/30 hover:shadow-xl hover:shadow-[#ff6f0f]/40'
                            } text-white`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>
                </form>

                {/* Security Notice */}
                <div className={`mt-6 p-4 rounded-lg border ${darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                    <p className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'} text-center`}>
                        🔒 Secure Admin Access<br />
                        Credentials are stored securely in environment variables
                    </p>
                </div>
            </motion.div>
        </div>
    );
}