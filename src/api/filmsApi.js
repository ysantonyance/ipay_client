import api from './api.js'

export const filmsApi = {
    getAll: (params) => api.get('/amazon-video/films', { params }),
    getById: (id) => api.get(`/amazon-video/films/${id}`),
    create: (productData) => api.post('/amazon-video/films', productData),
    update: (id, productData) => api.put(`/amazon-video/films/${id}`, productData),
    delete: (id) => api.delete(`/amazon-video/films/${id}`)
};