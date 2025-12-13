import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Search, Filter, X, Mail, Phone, Building } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface SponsorApplication {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company_name: string;
    company_website: string;
    sponsorship_amount: number;
    motivation: string;
    status: string;
    submitted_at: string;
}

interface SponsorApplicationsManagerProps {
    darkMode: boolean;
}

export function SponsorApplicationsManager({ darkMode }: SponsorApplicationsManagerProps) {
    const [applications, setApplications] = useState<SponsorApplication[]>([]);
    const [selectedApp, setSelectedApp] = useState<SponsorApplication | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            if (!supabase) {
                toast.error('Supabase not configured');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('sponsor_applications')
                .select('*')
                .order('submitted_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (error) {
            console.error('Error fetching sponsor applications:', error);
            toast.error('Failed to load sponsor applications');
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (appId: string, newStatus: string) => {
        try {
            if (!supabase) return;

            const { error } = await supabase
                .from('sponsor_applications')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', appId);

            if (error) throw error;

            toast.success(`Application ${newStatus}`);
            fetchApplications();
            setSelectedApp(null);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500';
            case 'approved': return 'bg-green-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-gray-500';
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
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Applications</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {applications.length}
                            </p>
                        </div>
                        <Building className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {applications.filter(a => a.status === 'pending').length}
                            </p>
                        </div>
                        <XCircle className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Approved</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {applications.filter(a => a.status === 'approved').length}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg mb-6`}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or company..."
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
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

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
                                    Company
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Amount
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Status
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
                                            No sponsor applications found
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
                                                {app.company_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                ${app.sponsorship_amount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)} text-white`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(app.submitted_at).toLocaleDateString()}
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

            {/* Detail Modal */}
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
                            className={`${darkMode ? 'bg-[#1a2942]' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Sponsor Application Details
                                    </h2>
                                    <button
                                        onClick={() => setSelectedApp(null)}
                                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-[#0a1628]' : 'hover:bg-gray-100'}`}
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Applicant Info */}
                                <div className="mb-6">
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Applicant Information
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
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</p>
                                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedApp.status)} text-white`}>
                                                {selectedApp.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Info */}
                                <div className="mb-6">
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Company Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Company Name</p>
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedApp.company_name}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Website</p>
                                            <a href={selectedApp.company_website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                                                {selectedApp.company_website}
                                            </a>
                                        </div>
                                        <div className="col-span-2">
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sponsorship Amount</p>
                                            <p className={`font-medium text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>${selectedApp.sponsorship_amount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Motivation */}
                                <div className="mb-6">
                                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Motivation
                                    </h3>
                                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {selectedApp.motivation}
                                    </p>
                                </div>

                                {/* Actions */}
                                {selectedApp.status === 'pending' && (
                                    <div className="border-t pt-6 flex gap-3">
                                        <button
                                            onClick={() => updateApplicationStatus(selectedApp.id, 'approved')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Approve
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
