import api from './api.js'

export const episodesApi = {
    getAll: (seriesId, params) => api.get(`/amazon-video/series/${seriesId}/episodes`, { params }),
    getById: (seriesId, id) => api.get(`/amazon-video/series/${seriesId}/episodes/${id}`),
    create: (seriesId, productData) => api.post(`/amazon-video/series/${seriesId}/episodes`, productData),
    update: (seriesId, id, productData) => api.put(`/amazon-video/series/${seriesId}/episodes/${id}`, productData),
    delete: (seriesId, id) => api.delete(`/amazon-video/series/${seriesId}/episodes/${id}`)
};