import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, BookOpen, Users, ArrowRight, Play, TrendingUp, Award, Target, Zap, Loader, MapPin, Calendar, Star, Quote } from 'lucide-react';
import { DecorativeElements } from '../components/DecorativeElements';
import { ProjectCard } from '../components/ProjectCard';
import { TypewriterText } from '../components/TypewriterText';
import { HeroImageSlider } from '../components/HeroImageSlider';
import { getActiveProjects, getSuccessStories, getTestimonials } from '@/utils/supabase/helpers';

interface HomePageProps {
  darkMode: boolean;
  onNavigate: (page: string, id?: string) => void;
}

export function HomePage({ darkMode, onNavigate }: HomePageProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // Hardcoded certification programs (same as ProjectsPage)
  const hardcodedProjects = [
    {
      id: '1',
      title: 'AWS Cloud Practitioner',
      description: 'Beginner-level cloud certification to build tech careers. Learn AWS fundamentals and cloud concepts.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    },
    {
      id: '2',
      title: 'CCNA Networking Certification',
      description: 'Learn networking fundamentals and advanced skills. Perfect for IT enthusiasts and aspiring network engineers.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    },
    {
      id: '3',
      title: 'IELTS Certification',
      description: 'Improve English language skills for global opportunities. Achieve your target score for university admission.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    },
  ];

  // Hardcoded success stories (same as SuccessStoriesPage)
  const hardcodedSuccessStories = [
    {
      id: '1',
      name: 'Amina Yusuf',
      age: 24,
      project: 'AWS Cloud Practitioner',
      location: 'Nairobi, Kenya',
      date: 'January 2024',
      story: 'Thanks to CentFund Africa, I completed my AWS certification and now work as a cloud engineer for a tech startup.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      impact: 'Secured cloud engineer position with 3x salary increase',
    },
    {
      id: '2',
      name: 'Mohamed Abdi',
      age: 22,
      project: 'CCNA Networking',
      location: 'Addis Ababa, Ethiopia',
      date: 'December 2023',
      story: 'CentFund Africa made it possible for me to learn networking skills and secure a remote job in IT support.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      impact: 'Landed remote IT support role, supporting family of 5',
    },
    {
      id: '3',
      name: 'Fatima Hassan',
      age: 21,
      project: 'IELTS',
      location: 'Lagos, Nigeria',
      date: 'November 2023',
      story: 'I achieved my IELTS score and got admitted to a university abroad. CentFund Africa changed my future.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      impact: 'Admitted to UK university with scholarship',
    },
  ];

  // Hardcoded testimonials (same as TestimonialsPage)
  const hardcodedTestimonials = [
    {
      id: '1',
      name: 'Ahmed Ali',
      role: 'CCNA Graduate',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      rating: 5,
      feedback: 'CentFund Africa made my dream of becoming a certified network engineer possible. The support and guidance throughout the process was exceptional.',
      project: 'CCNA Networking',
    },
    {
      id: '2',
      name: 'Halima Noor',
      role: 'AWS Certified',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      rating: 5,
      feedback: 'With CentFund Africa, I gained AWS certification and started a remote developer career. This platform truly changes lives.',
      project: 'AWS Cloud Practitioner',
    },
    {
      id: '3',
      name: 'John Mwangi',
      role: 'Investor & Sponsor',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      rating: 5,
      feedback: 'I know my investment truly helps deserving students gain valuable skills. CentFund Africa provides complete transparency and regular updates.',
      project: 'Multiple Certifications',
    },
    {
      id: '4',
      name: 'Sarah Omondi',
      role: 'Corporate Sponsor',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      rating: 5,
      feedback: 'CentFund Africa is a transparent and trustworthy way to support youth education. We have sponsored 10 students and seen amazing results.',
      project: 'Corporate Sponsorship',
    },
    {
      id: '5',
      name: 'Ibrahim Kamara',
      role: 'CompTIA A+ Graduate',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      rating: 5,
      feedback: 'The certification process was smooth and well-organized. CentFund Africa not only funded my certification but also provided career guidance.',
      project: 'CompTIA A+',
    },
    {
      id: '6',
      name: 'Zainab Mohammed',
      role: 'IELTS Graduate',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      rating: 5,
      feedback: 'Thanks to CentFund Africa, I achieved my IELTS target score and secured admission to my dream university. Forever grateful!',
      project: 'IELTS',
    },
  ];

  // Load projects from Supabase
  useEffect(() => {
    loadProjects();
    loadSuccessStories();
    loadTestimonials();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getActiveProjects();
      if (data && data.length > 0) {
        const formattedProjects = data.slice(0, 3).map(p => ({
          id: p.id,
          title: p.name,
          description: p.description,
          image: p.image,
        }));
        setProjects(formattedProjects);
      } else {
        // Use hardcoded projects if no data from Supabase
        setProjects(hardcodedProjects);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      // Use hardcoded projects on error
      setProjects(hardcodedProjects);
    } finally {
      setLoading(false);
    }
  };

  const loadSuccessStories = async () => {
    try {
      const data = await getSuccessStories();
      if (data && data.length > 0) {
        setSuccessStories(data.slice(0, 3));
      } else {
        setSuccessStories(hardcodedSuccessStories);
      }
    } catch (error) {
      console.error('Error loading success stories:', error);
      setSuccessStories(hardcodedSuccessStories);
    } finally {
      setStoriesLoading(false);
    }
  };

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      if (data && data.length > 0) {
        // Duplicate testimonials multiple times for seamless infinite scroll
        setTestimonials([...data, ...data, ...data, ...data]);
      } else {
        // Duplicate hardcoded testimonials multiple times for seamless infinite scroll
        setTestimonials([...hardcodedTestimonials, ...hardcodedTestimonials, ...hardcodedTestimonials, ...hardcodedTestimonials]);
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonials([...hardcodedTestimonials, ...hardcodedTestimonials, ...hardcodedTestimonials, ...hardcodedTestimonials]);
    } finally {
      setTestimonialsLoading(false);
    }
  };
  // Hero slider images - 5 different charity images that transition smoothly
  const heroImages = [
    '/carousel-1.jpg',
    '/carousel-2.jpg',
    '/carousel-3.jpg',
    '/carousel-4.jpg',
    '/carousel-5.jpg',
  ];



  const categories = [
    { icon: Target, title: 'Apply', count: 'Students submit applications', color: 'from-red-500 to-pink-500' },
    { icon: Award, title: 'Verify', count: 'Admin confirms eligibility', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, title: 'Sponsor', count: 'Investors fund certifications', color: 'from-purple-500 to-indigo-500' },
  ];

  const stats = [
    { icon: Users, number: '500+', label: 'Students Sponsored', color: 'from-orange-500 to-red-500' },
    { icon: Award, number: '120+', label: 'Certifications Completed', color: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, number: '70+', label: 'Students Employed', color: 'from-green-500 to-emerald-500' },
    { icon: Heart, number: '$150K+', label: 'Investor Contributions', color: 'from-purple-500 to-pink-500' },
  ];

  const features = [
    {
      icon: Target,
      title: 'Targeted Impact',
      description: 'Focused programs that address root causes and create lasting change',
    },
    {
      icon: TrendingUp,
      title: 'Transparent Growth',
      description: 'Track your contribution and see real-time impact metrics',
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Award-winning programs recognized by international organizations',
    },
    {
      icon: Zap,
      title: 'Rapid Response',
      description: 'Quick deployment to areas in urgent need of assistance',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center overflow-hidden ${darkMode ? 'bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-accent' : 'bg-white'}`}>
        <DecorativeElements />

        {/* Animated gradient overlay */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 111, 15, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(74, 144, 226, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 111, 15, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Image Slider with Typewriter Text Below */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative space-y-8"
            >
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                <HeroImageSlider images={heroImages} interval={6000} />
              </motion.div>

              {/* Typewriter Text Below Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <TypewriterText
                  texts={[
                    'Empowering Communities...',
                    'Educating Children...',
                    'Building Hope...',
                    'Changing Lives...',
                    'Creating Impact...',
                  ]}
                  typingSpeed={100}
                  deletingSpeed={50}
                  pauseDuration={2000}
                  className="text-white/90 text-xl md:text-2xl"
                />
              </motion.div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6, type: 'spring' }}
                className="absolute top-8 -right-3 lg:-right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-2xl max-w-[200px] border border-white/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ff6f0f] to-[#ff8f3f] rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Lives Impacted</p>
                    <p className="text-xl text-[#ff6f0f]">1000+</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 pt-2.5 border-t border-gray-100">
                  <span className="text-[#ff6f0f] text-sm">⭐⭐⭐⭐⭐</span>
                  <span className="text-xs text-gray-600">Trusted</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  className="inline-block px-4 py-2 bg-[#ff6f0f]/10 border border-[#ff6f0f]/30 rounded-full text-[#ff6f0f] mb-6 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Making a Difference from now!
                </motion.span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}
              >
                Empowering Youth Through{' '}
                <span className="bg-gradient-to-r from-accent-orange to-accent-orange-light bg-clip-text text-transparent">
                  Funded Certifications
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`leading-relaxed max-w-xl text-base sm:text-lg ${darkMode ? 'text-white/80' : 'text-gray-700'}`}
              >
                CentFund Africa connects ambitious students with sponsors to unlock skills, certifications, and career opportunities.
              </motion.p>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-2 sm:gap-4 py-4"
              >
                {[
                  { value: '500+', label: 'Students Sponsored' },
                  { value: '120+', label: 'Certifications' },
                  { value: '70+', label: 'Students Employed' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="text-center"
                  >
                    <p className={`text-2xl sm:text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>{stat.value}</p>
                    <p className={`text-xs sm:text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('projects')}
                  className="bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-[#ff6f0f]/30 hover:shadow-xl hover:shadow-[#ff6f0f]/40 transition-all group min-h-[48px] text-sm sm:text-base"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('contact')}
                  className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-3 border transition-all group min-h-[48px] text-sm sm:text-base ${darkMode
                    ? 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20'
                    : 'bg-black text-white border-black hover:bg-gray-900'
                    }`}
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  <span>Become a Sponsor</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className={`w-6 h-10 rounded-full border-2 flex items-start justify-center p-2 ${darkMode ? 'border-white/30' : 'border-black/30'
            }`}>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white' : 'bg-black'}`}
            />
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className={`py-16 relative overflow-hidden ${darkMode ? 'bg-dark-primary' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full mb-4 bg-accent-orange/10 text-accent-orange"
            >
              How It Works
            </motion.span>
            <h2 className={`mb-4 text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              Simple 3-Step Process
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
              From application to certification - we make it easy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`rounded-2xl p-8 text-center cursor-pointer transition-all relative group ${darkMode
                  ? 'bg-dark-secondary border border-white/10 hover:bg-dark-accent'
                  : 'bg-white border border-gray-200 hover:shadow-2xl'
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className={`relative w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
                  <category.icon className="w-10 h-10 text-white" />
                </div>

                <h3 className={`mb-2 relative text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {category.title}
                </h3>
                <p className={`relative ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  {category.count}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className={`py-16 relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-dark-primary to-dark-secondary' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
        <DecorativeElements />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange mb-4"
            >
              Making Impact
            </motion.span>
            <h2 className={`mb-4 text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              Featured Projects
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
              Creating real, measurable impact in communities across Somaliland
            </p>
          </motion.div>

          <div className={`grid gap-8 mb-12 ${projects.length === 1
            ? 'grid-cols-1 max-w-md mx-auto'
            : projects.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-[#ff6f0f]" />
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className={`text-lg ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  No active projects at the moment
                </p>
              </div>
            ) : (
              projects.map((project, index) => (
                <ProjectCard
                  key={project.id || index}
                  {...project}
                  darkMode={darkMode}
                  index={index}
                  onClick={() => project.id ? onNavigate('project-detail', project.id) : onNavigate('projects')}
                />
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('projects')}
              className="bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-10 py-4 rounded-xl flex items-center gap-3 mx-auto shadow-lg shadow-[#ff6f0f]/30 hover:shadow-xl hover:shadow-[#ff6f0f]/40 transition-all group"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`py-16 ${darkMode ? 'bg-dark-primary' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-2 rounded-full mb-4 bg-accent-orange/10 text-accent-orange"
            >
              Why Us
            </motion.span>
            <h2 className={`mb-4 text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              Why Choose CentFund Africa
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
              We're committed to transparency, verification, and measurable impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-2xl hover:shadow-xl transition-all group ${darkMode
                  ? 'bg-dark-secondary border border-white/10'
                  : 'bg-gray-50 border border-gray-200'
                  }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-accent-orange/20 to-accent-orange-light/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-accent-orange" />
                </div>
                <h3 className={`mb-3 text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {feature.title}
                </h3>
                <p className={darkMode ? 'text-white/70' : 'text-gray-700'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className={`py-16 relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-dark-primary to-dark-secondary' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
        <DecorativeElements />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange mb-4"
            >
              Real Impact
            </motion.span>
            <h2 className={`mb-4 text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              Success Stories
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
              Meet the students whose careers have been transformed through CentFund Africa
            </p>
          </motion.div>

          <div className={`grid gap-8 mb-12 ${successStories.length === 1
            ? 'grid-cols-1 max-w-md mx-auto'
            : successStories.length === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
            {storiesLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-accent-orange" />
              </div>
            ) : successStories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className={`text-lg ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  No success stories yet
                </p>
              </div>
            ) : (
              successStories.map((story, index) => (
                <motion.div
                  key={story.id || index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className={`group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${darkMode ? 'bg-dark-secondary text-white border border-white/10' : 'bg-white text-black border border-gray-200'
                    }`}
                >
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-20 h-20 object-cover rounded-2xl shadow-lg"
                      />
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-black'}`}>
                          {story.name}, {story.age}
                        </h3>
                        <div className="inline-flex items-center gap-2 bg-accent-orange text-white px-3 py-1 rounded-full text-xs">
                          <Heart className="w-3 h-3" />
                          <span className="font-medium">{story.project}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs mb-4">
                      <div className={`flex items-center gap-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                        <MapPin className="w-3 h-3" />
                        {story.location}
                      </div>
                      <div className={`flex items-center gap-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                        <Calendar className="w-3 h-3" />
                        {story.date}
                      </div>
                    </div>

                    <p className={`text-sm mb-6 leading-relaxed italic line-clamp-3 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                      "{story.story}"
                    </p>

                    <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-orange to-accent-orange-light flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                          Impact
                        </p>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
                          {story.impact}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate('success-stories')}
                      className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-accent-orange/20 hover:shadow-xl hover:shadow-accent-orange/30"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('success-stories')}
              className="bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-10 py-4 rounded-xl flex items-center gap-3 mx-auto shadow-lg shadow-accent-orange/30 hover:shadow-xl hover:shadow-accent-orange/40 transition-all group"
            >
              <span>View All Success Stories</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-dark-primary to-dark-secondary' : 'bg-gradient-to-br from-gray-100 to-gray-50'}`}>
        <DecorativeElements />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ y: -10, scale: 1.05 }}
                className={`text-center p-10 rounded-3xl shadow-xl ${darkMode
                  ? 'bg-white/10 backdrop-blur-sm border border-white/20'
                  : 'bg-white border border-gray-200'
                  }`}
              >
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <motion.h2
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}
                >
                  {stat.number}
                </motion.h2>
                <p className={`text-lg ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className={`py-16 relative overflow-hidden ${darkMode ? 'bg-dark-primary' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:pxmb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.span
              className="inline-block px-4 py-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange mb-4"
            >
              Testimonials
            </motion.span>
            <h2 className={`mb-4 text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              What People Say About Us
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
              Hear from students and sponsors who've experienced the impact firsthand
            </p>
          </motion.div>
        </div>

        {/* Auto-scrolling Testimonials */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {testimonialsLoading ? (
                <div className="flex justify-center w-full py-12">
                  <Loader className="w-8 h-8 animate-spin text-accent-orange" />
                </div>
              ) : (
                testimonials.map((testimonial, index) => (
                  <motion.div
                    key={`${testimonial.id}-${index}`}
                    className={`flex-shrink-0 w-[400px] rounded-2xl p-6 shadow-lg relative ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'
                      }`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10">
                      <Quote className="w-12 h-12 text-accent-orange" />
                    </div>

                    {/* Profile */}
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-accent-orange"
                      />
                      <div>
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
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
                        <Star key={i} className="w-4 h-4 fill-accent-orange text-accent-orange" />
                      ))}
                    </div>

                    {/* Feedback */}
                    <p className={`mb-4 leading-relaxed text-sm ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>
                      "{testimonial.feedback}"
                    </p>

                    {/* Project Badge */}
                    <div className="pt-4 border-t border-white/10">
                      <span className="inline-block px-3 py-1 bg-accent-orange/10 text-accent-orange rounded-full text-xs font-medium">
                        {testimonial.project}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('testimonials')}
            className="bg-gradient-to-r from-accent-orange to-accent-orange-light text-white px-10 py-4 rounded-xl flex items-center gap-3 mx-auto shadow-lg shadow-accent-orange/30 hover:shadow-xl hover:shadow-accent-orange/40 transition-all group"
          >
            <span>View All Testimonials</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </section>

      {/* Partners & Sponsors Carousel Section */}
      <section className={`py-16 relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-dark-primary to-dark-secondary' : 'bg-gradient-to-br from-gray-50 to-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.span
              className="inline-block px-4 py-2 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange mb-4"
            >
              Our Partners
            </motion.span>
            <h2 className={`mb-4 text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              Trusted By Leading Organizations
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
              Partnering with industry leaders to empower the next generation
            </p>
          </motion.div>
        </div>

        {/* Auto-scrolling Partners Logos */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-12 items-center"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {(() => {
                const partners = [
                  { name: 'AWS', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
                  { name: 'Cisco', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg' },
                  { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
                  { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
                  { name: 'CompTIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/CompTIA_Logo.svg' },
                  { name: 'IELTS', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/IELTS_logo.svg' },
                ];
                // Duplicate partners 4 times for seamless infinite scroll
                const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];
                return duplicatedPartners.map((partner, index) => (
                  <motion.div
                    key={`${partner.name}-${index}`}
                    className={`flex-shrink-0 w-[200px] h-[120px] rounded-2xl p-6 shadow-lg flex items-center justify-center ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'
                      }`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className={`max-w-full max-h-full object-contain ${darkMode ? 'brightness-0 invert opacity-80' : 'opacity-70'}`}
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const textElement = document.createElement('div');
                          textElement.className = `text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`;
                          textElement.textContent = partner.name;
                          parent.appendChild(textElement);
                        }
                      }}
                    />
                  </motion.div>
                ));
              })()}
            </motion.div>
          </div>
        </div>

        {/* Partner Stats */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '15+', label: 'Partner Organizations' },
              { number: '500+', label: 'Students Certified' },
              { number: '20+', label: 'Certification Programs' },
              { number: '10+', label: 'Countries Reached' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className={`text-3xl sm:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                  {stat.number}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 relative overflow-hidden ${darkMode ? 'bg-dark-primary' : 'bg-white'}`}>
        <DecorativeElements />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`rounded-3xl p-12 md:p-16 shadow-2xl ${darkMode
              ? 'bg-gradient-to-br from-dark-secondary to-dark-accent border border-white/10'
              : 'bg-gradient-to-br from-dark-primary to-dark-secondary'
              }`}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-accent-orange to-accent-orange-light rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>

            <h2 className="text-white mb-6 text-3xl sm:text-4xl font-bold">
              Join CentFund Africa Today
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Empower the next generation. Whether you're a student seeking opportunity or an investor wanting to make impact, we're here for you.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('contact')}
                className="bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-xl border border-white/20 hover:bg-white/20 transition-all text-lg font-medium"
              >
                Get In Touch
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
