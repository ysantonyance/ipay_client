import api from './api.js'

export const ordersApi = {
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    create: (productData) => api.post('/orders', productData),
    update: (id, productData) => api.put(`/orders/${id}`, productData),
    delete: (id) => api.delete(`/orders/${id}`)
};