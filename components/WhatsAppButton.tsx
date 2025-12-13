import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function WhatsAppButton() {
  const whatsappNumber = '17816921308'; // CentFund Africa WhatsApp
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20CentFund%20Africa!%20I%20would%20like%20to%20get%20in%20touch.`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{
        boxShadow: '0 0 25px rgba(37, 211, 102, 0.5)',
      }}
      whileTap={{ scale: 0.9 }}
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}
