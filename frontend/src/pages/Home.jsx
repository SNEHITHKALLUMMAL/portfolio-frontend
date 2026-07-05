import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Database, Globe, Users, Github, ExternalLink, Download } from 'lucide-react';
import { fetchProjects } from '../redux/slices/projectSlice';
import { fetchSkills } from '../redux/slices/skillSlice';
import { fetchPublicProfile } from '../redux/slices/userSlice';
import Reveal from '../components/motion/Reveal';
import RoleCycler from '../components/motion/RoleCycler';
import AmbientBackground from '../components/motion/AmbientBackground';
import CountUp from '../components/motion/CountUp';
import Magnetic from '../components/motion/Magnetic';
import MouseGlow from '../components/motion/MouseGlow';

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

  const roles = ['Full-Stack Developer', 'Problem Solver', 'UI Craftsman', 'Open-Source Contributor'];

  return (
    <div className="relative page-container overflow-hidden">
      <AmbientBackground particles />

      {/* Hero */}
      <MouseGlow className="min-h-[80vh] flex items-center justify-center rounded-[32px]">
        <div className="w-full max-w-3xl text-center py-10">
          <Reveal className="mb-8 flex justify-center">
            {publicProfile?.avatar ? (
              <img
                src={publicProfile.avatar}
                alt={publicProfile.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white/40 dark:border-white/10 shadow-glass"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-accent-gradient flex items-center justify-center shadow-glow-violet">
                <span className="text-white text-4xl font-bold font-display">
                  {publicProfile?.name?.charAt(0) || 'P'}
                </span>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.05}>
            <span className="eyebrow justify-center">Welcome to my portfolio</span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-slate-900 dark:text-white tracking-tight leading-[1.05]">
              Hi, I'm {publicProfile?.name || 'Your Name'}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-xl md:text-2xl font-display font-semibold mb-6 h-9">
              <RoleCycler words={roles} />
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-base md:text-lg text-muted-light dark:text-muted mb-10 max-w-xl mx-auto leading-relaxed">
              {publicProfile?.bio || 'Building fast, accessible, beautifully-crafted digital products — from database schema to pixel-perfect UI.'}
            </p>
          </Reveal>

          <Reveal delay={0.25} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Magnetic>
              <Link to="/projects" className="btn-primary">
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/contact" className="btn-secondary">
                <span>Get In Touch</span>
              </Link>
            </Magnetic>
            {publicProfile?.resume && (
              <Magnetic>
                <a
                  href={publicProfile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-icon"
                  aria-label="Download resume"
                >
                  <Download className="w-[18px] h-[18px]" />
                </a>
              </Magnetic>
            )}
          </Reveal>
        </div>
      </MouseGlow>

      {/* Bento Stats */}
      <section className="py-10">
        <div className="bento-grid">
          {[
            { icon: Code2, label: 'Projects Shipped', value: String(featuredProjects.length || 0), span: 'md:col-span-2' },
            { icon: Database, label: 'Skills Tracked', value: String(allSkills.length || 0), span: 'md:col-span-2' },
            { icon: Globe, label: 'Years Experience', value: '5+', span: 'md:col-span-1' },
            { icon: Users, label: 'Happy Clients', value: '50+', span: 'md:col-span-1' },
          ].map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.08}
              className={`glass-card glass-card-hover p-6 text-center ${stat.span}`}
            >
              <stat.icon className="w-6 h-6 mx-auto mb-3 text-accent-violet dark:text-accent-light" />
              <div className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-1">
                <CountUp value={stat.value} />
              </div>
              <div className="text-muted-light dark:text-muted text-xs uppercase tracking-wide font-medium">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <Reveal>
          <p className="eyebrow">Selected Work</p>
          <h2 className="section-title">Featured Projects</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {featuredProjects.map((project, index) => (
            <Reveal
              key={project._id}
              delay={index * 0.1}
              className="glass-card glass-card-hover overflow-hidden group"
            >
              {project.images?.[0] && (
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">{project.title}</h3>
                <p className="text-muted-light dark:text-muted mb-4 line-clamp-2 text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="pill bg-accent-gradient-soft text-accent-violet dark:text-accent-light">
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/projects/${project._id}`}
                  className="text-accent-violet dark:text-accent-light hover:opacity-80 text-sm font-semibold flex items-center gap-1.5 group/link"
                >
                  <span>View Project</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Magnetic>
            <Link to="/projects" className="btn-primary inline-flex">
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      {/* Skills */}
      <section className="py-16">
        <Reveal>
          <p className="eyebrow">Toolbox</p>
          <h2 className="section-title">Skills &amp; Technologies</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
          {allSkills.slice(0, 12).map((skill, index) => (
            <Reveal
              key={skill._id}
              direction="none"
              delay={index * 0.04}
              className="glass-card glass-card-hover p-4 text-center group relative"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{skill.icon || '💻'}</div>
              <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{skill.skillName}</div>
              <div className="text-xs font-semibold text-accent-violet dark:text-accent-light">{skill.percentage}%</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <Reveal className="relative glass-panel p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-accent-gradient opacity-90" />
          <div className="absolute inset-0 bg-radial-fade opacity-60" />
          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">Let's build something great together</h2>
            <p className="text-lg mb-8 text-white/85 max-w-xl mx-auto">
              Have a project in mind? I'd love to hear about it.
            </p>
            <Magnetic>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-accent-violet font-semibold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-xl">
                <span>Get In Touch</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Home;
