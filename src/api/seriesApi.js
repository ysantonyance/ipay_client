import api from './api.js'

export const seriesApi = {
    getAll: (params) => api.get('/amazon-video/series', { params }),
    getById: (id) => api.get(`/amazon-video/series/${id}`),
    create: (productData) => api.post('/amazon-video/series', productData),
    update: (id, productData) => api.put(`/amazon-video/series/${id}`, productData),
    delete: (id) => api.delete(`/amazon-video/series/${id}`)
};