import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Star } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { toast } from 'sonner';

interface TestimonialFormProps {
    darkMode: boolean;
    testimonial?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export function TestimonialForm({ darkMode, testimonial, onClose, onSuccess }: TestimonialFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        location: '',
        rating: 5,
        feedback: '',
        project: '',
        date: '',
        image: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (testimonial) {
            setFormData({
                name: testimonial.name || '',
                role: testimonial.role || '',
                location: testimonial.location || '',
                rating: testimonial.rating || 5,
                feedback: testimonial.feedback || '',
                project: testimonial.project || '',
                date: testimonial.date || '',
                image: testimonial.image || ''
            });
            setImagePreview(testimonial.image || '');
        }
    }, [testimonial]);

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
            .from('testimonial-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('testimonial-images')
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

            const testimonialData = {
                ...formData,
                image: imageUrl
            };

            if (testimonial) {
                const { error } = await supabase
                    .from('testimonials')
                    .update(testimonialData)
                    .eq('id', testimonial.id);

                if (error) throw error;
                toast.success('Testimonial updated successfully!');
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .insert([testimonialData]);

                if (error) throw error;
                toast.success('Testimonial created successfully!');
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error saving testimonial:', error);
            toast.error(error.message || 'Failed to save testimonial');
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
                        {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
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
                                    className="w-20 h-20 rounded-full object-cover border-2 border-[#ff6f0f]"
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

                    {/* Role */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Role *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            placeholder="e.g., Community Leader, Teacher, Doctor"
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

                    {/* Rating */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Rating *
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= formData.rating ? 'fill-[#ff6f0f] text-[#ff6f0f]' : 'text-gray-400'}`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Feedback */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Feedback *
                        </label>
                        <textarea
                            required
                            value={formData.feedback}
                            onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                            rows={4}
                            placeholder="Share the testimonial feedback..."
                            className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-white/20' : 'border-gray-300'}`}
                        />
                    </div>

                    {/* Project */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Project *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.project}
                            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                            placeholder="e.g., Clean Water Initiative"
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
                            {loading ? 'Saving...' : testimonial ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
