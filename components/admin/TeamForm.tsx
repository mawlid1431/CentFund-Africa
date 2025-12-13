import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Save, Image as ImageIcon, User, Briefcase, Upload, Loader, Linkedin, Mail } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    displayOrder: number;
    linkedinUrl?: string;
    email?: string;
}

interface TeamFormProps {
    darkMode: boolean;
    member: TeamMember | null;
    onSave: (member: Omit<TeamMember, 'id'>) => void;
    onCancel: () => void;
}

export function TeamForm({ darkMode, member, onSave, onCancel }: TeamFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: '',
        displayOrder: 0,
        linkedinUrl: '',
        email: ''
    });

    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name,
                role: member.role,
                image: member.image,
                displayOrder: member.displayOrder,
                linkedinUrl: member.linkedinUrl || '',
                email: member.email || ''
            });
            setImagePreview(member.image);
        }
    }, [member]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'displayOrder' ? parseInt(value) || 0 : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            setImageFile(file);

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
            const filePath = `team/${fileName}`;

            const { error } = await supabase.storage
                .from('team-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Upload error:', error);
                alert('Failed to upload image. Please try again.');
                return null;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('team-images')
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                    }`}
            >
                <div className={`sticky top-0 z-10 flex justify-between items-center p-6 border-b ${darkMode ? 'bg-[#0a1628] border-white/10' : 'bg-white border-gray-200'
                    }`}>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {member ? 'Edit Team Member' : 'Add Team Member'}
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onCancel}
                        className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                            }`}
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <User className="w-4 h-4" />
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter member name"
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                    ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                }`}
                        />
                    </div>

                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <Briefcase className="w-4 h-4" />
                            Role *
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Founder & CEO"
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                    ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                }`}
                        />
                    </div>

                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <ImageIcon className="w-4 h-4" />
                            Profile Image *
                        </label>

                        <div className="space-y-3">
                            <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${darkMode
                                    ? 'bg-[#0a1628] border-white/20 hover:border-[#ff6f0f] hover:bg-[#0a1628]/80'
                                    : 'bg-gray-50 border-gray-300 hover:border-[#ff6f0f] hover:bg-gray-100'
                                }`}>
                                <Upload className="w-5 h-5 text-[#ff6f0f]" />
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {imageFile ? imageFile.name : 'Click to upload image'}
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
                                        className="w-full h-64 object-cover rounded-lg"
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

                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <Linkedin className="w-4 h-4" />
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            placeholder="https://linkedin.com/in/username"
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                    ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                }`}
                        />
                    </div>

                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            <Mail className="w-4 h-4" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                    ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                }`}
                        />
                    </div>

                    <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            Display Order
                        </label>
                        <input
                            type="number"
                            name="displayOrder"
                            value={formData.displayOrder}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            className={`w-full px-4 py-3 rounded-lg border transition-all ${darkMode
                                    ? 'bg-[#0a1628] border-white/10 text-white placeholder-gray-400 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#ff6f0f] focus:ring-2 focus:ring-[#ff6f0f]/20'
                                }`}
                        />
                        <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Lower numbers appear first
                        </p>
                    </div>

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
                                    {member ? 'Update Member' : 'Add Member'}
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
