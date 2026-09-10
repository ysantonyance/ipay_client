import api from './api.js'

export const cartApi = {
    getAll: () => api.get('/cart'),
    addItem: (productData) => api.post(`/cart/items/`, productData),
    updateItem: (id, productData) => api.put(`/cart/items/${id}`, productData),
    removeItem: (id) => api.delete(`/cart/items/${id}`),
    delete: () => api.delete(`/cart`)
};