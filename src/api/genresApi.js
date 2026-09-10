import api from './api.js'

export const genresApi = {
    getAll: (params) => api.get('/genres', { params }),
    getById: (id) => api.get(`/genres/${id}`),
    create: (productData) => api.post('/genres', productData),
    update: (id, productData) => api.put(`/genres/${id}`, productData),
    delete: (id) => api.delete(`/genres/${id}`)
};