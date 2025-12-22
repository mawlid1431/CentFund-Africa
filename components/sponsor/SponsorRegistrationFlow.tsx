import { useState } from 'react';
import { SponsorEligibilityCheck } from './SponsorEligibilityCheck';
import { CompleteSponsorRegistration } from './CompleteSponsorRegistration';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

interface SponsorRegistrationFlowProps {
    darkMode: boolean;
    onComplete: () => void;
}

type FlowStep = 'eligibility' | 'result' | 'register' | 'pending';

interface EligibilityData {
    age: string;
    sponsorType: string;
    financialCapability: string;
    motivation: string;
}

export function SponsorRegistrationFlow({ darkMode, onComplete }: SponsorRegistrationFlowProps) {
    const [step, setStep] = useState<FlowStep>('eligibility');
    const [isEligible, setIsEligible] = useState(false);
    const [notEligibleReason, setNotEligibleReason] = useState('');
    const [eligibilityData, setEligibilityData] = useState<EligibilityData>({
        age: '',
        sponsorType: '',
        financialCapability: '',
        motivation: ''
    });
    const [registeredEmail, setRegisteredEmail] = useState('');

    const handleEligible = (data: EligibilityData) => {
        setIsEligible(true);
        setEligibilityData(data);
        setStep('result');
        setTimeout(() => setStep('register'), 2000);
    };

    const handleNotEligible = (reason: string) => {
        setIsEligible(false);
        setNotEligibleReason(reason);
        setStep('result');
    };

    const handleRegistrationSuccess = (userId: string, email: string, name: string) => {
        setRegisteredEmail(email);
        setStep('pending');
    };

    if (step === 'eligibility') {
        return (
            <SponsorEligibilityCheck
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
                                Great! You're Eligible
                            </h2>
                            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Thank you for your interest in sponsoring students. Let's create your account.
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
                            <button
                                onClick={onComplete}
                                className="mt-6 px-6 py-3 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white rounded-lg font-medium"
                            >
                                Back to Home
                            </button>
                        </>
                    )}
                </motion.div>
            </div>
        );
    }

    if (step === 'register') {
        return (
            <CompleteSponsorRegistration
                darkMode={darkMode}
                eligibilityData={eligibilityData}
                onSuccess={handleRegistrationSuccess}
            />
        );
    }

    if (step === 'pending') {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`max-w-lg w-full p-8 rounded-2xl ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'} shadow-2xl text-center`}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                    </motion.div>
                    <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Account Pending Approval
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                        Thank you for registering as a sponsor! Your account has been created successfully.
                    </p>

                    <div className={`p-6 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'} mb-6`}>
                        <Mail className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Our admin team will review your application. You'll receive an email at:
                        </p>
                        <p className={`text-lg font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {registeredEmail}
                        </p>
                        <p className={`text-sm mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Once approved, you can login and start sponsoring students.
                        </p>
                    </div>

                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-yellow-50 border border-yellow-200'} mb-6`}>
                        <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                            <strong>Important:</strong> You cannot login until your account is approved by an administrator.
                        </p>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full py-3 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white rounded-lg font-medium"
                    >
                        Back to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return null;
}
