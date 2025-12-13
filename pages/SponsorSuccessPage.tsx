import { motion } from 'motion/react';
import { CheckCircle, Download, Home, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SponsorSuccessPageProps {
    darkMode: boolean;
    onNavigate: (page: string) => void;
}

export function SponsorSuccessPage({ darkMode, onNavigate }: SponsorSuccessPageProps) {
    const [confetti, setConfetti] = useState(true);
    const selectedProject = JSON.parse(sessionStorage.getItem('selectedProject') || '{}');
    const sponsorAmount = sessionStorage.getItem('sponsorAmount') || '0';
    const sponsorName = sessionStorage.getItem('sponsorName') || 'Sponsor';

    useEffect(() => {
        setTimeout(() => setConfetti(false), 3000);
    }, []);

    return (
        <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            {confetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 1 }}
                            animate={{ y: window.innerHeight + 20, opacity: 0 }}
                            transition={{ duration: 3, delay: Math.random() * 0.5 }}
                            className="absolute w-2 h-2 bg-accent-orange rounded-full"
                        />
                    ))}
                </div>
            )}

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}
                    >
                        Application Submitted Successfully!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`text-lg ${darkMode ? 'text-white/70' : 'text-gray-600'}`}
                    >
                        Thank you for your generous sponsorship, {sponsorName}!
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`rounded-2xl p-8 mb-8 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'
                        }`}
                >
                    <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                        Sponsorship Summary
                    </h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                            <span className={darkMode ? 'text-white/70' : 'text-gray-600'}>Project</span>
                            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                                {selectedProject.name}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                            <span className={darkMode ? 'text-white/70' : 'text-gray-600'}>Sponsorship Amount</span>
                            <span className="font-bold text-2xl text-accent-orange">${sponsorAmount}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/10">
                            <span className={darkMode ? 'text-white/70' : 'text-gray-600'}>Application ID</span>
                            <span className={`font-mono ${darkMode ? 'text-white' : 'text-black'}`}>
                                SPNSR-{Date.now().toString().slice(-8)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={darkMode ? 'text-white/70' : 'text-gray-600'}>Status</span>
                            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                Under Review
                            </span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={`rounded-2xl p-8 mb-8 ${darkMode ? 'bg-gradient-to-r from-accent-orange/20 to-accent-orange-light/20 border border-accent-orange/30' : 'bg-gradient-to-r from-accent-orange/10 to-accent-orange-light/10 border border-accent-orange/20'
                        }`}
                >
                    <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        What Happens Next?
                    </h3>
                    <ul className="space-y-3">
                        {[
                            'Our team will review your application within 2-3 business days',
                            'You will receive an email confirmation with payment instructions',
                            'Once payment is confirmed, you will be matched with a student',
                            'You will receive regular updates on your sponsored student\'s progress',
                            'Upon completion, you will receive a certificate of sponsorship',
                        ].map((step, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-0.5" />
                                <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>{step}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('home')}
                        className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Home</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 border transition-all ${darkMode
                                ? 'border-white/20 text-white hover:bg-white/10'
                                : 'border-gray-300 text-black hover:bg-gray-100'
                            }`}
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Receipt</span>
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="mt-8 text-center"
                >
                    <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                        Questions? Contact us at{' '}
                        <a href="mailto:sponsors@centfundafrica.org" className="text-accent-orange hover:underline">
                            sponsors@centfundafrica.org
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
