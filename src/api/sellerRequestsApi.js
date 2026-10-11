import api from './api.js'

// Backend: api/seller-requests
export const sellerRequestsApi = {
    // Customer. Body: { message? } -> the new request. Rejects 400 if one is already pending.
    create: (message) => api.post('/seller-requests', { message }),

    // Customer or seller. -> their latest request { id, status, message, createdAt, ... } or '' (204) if none.
    getMine: () => api.get('/seller-requests/mine'),

    // Admin or moderator. -> every request, pending first.
    getAll: () => api.get('/seller-requests'),

    // Admin or moderator. Approving makes the customer a seller. -> the updated request.
    approve: (id) => api.post(`/seller-requests/${id}/approve`),
    reject: (id) => api.post(`/seller-requests/${id}/reject`),
};
