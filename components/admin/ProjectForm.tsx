import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Image as ImageIcon, Calendar, FileText, Upload, Loader } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

interface Project {
    id: string;
    name: string;
    date: string;
    description: string;
    image: string;
    video_url: string | null;
}

interface ProjectFormProps {
    darkMode: boolean;
    project: Project | null;
    onSave: (project: Omit<Project, 'id'>) => void;
    onCancel: () => void;
}

export function ProjectForm({ darkMode, project, onSave, onCancel }: ProjectFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        description: '',
        image: '',
        video_url: ''
    });
    const [hasVideo, setHasVideo] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (project) {
            setFormData({
                name: project.name,
                date: project.date || '',
                description: project.description,
                image: project.image,
                video_url: project.video_url || ''
            });
            setImagePreview(project.image);
            setHasVideo(!!project.video_url);
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If there's a new image file, upload it first
        if (imageFile) {
            setUploading(true);
            const imageUrl = await uploadImage(imageFile);
            if (imageUrl) {
                formData.image = imageUrl;
            }
            setUploading(false);
        }

        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `projects/${fileName}`;

            // Upload to Supabase Storage
            const { error } = await supabase.storage
                .from('project-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Upload error:', error);
                alert('Failed to upload image. Please try again.');
                return null;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
            return null;
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, image: '' }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl modal-mobile ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                    }`}
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 border-b ${darkMode ? 'bg-[#0a1628] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onCancel}
                        className={`p-2 sm:p-3 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Project Name */}
                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <FileText className="w-4 h-4" />
                            Project Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter project name"
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                }`}
                        />
                    </div>

                    {/* Project Description */}
                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <FileText className="w-4 h-4" />
                            Project Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Enter detailed project description"
                            className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${darkMode
                                ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                }`}
                        />
                    </div>

                    {/* Project Date */}
                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <Calendar className="w-4 h-4" />
                            Project Date *
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                ? 'bg-[#0a1628] border-white/10 text-white focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                : 'bg-white border-gray-300 text-gray-900 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                }`}
                        />
                    </div>

                    {/* Video Link Option */}
                    <div>
                        <label className={`text-sm font-medium mb-3 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Does this project have a video link?
                        </label>
                        <div className="flex items-center gap-6 mb-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="hasVideo"
                                    checked={hasVideo === true}
                                    onChange={() => setHasVideo(true)}
                                    className="w-4 h-4 text-[#ff6f0f] focus:ring-[#ff6f0f] focus:ring-2"
                                />
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="hasVideo"
                                    checked={hasVideo === false}
                                    onChange={() => {
                                        setHasVideo(false);
                                        setFormData(prev => ({ ...prev, video_url: '' }));
                                    }}
                                    className="w-4 h-4 text-[#ff6f0f] focus:ring-[#ff6f0f] focus:ring-2"
                                />
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No</span>
                            </label>
                        </div>

                        {hasVideo && (
                            <div>
                                <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Video URL
                                </label>
                                <input
                                    type="url"
                                    name="video_url"
                                    value={formData.video_url}
                                    onChange={handleChange}
                                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                                    className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                        ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                        }`}
                                />
                            </div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <ImageIcon className="w-4 h-4" />
                            Project Image *
                        </label>

                        {/* Upload Button */}
                        <div className="space-y-3">
                            <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${darkMode
                                ? 'bg-[#0a1628] border-white/20 hover:border-[#ff6f0f] hover:bg-[#0a1628]/80'
                                : 'bg-gray-50 border-gray-300 hover:border-[#ff6f0f] hover:bg-gray-100'
                                }`}>
                                <Upload className="w-5 h-5 text-[#ff6f0f]" />
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {imageFile ? imageFile.name : 'Click to upload project image'}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Supported: JPG, PNG, GIF (Max 5MB)
                            </p>
                        </div>

                        {/* Image Preview */}
                        {(imagePreview || formData.image) && (
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-2">
                                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Image Preview:
                                    </p>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={removeImage}
                                        className={`text-xs px-2 py-1 rounded transition-all ${darkMode
                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                            }`}
                                    >
                                        Remove
                                    </motion.button>
                                </div>
                                <div className="relative">
                                    <img
                                        src={imagePreview || formData.image}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800';
                                        }}
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                            <Loader className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onCancel}
                            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${darkMode
                                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                                }`}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            disabled={uploading}
                            whileHover={{ scale: uploading ? 1 : 1.02 }}
                            whileTap={{ scale: uploading ? 1 : 0.98 }}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white rounded-lg font-medium shadow-lg shadow-[#ff6f0f]/30 hover:shadow-xl hover:shadow-[#ff6f0f]/40 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {uploading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {project ? 'Update Project' : 'Create Project'}
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
