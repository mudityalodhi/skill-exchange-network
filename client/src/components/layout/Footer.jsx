import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    Platform: [
      { to: '/explore', label: 'Explore Skills' },
      { to: '/articles', label: 'Knowledge Hub' },
      { to: '/about', label: 'About SEN' },
      { to: '/register', label: 'Join Free' },
    ],
    Learn: [
      { to: '/articles?category=Coding', label: 'Coding' },
      { to: '/articles?category=Web Development', label: 'Web Dev' },
      { to: '/articles?category=Design', label: 'Design' },
      { to: '/articles?category=Career Guidance', label: 'Career' },
    ],
    Community: [
      { to: '/explore', label: 'Find Mentors' },
      { to: '/exchanges', label: 'Exchanges' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/messages', label: 'Messages' },
    ],
  };

  return (
    <footer className="border-t border-sen-border bg-sen-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center">
                <span className="text-white font-heading font-bold">S</span>
              </div>
              <span className="text-xl font-heading font-bold text-white">
                SEN<span className="text-primary-500">.</span>
              </span>
            </Link>
            <p className="text-sen-muted text-sm leading-relaxed max-w-xs font-body mb-6">
              Exchange skills, grow together. A peer-to-peer learning platform where knowledge flows freely.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <FiGithub size={17} />, href: '#', label: 'GitHub' },
                { icon: <FiTwitter size={17} />, href: '#', label: 'Twitter' },
                { icon: <FiLinkedin size={17} />, href: '#', label: 'LinkedIn' },
                { icon: <FiMail size={17} />, href: 'mailto:hello@sen.app', label: 'Email' },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-sen-card border border-sen-border flex items-center justify-center text-sen-muted hover:text-white hover:border-primary-500/50 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-heading font-semibold text-sm mb-4 uppercase tracking-wider">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {items.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sen-muted hover:text-primary-400 text-sm font-body transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-sen-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sen-muted text-sm font-body">
            © {year} SEN — Skill Exchange Network. All rights reserved.
          </p>

          <p className="text-sen-muted text-sm font-body">
            Crafted by{" "}
            <span className="text-white font-medium">
              Muditya Lodhi
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
