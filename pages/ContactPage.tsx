import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { DecorativeElements } from '../components/DecorativeElements';
import { ContactForm } from '../components/ContactForm';

interface ContactPageProps {
  darkMode: boolean;
}

export function ContactPage({ darkMode }: ContactPageProps) {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'contact@centfundafrica.org',
      link: 'mailto:contact@centfundafrica.org',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+XXX XXX XXX',
      link: 'tel:+XXXXXXXXXX',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'Africa',
      link: '#',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Clock,
      title: 'Response Time',
      content: 'We respond within 24 hours',
      link: '#',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', link: '#' },
    { icon: Twitter, label: 'Twitter', link: '#' },
    { icon: Instagram, label: 'Instagram', link: '#' },
    { icon: Linkedin, label: 'LinkedIn', link: '#' },
  ];

  const faqs = [
    {
      question: 'How do I apply for certification sponsorship?',
      answer: 'Fill out the contact form indicating your interest in certification sponsorship. Include details about your desired certification, educational background, and career goals. Our team will review your application and respond within 24 hours.',
    },
    {
      question: 'What certifications do you sponsor?',
      answer: 'We sponsor a wide range of professional certifications including AWS Cloud Practitioner, CCNA, CompTIA, Microsoft certifications, and more. Check our Projects page for current available programs.',
    },
    {
      question: 'How can I become a sponsor/investor?',
      answer: 'Contact us through the form to learn about sponsorship opportunities. You can sponsor individual students or contribute to our general fund. We provide regular updates on the impact of your investment.',
    },
    {
      question: 'What is the eligibility criteria for students?',
      answer: 'Students must demonstrate financial need, academic potential, and commitment to completing the certification. Age and education requirements vary by program. Contact us for specific eligibility details.',
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a1628]' : 'bg-white'}`}>
      {/* Header Section */}
      <section className={`relative py-32 overflow-hidden ${darkMode ? 'bg-gradient-to-r from-[#0a1628] to-[#0a1628]' : 'bg-gradient-to-r from-[#0a1628] to-[#2a4f7f]'}`}>
        <DecorativeElements />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#ff6f0f] mb-4 tracking-wider uppercase"
            >
              Get In Touch
            </motion.p>
            <h1 className="text-white mb-6">
              Contact Us
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto">
              We'd love to hear from you! Whether you want to become a sponsor, partner with us, or have questions, reach out today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className={`py-16 ${darkMode ? 'bg-[#0a1628]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`block rounded-xl sm:rounded-2xl p-4 sm:p-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'
                  } shadow-lg hover:shadow-2xl transition-all cursor-pointer`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center mb-4 text-white`}>
                  <method.icon className="w-7 h-7" />
                </div>
                <h3 className={`mb-2 text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                  {method.title}
                </h3>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                  {method.content}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className={`py-20 ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className={`mb-6 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                Send Us a Message
              </h2>
              <div className={`rounded-3xl p-8 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'
                } shadow-xl`}>
                <ContactForm darkMode={darkMode} />
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h2 className={`mb-6 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                  Why Contact Us?
                </h2>
                <div className="space-y-4">
                  {[
                    'Apply for certification sponsorship',
                    'Become an investor/sponsor',
                    'Inquire about partnership opportunities',
                    'Learn about available certification programs',
                    'Get updates on student success stories',
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#ff6f0f]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#ff6f0f]" />
                      </div>
                      <p className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                        {item}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className={`rounded-2xl p-8 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'
                }`}>
                <h3 className={`mb-4 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                  Follow Us
                </h3>
                <p className={`mb-6 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                  Stay updated with our latest projects and impact stories
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6f0f] to-[#ff8f3f] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
                      title={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Office Info */}
              <div className={`rounded-2xl p-8 ${darkMode ? 'bg-gradient-to-br from-[#ff6f0f]/10 to-[#4a90e2]/10' : 'bg-gradient-to-br from-[#ff6f0f]/5 to-[#4a90e2]/5'
                } border border-[#ff6f0f]/20`}>
                <h3 className={`mb-4 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                  Quick Response Guarantee
                </h3>
                <p className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                  We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`py-20 ${darkMode ? 'bg-[#0a1628]' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
              Frequently Asked Questions
            </h2>
            <p className={`max-w-2xl mx-auto ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
              Find quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'
                  }`}
              >
                <h3 className={`mb-3 ${darkMode ? 'text-white' : 'text-[#0a1628]'}`}>
                  {faq.question}
                </h3>
                <p className={darkMode ? 'text-white/70' : 'text-gray-600'}>
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className={`py-20 ${darkMode ? 'bg-[#0a1628]' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`rounded-3xl overflow-hidden h-96 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100'
              } flex items-center justify-center`}
          >
            <div className="text-center">
              <MapPin className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-white/40' : 'text-gray-400'}`} />
              <p className={darkMode ? 'text-white/60' : 'text-gray-600'}>
                Map Location Placeholder
              </p>
              <p className={`mt-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
                Boston Road, MA, United States, Massachusetts
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 relative overflow-hidden ${darkMode ? 'bg-gradient-to-r from-[#0a1628] to-[#0a1628]' : 'bg-gradient-to-r from-[#0a1628] to-[#2a4f7f]'}`}>
        <DecorativeElements />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white mb-6">
              Ready to Empower Youth?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Join CentFund Africa today. Whether you're seeking opportunity or wanting to create it, we're here to help.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 111, 15, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#ff6f0f] to-[#ff8f3f] text-white px-12 py-4 rounded-lg shadow-xl"
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
