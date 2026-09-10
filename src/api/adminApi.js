import api from './api.js'

export const adminApi = {
    getAllUsers: () => api.get('/admin/users'),
    getDashboardStats: () => api.get(`/admin/stats`),
    updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
    banUser: (userId) => api.put(`/admin/users/${userId}`, { isBanned: true }),
    unbanUser: (userId) => api.put(`/admin/users/${userId}`, { isBanned: false }),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
};