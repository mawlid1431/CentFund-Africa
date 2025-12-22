import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

interface SponsorLoginProps {
    darkMode: boolean;
    onSuccess: (userId: string, email: string, name: string) => void;
    onRegister: () => void;
}

export function SponsorLogin({ darkMode, onSuccess, onRegister }: SponsorLoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Attempt to sign in
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            if (!authData.user) {
                throw new Error('Login failed');
            }

            // 2. Check if user is a sponsor and if approved
            const { data: sponsor, error: sponsorError } = await supabase
                .from('sponsor_users')
                .select('full_name, account_status, approval_status')
                .eq('id', authData.user.id)
                .single();

            if (sponsorError) {
                // User exists but not a sponsor
                await supabase.auth.signOut();
                throw new Error('This account is not registered as a sponsor');
            }

            // 3. Check approval status
            if (sponsor.approval_status !== 'approved' || sponsor.account_status !== 'approved') {
                await supabase.auth.signOut();

                if (sponsor.account_status === 'rejected') {
                    throw new Error('Your sponsor account application was rejected. Please contact support for more information.');
                } else if (sponsor.account_status === 'suspended') {
                    throw new Error('Your sponsor account has been suspended. Please contact support.');
                } else {
                    throw new Error('Your sponsor account is pending approval. Please wait for admin approval before logging in.');
                }
            }

            // 4. Success - sponsor is approved
            onSuccess(authData.user.id, email, sponsor.full_name);

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-md w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}
            >
                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Sponsor Login
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Login to manage your sponsorships
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                Login
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Don't have an account?{' '}
                        <button
                            onClick={onRegister}
                            className="text-accent-orange hover:text-accent-orange-light font-medium"
                        >
                            Register as Sponsor
                        </button>
                    </p>
                </div>

                <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                        <strong>Note:</strong> You can only login after your sponsor account has been approved by an administrator.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
