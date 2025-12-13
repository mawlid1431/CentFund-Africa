import { motion } from 'motion/react';
import { CheckCircle, XCircle, ArrowRight, Shield, DollarSign, FileText, Users } from 'lucide-react';
import { useState } from 'react';

interface SponsorRequirementsPageProps {
    darkMode: boolean;
    onNavigate: (page: string) => void;
}

export function SponsorRequirementsPage({ darkMode, onNavigate }: SponsorRequirementsPageProps) {
    const [checkedRequirements, setCheckedRequirements] = useState<number[]>([]);

    const requirements = [
        {
            id: 1,
            title: 'Minimum Age Requirement',
            description: 'Must be 18 years or older',
            icon: Users,
        },
        {
            id: 2,
            title: 'Financial Capacity',
            description: 'Ability to sponsor at least $100 per certification',
            icon: DollarSign,
        },
        {
            id: 3,
            title: 'Valid Identification',
            description: 'Government-issued ID or passport',
            icon: Shield,
        },
        {
            id: 4,
            title: 'Documentation',
            description: 'Willing to complete sponsor agreement form',
            icon: FileText,
        },
    ];

    const toggleRequirement = (id: number) => {
        setCheckedRequirements(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const allChecked = checkedRequirements.length === requirements.length;

    return (
        <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.span
                        className="inline-block px-4 py-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange mb-4"
                    >
                        Step 1 of 4
                    </motion.span>
                    <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        Sponsor Requirements
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Please review and confirm you meet all requirements to become a sponsor
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`rounded-2xl p-8 mb-8 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'}`}
                >
                    <div className="space-y-6">
                        {requirements.map((req, index) => (
                            <motion.div
                                key={req.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${checkedRequirements.includes(req.id)
                                        ? 'border-accent-orange bg-accent-orange/5'
                                        : darkMode
                                            ? 'border-white/10 hover:border-white/20'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => toggleRequirement(req.id)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${checkedRequirements.includes(req.id)
                                            ? 'bg-accent-orange text-white'
                                            : darkMode
                                                ? 'bg-white/10 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        <req.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                            {req.title}
                                        </h3>
                                        <p className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                                            {req.description}
                                        </p>
                                    </div>
                                    <div>
                                        {checkedRequirements.includes(req.id) ? (
                                            <CheckCircle className="w-6 h-6 text-accent-orange" />
                                        ) : (
                                            <XCircle className={`w-6 h-6 ${darkMode ? 'text-white/30' : 'text-gray-300'}`} />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onNavigate('home')}
                        className={`px-8 py-4 rounded-xl border transition-all ${darkMode
                                ? 'border-white/20 text-white hover:bg-white/10'
                                : 'border-gray-300 text-black hover:bg-gray-100'
                            }`}
                    >
                        Go Back
                    </motion.button>
                    <motion.button
                        whileHover={allChecked ? { scale: 1.05 } : {}}
                        whileTap={allChecked ? { scale: 0.95 } : {}}
                        onClick={() => allChecked && onNavigate('sponsor-auth')}
                        disabled={!allChecked}
                        className={`px-8 py-4 rounded-xl flex items-center gap-3 transition-all ${allChecked
                                ? 'bg-gradient-to-r from-accent-orange to-accent-orange-light text-white shadow-lg'
                                : darkMode
                                    ? 'bg-white/10 text-white/50 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <span>Continue to Login</span>
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
