import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Target, Loader } from 'lucide-react';
import { ProjectForm } from './ProjectForm';
import { getProjects, createProject, updateProject, deleteProject } from '@/utils/supabase/helpers';
import { toast } from 'sonner';

interface Project {
    id: string;
    name: string;
    date: string;
    description: string;
    image: string;
    video_url: string | null;
    created_at: string;
}

interface ProjectsManagerProps {
    darkMode: boolean;
    onRefresh?: () => void;
}

export function ProjectsManager({ darkMode, onRefresh }: ProjectsManagerProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Load projects from Supabase
    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Error loading projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = () => {
        setEditingProject(null);
        setShowForm(true);
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await deleteProject(id);
            toast.success('Project deleted successfully');
            loadProjects();
            onRefresh?.();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        }
    };

    const handleSaveProject = async (projectData: Omit<Project, 'id' | 'created_at'>) => {
        try {
            if (editingProject) {
                // Update existing project
                await updateProject(editingProject.id, {
                    name: projectData.name,
                    date: projectData.date,
                    description: projectData.description,
                    image: projectData.image,
                    video_url: projectData.video_url
                });
                toast.success('Project updated successfully');
            } else {
                // Add new project
                await createProject({
                    name: projectData.name,
                    date: projectData.date,
                    description: projectData.description,
                    image: projectData.image,
                    video_url: projectData.video_url
                });
                toast.success('Project created successfully');
            }
            setShowForm(false);
            setEditingProject(null);
            loadProjects();
            onRefresh?.();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Failed to save project');
        }
    };



    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Projects Management
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddProject}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white rounded-lg shadow-lg shadow-[#ff6f0f]/30 hover:shadow-xl hover:shadow-[#ff6f0f]/40 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </motion.button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader className="w-8 h-8 animate-spin text-[#ff6f0f]" />
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20">
                    <Target className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No projects yet
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Click "Add Project" to create your first project
                    </p>
                </div>
            ) : (
                /* Projects Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-[#0a1628] border border-white/10' : 'bg-white border border-gray-200'
                                }`}
                        >
                            {/* Project Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <div className="flex items-center gap-2 text-white text-xs">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        {new Date(project.date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="p-4 sm:p-6">
                                <h3 className={`text-base sm:text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {project.name}
                                </h3>
                                <p className={`text-sm mb-4 sm:mb-6 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {project.description}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEditProject(project)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg transition-all text-sm min-h-[44px] ${darkMode
                                            ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20'
                                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                                            }`}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDeleteProject(project.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg transition-all text-sm min-h-[44px] ${darkMode
                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                            }`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Project Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <ProjectForm
                        darkMode={darkMode}
                        project={editingProject}
                        onSave={handleSaveProject}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingProject(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}