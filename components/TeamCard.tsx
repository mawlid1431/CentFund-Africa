import { motion } from 'motion/react';
import { Linkedin, Mail } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
  darkMode: boolean;
  index: number;
  linkedinUrl?: string;
  email?: string;
}

export function TeamCard({ name, role, image, darkMode, index, linkedinUrl, email }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-dark-secondary border border-white/10' : 'bg-white border border-gray-200'
        } shadow-lg hover:shadow-2xl transition-all duration-300`}
    >
      <div className="relative h-80 overflow-hidden group">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
          {linkedinUrl && (
            <motion.a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="w-10 h-10 rounded-full bg-[#ff6f0f] flex items-center justify-center text-white"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
          )}
          {email && (
            <motion.a
              href={`mailto:${email}`}
              whileHover={{ scale: 1.2 }}
              className="w-10 h-10 rounded-full bg-[#ff6f0f] flex items-center justify-center text-white"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          )}
        </div>
      </div>
      <div className="p-6 text-center">
        <h3 className={`mb-1 font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>
          {name}
        </h3>
        <p className="text-accent-orange font-medium">{role}</p>
      </div>
    </motion.div>
  );
}
