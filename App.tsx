import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { NotFoundPage } from './pages/NotFoundPage';

interface AppProps {
  initialPage?: string;
}

function App({ initialPage = 'home' }: AppProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Valid pages list
  const validPages = ['home', 'projects', 'success-stories', 'testimonials', 'about', 'contact', 'admin', 'project-detail', '404'];

  // Check if current page is valid, if not show 404
  useEffect(() => {
    if (!validPages.includes(currentPage)) {
      setCurrentPage('404');
    }
  }, [currentPage]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (id && page === 'project-detail') {
      setSelectedProjectId(id);
    }
    scrollToTop();

    // Update URL
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else if (page === 'project-detail' && id) {
      window.history.pushState({}, '', `/project/${id}`);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-dark-primary text-white' : 'bg-white text-black'}`}>
      <Toaster position="top-right" richColors />
      {currentPage !== 'admin' && (
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentPage === 'home' && <HomePage darkMode={darkMode} onNavigate={handleNavigate} />}
          {currentPage === 'projects' && <ProjectsPage darkMode={darkMode} onNavigate={handleNavigate} />}
          {currentPage === 'success-stories' && <SuccessStoriesPage darkMode={darkMode} onNavigate={handleNavigate} />}
          {currentPage === 'testimonials' && <TestimonialsPage darkMode={darkMode} onNavigate={handleNavigate} />}
          {currentPage === 'about' && <AboutPage darkMode={darkMode} onNavigate={handleNavigate} />}
          {currentPage === 'contact' && <ContactPage darkMode={darkMode} />}
          {currentPage === 'project-detail' && selectedProjectId && (
            <ProjectDetailPage
              darkMode={darkMode}
              projectId={selectedProjectId}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'admin' && <AdminPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          {currentPage === '404' && <NotFoundPage darkMode={darkMode} onNavigate={handleNavigate} />}
        </motion.div>
      </AnimatePresence>

      {currentPage !== 'admin' && currentPage !== '404' && (
        <>
          <Footer darkMode={darkMode} onNavigate={setCurrentPage} />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}

export default App;
