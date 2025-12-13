import { useState, useEffect } from 'react';
import { Eye, UserCheck, Users, Clock, CheckCircle, XCircle, Search, Filter, X, GraduationCap, Building, UserPlus, Award } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface Application {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    certification_name: string;
    certification_cost: number;
    status: string;
    current_stage: number;
    stage1_status: string;
    stage2_status: string;
    assigned_sponsor_id: string | null;
    submitted_at: string;
    date_of_birth: string;
    gender: string;
    nationality: string;
    address: string;
    city: string;
    country: string;
    education_level: string;
    institution_name: string;
    field_of_study: string;
    why_certification: string;
    career_goals: string;
    financial_situation: string;
    resume_url: string;
    id_document_url: string;
}

interface Sponsor {
    id: string;
    full_name: string;
    email: string;
    active_sponsorships: number;
    max_sponsorships: number;
}

interface ApplicationsManagerProps {
    darkMode: boolean;
}

export function ApplicationsManager({ darkMode }: ApplicationsManagerProps) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [sponsorApplications, setSponsorApplications] = useState<any[]>([]);
    const [activeSponsorsList, setActiveSponsorsList] = useState<any[]>([]);
    const [activeView, setActiveView] = useState<'students' | 'sponsor-apps' | 'sponsors-list'>('students');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedSponsor, setSelectedSponsor] = useState('');

    useEffect(() => {
        fetchApplications();
        fetchSponsors();
        fetchSponsorApplications();
        fetchActiveSponsorsList();
    }, []);

    const fetchApplications = async () => {
        try {
            if (!supabase) {
                toast.error('Supabase not configured');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('applications')
                .select('*')
                .order('submitted_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const fetchSponsors = async () => {
        try {
            if (!supabase) return;

            // Get users with sponsor role
            const { data: users, error: usersError } = await supabase
                .from('users')
                .select('id, full_name, email')
                .eq('role', 'sponsor')
                .eq('status', 'active');

            if (usersError) throw usersError;

            // Get sponsor details from sponsors table
            const { data: sponsorDetails, error: sponsorError } = await supabase
                .from('sponsors')
                .select('email, active_sponsorships, total_sponsored')
                .eq('status', 'approved');

            if (sponsorError) throw sponsorError;

            // Merge the data
            const sponsorData = users?.map((user: any) => {
                const details = sponsorDetails?.find((s: any) => s.email === user.email);
                return {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    active_sponsorships: details?.active_sponsorships || 0,
                    max_sponsorships: 5, // Default max sponsorships
                };
            }) || [];

            setSponsors(sponsorData);
        } catch (error) {
            console.error('Error fetching sponsors:', error);
        }
    };

    const fetchSponsorApplications = async () => {
        try {
            if (!supabase) return;

            const { data, error } = await supabase
                .from('sponsors')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSponsorApplications(data || []);
        } catch (error) {
            console.error('Error fetching sponsor applications:', error);
        }
    };

    const fetchActiveSponsorsList = async () => {
        try {
            if (!supabase) return;

            const { data, error } = await supabase
                .from('sponsors')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setActiveSponsorsList(data || []);
        } catch (error) {
            console.error('Error fetching active sponsors:', error);
        }
    };

    const updateApplicationStatus = async (appId: string, newStatus: string, stage?: number) => {
        try {
            if (!supabase) return;

            const updates: any = {
                status: newStatus,
                updated_at: new Date().toISOString(),
            };

            if (stage) {
                updates.current_stage = stage;
                if (stage === 1) {
                    updates.stage1_status = newStatus.includes('accepted') ? 'accepted' : 'pending';
                } else if (stage === 2) {
                    updates.stage2_status = newStatus.includes('accepted') ? 'accepted' : 'pending';
                }
            }

            const { error } = await supabase
                .from('applications')
                .update(updates)
                .eq('id', appId);

            if (error) throw error;

            await supabase.from('application_history').insert({
                application_id: appId,
                new_status: newStatus,
                stage: stage || 1,
                notes: `Status updated to ${newStatus}`,
            });

            toast.success('Application status updated');
            fetchApplications();
            setSelectedApp(null);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const assignSponsor = async () => {
        if (!selectedApp || !selectedSponsor || !supabase) return;

        try {
            const { error } = await supabase
                .from('applications')
                .update({
                    assigned_sponsor_id: selectedSponsor,
                    sponsor_assigned_at: new Date().toISOString(),
                    status: 'assigned_to_sponsor',
                })
                .eq('id', selectedApp.id);

            if (error) throw error;

            await supabase.from('sponsor_assignments').insert({
                sponsor_id: selectedSponsor,
                application_id: selectedApp.id,
            });

            toast.success('Sponsor assigned successfully');
            setShowAssignModal(false);
            setSelectedSponsor('');
            fetchApplications();
            fetchSponsors();
        } catch (error) {
            console.error('Error assigning sponsor:', error);
            toast.error('Failed to assign sponsor');
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500';
            case 'accepted_stage1': return 'bg-blue-500';
            case 'pending_stage2': return 'bg-orange-500';
            case 'accepted_stage2': return 'bg-green-500';
            case 'assigned_to_sponsor': return 'bg-purple-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pending Review';
            case 'accepted_stage1': return 'Accepted - Stage 1';
            case 'pending_stage2': return 'Pending - Stage 2';
            case 'accepted_stage2': return 'Accepted - Stage 2';
            case 'assigned_to_sponsor': return 'Assigned to Sponsor';
            case 'rejected': return 'Rejected';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            {/* 4 Main Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Student Applicants Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveView('students')}
                    className={`p-6 rounded-lg cursor-pointer transition-all ${activeView === 'students'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl'
                        : darkMode ? 'bg-[#0a1628] hover:bg-[#1a2942]' : 'bg-white hover:bg-gray-50'
                        } shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <GraduationCap className={`w-10 h-10 ${activeView === 'students' ? 'text-white' : 'text-blue-500'}`} />
                        {activeView === 'students' && (
                            <CheckCircle className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${activeView === 'students' ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Student Applicants
                    </h3>
                    <p className={`text-3xl font-bold mb-2 ${activeView === 'students' ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {applications.length}
                    </p>
                    <p className={`text-sm ${activeView === 'students' ? 'text-blue-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {applications.filter(a => a.status === 'pending').length} pending review
                    </p>
                </motion.div>

                {/* Becoming Sponsor Applications Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveView('sponsor-apps')}
                    className={`p-6 rounded-lg cursor-pointer transition-all ${activeView === 'sponsor-apps'
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl'
                        : darkMode ? 'bg-[#0a1628] hover:bg-[#1a2942]' : 'bg-white hover:bg-gray-50'
                        } shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <UserPlus className={`w-10 h-10 ${activeView === 'sponsor-apps' ? 'text-white' : 'text-purple-500'}`} />
                        {activeView === 'sponsor-apps' && (
                            <CheckCircle className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${activeView === 'sponsor-apps' ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Becoming Sponsor
                    </h3>
                    <p className={`text-3xl font-bold mb-2 ${activeView === 'sponsor-apps' ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {sponsorApplications.length}
                    </p>
                    <p className={`text-sm ${activeView === 'sponsor-apps' ? 'text-purple-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {sponsorApplications.filter(s => s.status === 'pending').length} pending approval
                    </p>
                </motion.div>

                {/* Active Sponsors List Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setActiveView('sponsors-list')}
                    className={`p-6 rounded-lg cursor-pointer transition-all ${activeView === 'sponsors-list'
                        ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-xl'
                        : darkMode ? 'bg-[#0a1628] hover:bg-[#1a2942]' : 'bg-white hover:bg-gray-50'
                        } shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Building className={`w-10 h-10 ${activeView === 'sponsors-list' ? 'text-white' : 'text-green-500'}`} />
                        {activeView === 'sponsors-list' && (
                            <CheckCircle className="w-6 h-6 text-white" />
                        )}
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${activeView === 'sponsors-list' ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Active Sponsors
                    </h3>
                    <p className={`text-3xl font-bold mb-2 ${activeView === 'sponsors-list' ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activeSponsorsList.length}
                    </p>
                    <p className={`text-sm ${activeView === 'sponsors-list' ? 'text-green-100' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Currently active partners
                    </p>
                </motion.div>

                {/* Completed/Success Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <Award className="w-10 h-10 text-orange-500" />
                    </div>
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Completed
                    </h3>
                    <p className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {applications.filter(a => a.status === 'accepted_stage2').length}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Successfully completed
                    </p>
                </motion.div>
            </div>

            {/* Filters */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg mb-6`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                    ? 'bg-[#1a2942] border-gray-700 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className={`px-4 py-2 rounded-lg border ${darkMode
                                ? 'bg-[#1a2942] border-gray-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted_stage1">Accepted Stage 1</option>
                            <option value="pending_stage2">Pending Stage 2</option>
                            <option value="accepted_stage2">Accepted Stage 2</option>
                            <option value="assigned_to_sponsor">Assigned to Sponsor</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Conditional Content Based on Active View */}
            {activeView === 'students' && (
                <>
                    {/* Applications Table */}
                    <div className={`rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg overflow-hidden`}>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className={darkMode ? 'bg-[#1a2942]' : 'bg-gray-50'}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Applicant
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Certification
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Status
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Stage
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Submitted
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {filteredApplications.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center">
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    No applications found
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredApplications.map((app) => (
                                            <tr key={app.id} className={darkMode ? 'hover:bg-[#1a2942]' : 'hover:bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {app.full_name}
                                                        </div>
                                                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {app.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {app.certification_name}
                                                    </div>
                                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        ${app.certification_cost}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)} text-white`}>
                                                        {getStatusText(app.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        Stage {app.current_stage}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {new Date(app.submitted_at).toLocaleDateString()}
                                                    </div>
                                                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        {new Date(app.submitted_at).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => setSelectedApp(app)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Sponsor Applications View */}
            {activeView === 'sponsor-apps' && (
                <div className={`p-8 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg text-center`}>
                    <UserPlus className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Sponsor Applications
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        View and manage people applying to become sponsors/partners
                    </p>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {sponsorApplications.length} Applications
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {sponsorApplications.filter(s => s.status === 'pending').length} Pending | {sponsorApplications.filter(s => s.status === 'approved').length} Approved
                    </p>
                </div>
            )}

            {/* Active Sponsors List View */}
            {activeView === 'sponsors-list' && (
                <div className={`p-8 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg text-center`}>
                    <Building className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Active Sponsors
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        List of current active sponsors/partners
                    </p>
                    <p className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activeSponsorsList.length} Active Sponsors
                    </p>
                </div>
            )}

            {/* Application Detail Modal - Copy from AdminApplicationsPage */}
            <AnimatePresence>
                {selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedApp(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`${darkMode ? 'bg-[#1a2942]' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Application Details
                                    </h2>
                                    <button
                                        onClick={() => setSelectedApp(null)}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#0a1628]' : 'hover:bg-gray-100'}`}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Personal Information */}
                                <div className="mb-6">
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.full_name}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.email}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.phone}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date of Birth</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {new Date(selectedApp.date_of_birth).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Gender</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.gender}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nationality</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.nationality}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedApp.address}, {selectedApp.city}, {selectedApp.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Education Information */}
                                <div className="mb-6">
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Education Background
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Education Level</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.education_level}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Institution</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.institution_name}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Field of Study</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.field_of_study}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Certification Details */}
                                <div className="mb-6">
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Certification Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Certification Name</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.certification_name}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cost</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>${selectedApp.certification_cost}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Why This Certification</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.why_certification}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Career Goals</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.career_goals}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Financial Situation</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.financial_situation}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Application Status */}
                                <div className="mb-6">
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Application Status
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Status</p>
                                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedApp.status)} text-white`}>
                                                {getStatusText(selectedApp.status)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Stage</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stage {selectedApp.current_stage}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Submitted</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {new Date(selectedApp.submitted_at).toLocaleDateString()}
                                            </p>
                                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {new Date(selectedApp.submitted_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="border-t pt-6 space-y-4">
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Actions
                                    </h3>

                                    {selectedApp.status === 'pending' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => updateApplicationStatus(selectedApp.id, 'accepted_stage1', 1)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Accept to Stage 1
                                            </button>
                                            <button
                                                onClick={() => updateApplicationStatus(selectedApp.id, 'rejected')}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {selectedApp.status === 'accepted_stage1' && (
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => setShowAssignModal(true)}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                                            >
                                                <UserCheck className="w-5 h-5" />
                                                Assign to Sponsor
                                            </button>
                                            <button
                                                onClick={() => updateApplicationStatus(selectedApp.id, 'pending_stage2', 2)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                            >
                                                Move to Stage 2
                                            </button>
                                        </div>
                                    )}

                                    {selectedApp.status === 'pending_stage2' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => updateApplicationStatus(selectedApp.id, 'accepted_stage2', 2)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                Accept Stage 2 (Final)
                                            </button>
                                            <button
                                                onClick={() => updateApplicationStatus(selectedApp.id, 'rejected')}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assign Sponsor Modal */}
            <AnimatePresence>
                {showAssignModal && selectedApp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowAssignModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className={`${darkMode ? 'bg-[#1a2942]' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full p-6`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Assign Sponsor
                                </h2>
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#0a1628]' : 'hover:bg-gray-100'}`}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Select a sponsor for <strong>{selectedApp.full_name}</strong>'s application
                                </p>

                                <div className="space-y-3">
                                    {sponsors.length === 0 ? (
                                        <p className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No active sponsors available
                                        </p>
                                    ) : (
                                        sponsors.map((sponsor) => (
                                            <div
                                                key={sponsor.id}
                                                onClick={() => setSelectedSponsor(sponsor.id)}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedSponsor === sponsor.id
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : darkMode
                                                        ? 'border-gray-700 hover:border-gray-600'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {sponsor.full_name}
                                                        </h4>
                                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {sponsor.email}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            Active Sponsorships
                                                        </p>
                                                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {sponsor.active_sponsorships} / {sponsor.max_sponsorships}
                                                        </p>
                                                    </div>
                                                </div>
                                                {sponsor.active_sponsorships >= sponsor.max_sponsorships && (
                                                    <p className="text-sm text-red-500 mt-2">
                                                        This sponsor has reached their maximum capacity
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAssignModal(false)}
                                    className={`flex-1 px-4 py-2 rounded-lg border ${darkMode
                                        ? 'border-gray-700 hover:bg-[#0a1628]'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={assignSponsor}
                                    disabled={!selectedSponsor}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
                                >
                                    Assign Sponsor
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
