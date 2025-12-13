import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, Loader, Play, CheckCircle, Circle, User, FileText, Upload, ClipboardList, Send, AlertCircle, Lock, Mail } from 'lucide-react';
import { getProjectById } from '@/utils/supabase/helpers';

interface Project {
    id: string;
    name: string;
    description: string;
    image: string;
    date: string;
    created_at: string;
    video_url: string | null;
}

interface ProjectDetailPageProps {
    darkMode: boolean;
    projectId: string;
    onNavigate: (page: string) => void;
}

export function ProjectDetailPage({ darkMode, projectId, onNavigate }: ProjectDetailPageProps) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [applicationStep, setApplicationStep] = useState(0);
    const [isEligible, setIsEligible] = useState<boolean | null>(null);
    const [hasAccount, setHasAccount] = useState<boolean | null>(null);

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const loadProject = async () => {
        setLoading(true);
        try {
            const data = await getProjectById(projectId);
            if (data) {
                setProject(data);
            }
        } catch (error) {
            console.error('Error loading project from database:', error);
            // Fallback to hardcoded projects
            const hardcodedProjects = [
                {
                    id: '1',
                    name: 'AWS Cloud Practitioner',
                    description: 'Beginner-level cloud certification to build tech careers. Learn AWS fundamentals and cloud concepts.\n\nThis certification validates your understanding of AWS Cloud, independent of specific technical roles. You will learn about AWS Cloud concepts, AWS services, security, architecture, pricing, and support.',
                    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
                    date: 'Open',
                    created_at: new Date().toISOString(),
                    video_url: null,
                },
                {
                    id: '2',
                    name: 'CCNA Networking Certification',
                    description: 'Learn networking fundamentals and advanced skills. Perfect for IT enthusiasts and aspiring network engineers.\n\nCisco Certified Network Associate (CCNA) certification validates your ability to install, configure, operate, and troubleshoot medium-size routed and switched networks.',
                    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
                    date: 'Open',
                    created_at: new Date().toISOString(),
                    video_url: null,
                },
                {
                    id: '3',
                    name: 'IELTS Certification',
                    description: 'Improve English language skills for global opportunities. Achieve your target score for university admission.\n\nThe International English Language Testing System (IELTS) measures the language proficiency of people who want to study or work where English is used as a language of communication.',
                    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
                    date: 'Open',
                    created_at: new Date().toISOString(),
                    video_url: null,
                },
                {
                    id: '4',
                    name: 'CompTIA A+ Certification',
                    description: 'Essential IT certification covering hardware, software, and troubleshooting. Start your IT career today.\n\nCompTIA A+ is the industry standard for launching IT careers into today\'s digital world. It is the only industry recognized credential with performance testing to prove pros can think on their feet.',
                    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
                    date: 'Open',
                    created_at: new Date().toISOString(),
                    video_url: null,
                },
                {
                    id: '5',
                    name: 'Microsoft Azure Fundamentals',
                    description: 'Learn cloud services and Microsoft Azure basics. Perfect for beginners entering cloud computing.\n\nThis certification validates foundational knowledge of cloud services and how those services are provided with Microsoft Azure.',
                    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800',
                    date: 'Open',
                    created_at: new Date().toISOString(),
                    video_url: null,
                },
                {
                    id: '6',
                    name: 'Google IT Support Certificate',
                    description: 'Professional certificate in IT support. Learn troubleshooting, customer service, and system administration.\n\nThis program includes hands-on labs and projects to help you build job-ready skills in IT support.',
                    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
                    date: 'Open',
                    created_at: new Date().toISOString(),
                    video_url: null,
                },
            ];
            const fallbackProject = hardcodedProjects.find(p => p.id === projectId);
            if (fallbackProject) {
                setProject(fallbackProject);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen pt-20 flex items-center justify-center ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <Loader className="w-16 h-16 text-[#ff6f0f] animate-spin mx-auto mb-4" />
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Loading project...
                    </p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className={`min-h-screen pt-20 flex items-center justify-center ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Project Not Found
                    </h2>
                    <button
                        onClick={() => onNavigate('projects')}
                        className="px-6 py-3 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: -5 }}
                    onClick={() => onNavigate('projects')}
                    className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all ${darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-white/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Projects
                </motion.button>

                {/* Project Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Project Header */}
                    <div className={`p-8 rounded-2xl shadow-lg mb-6 ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                        }`}>
                        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {project.name}
                        </h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {new Date(project.date).toLocaleDateString()}
                                </span>
                            </div>

                            {project.video_url && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => project.video_url && window.open(project.video_url, '_blank')}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Play className="w-5 h-5" />
                                    Watch Video
                                </motion.button>
                            )}


                        </div>
                    </div>

                    {/* Project Image */}
                    <div className="mb-6">
                        <div className="relative h-96 rounded-2xl overflow-hidden">
                            <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800';
                                }}
                            />
                        </div>
                    </div>

                    {/* Project Description */}
                    <div className={`p-8 rounded-2xl shadow-lg mb-6 ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                        }`}>
                        <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            About This Certification
                        </h2>
                        <div className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {project.description?.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">
                                    {paragraph}
                                </p>
                            )) || <p>No description available.</p>}
                        </div>
                    </div>

                    {/* Application Requirements */}
                    <div className={`p-8 rounded-2xl shadow-lg mb-6 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'
                        }`}>
                        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                            Application Requirements
                        </h2>
                        <div className="space-y-4">
                            {[
                                { title: 'Age Requirement', desc: 'Must be 18 years or older' },
                                { title: 'Education', desc: 'High school diploma or equivalent' },
                                { title: 'Commitment', desc: 'Dedicated to completing the certification program' },
                                { title: 'English Proficiency', desc: 'Basic English reading and writing skills' },
                                { title: 'Internet Access', desc: 'Reliable internet connection for online learning' },
                            ].map((req, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-accent-orange flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{req.title}</h3>
                                        <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>{req.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Application Process Steps */}
                    <div className={`p-8 rounded-2xl shadow-lg mb-6 ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                        }`}>
                        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                            Application Process
                        </h2>
                        <div className="space-y-6">
                            {[
                                { icon: AlertCircle, title: 'Step 1: Check Eligibility', desc: 'Verify you meet all requirements' },
                                { icon: User, title: 'Step 2: Create Account', desc: 'Register with your email and create a password' },
                                { icon: Lock, title: 'Step 3: Login', desc: 'Access your account dashboard' },
                                { icon: FileText, title: 'Step 4: Fill Application', desc: 'Complete your personal information form' },
                                { icon: Upload, title: 'Step 5: Upload Documents', desc: 'Submit required documents (ID, certificates)' },
                                { icon: ClipboardList, title: 'Step 6: Take Quiz', desc: 'Complete the online eligibility quiz' },
                                { icon: Send, title: 'Step 7: Submit', desc: 'Review and submit your application' },
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-start gap-4 p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent-orange to-accent-orange-light flex items-center justify-center flex-shrink-0">
                                        <step.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>{step.title}</h3>
                                        <p className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Selection Process */}
                    <div className={`p-8 rounded-2xl shadow-lg mb-6 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'
                        }`}>
                        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                            Selection Process
                        </h2>
                        <div className={`space-y-4 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                            <p>After you submit your application, our admin team will:</p>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>Review your application within 3-5 business days</li>
                                <li>Verify your documents and eligibility</li>
                                <li>Evaluate your quiz results</li>
                                <li>Assess your commitment and motivation</li>
                                <li>Notify you via email about the decision</li>
                            </ol>
                            <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-accent-orange/10 border border-accent-orange/30' : 'bg-orange-50 border border-orange-200'}`}>
                                <p className="text-accent-orange font-semibold">
                                    💡 Tip: Complete all steps accurately to increase your chances of selection!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Apply Now Button */}
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowApplicationModal(true)}
                            className="bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-12 py-5 rounded-xl text-lg font-semibold shadow-lg shadow-accent-orange/30 hover:shadow-xl hover:shadow-accent-orange/40 transition-all"
                        >
                            Apply Now for {project.name}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Application Modal */}
                <AnimatePresence>
                    {showApplicationModal && (
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setShowApplicationModal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', damping: 25 }}
                                onClick={(e) => e.stopPropagation()}
                                className={`${darkMode ? 'bg-dark-primary' : 'bg-white'} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
                            >
                                <div className={`sticky top-0 ${darkMode ? 'bg-dark-primary' : 'bg-white'} border-b ${darkMode ? 'border-white/10' : 'border-gray-200'} p-6 z-10`}>
                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                        Application for {project.name}
                                    </h2>
                                    <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                        Complete the following steps to apply
                                    </p>
                                </div>

                                <div className="p-6">
                                    {/* Step 1: Check Eligibility */}
                                    {applicationStep === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Step 1: Check Eligibility
                                            </h3>
                                            <div className="space-y-4 mb-6">
                                                <p className={darkMode ? 'text-white/80' : 'text-gray-700'}>
                                                    Please confirm you meet the following requirements:
                                                </p>
                                                {[
                                                    'I am 18 years or older',
                                                    'I have a high school diploma or equivalent',
                                                    'I am committed to completing the certification',
                                                    'I have basic English proficiency',
                                                    'I have reliable internet access',
                                                ].map((req, index) => (
                                                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" className="w-5 h-5 text-accent-orange rounded" />
                                                        <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>{req}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        setIsEligible(true);
                                                        setApplicationStep(1);
                                                    }}
                                                    className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-6 py-3 rounded-xl font-semibold"
                                                >
                                                    I Meet All Requirements
                                                </button>
                                                <button
                                                    onClick={() => setShowApplicationModal(false)}
                                                    className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'}`}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Create Account or Login */}
                                    {applicationStep === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Step 2: Account Setup
                                            </h3>
                                            <p className={`mb-6 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                                Do you already have an account?
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <button
                                                    onClick={() => {
                                                        setHasAccount(false);
                                                        setApplicationStep(2);
                                                    }}
                                                    className={`p-6 rounded-xl border-2 transition-all ${darkMode ? 'border-white/20 hover:border-accent-orange bg-white/5' : 'border-gray-200 hover:border-accent-orange bg-gray-50'}`}
                                                >
                                                    <User className="w-12 h-12 text-accent-orange mx-auto mb-3" />
                                                    <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Create Account</h4>
                                                    <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>New to CentFund Africa</p>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setHasAccount(true);
                                                        setApplicationStep(3);
                                                    }}
                                                    className={`p-6 rounded-xl border-2 transition-all ${darkMode ? 'border-white/20 hover:border-accent-orange bg-white/5' : 'border-gray-200 hover:border-accent-orange bg-gray-50'}`}
                                                >
                                                    <Lock className="w-12 h-12 text-accent-orange mx-auto mb-3" />
                                                    <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Login</h4>
                                                    <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Already have account</p>
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => setApplicationStep(0)}
                                                className={`w-full px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'}`}
                                            >
                                                Back
                                            </button>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Registration/Login Form */}
                                    {applicationStep === 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Create Your Account
                                            </h3>
                                            <div className="space-y-4 mb-6">
                                                <div>
                                                    <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Full Name</label>
                                                    <input type="text" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} placeholder="John Doe" />
                                                </div>
                                                <div>
                                                    <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Email</label>
                                                    <input type="email" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} placeholder="john@example.com" />
                                                </div>
                                                <div>
                                                    <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Password</label>
                                                    <input type="password" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} placeholder="••••••••" />
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setApplicationStep(4)}
                                                    className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-6 py-3 rounded-xl font-semibold"
                                                >
                                                    Create Account
                                                </button>
                                                <button
                                                    onClick={() => setApplicationStep(1)}
                                                    className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'}`}
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3 Alt: Login Form */}
                                    {applicationStep === 3 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Login to Your Account
                                            </h3>
                                            <div className="space-y-4 mb-6">
                                                <div>
                                                    <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Email</label>
                                                    <input type="email" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} placeholder="john@example.com" />
                                                </div>
                                                <div>
                                                    <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Password</label>
                                                    <input type="password" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} placeholder="••••••••" />
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setApplicationStep(4)}
                                                    className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-6 py-3 rounded-xl font-semibold"
                                                >
                                                    Login
                                                </button>
                                                <button
                                                    onClick={() => setApplicationStep(1)}
                                                    className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'}`}
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Fill Application */}
                                    {applicationStep === 4 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Step 4: Personal Information
                                            </h3>
                                            <div className="space-y-4 mb-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Phone</label>
                                                        <input type="tel" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} placeholder="+1234567890" />
                                                    </div>
                                                    <div>
                                                        <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Date of Birth</label>
                                                        <input type="date" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Country</label>
                                                    <input type="text" className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} placeholder="Kenya" />
                                                </div>
                                                <div>
                                                    <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>Why do you want this certification?</label>
                                                    <textarea rows={4} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`} placeholder="Tell us your motivation..."></textarea>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setApplicationStep(5)}
                                                    className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-6 py-3 rounded-xl font-semibold"
                                                >
                                                    Continue
                                                </button>
                                                <button
                                                    onClick={() => setApplicationStep(hasAccount ? 3 : 2)}
                                                    className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'}`}
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 5: Upload Documents */}
                                    {applicationStep === 5 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Step 5: Upload Documents
                                            </h3>
                                            <div className="space-y-4 mb-6">
                                                {['ID/Passport', 'High School Certificate', 'Resume/CV (Optional)'].map((doc, index) => (
                                                    <div key={index} className={`p-4 rounded-xl border-2 border-dashed ${darkMode ? 'border-white/20 bg-white/5' : 'border-gray-300 bg-gray-50'}`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <Upload className="w-6 h-6 text-accent-orange" />
                                                                <span className={darkMode ? 'text-white' : 'text-black'}>{doc}</span>
                                                            </div>
                                                            <button className="px-4 py-2 bg-accent-orange text-white rounded-lg text-sm">
                                                                Choose File
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setApplicationStep(6)}
                                                    className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-6 py-3 rounded-xl font-semibold"
                                                >
                                                    Continue
                                                </button>
                                                <button
                                                    onClick={() => setApplicationStep(4)}
                                                    className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'}`}
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 6: Quiz */}
                                    {applicationStep === 6 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Step 6: Eligibility Quiz
                                            </h3>
                                            <p className={`mb-6 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                                Answer these questions to complete your application:
                                            </p>
                                            <div className="space-y-6 mb-6">
                                                {[
                                                    { q: 'Why are you interested in this certification?', type: 'textarea' },
                                                    { q: 'How will this certification help your career?', type: 'textarea' },
                                                    { q: 'Can you commit 10-15 hours per week for study?', type: 'radio', options: ['Yes', 'No'] },
                                                ].map((question, index) => (
                                                    <div key={index}>
                                                        <label className={`block mb-2 font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                                            {index + 1}. {question.q}
                                                        </label>
                                                        {question.type === 'textarea' ? (
                                                            <textarea rows={3} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-white/5 border-white/20 text-white' : 'bg-white border-gray-300 text-black'}`}></textarea>
                                                        ) : (
                                                            <div className="flex gap-4">
                                                                {question.options?.map((opt, i) => (
                                                                    <label key={i} className="flex items-center gap-2">
                                                                        <input type="radio" name={`q${index}`} className="w-4 h-4 text-accent-orange" />
                                                                        <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>{opt}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setApplicationStep(7)}
                                                    className="flex-1 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-6 py-3 rounded-xl font-semibold"
                                                >
                                                    Continue
                                                </button>
                                                <button
                                                    onClick={() => setApplicationStep(5)}
                                                    className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'}`}
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 7: Review & Submit */}
                                    {applicationStep === 7 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Step 7: Review & Submit
                                            </h3>
                                            <div className={`p-6 rounded-xl mb-6 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Application Summary</h4>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                        <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Eligibility confirmed</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                        <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Account created</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                        <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Personal information completed</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                        <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Documents uploaded</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                                        <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>Quiz completed</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-accent-orange/10 border border-accent-orange/30' : 'bg-orange-50 border border-orange-200'}`}>
                                                <p className="text-accent-orange text-sm">
                                                    By submitting, you agree that all information provided is accurate. Our admin team will review your application within 3-5 business days.
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => {
                                                        alert('Application submitted successfully! You will receive an email confirmation shortly.');
                                                        setShowApplicationModal(false);
                                                        setApplicationStep(0);
                                                    }}
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                                                >
                                                    <Send className="w-5 h-5" />
                                                    Submit Application
                                                </button>
                                                <button
                                                    onClick={() => setApplicationStep(6)}
                                                    className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-200 text-black'}`}
                                                >
                                                    Back
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
