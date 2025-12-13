import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  progress?: number;
  raised?: string;
  goal?: string;
  darkMode: boolean;
  index: number;
  onClick?: () => void;
  video_url?: string;
}

export function ProjectCard({
  title,
  description,
  image,
  progress,
  raised,
  goal,
  darkMode,
  index,
  onClick,
  video_url
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -15, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group rounded-3xl overflow-hidden shadow-xl ${darkMode ? 'bg-dark-secondary text-white border border-white/10' : 'bg-white text-black border border-gray-200'
        } hover:shadow-2xl transition-all duration-500 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="relative h-72 overflow-hidden">
        {/* Image with overlay gradient */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full"
        >
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />

        {/* Progress badge on image */}
        {progress !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#ff6f0f]" />
            <span className="text-sm text-gray-900">{progress}%</span>
          </motion.div>
        )}
      </div>

      <div className="p-8">
        <h3 className={`mb-3 group-hover:text-accent-orange transition-colors ${darkMode ? 'text-white' : 'text-black'}`}>
          {title}
        </h3>
        <p className={`mb-6 line-clamp-2 ${darkMode ? 'text-white/70' : 'text-gray-700'}`}>
          {description}
        </p>

        {progress !== undefined && (
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <div>
                <p className={`text-sm mb-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Raised</p>
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>${raised}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm mb-1 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>Goal</p>
                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>${goal}</p>
              </div>
            </div>

            {/* Progress bar with gradient */}
            <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-300'}`}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.5, duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#ff6f0f] via-[#ff8f3f] to-[#ffa55f] rounded-full relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.1 + 1.5,
                  }}
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
              </motion.div>
            </div>
          </div>
        )}

        {video_url ? (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="flex-1 bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] hover:from-[#ff8f3f] hover:to-[#ffa55f] text-white px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-[#ff6f0f]/20 hover:shadow-xl hover:shadow-[#ff6f0f]/30"
            >
              <span className="text-sm">Learn More</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(video_url, '_blank');
              }}
              className={`px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${darkMode
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-gray-200 hover:bg-gray-300 text-black border border-gray-300'
                }`}
            >
              <Play className="w-4 h-4" />
              <span className="text-sm">Watch Video</span>
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] hover:from-[#ff8f3f] hover:to-[#ffa55f] text-white px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-[#ff6f0f]/20 hover:shadow-xl hover:shadow-[#ff6f0f]/30"
          >
            <span>Learn More</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
