import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, Quote, MapPin, Calendar, ThumbsUp, Loader } from 'lucide-react';
import { getTestimonials } from '@/utils/supabase/helpers';

interface TestimonialsPageProps {
    darkMode: boolean;
    onNavigate: (page: string) => void;
}

export function TestimonialsPage({ darkMode, onNavigate }: TestimonialsPageProps) {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const data = await getTestimonials();
            setTestimonials(data.length > 0 ? data : hardcodedTestimonials);
        } catch (error) {
            console.error('Error loading testimonials:', error);
            setTestimonials(hardcodedTestimonials);
        } finally {
            setLoading(false);
        }
    };

    // Hardcoded testimonials
    const hardcodedTestimonials = [
        {
            id: '1',
            name: 'Ahmed Ali',
            role: 'CCNA Graduate',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
            rating: 5,
            feedback: 'CertFund Africa made my dream of becoming a certified network engineer possible. The support and guidance throughout the process was exceptional.',
            location: 'Cairo, Egypt',
            date: 'February 2024',
            project: 'CCNA Networking',
        },
        {
            id: '2',
            name: 'Halima Noor',
            role: 'AWS Certified',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            rating: 5,
            feedback: 'With CertFund Africa, I gained AWS certification and started a remote developer career. This platform truly changes lives.',
            location: 'Mogadishu, Somalia',
            date: 'January 2024',
            project: 'AWS Cloud Practitioner',
        },
        {
            id: '3',
            name: 'John Mwangi',
            role: 'Investor & Sponsor',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            rating: 5,
            feedback: 'I know my investment truly helps deserving students gain valuable skills. CertFund Africa provides complete transparency and regular updates.',
            location: 'Nairobi, Kenya',
            date: 'March 2024',
            project: 'Multiple Certifications',
        },
        {
            id: '4',
            name: 'Sarah Omondi',
            role: 'Corporate Sponsor',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            rating: 5,
            feedback: 'CertFund Africa is a transparent and trustworthy way to support youth education. We have sponsored 10 students and seen amazing results.',
            location: 'Kampala, Uganda',
            date: 'February 2024',
            project: 'Corporate Sponsorship',
        },
        {
            id: '5',
            name: 'Ibrahim Kamara',
            role: 'CompTIA A+ Graduate',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            rating: 5,
            feedback: 'The certification process was smooth and well-organized. CertFund Africa not only funded my certification but also provided career guidance.',
            location: 'Accra, Ghana',
            date: 'December 2023',
            project: 'CompTIA A+',
        },
        {
            id: '6',
            name: 'Zainab Mohammed',
            role: 'IELTS Graduate',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            rating: 5,
            feedback: 'Thanks to CertFund Africa, I achieved my IELTS target score and secured admission to my dream university. Forever grateful!',
            location: 'Khartoum, Sudan',
            date: 'November 2023',
            project: 'IELTS',
        },
    ];

    return (
        <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-2 bg-[#ff6f0f]/10 border border-[#ff6f0f]/30 rounded-full text-[#ff6f0f] mb-4"
                    >
                        Voices from the Community
                    </motion.span>
                    <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                        Hear From Our Students & Sponsors
                    </h1>
                    <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Hear from students who've completed their certifications and investors who've made it possible. Real voices, real impact.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-[#ff6f0f]" />
                    </div>
                ) : (
                    <>
                        {testimonials.length > 0 ? (
                            <>
                                {/* Testimonials Grid */}
                                <div className={`grid gap-8 mb-16 ${testimonials.length === 1
                                    ? 'grid-cols-1 max-w-md mx-auto'
                                    : testimonials.length === 2
                                        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                    }`}>
                                    {testimonials.map((testimonial, index) => (
                                        <motion.div
                                            key={testimonial.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`${darkMode ? 'bg-[#0a1628] border-white/10' : 'bg-white border-gray-200'} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all relative`}
                                        >
                                            {/* Quote Icon */}
                                            <div className="absolute top-6 right-6 opacity-10">
                                                <Quote className="w-16 h-16 text-[#ff6f0f]" />
                                            </div>

                                            {/* Profile */}
                                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-[#ff6f0f]"
                                                />
                                                <div>
                                                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                        {testimonial.name}
                                                    </h3>
                                                    <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex gap-1 mb-4">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="w-5 h-5 fill-[#ff6f0f] text-[#ff6f0f]" />
                                                ))}
                                            </div>

                                            {/* Feedback */}
                                            <p className={`mb-4 leading-relaxed ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                                "{testimonial.feedback}"
                                            </p>

                                            {/* Meta Info */}
                                            <div className="space-y-2 pt-4 border-t border-white/10">
                                                <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                                    <MapPin className="w-4 h-4" />
                                                    {testimonial.location}
                                                </div>
                                                <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                                    <Calendar className="w-4 h-4" />
                                                    {testimonial.date}
                                                </div>
                                                <div className="pt-2">
                                                    <span className="inline-block px-3 py-1 bg-[#ff6f0f]/10 text-[#ff6f0f] rounded-full text-xs font-medium">
                                                        {testimonial.project}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Stats Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className={`p-12 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-[#0a1628] to-[#0a1628]' : 'bg-gradient-to-r from-gray-50 to-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'} mb-16`}
                                >
                                    <div className="grid md:grid-cols-3 gap-8 text-center">
                                        <div>
                                            <div className="w-16 h-16 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ThumbsUp className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                {testimonials.length}
                                            </h3>
                                            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                                Total Testimonials
                                            </p>
                                        </div>
                                        <div>
                                            <div className="w-16 h-16 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Star className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                {testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : '0.0'}
                                            </h3>
                                            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                                Average Rating
                                            </p>
                                        </div>
                                        <div>
                                            <div className="w-16 h-16 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Quote className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                {testimonials.filter(t => t.rating >= 4).length}
                                            </h3>
                                            <p className={`${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                                Positive Reviews
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Quote className="w-12 h-12 text-white" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                    No Testimonials Yet
                                </h3>
                                <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                    We're working hard to collect testimonials from our community. Check back soon to see what people are saying about our projects.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onNavigate('contact')}
                                    className="bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Share Your Experience
                                </motion.button>
                            </div>
                        )}
                    </>
                )}

                {/* Call to Action */}
                {testimonials.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center"
                    >
                        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                            Want to Share Your Experience?
                        </h2>
                        <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                            We value your feedback and would love to hear about your experience with our projects.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('contact')}
                            className="bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Contact Us
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div >
    );
}