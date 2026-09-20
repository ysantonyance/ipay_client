import api from './api.js'

// Backend: api/series
export const seriesApi = {
    getAll: () => api.get('/series'),
    getById: (id) => api.get(`/series/${id}`),
    create: (seriesData) => api.post('/series', seriesData),
    update: (id, seriesData) => api.put(`/series/${id}`, seriesData),
    delete: (id) => api.delete(`/series/${id}`)
};
