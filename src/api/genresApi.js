import api from './api.js'
import { cached, invalidating } from './cache.js'

// Genres and series reference each other, so both lists are refreshed after a write.
const AFFECTED = ['genres', 'series'];

// Backend: api/genres
export const genresApi = {
    // Cached for a few minutes; cleared by any genre (or genre link) write.
    getAll: () => cached('genres', () => api.get('/genres')),
    getById: (id) => api.get(`/genres/${id}`),
    create: (genreData) => invalidating(AFFECTED, api.post('/genres', genreData)),
    update: (id, genreData) => invalidating(AFFECTED, api.put(`/genres/${id}`, genreData)),
    delete: (id) => invalidating(AFFECTED, api.delete(`/genres/${id}`)),
    addSeries: (id, seriesId) => invalidating(AFFECTED, api.put(`/genres/${id}/series/${seriesId}`)),
    removeSeries: (id, seriesId) => invalidating(AFFECTED, api.delete(`/genres/${id}/series/${seriesId}`)),
    addFilm: (id, filmId) => invalidating(AFFECTED, api.put(`/genres/${id}/films/${filmId}`)),
    removeFilm: (id, filmId) => invalidating(AFFECTED, api.delete(`/genres/${id}/films/${filmId}`))
};
