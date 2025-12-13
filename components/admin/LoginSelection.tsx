import { motion } from 'motion/react';
import { Shield, Users, GraduationCap, ArrowRight } from 'lucide-react';

interface LoginSelectionProps {
    darkMode: boolean;
    onSelectUserType: (userType: 'admin' | 'sponsor' | 'student') => void;
}

export function LoginSelection({ darkMode, onSelectUserType }: LoginSelectionProps) {
    const userTypes = [
        {
            type: 'admin' as const,
            title: 'Admin Login',
            description: 'Access admin dashboard to manage applications, projects, and users',
            icon: Shield,
            color: 'from-purple-500 to-indigo-500',
            hoverColor: 'hover:from-purple-600 hover:to-indigo-600',
        },
        {
            type: 'student' as const,
            title: 'Student Login',
            description: 'Track your application status and certification progress',
            icon: GraduationCap,
            color: 'from-blue-500 to-cyan-500',
            hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
        },
        {
            type: 'sponsor' as const,
            title: 'Sponsor Login',
            description: 'View sponsored students and track your impact',
            icon: Users,
            color: 'from-orange-500 to-red-500',
            hoverColor: 'hover:from-orange-600 hover:to-red-600',
        },
    ];

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-20 h-20 bg-gradient-to-br from-[#ff6f0f] to-[#ff8f3f] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#ff6f0f]/30"
                    >
                        <span className="text-4xl">🎓</span>
                    </motion.div>
                    <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Welcome to CertFund Africa
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Select your login type to continue
                    </p>
                </motion.div>

                {/* Login Type Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {userTypes.map((userType, index) => (
                        <motion.div
                            key={userType.type}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            onClick={() => onSelectUserType(userType.type)}
                            className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all group ${darkMode
                                ? 'bg-[#0a1628] border border-white/10 hover:border-white/20'
                                : 'bg-white border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-2xl'
                                }`}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${userType.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                            {/* Icon */}
                            <div className={`relative w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${userType.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
                                <userType.icon className="w-8 h-8 text-white" />
                            </div>

                            {/* Content */}
                            <div className="relative text-center">
                                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {userType.title}
                                </h3>
                                <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {userType.description}
                                </p>

                                {/* Button */}
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className={`inline-flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-[#ff6f0f]' : 'text-[#ff6f0f]'
                                        }`}
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${userType.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`} />
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`mt-12 text-center p-4 rounded-lg border ${darkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'
                        }`}
                >
                    <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        🔒 All logins are secure and encrypted. Your data is protected.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
