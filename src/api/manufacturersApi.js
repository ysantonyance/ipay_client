import api from './api.js'

// Backend: api/manufacturers
export const manufacturersApi = {
    getAll: () => api.get('/manufacturers'),
    getById: (id) => api.get(`/manufacturers/${id}`),
    // Body: { name }
    create: (manufacturerData) => api.post('/manufacturers', manufacturerData),
    update: (id, manufacturerData) => api.put(`/manufacturers/${id}`, manufacturerData),
    delete: (id) => api.delete(`/manufacturers/${id}`)
};
