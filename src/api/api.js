import axios from 'axios';

// In development the Vite dev server proxies "/api" to the ASP.NET backend (see vite.config.js),
// so the browser only talks to its own origin. For a deployed build, set VITE_API_URL
// (e.g. https://your-backend.example.com/api) in the environment.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
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
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

/**
 * Turns whatever the backend (or the network) threw into a readable string.
 * The backend returns plain strings ("Неверный email или пароль"), { error }, or { message }.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
    const data = error?.response?.data;

    if (typeof data === 'string' && data.trim()) return data;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    if (data?.title) return data.title; // ASP.NET ProblemDetails / validation errors

    if (error?.code === 'ECONNABORTED') return 'The server took too long to respond.';
    if (error?.request && !error?.response) return 'Cannot reach the server. Is the backend running?';

    return fallback;
}

export default api;
