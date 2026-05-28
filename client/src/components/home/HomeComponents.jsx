import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { skillService, userService, articleService } from '../../services/index.js';
import { SectionHeader, Avatar, StarRating } from '../common/index.jsx';

// ==================== POPULAR SKILLS ====================
const SKILL_ICONS = {
  Technology: '💻', Design: '🎨', Business: '💼', Marketing: '📢',
  Music: '🎵', Art: '🖌️', Language: '🌍', Writing: '✍️',
  Photography: '📸', Cooking: '🍳', Fitness: '💪', Finance: '📈',
  Education: '📚', Other: '🎯',
};

export const PopularSkills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    skillService.getPopular()
      .then(({ data }) => setSkills(data.skills || []))
      .catch(() => {});
  }, []);

  const FALLBACK = [
    { title: 'React.js', category: 'Technology', usersOffering: 42 },
    { title: 'UI/UX Design', category: 'Design', usersOffering: 38 },
    { title: 'Python', category: 'Technology', usersOffering: 55 },
    { title: 'Public Speaking', category: 'Education', usersOffering: 29 },
    { title: 'Photoshop', category: 'Design', usersOffering: 33 },
    { title: 'Video Editing', category: 'Art', usersOffering: 27 },
    { title: 'Digital Marketing', category: 'Marketing', usersOffering: 31 },
    { title: 'Guitar', category: 'Music', usersOffering: 22 },
    { title: 'Data Science', category: 'Technology', usersOffering: 48 },
    { title: 'Copywriting', category: 'Writing', usersOffering: 25 },
    { title: 'Node.js', category: 'Technology', usersOffering: 36 },
    { title: 'Spanish', category: 'Language', usersOffering: 19 },
  ];

  const displaySkills = skills.length > 0 ? skills : FALLBACK;

  return (
    <section className="section bg-sen-dark/30">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="section-tag">🔥 Popular Skills</div>
            <h2 className="section-title !mb-0">Skills People Are Exchanging</h2>
          </div>
          <Link to="/explore" className="btn-ghost text-sm shrink-0">
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {displaySkills.slice(0, 12).map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <Link
                to={`/explore?skill=${encodeURIComponent(skill.title)}`}
                className="card text-center group hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="text-3xl mb-3">{SKILL_ICONS[skill.category] || '🎯'}</div>
                <h3 className="text-sm font-semibold text-white font-heading mb-1 truncate">{skill.title}</h3>
                <p className="text-xs text-sen-muted font-body">{skill.usersOffering} teaching</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== TOP MENTORS ====================
export const TopMentors = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    userService.getUsers({ sort: '-averageRating', limit: 6 })
      .then(({ data }) => setMentors(data.users || []))
      .catch(() => {});
  }, []);

  const FALLBACK = [
    { _id: '1', name: 'Aryan Mehta', bio: 'Full Stack Developer', skillsOffered: [{ skill: 'React.js' }, { skill: 'Node.js' }], averageRating: 4.9, totalReviews: 32 },
    { _id: '2', name: 'Priya Sharma', bio: 'UI/UX Designer', skillsOffered: [{ skill: 'Figma' }, { skill: 'UI Design' }], averageRating: 4.8, totalReviews: 28 },
    { _id: '3', name: 'Rahul Singh', bio: 'Data Scientist', skillsOffered: [{ skill: 'Python' }, { skill: 'ML' }], averageRating: 4.9, totalReviews: 41 },
    { _id: '4', name: 'Sneha Patel', bio: 'Content Creator', skillsOffered: [{ skill: 'Video Editing' }, { skill: 'YouTube' }], averageRating: 4.7, totalReviews: 19 },
    { _id: '5', name: 'Dev Kapoor', bio: 'Digital Marketer', skillsOffered: [{ skill: 'SEO' }, { skill: 'Marketing' }], averageRating: 4.8, totalReviews: 24 },
    { _id: '6', name: 'Ananya Roy', bio: 'Graphic Designer', skillsOffered: [{ skill: 'Photoshop' }, { skill: 'Illustration' }], averageRating: 4.9, totalReviews: 37 },
  ];

  const displayMentors = mentors.length > 0 ? mentors : FALLBACK;

  return (
    <section className="section bg-sen-black">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="section-tag">🌟 Top Mentors</div>
            <h2 className="section-title !mb-0">Learn from the Best</h2>
          </div>
          <Link to="/explore" className="btn-ghost text-sm shrink-0">
            See All Mentors <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMentors.map((mentor, i) => (
            <motion.div
              key={mentor._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link to={`/profile/${mentor._id}`} className="card group block hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <Avatar user={mentor} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-heading font-semibold truncate group-hover:text-primary-400 transition-colors">
                      {mentor.name}
                    </h3>
                    <p className="text-sen-muted text-sm font-body truncate">{mentor.bio || 'SEN Member'}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <StarRating rating={mentor.averageRating || 5} />
                      <span className="text-sen-muted text-xs">({mentor.totalReviews || 0})</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {(mentor.skillsOffered || []).slice(0, 3).map((s) => (
                    <span key={s.skill} className="badge-red text-xs">
                      {s.skill}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== TESTIMONIALS ====================
const TESTIMONIALS = [
  {
    name: 'Riya Verma',
    role: 'React Dev → Learned Photoshop',
    text: 'I taught React to a graphic designer and learned Photoshop in return. SEN made this zero-cost exchange so seamless!',
    rating: 5,
    emoji: '🧑‍💻',
  },
  {
    name: 'Karan Joshi',
    role: 'Video Editor → Learned Python',
    text: 'As a video editor, I always wanted to learn Python. Found an amazing mentor on SEN who taught me in exchange for editing lessons.',
    rating: 5,
    emoji: '🎬',
  },
  {
    name: 'Meera Nair',
    role: 'Yoga Instructor → Learned Digital Marketing',
    text: 'SEN is a game-changer! I run a yoga studio and exchanged teaching sessions for digital marketing skills. My revenue doubled!',
    rating: 5,
    emoji: '🧘‍♀️',
  },
  {
    name: 'Arjun Das',
    role: 'Guitarist → Learned Public Speaking',
    text: 'I exchanged guitar lessons for public speaking coaching. Best investment of time I ever made. The credits system is brilliant.',
    rating: 5,
    emoji: '🎸',
  },
];

export const Testimonials = () => (
  <section className="section bg-sen-dark/30 overflow-hidden">
    <div className="container-max">
      <SectionHeader
        tag="💬 Testimonials"
        title="People Love SEN"
        description="Thousands of skill exchanges have happened. Here's what our community says."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="card group hover:border-primary-500/30"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="text-4xl">{t.emoji}</div>
              <div>
                <h4 className="text-white font-heading font-semibold">{t.name}</h4>
                <p className="text-sen-muted text-xs font-body">{t.role}</p>
                <StarRating rating={t.rating} />
              </div>
            </div>
            <p className="text-sen-muted text-sm font-body leading-relaxed italic">
              "{t.text}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ==================== FEATURED ARTICLES ====================
export const FeaturedArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    articleService.getAll({ featured: 'true', limit: 3 })
      .then(({ data }) => setArticles(data.articles || []))
      .catch(() => {});
  }, []);

  const FALLBACK = [
    { _id: '1', slug: '#', title: 'How to Master Any Skill in 30 Days', category: 'Productivity', readTime: 6, thumbnail: '', excerpt: 'Science-backed strategies to accelerate skill acquisition.' },
    { _id: '2', slug: '#', title: 'Top 10 In-Demand Skills for 2025', category: 'Career Guidance', readTime: 8, thumbnail: '', excerpt: 'Skills that employers and the market desperately need right now.' },
    { _id: '3', slug: '#', title: 'The Art of Teaching What You Know', category: 'Self Improvement', readTime: 5, thumbnail: '', excerpt: 'Teaching others accelerates your own mastery. Here is how.' },
  ];

  const displayArticles = articles.length > 0 ? articles : FALLBACK;

  return (
    <section className="section bg-sen-black">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="section-tag">📚 Knowledge Hub</div>
            <h2 className="section-title !mb-0">Featured Articles</h2>
          </div>
          <Link to="/articles" className="btn-ghost text-sm shrink-0">
            View All Articles <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayArticles.map((article, i) => (
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link to={`/articles/${article.slug}`} className="card group block hover:-translate-y-1 transition-all duration-300">
                <div className="w-full h-40 rounded-xl bg-gradient-to-br from-primary-500/20 to-sen-green/10 flex items-center justify-center text-5xl mb-4 overflow-hidden">
                  {article.thumbnail
                    ? <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
                    : '📖'}
                </div>
                <span className="badge-red text-xs mb-3">{article.category}</span>
                <h3 className="text-white font-heading font-semibold mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sen-muted text-sm font-body line-clamp-2 mb-3">{article.excerpt}</p>
                <span className="text-sen-muted text-xs">{article.readTime} min read</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== CTA SECTION ====================
export const CTASection = () => (
  <section className="section bg-sen-dark/30">
    <div className="container-max">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-primary-500/20 bg-gradient-to-br from-primary-500/10 via-sen-black to-sen-green/5 p-12 text-center"
      >
        {/* Glow effects */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-sen-green/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
            Ready to Start <span className="gradient-text">Exchanging?</span>
          </h2>
          <p className="text-sen-muted text-lg font-body max-w-xl mx-auto mb-8">
            Join 5,000+ learners and teachers on SEN. Sign up free and get 50 starter credits instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-10 py-4">
              Join SEN Free — Get 50 Credits
              <FiArrowRight />
            </Link>
            <Link to="/explore" className="btn-secondary text-base px-8 py-4">
              Explore First
            </Link>
          </div>
          <p className="text-sen-muted text-sm mt-6 font-body">
            No credit card required. No fees. Just skill exchange.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);
