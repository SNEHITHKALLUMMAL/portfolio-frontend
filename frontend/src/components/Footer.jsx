import { Github, Linkedin, Twitter, Mail, TerminalSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Footer = () => {
  const { publicProfile } = useSelector((state) => state.user);
  const socialLinks = publicProfile?.socialLinks || {};

  const quickLinks = [
    { name: 'home', path: '/' },
    { name: 'projects', path: '/projects' },
    { name: 'about', path: '/about' },
    { name: 'blog', path: '/blog' },
    { name: 'contact', path: '/contact' },
  ];

  return (
    <footer className="relative mt-auto border-t border-ink-900/[0.07] dark:border-white/[0.07] bg-paper-50 dark:bg-ink-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ink-950 dark:bg-white/[0.06] border border-transparent dark:border-white/10 flex items-center justify-center">
                <TerminalSquare className="w-4 h-4 text-primary-400" />
              </div>
              <span className="font-mono font-semibold text-ink-950 dark:text-white">portfolio.dev</span>
            </div>
            <p className="text-ink-500 dark:text-ink-300 leading-relaxed">
              {publicProfile?.bio || 'A passionate developer creating amazing digital experiences.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="eyebrow">navigate</h3>
            <ul className="space-y-2 font-mono text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className="text-ink-500 dark:text-ink-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    ./{link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="eyebrow">connect</h3>
            <div className="flex space-x-3">
              {socialLinks.github && (
                <motion.a
                  whileHover={{ y: -3 }}
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-ink-900/10 dark:border-white/10 hover:border-primary-400/60 hover:text-primary-500 text-ink-600 dark:text-ink-300 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </motion.a>
              )}
              {socialLinks.linkedin && (
                <motion.a
                  whileHover={{ y: -3 }}
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-ink-900/10 dark:border-white/10 hover:border-primary-400/60 hover:text-primary-500 text-ink-600 dark:text-ink-300 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              )}
              {socialLinks.twitter && (
                <motion.a
                  whileHover={{ y: -3 }}
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg border border-ink-900/10 dark:border-white/10 hover:border-primary-400/60 hover:text-primary-500 text-ink-600 dark:text-ink-300 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
              )}
              <motion.a
                whileHover={{ y: -3 }}
                href="mailto:contact@example.com"
                className="p-2.5 rounded-lg border border-ink-900/10 dark:border-white/10 hover:border-primary-400/60 hover:text-primary-500 text-ink-600 dark:text-ink-300 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-ink-900/[0.07] dark:border-white/[0.07] text-center font-mono text-xs text-ink-400 dark:text-ink-400">
          <p>
            © {new Date().getFullYear()} portfolio.dev — built with React &amp; a lot of coffee
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
