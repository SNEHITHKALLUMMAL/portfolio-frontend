import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Database, Globe, Users, Github, ExternalLink } from 'lucide-react';
import { fetchProjects } from '../redux/slices/projectSlice';
import { fetchSkills } from '../redux/slices/skillSlice';
import { fetchPublicProfile } from '../redux/slices/userSlice';
import Reveal from '../components/motion/Reveal';
import TypeWriter from '../components/motion/TypeWriter';
import AmbientBackground from '../components/motion/AmbientBackground';
import CountUp from '../components/motion/CountUp';

const Home = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { skills } = useSelector((state) => state.skills);
  const { publicProfile } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProjects({ featured: 'true', limit: 3 }));
    dispatch(fetchSkills());
    dispatch(fetchPublicProfile());
  }, [dispatch]);

  const featuredProjects = projects.slice(0, 3);
  const allSkills = skills.allSkills || [];

  const roles = ['full-stack developer', 'problem solver', 'lifelong learner', 'open-source tinkerer'];

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground />

      {/* Hero Section — terminal window */}
      <section className="min-h-[78vh] flex items-center justify-center py-10">
        <div className="w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="window-card shadow-2xl shadow-ink-950/5 dark:shadow-black/40"
          >
            <div className="window-titlebar">
              <span className="window-dot bg-[#ff5f57]" />
              <span className="window-dot bg-[#febc2e]" />
              <span className="window-dot bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-ink-400">~/portfolio — zsh</span>
            </div>

            <div className="p-6 md:p-10 font-mono">
              <p className="text-sm text-ink-400 mb-1">
                <span className="text-stringc-500">visitor@web</span>
                <span className="text-ink-400">:</span>
                <span className="text-keyword-500">~</span>
                <span className="text-ink-400">$</span> whoami
              </p>

              <div className="flex items-center gap-5 my-6">
                {publicProfile?.avatar ? (
                  <img
                    src={publicProfile.avatar}
                    alt={publicProfile.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border-2 border-primary-400/60 shadow-lg shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-primary-400 to-keyword-500 flex items-center justify-center shadow-lg shrink-0">
                    <span className="text-white text-2xl font-bold">
                      {publicProfile?.name?.charAt(0) || 'P'}
                    </span>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl md:text-4xl font-extrabold text-ink-950 dark:text-white tracking-tight leading-tight">
                    {publicProfile?.name || 'Your Name'}
                  </h1>
                  <p className="text-primary-600 dark:text-primary-400 text-sm md:text-base mt-1">
                    <TypeWriter words={roles} />
                  </p>
                </div>
              </div>

              <p className="text-sm text-ink-400 mb-1 mt-4">
                <span className="text-stringc-500">visitor@web</span>
                <span className="text-ink-400">:</span>
                <span className="text-keyword-500">~</span>
                <span className="text-ink-400">$</span> cat bio.txt
              </p>
              <p className="text-ink-700 dark:text-ink-100 leading-relaxed mb-8 max-w-xl font-sans">
                {publicProfile?.bio || 'Full-stack developer building fast, accessible, well-crafted digital experiences — from database schema to pixel-perfect UI.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/projects" className="btn-primary">
                  <span>view_work()</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="btn-secondary">
                  <span>get_in_touch()</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Code2, label: 'projects shipped', value: String(featuredProjects.length || 0) },
            { icon: Database, label: 'skills tracked', value: String(allSkills.length || 0) },
            { icon: Globe, label: 'years experience', value: '5+' },
            { icon: Users, label: 'happy clients', value: '50+' },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08} className="window-card p-5 md:p-6 text-center hover:-translate-y-1 transition-transform">
              <stat.icon className="w-6 h-6 mx-auto mb-3 text-primary-500" />
              <div className="text-2xl md:text-3xl font-bold font-mono text-ink-950 dark:text-white mb-1">
                <CountUp value={stat.value} />
              </div>
              <div className="text-ink-400 text-xs font-mono uppercase tracking-wide">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <Reveal>
          <p className="eyebrow">ls ./featured-projects</p>
          <h2 className="section-title">Selected Work</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {featuredProjects.map((project, index) => (
            <Reveal key={project._id} delay={index * 0.1} className="window-card group hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink-950/5 dark:hover:shadow-black/30">
              <div className="window-titlebar">
                <span className="window-dot bg-[#ff5f57]" />
                <span className="window-dot bg-[#febc2e]" />
                <span className="window-dot bg-[#28c840]" />
              </div>
              {project.images?.[0] && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-ink-950 dark:text-white">{project.title}</h3>
                <p className="text-ink-500 dark:text-ink-300 mb-4 line-clamp-2 text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="pill bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400">
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/projects/${project._id}`}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-mono text-sm font-medium flex items-center gap-1.5 group/link"
                >
                  <span>view_project()</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link to="/projects" className="btn-primary inline-flex">
            <span>view_all_projects()</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>

      {/* Skills Preview */}
      <section className="py-16">
        <Reveal>
          <p className="eyebrow">cat ./skills.json</p>
          <h2 className="section-title">Tools &amp; Technologies</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
          {allSkills.slice(0, 12).map((skill, index) => (
            <Reveal
              key={skill._id}
              direction="none"
              delay={index * 0.04}
              className="window-card p-4 text-center hover:-translate-y-1 hover:border-primary-400/50 transition-all"
            >
              <div className="text-2xl mb-2">{skill.icon || '💻'}</div>
              <div className="text-sm font-medium text-ink-950 dark:text-white truncate">{skill.skillName}</div>
              <div className="text-xs font-mono text-primary-500">{skill.percentage}%</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <Reveal className="relative window-card p-10 md:p-14 text-center bg-ink-950 dark:bg-ink-900 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[length:38px_38px] opacity-40 mask-fade-b" />
          <div className="relative">
            <p className="eyebrow !text-primary-400">./contact.sh</p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">Let's build something together</h2>
            <p className="text-lg mb-8 text-ink-200 max-w-xl mx-auto">
              Have a project in mind? I'd love to hear about it.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-300 text-ink-950 font-mono font-semibold px-8 py-3 rounded-lg transition-all hover:-translate-y-0.5">
              <span>get_in_touch()</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
