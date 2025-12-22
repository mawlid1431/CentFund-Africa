import { useState } from 'react';
import { EligibilityCheck } from './EligibilityCheck';
import { CompleteRegistration } from './CompleteRegistration';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, LogIn } from 'lucide-react';
import { supabase } from '../../utils/supabase/client';

interface StudentRegistrationFlowProps {
    darkMode: boolean;
    onComplete: (userId: string, email: string, name: string) => void;
}

type FlowStep = 'eligibility' | 'result' | 'choice' | 'login' | 'register' | 'success';

export function StudentRegistrationFlow({ darkMode, onComplete }: StudentRegistrationFlowProps) {
    const [step, setStep] = useState<FlowStep>('eligibility');
    const [isEligible, setIsEligible] = useState(false);
    const [notEligibleReason, setNotEligibleReason] = useState('');
    const [eligibilityData, setEligibilityData] = useState({
        age: '',
        country: '',
        education: ''
    });

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleEligible = (data: { age: string; country: string; education: string }) => {
        setIsEligible(true);
        setEligibilityData(data);
        setStep('result');
        setTimeout(() => setStep('choice'), 2000);
    };

    const handleNotEligible = (reason: string) => {
        setIsEligible(false);
        setNotEligibleReason(reason);
        setStep('result');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });

            if (error) throw error;

            if (data.user) {
                // Get student profile
                const { data: student, error: studentError } = await supabase
                    .from('students')
                    .select('full_name')
                    .eq('id', data.user.id)
                    .single();

                if (studentError) throw studentError;

                onComplete(data.user.id, loginEmail, student?.full_name || 'Student');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setLoginError(err.message || 'Invalid email or password');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegistrationSuccess = (userId: string, email: string, name: string) => {
        setStep('success');
        setTimeout(() => {
            onComplete(userId, email, name);
        }, 2000);
    };

    if (step === 'eligibility') {
        return (
            <EligibilityCheck
                darkMode={darkMode}
                onEligible={handleEligible}
                onNotEligible={handleNotEligible}
            />
        );
    }

    if (step === 'result') {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-md w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl text-center`}
                >
                    {isEligible ? (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                            >
                                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                            </motion.div>
                            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Congratulations! You're Eligible
                            </h2>
                            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                You meet all the requirements for this program. Let's continue with your application.
                            </p>
                        </>
                    ) : (
                        <>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                            >
                                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                            </motion.div>
                            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Not Eligible
                            </h2>
                            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {notEligibleReason}
                            </p>
                        </>
                    )}
                </motion.div>
            </div>
        );
    }

    if (step === 'choice') {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-2xl w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}
                >
                    <div className="text-center mb-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Congratulations! You're Eligible
                        </h2>
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            You meet all the requirements for this program. Let's continue with your application.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Already have account */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep('login')}
                            className={`w-full p-6 rounded-xl border-2 transition-all ${darkMode
                                ? 'border-white/10 hover:border-white/20 bg-white/5'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <LogIn className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                <div className="text-left">
                                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Already have an account?
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Login to continue your application
                                    </p>
                                </div>
                            </div>
                        </motion.button>

                        {/* New applicant */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep('register')}
                            className="w-full p-6 rounded-xl bg-gradient-to-r from-accent-orange to-accent-orange-light text-white"
                        >
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-8 h-8" />
                                <div className="text-left">
                                    <h3 className="text-xl font-semibold">
                                        New applicant?
                                    </h3>
                                    <p className="text-sm text-white/90">
                                        Create an account and complete your application
                                    </p>
                                </div>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (step === 'login') {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-md w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl`}
                >
                    <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Welcome Back!
                    </h2>
                    <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Login to continue your application
                    </p>

                    {loginError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                    ? 'bg-white/5 border-white/10 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                                className={`w-full px-4 py-3 rounded-lg border ${darkMode
                                    ? 'bg-white/5 border-white/10 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                placeholder="Enter your password"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loginLoading}
                            className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all ${loginLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loginLoading ? 'Logging in...' : 'Login'}
                        </motion.button>

                        <button
                            type="button"
                            onClick={() => setStep('choice')}
                            className={`w-full text-center text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            ← Back to options
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    if (step === 'register') {
        return (
            <CompleteRegistration
                darkMode={darkMode}
                eligibilityData={eligibilityData}
                onSuccess={handleRegistrationSuccess}
            />
        );
    }

    if (step === 'success') {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-md w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl text-center`}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Account Created Successfully!
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Redirecting to your dashboard...
                    </p>
                </motion.div>
            </div>
        );
    }

    return null;
}
