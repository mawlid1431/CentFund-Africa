import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  darkMode: boolean;
  onNavigate: (page: string) => void;
}

export function Footer({ darkMode, onNavigate }: FooterProps) {
  return (
    <footer className={`${darkMode ? 'bg-dark-primary text-white border-t border-white/10' : 'bg-gray-100 text-black border-t border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-orange-light rounded-lg flex items-center justify-center">
                <span className="text-white">🎓</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-lg sm:text-xl ${darkMode ? 'text-white' : 'text-black'}`}>
                  CertFund
                </span>
                <span className="text-accent-orange text-lg sm:text-xl">
                  Africa
                </span>
              </div>
            </div>
            <p className={`mb-4 max-w-md text-sm sm:text-base ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
              Connecting students with sponsors to fund professional certifications and unlock career opportunities.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-orange hover:bg-accent-orange-light transition-colors flex items-center justify-center text-white"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-orange hover:bg-accent-orange-light transition-colors flex items-center justify-center text-white"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-orange hover:bg-accent-orange-light transition-colors flex items-center justify-center text-white"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`mb-4 text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className={`hover:text-accent-orange transition-colors text-left text-sm sm:text-base py-1 ${darkMode ? 'text-white/70' : 'text-gray-700'}`}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className={`hover:text-accent-orange transition-colors text-left text-sm sm:text-base py-1 ${darkMode ? 'text-white/70' : 'text-gray-700'}`}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className={`hover:text-accent-orange transition-colors text-left text-sm sm:text-base py-1 ${darkMode ? 'text-white/70' : 'text-gray-700'}`}
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('success-stories')}
                  className={`hover:text-accent-orange transition-colors text-left text-sm sm:text-base py-1 ${darkMode ? 'text-white/70' : 'text-gray-700'}`}
                >
                  Success Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('testimonials')}
                  className={`hover:text-accent-orange transition-colors text-left text-sm sm:text-base py-1 ${darkMode ? 'text-white/70' : 'text-gray-700'}`}
                >
                  Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className={`hover:text-accent-orange transition-colors text-left text-sm sm:text-base py-1 ${darkMode ? 'text-white/70' : 'text-gray-700'}`}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`mb-4 text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-accent-orange mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@certfundafrica.org" className={`hover:text-accent-orange transition-colors text-sm sm:text-base break-all ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
                  contact@certfundafrica.org
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent-orange mt-0.5 flex-shrink-0" />
                <a href="tel:+17816921308" className={`hover:text-accent-orange transition-colors text-sm sm:text-base ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
                  +1 781-692-1308
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent-orange mt-0.5 flex-shrink-0" />
                <a href="https://maps.google.com/?q=Boston+Road+MA+Massachusetts" target="_blank" rel="noopener noreferrer" className={`hover:text-accent-orange transition-colors text-sm sm:text-base ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
                  Boston Road, MA, Massachusetts
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${darkMode ? 'border-t border-white/10' : 'border-t border-gray-300'}`}>
          <p className={`text-center md:text-left text-sm ${darkMode ? 'text-white/50' : 'text-gray-600'}`}>
            © 2025 CertFund Africa. All rights reserved.
          </p>
          <p className={`flex items-center gap-2 text-sm ${darkMode ? 'text-white/50' : 'text-gray-600'}`}>
            Made with <Heart className="w-4 h-4 text-accent-orange fill-accent-orange" /> for a better world
          </p>
        </div>
      </div>
    </footer>
  );
}
