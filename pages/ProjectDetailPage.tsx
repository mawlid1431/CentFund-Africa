import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle, DollarSign, Calendar, Users, Award, AlertCircle } from 'lucide-react';
import { DecorativeElements } from '../components/DecorativeElements';

interface ProjectDetailPageProps {
    darkMode: boolean;
    projectId: string;
    onNavigate: (page: string) => void;
}

export function ProjectDetailPage({ darkMode, projectId, onNavigate }: ProjectDetailPageProps) {
    const [currentStep, setCurrentStep] = useState<'details' | 'eligibility' | 'auth' | 'application'>('details');
    const [isEligible, setIsEligible] = useState(false);
    const [eligibilityData, setEligibilityData] = useState({
        age: '',
        education: '',
        location: '',
        hasComputer: '',
        hasInternet: '',
    });

    // Mock project data - TODO: Load from Supabase
    const project = {
        id: projectId,
        title: 'AWS Cloud Practitioner',
        description: 'Beginner-level cloud certification to build tech careers. Learn AWS fundamentals and cloud concepts.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        price: 300,
        duration: '3 months',
        requirements: [
            'Age 18-35',
            'High school diploma or equivalent',
            'Basic computer skills',
            'Access to internet',
            'Resident of Somaliland',
        ],
        benefits: [
            'Full certification cost covered',
            'Study materials provided',
            'Mentorship support',
            'Job placement assistance',
        ],
    };

    const handleEligibilitySubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check eligibility criteria
        const age = parseInt(eligibilityData.age);
        const eligible =
            age >= 18 &&
            age <= 35 &&
            eligibilityData.education !== '' &&
            eligibilityData.location.toLowerCase().includes('somaliland') &&
            eligibilityData.hasComputer === 'yes' &&
            eligibilityData.hasInternet === 'yes';

        setIsEligible(eligible);

        if (eligible) {
            setCurrentStep('auth');
        } else {
            alert('Unfortunately, you do not meet the eligibility criteria for this program.');
        }
    };

    const handleAuthChoice = (choice: 'login' | 'create') => {
        if (choice === 'login') {
            // Redirect to login with return URL
            localStorage.setItem('returnToApplication', projectId);
            onNavigate('admin');
        } else {
            // Show create account form
            setCurrentStep('application');
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-[#0a1628]' : 'bg-white'}`}>
            {/* Header */}
            <section className={`relative py-20 overflow-hidden ${darkMode ? 'bg-gradient-to-r from-[#0a1628] to-[#0a1628]' : 'bg-gradient-to-r from-[#0a1628] to-[#2a4f7f]'}`}>
                <DecorativeElements />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: -5 }}
                        onClick={() => onNavigate('projects')}
                        className="flex items-center gap-2 text-white mb-8 hover:text-[#ff6f0f] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Projects
                    </motion.button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-white text-4xl font-bold mb-4">{project.title}</h1>
                            <p className="text-white/80 text-lg mb-6">{project.description}</p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-[#ff6f0f]" />
                                    <span className="text-white">${project.price}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                    <Calendar className="w-5 h-5 text-[#ff6f0f]" />
                                    <span className="text-white">{project.duration}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className={`py-16 ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatePresence mode="wait">
                        {currentStep === 'details' && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Requirements */}
                                <div className={`p-8 rounded-2xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}>
                                    <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <AlertCircle className="w-6 h-6 text-[#ff6f0f]" />
                                        Eligibility Requirements
                                    </h2>
                                    <ul className="space-y-3">
                                        {project.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Benefits */}
                                <div className={`p-8 rounded-2xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}>
                                    <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <Award className="w-6 h-6 text-[#ff6f0f]" />
                                        What You'll Get
                                    </h2>
                                    <ul className="space-y-3">
                                        {project.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-[#ff6f0f] mt-0.5 flex-shrink-0" />
                                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Apply Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setCurrentStep('eligibility')}
                                    className="w-full bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                                >
                                    Check Eligibility & Apply
                                </motion.button>
                            </motion.div>
                        )}

                        {currentStep === 'eligibility' && (
                            <motion.div
                                key="eligibility"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`p-8 rounded-2xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}
                            >
                                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Eligibility Check
                                </h2>
                                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Please answer the following questions to check if you're eligible for this program.
                                </p>

                                <form onSubmit={handleEligibilitySubmit} className="space-y-6">
                                    {/* Age */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            What is your age? *
                                        </label>
                                        <input
                                            type="number"
                                            value={eligibilityData.age}
                                            onChange={(e) => setEligibilityData({ ...eligibilityData, age: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                                    ? 'bg-[#0a1628] border-white/10 text-white focus:border-[#ff6f0f]'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#ff6f0f]'
                                                }`}
                                            required
                                            min="1"
                                            max="100"
                                        />
                                    </div>

                                    {/* Education */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            What is your highest level of education? *
                                        </label>
                                        <select
                                            value={eligibilityData.education}
                                            onChange={(e) => setEligibilityData({ ...eligibilityData, education: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                                    ? 'bg-[#0a1628] border-white/10 text-white focus:border-[#ff6f0f]'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#ff6f0f]'
                                                }`}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            <option value="high-school">High School</option>
                                            <option value="diploma">Diploma</option>
                                            <option value="bachelors">Bachelor's Degree</option>
                                            <option value="masters">Master's Degree</option>
                                        </select>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Where are you currently located? *
                                        </label>
                                        <input
                                            type="text"
                                            value={eligibilityData.location}
                                            onChange={(e) => setEligibilityData({ ...eligibilityData, location: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                                    ? 'bg-[#0a1628] border-white/10 text-white focus:border-[#ff6f0f]'
                                                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#ff6f0f]'
                                                }`}
                                            placeholder="e.g., Hargeisa, Somaliland"
                                            required
                                        />
                                    </div>

                                    {/* Computer Access */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Do you have access to a computer? *
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="hasComputer"
                                                    value="yes"
                                                    checked={eligibilityData.hasComputer === 'yes'}
                                                    onChange={(e) => setEligibilityData({ ...eligibilityData, hasComputer: e.target.value })}
                                                    required
                                                />
                                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="hasComputer"
                                                    value="no"
                                                    checked={eligibilityData.hasComputer === 'no'}
                                                    onChange={(e) => setEligibilityData({ ...eligibilityData, hasComputer: e.target.value })}
                                                />
                                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Internet Access */}
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Do you have reliable internet access? *
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="hasInternet"
                                                    value="yes"
                                                    checked={eligibilityData.hasInternet === 'yes'}
                                                    onChange={(e) => setEligibilityData({ ...eligibilityData, hasInternet: e.target.value })}
                                                    required
                                                />
                                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="hasInternet"
                                                    value="no"
                                                    checked={eligibilityData.hasInternet === 'no'}
                                                    onChange={(e) => setEligibilityData({ ...eligibilityData, hasInternet: e.target.value })}
                                                />
                                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setCurrentStep('details')}
                                            className={`flex-1 px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                                }`}
                                        >
                                            Back
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-6 py-3 rounded-lg font-medium"
                                        >
                                            Check Eligibility
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {currentStep === 'auth' && isEligible && (
                            <motion.div
                                key="auth"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`p-8 rounded-2xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Congratulations! You're Eligible
                                    </h2>
                                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                                        You meet all the requirements for this program. Let's continue with your application.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAuthChoice('login')}
                                        className={`w-full p-6 rounded-xl border-2 transition-all ${darkMode ? 'border-white/10 hover:border-[#ff6f0f] bg-white/5' : 'border-gray-200 hover:border-[#ff6f0f] bg-white'
                                            }`}
                                    >
                                        <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Already have an account?
                                        </h3>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Login to continue your application
                                        </p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAuthChoice('create')}
                                        className="w-full p-6 rounded-xl bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white"
                                    >
                                        <h3 className="text-lg font-bold mb-2">
                                            New applicant?
                                        </h3>
                                        <p className="text-sm text-white/80">
                                            Create an account and complete your application
                                        </p>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
