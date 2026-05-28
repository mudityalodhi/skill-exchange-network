import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 5000, suffix: '+', label: 'Active Members', icon: '👥' },
  { value: 120, suffix: '+', label: 'Skills Available', icon: '🎯' },
  { value: 10000, suffix: '+', label: 'Exchanges Done', icon: '🔄' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: '⭐' },
];

const AnimatedCounter = ({ target, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => (
  <section className="py-16 border-y border-sen-border bg-sen-dark/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {STATS.map(({ value, suffix, label, icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="text-center"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-3xl sm:text-4xl font-heading font-bold gradient-text mb-1">
              <AnimatedCounter target={value} suffix={suffix} />
            </div>
            <p className="text-sen-muted text-sm font-body">{label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
