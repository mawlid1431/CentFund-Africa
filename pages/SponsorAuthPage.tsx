import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SponsorAuthPageProps {
    darkMode: boolean;
    onNavigate: (page: string) => void;
}

export function SponsorAuthPage({ darkMode, onNavigate }: SponsorAuthPageProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin && formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Store sponsor info in session
        sessionStorage.setItem('sponsorEmail', formData.email);
        sessionStorage.setItem('sponsorName', formData.name || formData.email);

        toast.success(isLogin ? 'Login successful!' : 'Account created successfully!');
        onNavigate('sponsor-dashboard');
    };

    return (
        <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <motion.span
                        className="inline-block px-4 py-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange mb-4"
                    >
                        Step 2 of 4
                    </motion.span>
                    <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        {isLogin ? 'Login' : 'Create Account'}
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        {isLogin ? 'Welcome back!' : 'Join us as a sponsor'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-2xl p-8 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'}`}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                            }`}
                                        placeholder="John Doe"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                Email Address
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
                                    placeholder="sponsor@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                            ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                            : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                        }`}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                            }`}
                                        placeholder="••••••••"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg"
                        >
                            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                            <span>{isLogin ? 'Login' : 'Create Account'}</span>
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className={`text-sm ${darkMode ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                        >
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <span className="text-accent-orange font-semibold">
                                {isLogin ? 'Sign Up' : 'Login'}
                            </span>
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-center"
                >
                    <button
                        onClick={() => onNavigate('sponsor-requirements')}
                        className={`text-sm ${darkMode ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-black'}`}
                    >
                        ← Back to Requirements
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
