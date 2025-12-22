import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogOut, Sun, Moon, FileText, CheckCircle, Clock, XCircle, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';

interface StudentDashboardProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    onLogout: () => void;
}

interface Application {
    id: string;
    projectName: string;
    projectImage: string;
    status: 'pending' | 'under_review' | 'accepted_stage1' | 'assigned_to_sponsor' | 'sponsor_accepted' | 'payment_pending' | 'payment_completed' | 'rejected';
    appliedDate: string;
    lastUpdated: string;
    sponsorName?: string;
    paymentMethod?: string;
    progressPercentage?: number;
}

export function StudentDashboard({ darkMode, toggleDarkMode, onLogout }: StudentDashboardProps) {
    const [activeTab, setActiveTab] = useState<'my-applications' | 'available-projects'>('my-applications');
    const [applications, setApplications] = useState<Application[]>([]);
    const [availableProjects, setAvailableProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const studentEmail = localStorage.getItem('userEmail') || '';
    const studentName = localStorage.getItem('userName') || 'Student';

    useEffect(() => {
        loadApplications();
        loadAvailableProjects();
    }, []);

    const loadApplications = async () => {
        // TODO: Load from Supabase based on student email
        // For now, using mock data
        const mockApplications: Application[] = [
            {
                id: '1',
                projectName: 'AWS Cloud Practitioner',
                projectImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
                status: 'stage1',
                appliedDate: '2024-01-15',
                lastUpdated: '2024-01-20',
            },
            {
                id: '2',
                projectName: 'CCNA Networking',
                projectImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
                status: 'pending',
                appliedDate: '2024-01-10',
                lastUpdated: '2024-01-10',
            },
        ];
        setApplications(mockApplications);
        setLoading(false);
    };

    const loadAvailableProjects = async () => {
        // TODO: Load from Supabase, excluding already applied projects
        const mockProjects = [
            {
                id: '3',
                title: 'IELTS Certification',
                description: 'Improve English language skills for global opportunities',
                image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
            },
            {
                id: '4',
                title: 'CompTIA A+',
                description: 'Essential IT certification covering hardware and software',
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
            },
        ];
        setAvailableProjects(mockProjects);
    };

    const getStatusInfo = (status: Application['status']) => {
        switch (status) {
            case 'pending':
                return {
                    icon: Clock,
                    label: 'Pending Admin Review',
                    color: 'from-yellow-500 to-orange-500',
                    bgColor: 'bg-yellow-500/10',
                    textColor: 'text-yellow-500',
                    progress: 10,
                    message: 'Your application is being reviewed by our admin team'
                };
            case 'under_review':
                return {
                    icon: AlertCircle,
                    label: 'Under Review',
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/10',
                    textColor: 'text-blue-500',
                    progress: 25,
                    message: 'Admin is reviewing your documents and eligibility'
                };
            case 'accepted_stage1':
                return {
                    icon: CheckCircle,
                    label: 'Stage 1 Approved',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    textColor: 'text-green-500',
                    progress: 40,
                    message: 'Congratulations! Your application passed initial review'
                };
            case 'assigned_to_sponsor':
                return {
                    icon: AlertCircle,
                    label: 'Assigned to Sponsor',
                    color: 'from-purple-500 to-indigo-500',
                    bgColor: 'bg-purple-500/10',
                    textColor: 'text-purple-500',
                    progress: 55,
                    message: 'A sponsor is reviewing your application'
                };
            case 'sponsor_accepted':
                return {
                    icon: CheckCircle,
                    label: 'Sponsor Accepted!',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    textColor: 'text-green-500',
                    progress: 75,
                    message: 'Great news! A sponsor has accepted your application'
                };
            case 'payment_pending':
                return {
                    icon: Clock,
                    label: 'Payment Processing',
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/10',
                    textColor: 'text-blue-500',
                    progress: 85,
                    message: 'Sponsor is processing the payment'
                };
            case 'payment_completed':
                return {
                    icon: CheckCircle,
                    label: '🎉 Fully Funded!',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    textColor: 'text-green-500',
                    progress: 100,
                    message: 'Congratulations! You can now schedule your certification exam'
                };
            case 'rejected':
                return {
                    icon: XCircle,
                    label: 'Under Review - Pre-checking',
                    color: 'from-orange-500 to-yellow-500',
                    bgColor: 'bg-orange-500/10',
                    textColor: 'text-orange-500',
                    progress: 15,
                    message: 'Your application needs some updates. Please review the feedback and resubmit with corrections.'
                };
            // Handle old status values for backward compatibility
            case 'stage1' as any:
                return {
                    icon: AlertCircle,
                    label: 'Stage 1 - Document Review',
                    color: 'from-blue-500 to-cyan-500',
                    bgColor: 'bg-blue-500/10',
                    textColor: 'text-blue-500',
                    progress: 40,
                    message: 'Your documents are being reviewed'
                };
            case 'stage2' as any:
                return {
                    icon: AlertCircle,
                    label: 'Stage 2 - Final Review',
                    color: 'from-purple-500 to-indigo-500',
                    bgColor: 'bg-purple-500/10',
                    textColor: 'text-purple-500',
                    progress: 60,
                    message: 'Your application is in final review stage'
                };
            case 'accepted' as any:
                return {
                    icon: CheckCircle,
                    label: 'Accepted',
                    color: 'from-green-500 to-emerald-500',
                    bgColor: 'bg-green-500/10',
                    textColor: 'text-green-500',
                    progress: 90,
                    message: 'Your application has been accepted'
                };
            default:
                // Fallback for any unknown status
                return {
                    icon: Clock,
                    label: 'In Progress',
                    color: 'from-gray-500 to-gray-600',
                    bgColor: 'bg-gray-500/10',
                    textColor: 'text-gray-500',
                    progress: 50,
                    message: 'Your application is being processed'
                };
        }
    };

    const stats = [
        { label: 'Total Applications', value: applications.length.toString(), color: 'from-blue-500 to-cyan-500' },
        { label: 'Pending', value: applications.filter(a => a.status === 'pending' || a.status === 'under_review').length.toString(), color: 'from-yellow-500 to-orange-500' },
        { label: 'In Progress', value: applications.filter(a => ['accepted_stage1', 'assigned_to_sponsor', 'sponsor_accepted', 'payment_pending'].includes(a.status)).length.toString(), color: 'from-purple-500 to-indigo-500' },
        { label: 'Completed', value: applications.filter(a => a.status === 'payment_completed').length.toString(), color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Welcome back, {studentName}!
                    </h1>
                    <p className={`text-base sm:text-lg mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Track your applications and explore new opportunities
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleDarkMode}
                        className={`p-3 rounded-xl transition-all shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/'}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base min-h-[44px] ${darkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                            }`}
                    >
                        <span>Home</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base min-h-[44px] ${darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            }`}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </motion.button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg`}
                    >
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                        <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                            {stat.value}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('my-applications')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'my-applications'
                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white shadow-lg'
                        : darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    My Applications
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('available-projects')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === 'available-projects'
                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white shadow-lg'
                        : darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <BookOpen className="w-5 h-5" />
                    Available Projects
                </motion.button>
            </div>

            {/* Content */}
            {activeTab === 'my-applications' ? (
                <div className="space-y-4">
                    {applications.length === 0 ? (
                        <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'}`}>
                            <FileText className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                No applications yet
                            </p>
                            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Start by applying to available projects
                            </p>
                        </div>
                    ) : (
                        applications.map((app, index) => {
                            const statusInfo = getStatusInfo(app.status);
                            return (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-6 rounded-xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all`}
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <img
                                            src={app.projectImage}
                                            alt={app.projectName}
                                            className="w-full md:w-32 h-32 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div>
                                                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {app.projectName}
                                                    </h3>
                                                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Applied: {new Date(app.appliedDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                                    <statusInfo.icon className="w-5 h-5" />
                                                    <span className="font-medium whitespace-nowrap">{statusInfo.label}</span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        Progress
                                                    </span>
                                                    <span className={`text-sm font-bold ${statusInfo.textColor}`}>
                                                        {statusInfo.progress}%
                                                    </span>
                                                </div>
                                                <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-200'}`}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${statusInfo.progress}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={`h-full bg-gradient-to-r ${statusInfo.color} rounded-full`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Status Message */}
                                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {statusInfo.message}
                                                </p>
                                            </div>

                                            {/* Additional Info for Accepted/Funded */}
                                            {app.sponsorName && (
                                                <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                                    <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                                                        💚 Sponsored by: {app.sponsorName}
                                                    </p>
                                                </div>
                                            )}

                                            {app.status === 'payment_completed' && (
                                                <motion.div
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className={`p-4 rounded-lg ${darkMode ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300'}`}
                                                >
                                                    <p className={`text-base font-bold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                                                        🎉 Congratulations! Your certification is fully funded!
                                                    </p>
                                                    <p className={`text-sm mt-2 ${darkMode ? 'text-green-300/80' : 'text-green-600'}`}>
                                                        You can now schedule your exam. Check your email for next steps.
                                                    </p>
                                                </motion.div>
                                            )}

                                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Last updated: {new Date(app.lastUpdated).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`rounded-xl overflow-hidden ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all group`}
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-6">
                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {project.title}
                                </h3>
                                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {project.description}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    Apply Now
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
