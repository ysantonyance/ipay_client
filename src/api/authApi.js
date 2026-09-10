import api from './api.js'

export const authApi = {
    login: (credentials) => api.post('/login', credentials),
    register: (userData) => api.post(`/register`, userData),
    logout: () => api.post('/logout'),
    getProfile: () => api.get(`/your-account`)
};