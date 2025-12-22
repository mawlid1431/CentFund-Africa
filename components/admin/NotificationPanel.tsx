import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Check, CheckCheck, Clock, User, FileText, Award, AlertCircle } from 'lucide-react';

interface NotificationPanelProps {
    darkMode: boolean;
    userId: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    link?: string;
    created_at: string;
}

export function NotificationPanel({ darkMode, userId }: NotificationPanelProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPanel, setShowPanel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    const loadNotifications = async () => {
        // TODO: Load from Supabase
        const mockNotifications: Notification[] = [
            {
                id: '1',
                title: '🎓 New Student Registered',
                message: 'Ahmed Mohamed (ahmed@example.com) registered from Hargeisa, Somalia at 14:30 on 22 Dec 2024',
                type: 'info',
                read: false,
                created_at: new Date().toISOString(),
            },
            {
                id: '2',
                title: '✅ Student Passed Quiz',
                message: 'Fatima Hassan (fatima@example.com) scored 32/40 on eligibility quiz. Student is now eligible to apply for programs!',
                type: 'success',
                read: false,
                created_at: new Date(Date.now() - 3600000).toISOString(),
            },
            {
                id: '3',
                title: '📝 New Application Submitted',
                message: 'Ahmed Mohamed applied for AWS Cloud Practitioner certification. Application ID: 8948af02... | Status: Pending Review',
                type: 'info',
                read: true,
                created_at: new Date(Date.now() - 7200000).toISOString(),
            },
        ];
        setNotifications(mockNotifications);
    };

    const markAsRead = async (notificationId: string) => {
        // TODO: Update in Supabase
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = async () => {
        setLoading(true);
        // TODO: Update all in Supabase
        setTimeout(() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setLoading(false);
        }, 500);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return CheckCheck;
            case 'warning': return AlertCircle;
            case 'error': return X;
            default: return Bell;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return 'text-green-500 bg-green-500/10';
            case 'warning': return 'text-yellow-500 bg-yellow-500/10';
            case 'error': return 'text-red-500 bg-red-500/10';
            default: return 'text-blue-500 bg-blue-500/10';
        }
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            {/* Notification Bell Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPanel(!showPanel)}
                className={`relative p-3 rounded-xl transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
            >
                <Bell className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Notification Panel */}
            <AnimatePresence>
                {showPanel && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPanel(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 300 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 300 }}
                            className={`fixed right-0 top-0 h-full w-full max-w-md z-50 ${darkMode ? 'bg-dark-secondary' : 'bg-white'
                                } shadow-2xl overflow-hidden flex flex-col`}
                        >
                            {/* Header */}
                            <div className={`p-6 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Notifications
                                    </h2>
                                    <button
                                        onClick={() => setShowPanel(false)}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                                    </button>
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilter('all')}
                                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${filter === 'all'
                                                ? 'bg-accent-orange text-white'
                                                : darkMode
                                                    ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        All ({notifications.length})
                                    </button>
                                    <button
                                        onClick={() => setFilter('unread')}
                                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${filter === 'unread'
                                                ? 'bg-accent-orange text-white'
                                                : darkMode
                                                    ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Unread ({unreadCount})
                                    </button>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        disabled={loading}
                                        className={`w-full mt-3 py-2 rounded-lg text-sm font-medium ${darkMode
                                                ? 'bg-white/5 text-white hover:bg-white/10'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } disabled:opacity-50`}
                                    >
                                        {loading ? 'Marking...' : 'Mark All as Read'}
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredNotifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full p-8">
                                        <Bell className={`w-16 h-16 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                                        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            No notifications
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 space-y-3">
                                        {filteredNotifications.map((notification, index) => {
                                            const Icon = getIcon(notification.type);
                                            return (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                                    className={`p-4 rounded-xl cursor-pointer transition-all ${notification.read
                                                            ? darkMode
                                                                ? 'bg-white/5'
                                                                : 'bg-gray-50'
                                                            : darkMode
                                                                ? 'bg-accent-orange/10 border border-accent-orange/30'
                                                                : 'bg-orange-50 border border-orange-200'
                                                        } hover:shadow-lg`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                                <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                                    {notification.title}
                                                                </h3>
                                                                {!notification.read && (
                                                                    <span className="w-2 h-2 bg-accent-orange rounded-full flex-shrink-0 mt-1" />
                                                                )}
                                                            </div>
                                                            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {notification.message}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className={`w-3 h-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                                                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                                    {new Date(notification.created_at).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
