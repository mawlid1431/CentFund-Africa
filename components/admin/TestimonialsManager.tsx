import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Star, MapPin, Calendar } from 'lucide-react';
import { getTestimonials, deleteTestimonial } from '@/utils/supabase/helpers';
import { TestimonialForm } from './TestimonialForm';
import { toast } from 'sonner';

interface TestimonialsManagerProps {
    darkMode: boolean;
}

export function TestimonialsManager({ darkMode }: TestimonialsManagerProps) {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            setLoading(true);
            const data = await getTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error('Error loading testimonials:', error);
            toast.error('Failed to load testimonials');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (testimonial: any) => {
        setSelectedTestimonial(testimonial);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            await deleteTestimonial(id);
            toast.success('Testimonial deleted successfully');
            loadTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            toast.error('Failed to delete testimonial');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedTestimonial(null);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Testimonials
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage testimonials and feedback from beneficiaries
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white rounded-lg shadow-lg min-h-[44px] text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add Testimonial
                </motion.button>
            </div>

            {/* Testimonials Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6f0f] mx-auto"></div>
                </div>
            ) : testimonials.length === 0 ? (
                <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>No testimonials yet. Add your first testimonial!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${darkMode ? 'bg-[#0a1628] border-white/10' : 'bg-white border-gray-200'} border rounded-xl p-6 shadow-lg`}
                        >
                            {/* Profile */}
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-[#ff6f0f]"
                                />
                                <div>
                                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {testimonial.name}
                                    </h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-1 mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-[#ff6f0f] text-[#ff6f0f]" />
                                ))}
                            </div>

                            {/* Feedback */}
                            <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                "{testimonial.feedback}"
                            </p>

                            {/* Meta Info */}
                            <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                                <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <MapPin className="w-3 h-3" />
                                    {testimonial.location}
                                </div>
                                <div className={`flex items-center gap-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Calendar className="w-3 h-3" />
                                    {testimonial.date}
                                </div>
                                <div>
                                    <span className="inline-block px-2 py-1 bg-[#ff6f0f]/10 text-[#ff6f0f] rounded-full text-xs">
                                        {testimonial.project}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(testimonial)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(testimonial.id)}
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
                <TestimonialForm
                    darkMode={darkMode}
                    testimonial={selectedTestimonial}
                    onClose={handleCloseForm}
                    onSuccess={loadTestimonials}
                />
            )}
        </div>
    );
}
