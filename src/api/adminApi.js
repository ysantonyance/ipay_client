import api from './api.js'

export const adminApi = {
    // Admin or moderator. -> [{ id, name, email, phone, role, isBanned }] (role is the role's name; no password data)
    getAllUsers: () => api.get('/admin/users'),

    // Admin or moderator. -> the updated user row. Rejects (403) for admins/moderators and (400) for banned users.
    makeSeller: (userId) => api.post(`/admin/users/${userId}/make-seller`),

    // Admin only. -> the updated user row.
    makeModerator: (userId) => api.post(`/admin/users/${userId}/make-moderator`),

    getDashboardStats: () => api.get(`/admin/stats`),
    updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
    banUser: (userId) => api.put(`/admin/users/${userId}`, { isBanned: true }),
    unbanUser: (userId) => api.put(`/admin/users/${userId}`, { isBanned: false }),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
};
