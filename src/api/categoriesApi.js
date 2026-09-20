import api from './api.js'

// Backend: api/categories
export const categoriesApi = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    // Body: { id, name, quantity, productIds }
    create: (categoryData) => api.post('/categories', categoryData),
    update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
    delete: (id) => api.delete(`/categories/${id}`),
    addProduct: (id, productId) => api.put(`/categories/${id}/products/${productId}`),
    removeProduct: (id, productId) => api.delete(`/categories/${id}/products/${productId}`)
};
