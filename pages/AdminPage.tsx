import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { LoginSelection } from '../components/admin/LoginSelection';
import { StudentDashboard } from '../components/student/StudentDashboard';

interface AdminPageProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export function AdminPage({ darkMode, toggleDarkMode }: AdminPageProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<'admin' | 'sponsor' | 'applicant'>('admin');
    const [selectedUserType, setSelectedUserType] = useState<'admin' | 'sponsor' | 'student' | null>(null);

    useEffect(() => {
        // Check if user is already logged in
        const adminToken = localStorage.getItem('adminToken');
        const storedUserType = localStorage.getItem('userType') as 'admin' | 'sponsor' | 'applicant';
        if (adminToken && storedUserType) {
            setIsAuthenticated(true);
            setUserType(storedUserType);
        }
    }, []);

    const handleLogin = (success: boolean, type: 'admin' | 'sponsor' | 'applicant', userData?: any) => {
        if (success) {
            setIsAuthenticated(true);
            setUserType(type);
            localStorage.setItem('adminToken', 'authenticated');
            localStorage.setItem('userType', type);

            // Store user data if provided
            if (userData) {
                if (userData.name) localStorage.setItem('userName', userData.name);
                if (userData.email) localStorage.setItem('userEmail', userData.email);
            }

            // Redirect based on user type
            if (type === 'sponsor') {
                // Redirect to sponsor dashboard
                window.location.href = '/sponsor-dashboard';
            }
            // Admin and applicant stay on this page to show their respective dashboards
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
    };

    const handleSelectUserType = (type: 'admin' | 'sponsor' | 'student') => {
        setSelectedUserType(type);
    };

    const handleBackToSelection = () => {
        setSelectedUserType(null);
    };

    return (
        <div className={`min-h-screen pt-20 ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
            <AnimatePresence mode="wait">
                {!isAuthenticated ? (
                    selectedUserType === null ? (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <LoginSelection darkMode={darkMode} onSelectUserType={handleSelectUserType} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AdminLogin
                                darkMode={darkMode}
                                toggleDarkMode={toggleDarkMode}
                                onLogin={handleLogin}
                                selectedUserType={selectedUserType}
                                onBack={handleBackToSelection}
                            />
                        </motion.div>
                    )
                ) : (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {userType === 'admin' ? (
                            <AdminDashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} />
                        ) : userType === 'applicant' ? (
                            <StudentDashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} />
                        ) : (
                            <AdminDashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}