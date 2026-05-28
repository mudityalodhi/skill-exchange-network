import api from './api';

// ==================== AUTH SERVICE ====================
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
};

// ==================== USER SERVICE ====================
export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (formData) =>
    api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleBookmark: (id) => api.post(`/users/${id}/bookmark`),
  getMatches: () => api.get('/users/matches'),
  getDashboard: () => api.get('/users/dashboard'),
};

// ==================== EXCHANGE SERVICE ====================
export const exchangeService = {
  send: (data) => api.post('/exchanges', data),
  getAll: (params) => api.get('/exchanges', { params }),
  getById: (id) => api.get(`/exchanges/${id}`),
  respond: (id, action) => api.put(`/exchanges/${id}/respond`, { action }),
  complete: (id) => api.put(`/exchanges/${id}/complete`),
};

// ==================== ARTICLE SERVICE ====================
export const articleService = {
  getAll: (params) => api.get('/articles', { params }),
  getBySlug: (slug) => api.get(`/articles/${slug}`),
  getCategories: () => api.get('/articles/categories'),
  create: (formData) =>
    api.post('/articles', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/articles/${id}`, data),
  delete: (id) => api.delete(`/articles/${id}`),
  like: (id) => api.post(`/articles/${id}/like`),
  bookmark: (id) => api.post(`/articles/${id}/bookmark`),
};

// ==================== REVIEW SERVICE ====================
export const reviewService = {
  create: (data) => api.post('/reviews', data),
  getForUser: (userId, params) => api.get(`/reviews/user/${userId}`, { params }),
};

// ==================== NOTIFICATION SERVICE ====================
export const notificationService = {
  getAll: (params) => api.get('/notifications', { params }),
  markRead: (ids) => api.put('/notifications/read', { ids }),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// ==================== CHAT SERVICE ====================
export const chatService = {
  getOrCreate: (participantId) => api.post('/chat/conversations', { participantId }),
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId, params) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, content) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { content }),
};

// ==================== SKILL SERVICE ====================
export const skillService = {
  getAll: (params) => api.get('/skills', { params }),
  getPopular: () => api.get('/skills/popular'),
};
