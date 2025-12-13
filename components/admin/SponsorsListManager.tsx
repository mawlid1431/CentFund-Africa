import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Search, Filter, X, Users, Clock } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface Sponsor {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    organization: string;
    project_id: string;
    amount: number;
    sponsor_type: string;
    status: string;
    id_document_url: string;
    proof_of_funds_url: string;
    created_at: string;
    updated_at: string;
}

interface SponsorsListManagerProps {
    darkMode: boolean;
}

export function SponsorsListManager({ darkMode }: SponsorsListManagerProps) {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);
    const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            if (!supabase) {
                toast.error('Supabase not configured');
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('sponsors')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSponsors(data || []);
        } catch (error) {
            console.error('Error fetching sponsors:', error);
            toast.error('Failed to load sponsors');
        } finally {
            setLoading(false);
        }
    };

    const updateSponsorStatus = async (sponsorId: string, newStatus: string) => {
        try {
            if (!supabase) return;

            const { error } = await supabase
                .from('sponsors')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', sponsorId);

            if (error) throw error;

            toast.success(`Sponsor ${newStatus}`);
            fetchSponsors();
            setSelectedSponsor(null);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredSponsors = sponsors.filter(sponsor => {
        const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sponsor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (sponsor.organization && sponsor.organization.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' || sponsor.status === filterStatus;
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

    const getTypeColor = (type: string) => {
        return type === 'full' ? 'bg-blue-500' : 'bg-purple-500';
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Sponsors</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {sponsors.length}
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pending</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {sponsors.filter(s => s.status === 'pending').length}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Approved</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {sponsors.filter(s => s.status === 'approved').length}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className={`p-6 rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Amount</p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                ${sponsors.reduce((sum, s) => sum + Number(s.amount), 0).toLocaleString()}
                            </p>
                        </div>
                        <XCircle className="w-8 h-8 text-purple-500" />
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
                                placeholder="Search by name, email, or organization..."
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

            {/* Sponsors Table */}
            <div className={`rounded-lg ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} shadow-lg overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={darkMode ? 'bg-[#1a2942]' : 'bg-gray-50'}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Sponsor
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Organization
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Type
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Amount
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Status
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Date
                                </th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredSponsors.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center">
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            No sponsors found
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                filteredSponsors.map((sponsor) => (
                                    <tr key={sponsor.id} className={darkMode ? 'hover:bg-[#1a2942]' : 'hover:bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {sponsor.name}
                                                </div>
                                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {sponsor.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {sponsor.organization || 'Individual'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(sponsor.sponsor_type)} text-white`}>
                                                {sponsor.sponsor_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                ${Number(sponsor.amount).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sponsor.status)} text-white`}>
                                                {sponsor.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {new Date(sponsor.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => setSelectedSponsor(sponsor)}
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
