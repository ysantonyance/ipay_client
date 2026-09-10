import axios from 'axios';

const api = axios.create({
    baseURL: 'backendurl', /////////////////////////////////
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Session expired. Redirecting to login...');
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;