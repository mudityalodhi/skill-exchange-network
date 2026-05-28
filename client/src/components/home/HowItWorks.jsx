import { motion } from 'framer-motion';
import { FiUserPlus, FiList, FiRepeat, FiStar } from 'react-icons/fi';
import { SectionHeader } from '../common/index.jsx';

const STEPS = [
  {
    icon: <FiUserPlus size={28} />,
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up and list the skills you can teach and skills you want to learn. Add your experience level and availability.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    icon: <FiList size={28} />,
    step: '02',
    title: 'Find Your Match',
    description: 'Our AI matching engine connects you with the perfect skill exchange partners based on your needs and what you offer.',
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/20',
  },
  {
    icon: <FiRepeat size={28} />,
    step: '03',
    title: 'Exchange Skills',
    description: 'Send exchange requests, schedule sessions, and start learning. Teach what you know, learn what you want.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
  {
    icon: <FiStar size={28} />,
    step: '04',
    title: 'Earn & Grow',
    description: 'Earn SEN credits for every session you teach. Spend credits to learn from others. Build your reputation.',
    color: 'text-sen-green',
    bg: 'bg-sen-green/10',
    border: 'border-sen-green/20',
  },
];

const HowItWorks = () => (
  <section className="section bg-sen-black">
    <div className="container-max">
      <SectionHeader
        tag="✨ How It Works"
        title="Simple. Powerful. Free."
        description="Four easy steps to start exchanging skills and building your knowledge."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Connector line (desktop) */}
        <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-sen-border to-transparent" />

        {STEPS.map(({ icon, step, title, description, color, bg, border }, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative group"
          >
            <div className="card text-center h-full group-hover:border-primary-500/30 transition-all duration-300">
              {/* Step number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-sen-black border border-sen-border text-sen-muted text-xs font-bold px-2 py-0.5 rounded-full font-body">
                  {step}
                </span>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 ${bg} border ${border} rounded-2xl flex items-center justify-center mx-auto mb-5 mt-3 ${color} group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>

              <h3 className="text-lg font-heading font-semibold text-white mb-3">{title}</h3>
              <p className="text-sen-muted text-sm font-body leading-relaxed">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
