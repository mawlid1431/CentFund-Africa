import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, MapPin, Calendar, Users } from 'lucide-react';
import { getSuccessStories, deleteSuccessStory } from '@/utils/supabase/helpers';
import { SuccessStoryForm } from './SuccessStoryForm';
import { toast } from 'sonner';

interface SuccessStoriesManagerProps {
    darkMode: boolean;
}

export function SuccessStoriesManager({ darkMode }: SuccessStoriesManagerProps) {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedStory, setSelectedStory] = useState<any>(null);

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            setLoading(true);
            const data = await getSuccessStories();
            setStories(data);
        } catch (error) {
            console.error('Error loading success stories:', error);
            toast.error('Failed to load success stories');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (story: any) => {
        setSelectedStory(story);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this success story?')) return;

        try {
            await deleteSuccessStory(id);
            toast.success('Success story deleted');
            loadStories();
        } catch (error) {
            console.error('Error deleting success story:', error);
            toast.error('Failed to delete success story');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedStory(null);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Success Stories
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage success stories from beneficiaries
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white rounded-lg shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    Add Success Story
                </motion.button>
            </div>

            {/* Stories Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6f0f] mx-auto"></div>
                </div>
            ) : stories.length === 0 ? (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>No success stories yet. Add your first story!</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {stories.map((story) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${darkMode ? 'bg-[#0a1628] border-white/10' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-lg`}
                        >
                            {/* Profile */}
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={story.image}
                                    alt={story.name}
                                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                                />
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {story.name}, {story.age}
                                    </h3>
                                    <div className="inline-flex items-center gap-2 bg-[#ff6f0f] text-white px-3 py-1 rounded-full text-xs mt-1">
                                        <span className="font-medium">{story.project}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-3 text-xs mb-3">
                                <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <MapPin className="w-3 h-3" />
                                    {story.location}
                                </div>
                                <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Calendar className="w-3 h-3" />
                                    {story.date}
                                </div>
                            </div>

                            {/* Story */}
                            <p className={`text-sm mb-4 line-clamp-3 italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                "{story.story}"
                            </p>

                            {/* Impact */}
                            <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] flex items-center justify-center flex-shrink-0">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Impact
                                    </p>
                                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {story.impact}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(story)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(story.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <SuccessStoryForm
                    darkMode={darkMode}
                    story={selectedStory}
                    onClose={handleCloseForm}
                    onSuccess={loadStories}
                />
            )}
        </div>
    );
}
