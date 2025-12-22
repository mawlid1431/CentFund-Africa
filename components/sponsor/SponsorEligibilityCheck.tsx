import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, ArrowRight, DollarSign, Heart, Users, Building } from 'lucide-react';

interface SponsorEligibilityCheckProps {
    darkMode: boolean;
    onEligible: (data: EligibilityData) => void;
    onNotEligible: (reason: string) => void;
}

interface EligibilityData {
    age: string;
    sponsorType: string;
    financialCapability: string;
    motivation: string;
}

export function SponsorEligibilityCheck({ darkMode, onEligible, onNotEligible }: SponsorEligibilityCheckProps) {
    const [age, setAge] = useState('');
    const [sponsorType, setSponsorType] = useState('');
    const [financialCapability, setFinancialCapability] = useState('');
    const [motivation, setMotivation] = useState('');
    const [commitmentDuration, setCommitmentDuration] = useState('');
    const [hasSponsored, setHasSponsored] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            // Check age (must be 21+)
            const ageNum = parseInt(age);
            if (ageNum < 21) {
                onNotEligible('Sponsors must be at least 21 years old.');
                setLoading(false);
                return;
            }

            // Check financial capability
            if (financialCapability === 'no') {
                onNotEligible('You must have the financial capability to sponsor at least one student certification.');
                setLoading(false);
                return;
            }

            // Check commitment duration
            if (commitmentDuration === 'none') {
                onNotEligible('We require sponsors who can commit to supporting students through their certification journey.');
                setLoading(false);
                return;
            }

            // All checks passed
            setLoading(false);
            onEligible({
                age,
                sponsorType,
                financialCapability,
                motivation
            });
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
                    <Heart className="w-16 h-16 text-accent-orange mx-auto mb-4" />
                    <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Become a Sponsor
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Please answer the following questions to check if you're eligible to sponsor students.
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
                            min="1"
                            max="120"
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                }`}
                            placeholder="Enter your age"
                        />
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Sponsors must be at least 21 years old
                        </p>
                    </div>

                    {/* Sponsor Type */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Users className="w-4 h-4 inline mr-2" />
                            Are you sponsoring as an individual or organization? *
                        </label>
                        <select
                            value={sponsorType}
                            onChange={(e) => setSponsorType(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                }`}
                        >
                            <option value="">Select...</option>
                            <option value="individual">Individual</option>
                            <option value="organization">Organization/Company</option>
                            <option value="foundation">Foundation/NGO</option>
                        </select>
                    </div>

                    {/* Financial Capability */}
                    <div>
                        <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <DollarSign className="w-4 h-4 inline mr-2" />
                            Do you have the financial capability to sponsor at least one student certification? *
                        </label>
                        <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Certification costs typically range from $200 - $500 per student
                        </p>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${financialCapability === 'yes'
                                ? 'border-accent-orange bg-accent-orange/10'
                                : darkMode
                                    ? 'border-white/10 hover:border-white/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="financial"
                                    value="yes"
                                    checked={financialCapability === 'yes'}
                                    onChange={(e) => setFinancialCapability(e.target.value)}
                                    className="sr-only"
                                    required
                                />
                                <div className="text-center">
                                    <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${financialCapability === 'yes' ? 'text-accent-orange' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Yes</span>
                                </div>
                            </label>
                            <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${financialCapability === 'no'
                                ? 'border-red-500 bg-red-500/10'
                                : darkMode
                                    ? 'border-white/10 hover:border-white/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="financial"
                                    value="no"
                                    checked={financialCapability === 'no'}
                                    onChange={(e) => setFinancialCapability(e.target.value)}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <XCircle className={`w-6 h-6 mx-auto mb-2 ${financialCapability === 'no' ? 'text-red-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Commitment Duration */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            How long can you commit to supporting students? *
                        </label>
                        <select
                            value={commitmentDuration}
                            onChange={(e) => setCommitmentDuration(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                }`}
                        >
                            <option value="">Select...</option>
                            <option value="3-6months">3-6 months (One certification)</option>
                            <option value="6-12months">6-12 months (Multiple certifications)</option>
                            <option value="1year+">1+ year (Long-term support)</option>
                            <option value="none">Cannot commit</option>
                        </select>
                    </div>

                    {/* Previous Sponsorship */}
                    <div>
                        <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Have you sponsored students or educational programs before?
                        </label>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${hasSponsored === true
                                ? 'border-accent-orange bg-accent-orange/10'
                                : darkMode
                                    ? 'border-white/10 hover:border-white/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="sponsored"
                                    checked={hasSponsored === true}
                                    onChange={() => setHasSponsored(true)}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${hasSponsored === true ? 'text-accent-orange' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Yes</span>
                                </div>
                            </label>
                            <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${hasSponsored === false
                                ? 'border-accent-orange bg-accent-orange/10'
                                : darkMode
                                    ? 'border-white/10 hover:border-white/20'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="sponsored"
                                    checked={hasSponsored === false}
                                    onChange={() => setHasSponsored(false)}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <Building className={`w-6 h-6 mx-auto mb-2 ${hasSponsored === false ? 'text-accent-orange' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>No, First Time</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Motivation */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Why do you want to sponsor students? *
                        </label>
                        <textarea
                            value={motivation}
                            onChange={(e) => setMotivation(e.target.value)}
                            required
                            rows={4}
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-accent-orange'
                                }`}
                            placeholder="Share your motivation for sponsoring students..."
                        />
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Minimum 50 characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || motivation.length < 50}
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
