import api from './api.js'

export const adminApi = {
    // Admin or moderator. -> [{ id, name, email, phone, role, isBanned }] (role is the role's name; no password data)
    getAllUsers: () => api.get('/admin/users'),

    // Admin or moderator. -> the updated user row. Rejects (403) for admins/moderators and (400) for banned users.
    makeSeller: (userId) => api.post(`/admin/users/${userId}/make-seller`),

    // Admin only. -> the updated user row.
    makeModerator: (userId) => api.post(`/admin/users/${userId}/make-moderator`),

    // Admin only. Takes the moderator role away (the person becomes a customer). -> the updated user row.
    removeModerator: (userId) => api.post(`/admin/users/${userId}/remove-moderator`),

    // Admin or moderator. Turns a seller back into a customer. -> the updated user row.
    makeCustomer: (userId) => api.post(`/admin/users/${userId}/make-customer`),

    getDashboardStats: () => api.get(`/admin/stats`),
    updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
    // Ban / unban. Admins and moderators have separate routes on the backend (each role's own rules):
    // admins can ban anyone except admins, moderators can't ban admins or other moderators. -> the updated user row.
    banUser: (userId, asAdmin) =>
        api.patch(asAdmin ? `/admin/${userId}/ban` : `/admin/moderator/${userId}/ban`),
    unbanUser: (userId, asAdmin) =>
        api.patch(asAdmin ? `/admin/${userId}/unban` : `/admin/moderator/${userId}/unban`),
    deleteUser: (userId) => api.delete(`/admin/users/${userId}`)
};
