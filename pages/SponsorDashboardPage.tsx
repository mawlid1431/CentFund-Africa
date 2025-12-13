import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Heart, DollarSign, ArrowRight, Loader, Target } from 'lucide-react';
import { getActiveProjects } from '@/utils/supabase/helpers';
import { toast } from 'sonner';

interface SponsorDashboardPageProps {
    darkMode: boolean;
    onNavigate: (page: string) => void;
}

export function SponsorDashboardPage({ darkMode, onNavigate }: SponsorDashboardPageProps) {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [sponsorAmount, setSponsorAmount] = useState('');
    const [sponsorType, setSponsorType] = useState<'full' | 'partial'>('partial');

    const hardcodedProjects = [
        {
            id: '1',
            name: 'AWS Cloud Practitioner',
            description: 'Beginner-level cloud certification to build tech careers',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
            cost: 300,
            studentsNeeded: 10,
        },
        {
            id: '2',
            name: 'CCNA Networking Certification',
            description: 'Learn networking fundamentals and advanced skills',
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
            cost: 400,
            studentsNeeded: 8,
        },
        {
            id: '3',
            name: 'IELTS Certification',
            description: 'Improve English language skills for global opportunities',
            image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
            cost: 250,
            studentsNeeded: 15,
        },
    ];

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await getActiveProjects();
            if (data && data.length > 0) {
                setProjects(data.map(p => ({
                    ...p,
                    cost: 300,
                    studentsNeeded: 10,
                })));
            } else {
                setProjects(hardcodedProjects);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            setProjects(hardcodedProjects);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectSelect = (project: any) => {
        setSelectedProject(project);
        setSponsorAmount(project.cost.toString());
        setSponsorType('full');
    };

    const handleContinue = () => {
        if (!selectedProject) {
            toast.error('Please select a project');
            return;
        }

        const amount = parseFloat(sponsorAmount);
        if (!amount || amount < 100) {
            toast.error('Minimum sponsorship amount is $100');
            return;
        }

        // Store sponsorship details
        sessionStorage.setItem('selectedProject', JSON.stringify(selectedProject));
        sessionStorage.setItem('sponsorAmount', sponsorAmount);
        sessionStorage.setItem('sponsorType', sponsorType);

        onNavigate('sponsor-application');
    };

    return (
        <div className={`min-h-screen pt-24 pb-16 ${darkMode ? 'bg-dark-primary' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.span
                        className="inline-block px-4 py-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange mb-4"
                    >
                        Step 3 of 4
                    </motion.span>
                    <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        Select Project to Sponsor
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                        Choose a certification program and set your sponsorship amount
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-accent-orange" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleProjectSelect(project)}
                                    className={`rounded-2xl overflow-hidden cursor-pointer transition-all ${selectedProject?.id === project.id
                                            ? 'ring-4 ring-accent-orange shadow-2xl'
                                            : darkMode
                                                ? 'bg-dark-secondary border border-white/10 hover:border-accent-orange/50'
                                                : 'bg-white border border-gray-200 hover:border-accent-orange/50'
                                        }`}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {selectedProject?.id === project.id && (
                                            <div className="absolute inset-0 bg-accent-orange/20 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-accent-orange rounded-full flex items-center justify-center">
                                                    <Heart className="w-8 h-8 text-white fill-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                                            {project.name}
                                        </h3>
                                        <p className={`mb-4 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                                            {project.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                                    Cost per student
                                                </p>
                                                <p className="text-2xl font-bold text-accent-orange">
                                                    ${project.cost}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                                    Students needed
                                                </p>
                                                <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                                                    {project.studentsNeeded}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {selectedProject && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`max-w-2xl mx-auto rounded-2xl p-8 ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'
                                    }`}
                            >
                                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>
                                    Sponsorship Details
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className={`block mb-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                            Sponsorship Type
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => {
                                                    setSponsorType('full');
                                                    setSponsorAmount(selectedProject.cost.toString());
                                                }}
                                                className={`p-4 rounded-xl border-2 transition-all ${sponsorType === 'full'
                                                        ? 'border-accent-orange bg-accent-orange/10'
                                                        : darkMode
                                                            ? 'border-white/10 hover:border-white/20'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <Target className={`w-6 h-6 mx-auto mb-2 ${sponsorType === 'full' ? 'text-accent-orange' : darkMode ? 'text-white' : 'text-gray-600'}`} />
                                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                                                    Full Sponsorship
                                                </p>
                                                <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                                    ${selectedProject.cost}
                                                </p>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSponsorType('partial');
                                                    setSponsorAmount('100');
                                                }}
                                                className={`p-4 rounded-xl border-2 transition-all ${sponsorType === 'partial'
                                                        ? 'border-accent-orange bg-accent-orange/10'
                                                        : darkMode
                                                            ? 'border-white/10 hover:border-white/20'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <DollarSign className={`w-6 h-6 mx-auto mb-2 ${sponsorType === 'partial' ? 'text-accent-orange' : darkMode ? 'text-white' : 'text-gray-600'}`} />
                                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                                                    Partial Sponsorship
                                                </p>
                                                <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                                    Custom amount
                                                </p>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                                            Sponsorship Amount (USD)
                                        </label>
                                        <div className="relative">
                                            <DollarSign className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-white/50' : 'text-gray-400'}`} />
                                            <input
                                                type="number"
                                                value={sponsorAmount}
                                                onChange={(e) => setSponsorAmount(e.target.value)}
                                                min="100"
                                                max={selectedProject.cost}
                                                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${darkMode
                                                        ? 'bg-white/5 border-white/10 text-white focus:border-accent-orange'
                                                        : 'bg-white border-gray-300 text-black focus:border-accent-orange'
                                                    }`}
                                                placeholder="Enter amount"
                                            />
                                        </div>
                                        <p className={`mt-2 text-sm ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                            Minimum: $100 | Maximum: ${selectedProject.cost}
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleContinue}
                                        className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-white py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        <span>Continue to Application</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
