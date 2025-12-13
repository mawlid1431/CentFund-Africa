import { motion } from 'motion/react';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';

interface NotFoundPageProps {
    darkMode: boolean;
    onNavigate: (page: string) => void;
}

export function NotFoundPage({ darkMode, onNavigate }: NotFoundPageProps) {
    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-dark-primary' : 'bg-white'}`}>
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* 404 Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative"
                    >
                        <h1 className={`text-9xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                            404
                        </h1>
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -top-8 -right-8"
                        >
                            <AlertCircle className="w-16 h-16 text-accent-orange" />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Error Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        Page Not Found
                    </h2>
                    <p className={`text-lg mb-8 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </motion.div>

                {/* Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className={`p-6 rounded-2xl mb-8 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-gray-50 border border-gray-200'}`}
                >
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        Here's what you can do:
                    </h3>
                    <ul className={`space-y-2 text-left ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-orange">•</span>
                            <span>Check the URL for typos</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-orange">•</span>
                            <span>Go back to the homepage</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-orange">•</span>
                            <span>Browse our certification programs</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-orange">•</span>
                            <span>Contact us if you need help</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('home')}
                        className="bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-accent-orange/30 hover:shadow-xl hover:shadow-accent-orange/40 transition-all flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNavigate('projects')}
                        className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${darkMode
                            ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                            : 'bg-gray-200 text-black border border-gray-300 hover:bg-gray-300'
                            }`}
                    >
                        <Search className="w-5 h-5" />
                        Browse Programs
                    </motion.button>
                </motion.div>

                {/* Back Link */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    whileHover={{ x: -5 }}
                    onClick={() => window.history.back()}
                    className={`mt-8 inline-flex items-center gap-2 ${darkMode ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-black'
                        } transition-colors`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go back to previous page
                </motion.button>
            </div>
        </div>
    );
}
