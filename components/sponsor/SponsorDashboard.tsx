import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Sun, Moon, Users, CheckCircle, XCircle, DollarSign, FileText, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react';

interface SponsorDashboardProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
    onLogout: () => void;
}

interface Applicant {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    dateOfBirth: string;
    projectName: string;
    projectImage: string;
    projectPrice: number;
    appliedDate: string;
    status: 'pending' | 'accepted' | 'rejected';
    documents: string[];
}

export function SponsorDashboard({ darkMode, toggleDarkMode, onLogout }: SponsorDashboardProps) {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewAction, setReviewAction] = useState<'accept' | 'reject' | null>(null);
    const [reviewReason, setReviewReason] = useState('');
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'direct' | 'through-us'>('through-us');
    const [loading, setLoading] = useState(false);

    const sponsorName = localStorage.getItem('userName') || 'Sponsor';
    const sponsorEmail = localStorage.getItem('userEmail') || '';

    useEffect(() => {
        loadApplicants();
    }, []);

    const loadApplicants = async () => {
        // TODO: Load from Supabase based on sponsor email
        // For now, using mock data
        const mockApplicants: Applicant[] = [
            {
                id: '1',
                name: 'Ahmed Mohamed',
                email: 'ahmed@example.com',
                phone: '+252 61 234 5678',
                address: '123 Main Street',
                city: 'Hargeisa',
                country: 'Somaliland',
                dateOfBirth: '2000-05-15',
                projectName: 'AWS Cloud Practitioner',
                projectImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
                projectPrice: 300,
                appliedDate: '2024-01-15',
                status: 'pending',
                documents: ['ID Card', 'Academic Certificate', 'Motivation Letter'],
            },
            {
                id: '2',
                name: 'Fatima Hassan',
                email: 'fatima@example.com',
                phone: '+252 61 345 6789',
                address: '456 Second Avenue',
                city: 'Burao',
                country: 'Somaliland',
                dateOfBirth: '1999-08-22',
                projectName: 'CCNA Networking',
                projectImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
                projectPrice: 450,
                appliedDate: '2024-01-10',
                status: 'pending',
                documents: ['ID Card', 'Academic Certificate'],
            },
        ];
        setApplicants(mockApplicants);
    };

    const handleReviewClick = (applicant: Applicant, action: 'accept' | 'reject') => {
        setSelectedApplicant(applicant);
        setReviewAction(action);
        setShowReviewModal(true);
        setReviewReason('');
        setAgreementChecked(false);
        setPaymentMethod('through-us');
    };

    const handleSubmitReview = async () => {
        if (!selectedApplicant || !reviewAction) return;

        if (reviewAction === 'accept' && !agreementChecked) {
            alert('Please check the agreement to proceed');
            return;
        }

        if (!reviewReason.trim()) {
            alert('Please provide a reason for your decision');
            return;
        }

        setLoading(true);

        // TODO: Submit to Supabase
        setTimeout(() => {
            // Update local state
            setApplicants(prev =>
                prev.map(app =>
                    app.id === selectedApplicant.id
                        ? { ...app, status: reviewAction }
                        : app
                )
            );

            setLoading(false);
            setShowReviewModal(false);
            setSelectedApplicant(null);
            alert(`Application ${reviewAction === 'accept' ? 'accepted' : 'rejected'} successfully!`);
        }, 1000);
    };

    const stats = [
        { label: 'Total Assigned', value: applicants.length.toString(), color: 'from-blue-500 to-cyan-500', icon: Users },
        { label: 'Pending Review', value: applicants.filter(a => a.status === 'pending').length.toString(), color: 'from-yellow-500 to-orange-500', icon: FileText },
        { label: 'Accepted', value: applicants.filter(a => a.status === 'accepted').length.toString(), color: 'from-green-500 to-emerald-500', icon: CheckCircle },
        { label: 'Rejected', value: applicants.filter(a => a.status === 'rejected').length.toString(), color: 'from-red-500 to-pink-500', icon: XCircle },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Welcome, {sponsorName}!
                    </h1>
                    <p className={`text-base sm:text-lg mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Review and manage your assigned applicants
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
                        <div className="flex items-center justify-between mb-2">
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                            <stat.icon className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                        <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                            {stat.value}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Applicants List */}
            <div className="space-y-4">
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Assigned Applicants
                </h2>

                {applicants.length === 0 ? (
                    <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'}`}>
                        <Users className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            No applicants assigned yet
                        </p>
                    </div>
                ) : (
                    applicants.map((applicant, index) => (
                        <motion.div
                            key={applicant.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all`}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Project Image */}
                                <img
                                    src={applicant.projectImage}
                                    alt={applicant.projectName}
                                    className="w-full lg:w-48 h-48 object-cover rounded-lg"
                                />

                                {/* Applicant Details */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div>
                                            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {applicant.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Award className={`w-5 h-5 ${darkMode ? 'text-[#ff6f0f]' : 'text-[#ff6f0f]'}`} />
                                                <span className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {applicant.projectName}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg ${applicant.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                applicant.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                                    'bg-red-500/10 text-red-500'
                                            }`}>
                                            <span className="font-medium capitalize">{applicant.status}</span>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {applicant.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {applicant.phone}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {applicant.city}, {applicant.country}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Price */}
                                    <div className={`flex items-center gap-2 p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                        <DollarSign className={`w-6 h-6 ${darkMode ? 'text-[#ff6f0f]' : 'text-[#ff6f0f]'}`} />
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Certification Cost
                                            </p>
                                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                ${applicant.projectPrice}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Documents */}
                                    <div>
                                        <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Submitted Documents:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {applicant.documents.map((doc, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}
                                                >
                                                    {doc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {applicant.status === 'pending' && (
                                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleReviewClick(applicant, 'accept')}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Accept Application
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleReviewClick(applicant, 'reject')}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Reject Application
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {showReviewModal && selectedApplicant && reviewAction && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowReviewModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                                } shadow-2xl`}
                        >
                            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {reviewAction === 'accept' ? 'Accept' : 'Reject'} Application
                            </h2>

                            <div className="space-y-6">
                                {/* Applicant Summary */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedApplicant.name}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {selectedApplicant.projectName} - ${selectedApplicant.projectPrice}
                                    </p>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Reason for {reviewAction === 'accept' ? 'Acceptance' : 'Rejection'} *
                                    </label>
                                    <textarea
                                        value={reviewReason}
                                        onChange={(e) => setReviewReason(e.target.value)}
                                        rows={4}
                                        className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                                ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f]'
                                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f]'
                                            }`}
                                        placeholder={`Provide a detailed reason for ${reviewAction === 'accept' ? 'accepting' : 'rejecting'} this application...`}
                                    />
                                </div>

                                {/* Accept-specific fields */}
                                {reviewAction === 'accept' && (
                                    <>
                                        {/* Payment Method */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Payment Method *
                                            </label>
                                            <div className="space-y-3">
                                                <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'through-us'
                                                        ? 'border-[#ff6f0f] bg-[#ff6f0f]/5'
                                                        : darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="through-us"
                                                        checked={paymentMethod === 'through-us'}
                                                        onChange={(e) => setPaymentMethod(e.target.value as 'direct' | 'through-us')}
                                                        className="mt-1"
                                                    />
                                                    <div>
                                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            Pay through CentFund Africa
                                                        </p>
                                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Payment will be processed through our secure system
                                                        </p>
                                                    </div>
                                                </label>
                                                <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'direct'
                                                        ? 'border-[#ff6f0f] bg-[#ff6f0f]/5'
                                                        : darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name="payment"
                                                        value="direct"
                                                        checked={paymentMethod === 'direct'}
                                                        onChange={(e) => setPaymentMethod(e.target.value as 'direct' | 'through-us')}
                                                        className="mt-1"
                                                    />
                                                    <div>
                                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            Pay directly to exam center
                                                        </p>
                                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Payment will be made directly to the certification provider
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Agreement */}
                                        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer ${darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                                            }`}>
                                            <input
                                                type="checkbox"
                                                checked={agreementChecked}
                                                onChange={(e) => setAgreementChecked(e.target.checked)}
                                                className="mt-1"
                                            />
                                            <div>
                                                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    I agree to sponsor this applicant
                                                </p>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    By checking this box, I confirm that I will provide the necessary funding for {selectedApplicant.name}'s {selectedApplicant.projectName} certification (${selectedApplicant.projectPrice}).
                                                </p>
                                            </div>
                                        </label>
                                    </>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowReviewModal(false)}
                                        className={`flex-1 px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }`}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmitReview}
                                        disabled={loading}
                                        className={`flex-1 px-6 py-3 rounded-lg font-medium text-white ${reviewAction === 'accept'
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : 'bg-gradient-to-r from-red-500 to-pink-500'
                                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Processing...' : `Confirm ${reviewAction === 'accept' ? 'Accept' : 'Reject'}`}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
