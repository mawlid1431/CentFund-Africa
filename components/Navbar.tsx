import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ darkMode, toggleDarkMode, currentPage, onNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: 'home' },
    { name: 'About', path: 'about' },
    { name: 'Projects', path: 'projects' },
    { name: 'Success Stories', path: 'success-stories' },
    { name: 'Testimonials', path: 'testimonials' },
    { name: 'Contact', path: 'contact' },
    { name: 'Login', path: 'admin', highlight: true }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${darkMode
        ? scrolled
          ? 'bg-dark-primary/95 backdrop-blur-xl shadow-2xl shadow-black/20 border-b-2 border-accent-orange/20 ring-1 ring-white/10'
          : 'bg-dark-primary/80 backdrop-blur-md border-b border-white/10'
        : scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b-2 border-gray-200'
          : 'bg-white/80 backdrop-blur-md border-b border-gray-200'
        } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center cursor-pointer group"
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-[#ff6f0f] to-[#ff8f3f] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff6f0f]/30 group-hover:shadow-xl group-hover:shadow-[#ff6f0f]/50 transition-all"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-white text-xl">🎓</span>
              </motion.div>
              <div className="flex flex-col leading-tight">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-xl tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
                    CentFund
                  </span>
                  <span className="text-accent-orange text-xl tracking-tight">
                    Africa
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item, index) => (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                onClick={() => onNavigate(item.path)}
                className={`relative transition-all duration-300 ${(item as any).highlight
                  ? 'px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-orange-light text-white rounded-lg hover:shadow-lg'
                  : currentPage === item.path
                    ? 'text-accent-orange'
                    : darkMode
                      ? 'text-white/80 hover:text-white'
                      : 'text-gray-700 hover:text-black'
                  }`}
                whileHover={{ y: -2 }}
              >
                <span className="relative z-10">{item.name}</span>
                {currentPage === item.path && !(item as any).highlight && (
                  <>
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-orange to-accent-orange-light rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -inset-2 bg-accent-orange/5 rounded-lg -z-10"
                    />
                  </>
                )}
              </motion.button>
            ))}

            {/* Dark Mode Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl transition-all shadow-lg ${darkMode
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-3 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${darkMode
                ? 'text-white hover:bg-white/10'
                : 'text-black hover:bg-gray-200'
                }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`p-3 transition-colors rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center ${darkMode
                ? 'text-white hover:bg-white/10'
                : 'text-black hover:bg-gray-200'
                }`}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden backdrop-blur-xl border-t-2 shadow-lg ${darkMode
              ? 'bg-dark-primary/95 border-accent-orange/20 ring-1 ring-white/10'
              : 'bg-white/95 border-gray-200'
              }`}
          >
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onNavigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-6 py-4 rounded-xl transition-all text-lg min-h-[56px] flex items-center ${currentPage === item.path
                    ? 'bg-gradient-to-r from-accent-orange to-accent-orange-light text-white shadow-lg'
                    : darkMode
                      ? 'text-white hover:bg-white/10'
                      : 'text-black hover:bg-gray-200'
                    }`}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}