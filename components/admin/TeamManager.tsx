import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Users, Loader } from 'lucide-react';
import { TeamForm } from './TeamForm';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/utils/supabase/helpers';
import { toast } from 'sonner';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    displayOrder: number;
    linkedinUrl?: string;
    email?: string;
}

interface TeamManagerProps {
    darkMode: boolean;
}

export function TeamManager({ darkMode }: TeamManagerProps) {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            setLoading(true);
            const data = await getTeamMembers();
            setMembers(data);
        } catch (error) {
            console.error('Error loading team members:', error);
            toast.error('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (memberData: Omit<TeamMember, 'id'>) => {
        try {
            if (editingMember) {
                await updateTeamMember(editingMember.id, memberData);
                toast.success('Team member updated successfully');
            } else {
                await createTeamMember(memberData);
                toast.success('Team member added successfully');
            }
            setShowForm(false);
            setEditingMember(null);
            loadMembers();
        } catch (error) {
            console.error('Error saving team member:', error);
            toast.error('Failed to save team member');
        }
    };

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this team member?')) return;

        try {
            await deleteTeamMember(id);
            toast.success('Team member deleted successfully');
            loadMembers();
        } catch (error) {
            console.error('Error deleting team member:', error);
            toast.error('Failed to delete team member');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingMember(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Users className={`w-6 h-6 ${darkMode ? 'text-[#ff6f0f]' : 'text-[#ff6f0f]'}`} />
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Team Members
                    </h2>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white rounded-lg font-medium shadow-lg shadow-[#ff6f0f]/30 hover:shadow-xl hover:shadow-[#ff6f0f]/40 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Member
                </motion.button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader className={`w-8 h-8 animate-spin ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                </div>
            ) : members.length === 0 ? (
                <div className={`text-center py-12 rounded-xl border-2 border-dashed ${darkMode ? 'border-white/10 text-gray-400' : 'border-gray-300 text-gray-500'
                    }`}>
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium">No team members yet</p>
                    <p className="text-sm mt-1">Click "Add Member" to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`rounded-xl overflow-hidden ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                                } shadow-lg hover:shadow-xl transition-all`}
                        >
                            <div className="relative h-64 overflow-hidden group">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleEdit(member)}
                                        className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(member.id)}
                                        className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {member.name}
                                </h3>
                                <p className="text-[#ff6f0f] text-sm">{member.role}</p>
                                {(member.linkedinUrl || member.email) && (
                                    <div className="flex justify-center gap-2 mt-3">
                                        {member.linkedinUrl && (
                                            <a
                                                href={member.linkedinUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                LinkedIn
                                            </a>
                                        )}
                                        {member.email && (
                                            <a
                                                href={`mailto:${member.email}`}
                                                className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                Email
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showForm && (
                    <TeamForm
                        darkMode={darkMode}
                        member={editingMember}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
