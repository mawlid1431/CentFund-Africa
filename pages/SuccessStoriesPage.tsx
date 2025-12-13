import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, Calendar, Users, Droplet, GraduationCap, Stethoscope, X, Loader, Play } from 'lucide-react';
import { getSuccessStories } from '@/utils/supabase/helpers';

interface SuccessStoriesPageProps {
    darkMode: boolean;
    onNavigate: (page: string) => void;
}

export function SuccessStoriesPage({ darkMode, onNavigate }: SuccessStoriesPageProps) {
    const [selectedStory, setSelectedStory] = useState<any>(null);
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        try {
            const data = await getSuccessStories();
            setStories(data.length > 0 ? data : hardcodedStories);
        } catch (error) {
            console.error('Error loading success stories:', error);
            setStories(hardcodedStories);
        } finally {
            setLoading(false);
        }
    };

    // Hardcoded success stories
    const hardcodedStories = [
        {
            id: '1',
            name: 'Amina Yusuf',
            age: 24,
            project: 'AWS Cloud Practitioner',
            location: 'Nairobi, Kenya',
            date: 'January 2024',
            story: 'Thanks to CentFund Africa, I completed my AWS certification and now work as a cloud engineer for a tech startup. The certification opened doors I never thought possible.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            impact: 'Secured cloud engineer position with 3x salary increase',
            video_url: '',
        },
        {
            id: '2',
            name: 'Mohamed Abdi',
            age: 22,
            project: 'CCNA Networking',
            location: 'Addis Ababa, Ethiopia',
            date: 'December 2023',
            story: 'CentFund Africa made it possible for me to learn networking skills and secure a remote job in IT support. I can now support my family and continue my education.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            impact: 'Landed remote IT support role, supporting family of 5',
            video_url: '',
        },
        {
            id: '3',
            name: 'Fatima Hassan',
            age: 21,
            project: 'IELTS',
            location: 'Lagos, Nigeria',
            date: 'November 2023',
            story: 'I achieved my IELTS score and got admitted to a university abroad. CentFund Africa changed my future and made my dreams come true.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            impact: 'Admitted to UK university with scholarship',
            video_url: '',
        },
        {
            id: '4',
            name: 'David Ochieng',
            age: 26,
            project: 'CompTIA A+',
            location: 'Kampala, Uganda',
            date: 'October 2023',
            story: 'The CompTIA A+ certification through CentFund Africa helped me transition from informal work to a professional IT career. I am now a certified technician.',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            impact: 'Transitioned to professional IT career, 4x income increase',
            video_url: '',
        },
    ];

    // Icon mapping for projects
    const getProjectIcon = (project: string) => {
        if (project.toLowerCase().includes('water')) return Droplet;
        if (project.toLowerCase().includes('education')) return GraduationCap;
        if (project.toLowerCase().includes('medical') || project.toLowerCase().includes('health')) return Stethoscope;
        if (project.toLowerCase().includes('food')) return Heart;
        return Heart;
    };



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
                        Real Impact, Real Lives
                    </motion.span>
                    <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                        Real Stories, Real Impact
                    </h1>
                    <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Meet the students whose careers have been transformed through CentFund Africa. From AWS certifications to CCNA credentials, these are the success stories that drive our mission forward.
                    </p>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-[#ff6f0f]" />
                    </div>
                ) : (
                    <>
                        {stories.length > 0 ? (
                            <>
                                {/* Success Stories Grid */}
                                <div className={`grid gap-8 ${stories.length === 1
                                    ? 'grid-cols-1 max-w-md mx-auto'
                                    : stories.length === 2
                                        ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                    }`}>
                                    {stories.map((story, index) => {
                                        const StoryIcon = story.icon || getProjectIcon(story.project);
                                        return (
                                            <motion.div
                                                key={story.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.03, y: -5 }}
                                                className={`${darkMode ? 'bg-[#0a1628] border-white/10' : 'bg-white border-gray-200'} border rounded-2xl shadow-xl hover:shadow-2xl transition-all p-6`}
                                            >
                                                <div className="flex flex-col gap-4">
                                                    {/* Image - Smaller and Rounded */}
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={story.image}
                                                            alt={story.name}
                                                            className="w-20 h-20 object-cover rounded-2xl shadow-lg flex-shrink-0"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                                {story.name}, {story.age}
                                                            </h3>
                                                            <div className="inline-flex items-center gap-2 bg-[#ff6f0f] text-white px-3 py-1 rounded-full text-xs mt-1">
                                                                <StoryIcon className="w-3 h-3" />
                                                                <span className="font-medium">{story.project}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex flex-col">
                                                        <div className="flex flex-wrap gap-3 text-xs mb-3">
                                                            <div className={`flex items-center gap-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                                                <MapPin className="w-3 h-3" />
                                                                {story.location}
                                                            </div>
                                                            <div className={`flex items-center gap-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                                                <Calendar className="w-3 h-3" />
                                                                {story.date}
                                                            </div>
                                                        </div>

                                                        <p className={`text-sm mb-4 leading-relaxed italic line-clamp-3 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                                            "{story.story}"
                                                        </p>

                                                        <div className="flex gap-2 mb-3">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedStory(story);
                                                                }}
                                                                className="text-[#ff6f0f] text-sm font-medium hover:underline flex items-center gap-1"
                                                            >
                                                                Read More →
                                                            </motion.button>

                                                            {story.video_url && (
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        window.open(story.video_url, '_blank');
                                                                    }}
                                                                    className="flex items-center gap-1 px-3 py-1 bg-[#ff6f0f] text-white text-sm rounded-full hover:bg-[#ff8f3f] transition-colors"
                                                                >
                                                                    <Play className="w-3 h-3" />
                                                                    Watch Video
                                                                </motion.button>
                                                            )}
                                                        </div>

                                                        <div className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] flex items-center justify-center flex-shrink-0">
                                                                <Users className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                                                    Impact
                                                                </p>
                                                                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                                    {story.impact}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-12 h-12 text-white" />
                                </div>
                                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                    No Success Stories Yet
                                </h3>
                                <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                    We're currently sponsoring students through their certification programs. Check back soon to see their success stories and career transformations.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onNavigate('projects')}
                                    className="bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                >
                                    View Our Projects
                                </motion.button>
                            </div>
                        )}

                        {/* Call to Action */}
                        {stories.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mt-16 text-center"
                            >
                                <div className={`p-12 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-[#0a1628] to-[#0a1628]' : 'bg-gradient-to-r from-gray-50 to-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                    <Heart className="w-16 h-16 text-[#ff6f0f] mx-auto mb-6" />
                                    <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                        Be Part of More Success Stories
                                    </h2>
                                    <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                        Every project creates new opportunities and transforms lives. Join us in making a difference.
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onNavigate('projects')}
                                        className="bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        View Our Projects
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Modal for Full Story Details */}
                        <AnimatePresence>
                            {selectedStory && (
                                <div
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                                    onClick={() => setSelectedStory(null)}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ type: 'spring', damping: 25 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className={`${darkMode ? 'bg-[#0a1628]' : 'bg-white'} rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
                                    >
                                        {/* Modal Header */}
                                        <div className={`sticky top-0 ${darkMode ? 'bg-[#0a1628]' : 'bg-white'} border-b ${darkMode ? 'border-white/10' : 'border-gray-200'} p-6 flex justify-between items-start z-10`}>
                                            <div className="flex items-center gap-4 flex-1">
                                                <img
                                                    src={selectedStory.image}
                                                    alt={selectedStory.name}
                                                    className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                                                />
                                                <div>
                                                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                        {selectedStory.name}, {selectedStory.age}
                                                    </h2>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {(() => {
                                                            const ModalIcon = selectedStory.icon || getProjectIcon(selectedStory.project);
                                                            return <ModalIcon className="w-4 h-4 text-[#ff6f0f]" />;
                                                        })()}
                                                        <span className={`text-sm ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                                            {selectedStory.project}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedStory(null)}
                                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'} transition-colors`}
                                            >
                                                <X className={darkMode ? 'text-white' : 'text-gray-900'} />
                                            </button>
                                        </div>

                                        {/* Modal Content */}
                                        <div className="p-6 space-y-6">
                                            {/* Location & Date */}
                                            <div className="flex flex-wrap gap-4">
                                                <div className={`flex items-center gap-2 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                                    <MapPin className="w-5 h-5 text-[#ff6f0f]" />
                                                    <span>{selectedStory.location}</span>
                                                </div>
                                                <div className={`flex items-center gap-2 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                                    <Calendar className="w-5 h-5 text-[#ff6f0f]" />
                                                    <span>{selectedStory.date}</span>
                                                </div>
                                            </div>

                                            {/* Story */}
                                            <div>
                                                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                    Their Story
                                                </h3>
                                                <p className={`text-lg leading-relaxed italic ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                                    "{selectedStory.story}"
                                                </p>
                                            </div>

                                            {/* Impact */}
                                            <div className={`p-6 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] flex items-center justify-center flex-shrink-0">
                                                        <Users className="w-8 h-8 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm mb-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                                                            Community Impact
                                                        </p>
                                                        <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                                                            {selectedStory.impact}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Call to Action */}
                                            <div className="flex gap-3 pt-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedStory(null);
                                                        onNavigate('projects');
                                                    }}
                                                    className="flex-1 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                                                >
                                                    View Our Projects
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedStory(null)}
                                                    className={`px-6 py-3 rounded-xl font-semibold ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                >
                                                    Close
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div >
    );
}
