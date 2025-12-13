import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, Building2, Mail, Phone, Globe, MapPin, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

interface PartnershipManagerProps {
    darkMode: boolean;
}

interface Partner {
    id: string;
    name: string;
    type: 'corporate' | 'individual' | 'organization';
    email: string;
    phone: string;
    website?: string;
    address: string;
    city: string;
    country: string;
    contributionAmount: number;
    status: 'active' | 'pending' | 'inactive';
    joinedDate: string;
    sponsoredStudents: number;
}

export function PartnershipManager({ darkMode }: PartnershipManagerProps) {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'corporate' as 'corporate' | 'individual' | 'organization',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        country: '',
        contributionAmount: 0,
        status: 'active' as 'active' | 'pending' | 'inactive',
    });

    useEffect(() => {
        loadPartners();
    }, []);

    const loadPartners = async () => {
        // TODO: Load from Supabase
        const mockPartners: Partner[] = [
            {
                id: '1',
                name: 'Tech Solutions Inc.',
                type: 'corporate',
                email: 'contact@techsolutions.com',
                phone: '+1 234 567 8900',
                website: 'https://techsolutions.com',
                address: '123 Business Ave',
                city: 'New York',
                country: 'USA',
                contributionAmount: 50000,
                status: 'active',
                joinedDate: '2024-01-15',
                sponsoredStudents: 25,
            },
            {
                id: '2',
                name: 'John Smith',
                type: 'individual',
                email: 'john.smith@email.com',
                phone: '+44 20 1234 5678',
                address: '456 Donor Street',
                city: 'London',
                country: 'UK',
                contributionAmount: 5000,
                status: 'active',
                joinedDate: '2024-02-10',
                sponsoredStudents: 3,
            },
            {
                id: '3',
                name: 'Education Foundation',
                type: 'organization',
                email: 'info@edufoundation.org',
                phone: '+252 61 234 5678',
                website: 'https://edufoundation.org',
                address: '789 Charity Road',
                city: 'Hargeisa',
                country: 'Somaliland',
                contributionAmount: 30000,
                status: 'active',
                joinedDate: '2023-12-01',
                sponsoredStudents: 15,
            },
        ];
        setPartners(mockPartners);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingPartner) {
            // Update existing partner
            setPartners(partners.map(p =>
                p.id === editingPartner.id
                    ? { ...p, ...formData }
                    : p
            ));
        } else {
            // Add new partner
            const newPartner: Partner = {
                id: Date.now().toString(),
                ...formData,
                joinedDate: new Date().toISOString().split('T')[0],
                sponsoredStudents: 0,
            };
            setPartners([...partners, newPartner]);
        }

        resetForm();
    };

    const handleEdit = (partner: Partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name,
            type: partner.type,
            email: partner.email,
            phone: partner.phone,
            website: partner.website || '',
            address: partner.address,
            city: partner.city,
            country: partner.country,
            contributionAmount: partner.contributionAmount,
            status: partner.status,
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this partner?')) {
            setPartners(partners.filter(p => p.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'corporate',
            email: '',
            phone: '',
            website: '',
            address: '',
            city: '',
            country: '',
            contributionAmount: 0,
            status: 'active',
        });
        setEditingPartner(null);
        setShowModal(false);
    };

    const getStatusBadge = (status: Partner['status']) => {
        switch (status) {
            case 'active':
                return { icon: CheckCircle, label: 'Active', color: 'bg-green-500/10 text-green-500' };
            case 'pending':
                return { icon: Clock, label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500' };
            case 'inactive':
                return { icon: XCircle, label: 'Inactive', color: 'bg-red-500/10 text-red-500' };
        }
    };

    const getTypeColor = (type: Partner['type']) => {
        switch (type) {
            case 'corporate':
                return 'from-blue-500 to-cyan-500';
            case 'individual':
                return 'from-purple-500 to-indigo-500';
            case 'organization':
                return 'from-orange-500 to-red-500';
        }
    };

    const stats = [
        { label: 'Total Partners', value: partners.length.toString(), color: 'from-blue-500 to-cyan-500' },
        { label: 'Active', value: partners.filter(p => p.status === 'active').length.toString(), color: 'from-green-500 to-emerald-500' },
        { label: 'Total Contributions', value: `$${partners.reduce((sum, p) => sum + p.contributionAmount, 0).toLocaleString()}`, color: 'from-orange-500 to-red-500' },
        { label: 'Students Sponsored', value: partners.reduce((sum, p) => sum + p.sponsoredStudents, 0).toString(), color: 'from-purple-500 to-indigo-500' },
    ];

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Partnership Management
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Add Partner
                </motion.button>
            </div>

            {/* Partners List */}
            <div className="space-y-4">
                {partners.map((partner, index) => {
                    const statusBadge = getStatusBadge(partner.status);
                    return (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-xl transition-all`}
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getTypeColor(partner.type)} flex items-center justify-center flex-shrink-0`}>
                                    <Building2 className="w-8 h-8 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                        <div>
                                            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {partner.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {partner.type}
                                                </span>
                                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                                    <statusBadge.icon className="w-3 h-3" />
                                                    {statusBadge.label}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {partner.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {partner.phone}
                                            </span>
                                        </div>
                                        {partner.website && (
                                            <div className="flex items-center gap-2">
                                                <Globe className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <a
                                                    href={partner.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-[#ff6f0f] hover:underline"
                                                >
                                                    Website
                                                </a>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <MapPin className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {partner.city}, {partner.country}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex flex-wrap gap-4">
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                            <DollarSign className={`w-5 h-5 ${darkMode ? 'text-[#ff6f0f]' : 'text-[#ff6f0f]'}`} />
                                            <div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Total Contribution
                                                </p>
                                                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    ${partner.contributionAmount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                            <Building2 className={`w-5 h-5 ${darkMode ? 'text-[#ff6f0f]' : 'text-[#ff6f0f]'}`} />
                                            <div>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Students Sponsored
                                                </p>
                                                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {partner.sponsoredStudents}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex lg:flex-col gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEdit(partner)}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                            }`}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span className="text-sm">Edit</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDelete(partner.id)}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'
                                            }`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="text-sm">Delete</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={resetForm}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                                } shadow-2xl`}
                        >
                            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Partner Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Partner Type *
                                        </label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        >
                                            <option value="corporate">Corporate</option>
                                            <option value="individual">Individual</option>
                                            <option value="organization">Organization</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Contribution Amount *
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.contributionAmount}
                                            onChange={(e) => setFormData({ ...formData, contributionAmount: parseFloat(e.target.value) })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Address *
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows={3}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Status *
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#0a1628] border-white/10 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={resetForm}
                                        className={`flex-1 px-6 py-3 rounded-lg font-medium ${darkMode ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }`}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-6 py-3 rounded-lg font-medium"
                                    >
                                        {editingPartner ? 'Update Partner' : 'Add Partner'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
