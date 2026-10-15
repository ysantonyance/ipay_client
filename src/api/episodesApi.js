import api from './api.js'
import { invalidating } from './cache.js'

// Backend: api/episodes  (episodes are filtered by series with ?seriesId=)
export const episodesApi = {
    getAll: () => api.get('/episodes'),
    getBySeries: (seriesId) => api.get('/episodes', { params: { seriesId } }),
    getById: (id) => api.get(`/episodes/${id}`),
    // A series stores its episode ids, so the cached series list is dropped after an episode write.
    create: (episodeData) => invalidating(['series'], api.post('/episodes', episodeData)),
    update: (id, episodeData) => invalidating(['series'], api.put(`/episodes/${id}`, episodeData)),
    delete: (id) => invalidating(['series'], api.delete(`/episodes/${id}`))
};
