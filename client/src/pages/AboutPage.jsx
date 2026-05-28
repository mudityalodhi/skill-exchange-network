import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart, FiZap, FiShield, FiUsers } from 'react-icons/fi';

const VALUES = [
  {
    icon: <FiHeart size={24} />,
    title: 'Community First',
    desc: 'We believe in the power of community learning. Every exchange creates a stronger network of knowledge-sharers.',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
  },
  {
    icon: <FiZap size={24} />,
    title: 'No Barriers',
    desc: 'Knowledge should flow freely. No money, no paywalls — just people helping people grow through skill exchange.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: <FiShield size={24} />,
    title: 'Trust & Safety',
    desc: 'Our rating system, verified profiles, and community guidelines ensure every exchange is safe and valuable.',
    color: 'text-sen-green',
    bg: 'bg-sen-green/10',
  },
  {
    icon: <FiUsers size={24} />,
    title: 'Peer Learning',
    desc: 'Learning from peers who\'ve walked the same path accelerates understanding and makes knowledge stick.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
];

const TEAM = [
  { name: 'Aryan Kapoor', role: 'Founder & CEO', emoji: '👨‍💻' },
  { name: 'Priya Singh', role: 'Head of Design', emoji: '👩‍🎨' },
  { name: 'Rahul Verma', role: 'Lead Engineer', emoji: '👨‍🔧' },
  { name: 'Neha Sharma', role: 'Community Manager', emoji: '👩‍💼' },
];

const AboutPage = () => (
  <div className="min-h-screen bg-sen-black">
    {/* Hero */}
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-tag mx-auto w-fit">🌟 Our Story</div>
          <h1 className="section-title text-5xl sm:text-6xl mt-4">
            We Believe Knowledge <br />
            <span className="gradient-text">Should Be Free</span>
          </h1>
          <p className="section-desc mx-auto text-lg mt-4">
            SEN was born from a simple idea: everyone has something valuable to teach, and everyone wants to learn something new. Why pay when you can exchange?
          </p>
        </motion.div>
      </div>
    </section>

    {/* Mission */}
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-sen-border bg-sen-dark/30">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="section-tag">🎯 Our Mission</div>
            <h2 className="text-3xl font-heading font-bold text-white mt-3 mb-5">
              Democratizing Access to Skills & Knowledge
            </h2>
            <p className="text-sen-muted font-body leading-relaxed mb-4">
              The traditional education system is expensive and slow. Online courses are often one-size-fits-all. SEN takes a different approach — peer-to-peer, personalized, and absolutely free.
            </p>
            <p className="text-sen-muted font-body leading-relaxed">
              We connect a React developer who wants to learn guitar with a guitarist who wants to learn React. Both win. No money changes hands — just pure knowledge exchange.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-500/10 to-sen-green/5 border border-primary-500/20 rounded-2xl p-8 text-center">
            <div className="text-7xl mb-4">🔄</div>
            <h3 className="text-2xl font-heading font-bold text-white mb-2">The SEN Way</h3>
            <p className="text-sen-muted font-body">Teach what you know. Learn what you want. Earn credits. Grow forever.</p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section bg-sen-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto w-fit">💎 Our Values</div>
          <h2 className="section-title mt-4">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <motion.div key={v.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card text-center group hover:border-primary-500/30"
            >
              <div className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 ${v.color} group-hover:scale-110 transition-transform`}>
                {v.icon}
              </div>
              <h3 className="text-white font-heading font-semibold mb-3">{v.title}</h3>
              <p className="text-sen-muted text-sm font-body leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="section bg-sen-dark/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto w-fit">👥 The Team</div>
          <h2 className="section-title mt-4">Built by Learners, for Learners</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <motion.div key={member.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card text-center"
            >
              <div className="text-5xl mb-3">{member.emoji}</div>
              <h3 className="text-white font-heading font-semibold text-sm">{member.name}</h3>
              <p className="text-sen-muted text-xs font-body mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section bg-sen-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-500/10 to-sen-green/5 border border-primary-500/20 rounded-3xl p-12"
        >
          <div className="text-5xl mb-5">🚀</div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
            Ready to Join the Movement?
          </h2>
          <p className="text-sen-muted font-body mb-8">
            Thousands of people are already exchanging skills on SEN. Join them today, completely free.
          </p>
          <Link to="/register" className="btn-primary text-base px-10 py-4">
            Get Started Free <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default AboutPage;
