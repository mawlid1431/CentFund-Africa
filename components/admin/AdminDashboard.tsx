import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogOut, Target, Sun, Moon, FolderKanban, UsersRound, MessageSquareQuote, Heart, Settings, FileText } from 'lucide-react';
import { ProjectsManager } from './ProjectsManager';
import { TeamManager } from './TeamManager';
import { TestimonialsManager } from './TestimonialsManager';
import { SuccessStoriesManager } from './SuccessStoriesManager';
import { SettingsManager } from './SettingsManager';
import { ApplicationsManager } from './ApplicationsManager';
import { getDashboardStats } from '@/utils/supabase/helpers';

interface AdminDashboardProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    onLogout: () => void;
}

export function AdminDashboard({ darkMode, toggleDarkMode, onLogout }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<'projects' | 'success-stories' | 'testimonials' | 'team' | 'settings' | 'applications'>('projects');
    const [stats, setStats] = useState([
        { name: 'Total Projects', value: '0', icon: Target, color: 'from-blue-500 to-blue-600' },
    ]);

    // Load dashboard stats
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats([
                { name: 'Total Projects', value: data.activeProjects.toString(), icon: Target, color: 'from-blue-500 to-blue-600' },
            ]);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Admin Dashboard
                    </h1>
                    <p className={`text-base sm:text-lg mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Manage CentFund Africa operations
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleDarkMode}
                        className={`p-3 rounded-xl transition-all shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center ${darkMode
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/'}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base min-h-[44px] ${darkMode
                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                            }`}
                    >
                        <span className="hidden sm:inline">Back to Site</span>
                        <span className="sm:hidden">Site</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base min-h-[44px] ${darkMode
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            }`}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </motion.button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                            } shadow-lg`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {stat.name}
                                </p>
                                <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('applications')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap min-w-fit ${activeTab === 'applications'
                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white shadow-lg shadow-[#ff6f0f]/30'
                        : darkMode
                            ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Applications</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap min-w-fit ${activeTab === 'projects'
                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white shadow-lg shadow-[#ff6f0f]/30'
                        : darkMode
                            ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Projects</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('success-stories')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap min-w-fit ${activeTab === 'success-stories'
                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white shadow-lg shadow-[#ff6f0f]/30'
                        : darkMode
                            ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Stories</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('testimonials')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap min-w-fit ${activeTab === 'testimonials'
                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white shadow-lg shadow-[#ff6f0f]/30'
                        : darkMode
                            ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <MessageSquareQuote className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Reviews</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('team')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap min-w-fit ${activeTab === 'team'
                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white shadow-lg shadow-[#ff6f0f]/30'
                        : darkMode
                            ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <UsersRound className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Team</span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('settings')}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap min-w-fit ${activeTab === 'settings'
                        ? 'bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white shadow-lg shadow-[#ff6f0f]/30'
                        : darkMode
                            ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Settings</span>
                </motion.button>
            </div>

            {/* Content */}
            {activeTab === 'applications' ? (
                <ApplicationsManager darkMode={darkMode} />
            ) : activeTab === 'projects' ? (
                <ProjectsManager darkMode={darkMode} onRefresh={loadStats} />
            ) : activeTab === 'success-stories' ? (
                <SuccessStoriesManager darkMode={darkMode} />
            ) : activeTab === 'testimonials' ? (
                <TestimonialsManager darkMode={darkMode} />
            ) : activeTab === 'team' ? (
                <TeamManager darkMode={darkMode} />
            ) : (
                <SettingsManager darkMode={darkMode} />
            )}
        </div>
    );
}
