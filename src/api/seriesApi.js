import api from './api.js'
import { cached, invalidating } from './cache.js'

// Genres and series reference each other, so both lists are refreshed after a write.
const AFFECTED = ['series', 'genres'];

// Backend: api/series
export const seriesApi = {
    // Cached for a few minutes; cleared by any series write.
    getAll: () => cached('series', () => api.get('/series')),
    getById: (id) => api.get(`/series/${id}`),
    create: (seriesData) => invalidating(AFFECTED, api.post('/series', seriesData)),
    update: (id, seriesData) => invalidating(AFFECTED, api.put(`/series/${id}`, seriesData)),
    delete: (id) => invalidating(AFFECTED, api.delete(`/series/${id}`))
};
