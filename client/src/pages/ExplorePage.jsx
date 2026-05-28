import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { userService } from '../services/index.js';
import { Avatar, StarRating, SkeletonCard, EmptyState, PageHeader } from '../components/common/index.jsx';

const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Evenings', 'Flexible'];

const UserCard = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Link to={`/profile/${user._id}`} className="card group flex flex-col h-full block hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-4 mb-4">
        <Avatar user={user} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-heading font-semibold truncate group-hover:text-primary-400 transition-colors">
            {user.name}
          </h3>
          <p className="text-sen-muted text-xs font-body mb-1">{user.location || 'SEN Member'}</p>
          <div className="flex items-center gap-1.5">
            <StarRating rating={user.averageRating || 0} />
            <span className="text-sen-muted text-xs">({user.totalReviews || 0})</span>
          </div>
        </div>
      </div>

      <p className="text-sen-muted text-sm font-body line-clamp-2 mb-4 flex-1">
        {user.bio || 'Passionate about skill exchange and continuous learning.'}
      </p>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-sen-muted font-body mb-1.5">🎓 Teaches</p>
          <div className="flex flex-wrap gap-1.5">
            {(user.skillsOffered || []).slice(0, 3).map((s) => (
              <span key={s.skill} className="badge-red text-xs">{s.skill}</span>
            ))}
            {(user.skillsOffered || []).length > 3 && (
              <span className="badge-gray text-xs">+{user.skillsOffered.length - 3}</span>
            )}
          </div>
        </div>

        {(user.skillsWanted || []).length > 0 && (
          <div>
            <p className="text-xs text-sen-muted font-body mb-1.5">📚 Wants to Learn</p>
            <div className="flex flex-wrap gap-1.5">
              {user.skillsWanted.slice(0, 2).map((s) => (
                <span key={s} className="badge-green text-xs">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-sen-border">
        <span className="text-xs text-sen-muted font-body">⏰ {user.availability || 'Flexible'}</span>
        <span className="text-xs text-primary-400 font-semibold group-hover:underline">View Profile →</span>
      </div>
    </Link>
  </motion.div>
);

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [skill, setSkill] = useState(searchParams.get('skill') || '');
  const [availability, setAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (skill) params.skill = skill;
      if (availability) params.availability = availability;
      const { data } = await userService.getUsers(params);
      setUsers(data.users || []);
      setPagination(data.pagination || { total: 0, pages: 1, page: 1 });
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search, skill, availability]);

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const clearFilters = () => {
    setSearch('');
    setSkill('');
    setAvailability('');
  };

  const hasFilters = search || skill || availability;

  return (
    <div className="min-h-screen bg-sen-black">
      <PageHeader
        title="Explore Skills"
        description="Find people to exchange skills with. Browse by skill, availability, or location."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-sen-card border border-sen-border rounded-xl p-2 focus-within:border-primary-500/50 transition-all">
            <FiSearch className="ml-2 text-sen-muted flex-shrink-0" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill, or bio..."
              className="flex-1 bg-transparent text-white placeholder:text-sen-muted text-sm font-body focus:outline-none"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="text-sen-muted hover:text-white">
                <FiX size={16} />
              </button>
            )}
          </form>

          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`btn-secondary flex items-center gap-2 text-sm px-4 py-2 ${showFilters ? 'border-primary-500/50 text-primary-400' : ''}`}
          >
            <FiFilter size={16} />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-sen-card border border-sen-border rounded-xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div>
              <label className="label">Skill</label>
              <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="input text-sm"
                placeholder="e.g., React, Photoshop..."
              />
            </div>
            <div>
              <label className="label">Availability</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="input text-sm"
              >
                <option value="">Any Availability</option>
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={clearFilters} className="btn-ghost text-sm w-full justify-center">
                <FiX size={14} /> Clear Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sen-muted text-sm font-body">
            {loading ? 'Searching...' : `${pagination.total} member${pagination.total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No members found"
            description="Try adjusting your search or filters to find skill exchange partners."
            action={
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {users.map((user) => <UserCard key={user._id} user={user} />)}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchUsers(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === pagination.page
                        ? 'bg-primary-500 text-white'
                        : 'bg-sen-card border border-sen-border text-sen-muted hover:border-primary-500/50 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
