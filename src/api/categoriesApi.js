import api from './api.js'
import { cached, invalidating } from './cache.js'

// Category links to products go both ways, so both lists are refreshed after a write.
const AFFECTED = ['categories', 'products'];

// Backend: api/categories
export const categoriesApi = {
    // Cached for a few minutes; cleared by any category write.
    getAll: () => cached('categories', () => api.get('/categories')),
    getById: (id) => api.get(`/categories/${id}`),
    // Body: { name, quantity, productIds }
    create: (categoryData) => invalidating(AFFECTED, api.post('/categories', categoryData)),
    update: (id, categoryData) => invalidating(AFFECTED, api.put(`/categories/${id}`, categoryData)),
    delete: (id) => invalidating(AFFECTED, api.delete(`/categories/${id}`)),
    addProduct: (id, productId) => invalidating(AFFECTED, api.put(`/categories/${id}/products/${productId}`)),
    removeProduct: (id, productId) => invalidating(AFFECTED, api.delete(`/categories/${id}/products/${productId}`))
};
