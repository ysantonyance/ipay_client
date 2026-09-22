import api from './api.js'

// Backend: api/genres
export const genresApi = {
    getAll: () => api.get('/genres'),
    getById: (id) => api.get(`/genres/${id}`),
    create: (genreData) => api.post('/genres', genreData),
    update: (id, genreData) => api.put(`/genres/${id}`, genreData),
    delete: (id) => api.delete(`/genres/${id}`),
    addSeries: (id, seriesId) => api.put(`/genres/${id}/series/${seriesId}`),
    removeSeries: (id, seriesId) => api.delete(`/genres/${id}/series/${seriesId}`),
    addFilm: (id, filmId) => api.put(`/genres/${id}/films/${filmId}`),
    removeFilm: (id, filmId) => api.delete(`/genres/${id}/films/${filmId}`)
};
