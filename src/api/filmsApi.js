import api from './api.js'

// Backend: api/films - a read-only proxy to OMDb (no create/update/delete).
export const filmsApi = {
    // GET /films/search?query=batman&page=1
    search: (query, page = 1) => api.get('/films/search', { params: { query, page } }),
    // GET /films/{imdbId}, e.g. "tt0372784"
    getByImdbId: (imdbId) => api.get(`/films/${imdbId}`)
};
