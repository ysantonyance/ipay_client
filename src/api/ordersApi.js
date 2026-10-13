import api from './api.js'

export const ordersApi = {
    getAll: (params) => api.get('/orders', { params }),
    getByUser: (userId) => api.get(`/orders/user/${userId}`),
    getById: (id) => api.get(`/orders/${id}`),
    create: (productData) => api.post('/orders', productData),
    // Admin or moderator (enforced by the UI; see OrdersPanel). status is the enum number: 0 Pending ... 4 Cancelled.
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    // A customer cancelling their own order (allowed until it ships). Returns the updated order.
    cancel: (id) => api.post(`/orders/${id}/cancel`),
    update: (id, productData) => api.put(`/orders/${id}`, productData),
    delete: (id) => api.delete(`/orders/${id}`)
};