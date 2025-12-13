import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Upload } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface SuccessStoryFormProps {
    darkMode: boolean;
    story?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export function SuccessStoryForm({ darkMode, story, onClose, onSuccess }: SuccessStoryFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        story: '',
        date: '',
        image: '',
        video_url: ''
    });
    const [hasVideo, setHasVideo] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (story) {
            setFormData({
                name: story.name || '',
                location: story.location || '',
                story: story.story || '',
                date: story.date || '',
                image: story.image || '',
                video_url: story.video_url || ''
            });
            setImagePreview(story.image || '');
            setHasVideo(!!story.video_url);
        }
    }, [story]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('success-story-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('success-story-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = formData.image;

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            const storyData = {
                ...formData,
                image: imageUrl,
                age: 0, // Default age
                project: 'Community Project', // Default project
                impact: 'Positive community impact' // Default impact
            };

            if (story) {
                const { error } = await supabase
                    .from('success_stories')
                    .update(storyData)
                    .eq('id', story.id);

                if (error) throw error;
                toast.success('Success story updated!');
            } else {
                const { error } = await supabase
                    .from('success_stories')
                    .insert([storyData]);

                if (error) throw error;
                toast.success('Success story created!');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error saving success story:', error);
            toast.error(error.message || 'Failed to save success story');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${darkMode ? 'bg-[#0a1628]' : 'bg-white'} rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {story ? 'Edit Success Story' : 'Add New Success Story'}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                        <X className={darkMode ? 'text-white' : 'text-gray-900'} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Profile Image *
                        </label>
                        <div className="flex items-center gap-4">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-20 h-20 rounded-2xl object-cover"
                                />
                            )}
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                <Upload className="w-4 h-4" />
                                <span>Upload Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-white/20' : 'border-gray-300'}`}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Location *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="e.g., Hargeisa, Somaliland"
                            className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-white/20' : 'border-gray-300'}`}
                        />
                    </div>

                    {/* Story */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Story / Description *
                        </label>
                        <textarea
                            required
                            value={formData.story}
                            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                            rows={4}
                            placeholder="Share their success story..."
                            className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-white/20' : 'border-gray-300'}`}
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Date *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            placeholder="e.g., March 2024"
                            className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-white/20' : 'border-gray-300'}`}
                        />
                    </div>

                    {/* Video Link Option */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Does this project have a video link?
                        </label>
                        <div className="flex items-center gap-4 mb-3">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="hasVideo"
                                    checked={hasVideo === true}
                                    onChange={() => {
                                        setHasVideo(true);
                                    }}
                                    className="text-[#ff6f0f]"
                                />
                                <span className={darkMode ? 'text-white' : 'text-gray-700'}>Yes</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="hasVideo"
                                    checked={hasVideo === false}
                                    onChange={() => {
                                        setHasVideo(false);
                                        setFormData({ ...formData, video_url: '' });
                                    }}
                                    className="text-[#ff6f0f]"
                                />
                                <span className={darkMode ? 'text-white' : 'text-gray-700'}>No</span>
                            </label>
                        </div>

                        {hasVideo && (
                            <input
                                type="url"
                                value={formData.video_url}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                                className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-white/20' : 'border-gray-300'}`}
                            />
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-4 py-2 rounded-lg ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : story ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
