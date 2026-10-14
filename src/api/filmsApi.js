import api from './api.js'

// Backend: api/films/omdb/* - a read-only proxy to OMDb (the key stays on the server).
export const filmsApi = {
    // GET /films/omdb/search?query=batman&page=1
    // -> { Search: [{ Title, Year, imdbID, Type, Poster }], totalResults, Response }
    search: (query, page = 1) => api.get('/films/omdb/search', { params: { query, page } }),
    // GET /films/omdb/{imdbId}, e.g. "tt0372784" -> full OMDb record (Title, Poster, Plot, Rated, imdbRating, ...)
    getByImdbId: (imdbId) => api.get(`/films/omdb/${imdbId}`)
};
