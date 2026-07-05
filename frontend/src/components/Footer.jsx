import { Github, Linkedin, Twitter, Mail, Sparkles } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import BackToTop from './motion/BackToTop';

const Footer = () => {
  const { publicProfile } = useSelector((state) => state.user);
  const socialLinks = publicProfile?.socialLinks || {};

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="relative mt-auto border-t border-slate-900/[0.06] dark:border-white/[0.07] bg-cloud-50 dark:bg-night-950">
      <BackToTop />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-slate-900 dark:text-white">Portfolio</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {quickLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="text-muted-light dark:text-muted hover:text-accent-violet dark:hover:text-accent-light transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex space-x-2.5">
            {socialLinks.github && (
              <motion.a whileHover={{ y: -3 }} href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="btn-icon">
                <Github className="w-[18px] h-[18px]" />
              </motion.a>
            )}
            {socialLinks.linkedin && (
              <motion.a whileHover={{ y: -3 }} href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="btn-icon">
                <Linkedin className="w-[18px] h-[18px]" />
              </motion.a>
            )}
            {socialLinks.twitter && (
              <motion.a whileHover={{ y: -3 }} href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="btn-icon">
                <Twitter className="w-[18px] h-[18px]" />
              </motion.a>
            )}
            <motion.a whileHover={{ y: -3 }} href="mailto:contact@example.com" className="btn-icon">
              <Mail className="w-[18px] h-[18px]" />
            </motion.a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900/[0.06] dark:border-white/[0.07] text-center text-xs text-muted-light dark:text-muted">
          <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
