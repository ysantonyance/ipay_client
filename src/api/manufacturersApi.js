import api from './api.js'
import { cached, invalidating } from './cache.js'

// Products store the manufacturer's name, so a manufacturer change can affect the product list too.
const AFFECTED = ['manufacturers', 'products'];

// Backend: api/manufacturers
export const manufacturersApi = {
    // Cached for a few minutes; cleared by any manufacturer write.
    getAll: () => cached('manufacturers', () => api.get('/manufacturers')),
    getById: (id) => api.get(`/manufacturers/${id}`),
    // Body: { name }
    create: (manufacturerData) => invalidating(AFFECTED, api.post('/manufacturers', manufacturerData)),
    update: (id, manufacturerData) => invalidating(AFFECTED, api.put(`/manufacturers/${id}`, manufacturerData)),
    delete: (id) => invalidating(AFFECTED, api.delete(`/manufacturers/${id}`))
};
