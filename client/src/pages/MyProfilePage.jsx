// MyProfilePage.jsx - Edit own profile
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiX, FiCamera, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/index.js';
import { Avatar, CreditsBadge, PageHeader } from '../components/common/index.jsx';
import toast from 'react-hot-toast';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Evenings', 'Flexible', 'Not Available'];

const MyProfilePage = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: '', bio: '', location: '', availability: 'Flexible',
    skillsOffered: [], skillsWanted: [],
    socialLinks: { linkedin: '', github: '', twitter: '', website: '' },
  });
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [newWanted, setNewWanted] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        availability: user.availability || 'Flexible',
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        socialLinks: { linkedin: '', github: '', twitter: '', website: '', ...(user.socialLinks || {}) },
      });
    }
  }, [user]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addSkillOffered = () => {
    if (!newSkill.trim()) return;
    if (form.skillsOffered.some((s) => s.skill === newSkill.trim())) return toast.error('Skill already added.');
    setForm((p) => ({ ...p, skillsOffered: [...p.skillsOffered, { skill: newSkill.trim(), level: newSkillLevel }] }));
    setNewSkill('');
  };

  const removeSkillOffered = (skill) =>
    setForm((p) => ({ ...p, skillsOffered: p.skillsOffered.filter((s) => s.skill !== skill) }));

  const addSkillWanted = () => {
    if (!newWanted.trim()) return;
    if (form.skillsWanted.includes(newWanted.trim())) return toast.error('Skill already added.');
    setForm((p) => ({ ...p, skillsWanted: [...p.skillsWanted, newWanted.trim()] }));
    setNewWanted('');
  };

  const removeSkillWanted = (s) =>
    setForm((p) => ({ ...p, skillsWanted: p.skillsWanted.filter((x) => x !== s) }));

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    setAvatarLoading(true);
    try {
      const { data } = await userService.uploadAvatar(fd);
      updateUser(data.user);
      toast.success('Avatar updated!');
    } catch (err) { toast.error(err.message); }
    finally { setAvatarLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await userService.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-sen-black">
      <PageHeader title="Edit Profile" description="Keep your profile updated to attract better skill exchange partners." />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card flex items-center gap-6">
            <div className="relative">
              <Avatar user={user} size="xl" />
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                {avatarLoading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FiCamera size={14} className="text-white" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <h3 className="text-white font-heading font-semibold">{user?.name}</h3>
              <p className="text-sen-muted text-sm font-body mb-2">{user?.email}</p>
              <CreditsBadge credits={user?.credits || 0} />
            </div>
          </motion.div>

          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card space-y-4">
            <h2 className="text-lg font-heading font-semibold text-white">Basic Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="input" placeholder="City, Country" />
              </div>
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} className="input resize-none" rows={3} placeholder="Tell others about yourself..." />
              <p className="text-xs text-sen-muted mt-1">{form.bio.length}/500</p>
            </div>
            <div>
              <label className="label">Availability</label>
              <select name="availability" value={form.availability} onChange={handleChange} className="input max-w-xs">
                {AVAILABILITY_OPTIONS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
          </motion.div>

          {/* Skills Offered */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card space-y-4">
            <h2 className="text-lg font-heading font-semibold text-white">Skills I Can Teach 🎓</h2>
            <div className="flex gap-2">
              <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
                className="input flex-1 text-sm" placeholder="Skill name..." />
              <select value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value)} className="input text-sm w-36">
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <button type="button" onClick={addSkillOffered} className="btn-primary text-sm px-4">
                <FiPlus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skillsOffered.map((s) => (
                <div key={s.skill} className="flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full px-3 py-1.5">
                  <span className="text-primary-400 text-sm font-semibold">{s.skill}</span>
                  <span className="text-primary-400/50 text-xs">· {s.level}</span>
                  <button type="button" onClick={() => removeSkillOffered(s.skill)} className="text-primary-400/50 hover:text-primary-400 ml-1">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills Wanted */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card space-y-4">
            <h2 className="text-lg font-heading font-semibold text-white">Skills I Want to Learn 📚</h2>
            <div className="flex gap-2">
              <input value={newWanted} onChange={(e) => setNewWanted(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillWanted())}
                className="input flex-1 text-sm" placeholder="Skill you want to learn..." />
              <button type="button" onClick={addSkillWanted} className="btn-primary text-sm px-4">
                <FiPlus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skillsWanted.map((s) => (
                <div key={s} className="badge-green flex items-center gap-1.5">
                  {s}
                  <button type="button" onClick={() => removeSkillWanted(s)} className="text-sen-green/60 hover:text-sen-green ml-1">
                    <FiX size={11} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card space-y-4">
            <h2 className="text-lg font-heading font-semibold text-white">Social Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['linkedin', 'github', 'twitter', 'website'].map((key) => (
                <div key={key}>
                  <label className="label capitalize">{key}</label>
                  <input
                    value={form.socialLinks[key]}
                    onChange={(e) => setForm((p) => ({ ...p, socialLinks: { ...p.socialLinks, [key]: e.target.value } }))}
                    className="input text-sm" placeholder={`https://${key}.com/...`}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
            {loading ? 'Saving...' : <><FiSave size={16} /> Save Profile</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;
