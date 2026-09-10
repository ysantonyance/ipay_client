import api from './api.js'

export const categoriesApi = {
    getAll: (params) => api.get('/categories', { params }),
    getById: (id) => api.get(`/categories/${id}`),
    create: (productData) => api.post('/categories', productData),
    update: (id, productData) => api.put(`/categories/${id}`, productData),
    delete: (id) => api.delete(`/categories/${id}`)
};