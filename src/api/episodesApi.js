import api from './api.js'

// Backend: api/episodes  (episodes are filtered by series with ?seriesId=)
export const episodesApi = {
    getAll: () => api.get('/episodes'),
    getBySeries: (seriesId) => api.get('/episodes', { params: { seriesId } }),
    getById: (id) => api.get(`/episodes/${id}`),
    create: (episodeData) => api.post('/episodes', episodeData),
    update: (id, episodeData) => api.put(`/episodes/${id}`, episodeData),
    delete: (id) => api.delete(`/episodes/${id}`)
};
