import api from './api.js'

// Backend: api/images (Firebase Storage)
export const imagesApi = {
    // Uploads a File (max 5 MB). Resolves to { url: "/api/images/<objectName>" }.
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/images', formData);
    },

    // Turns a stored image path like "/api/images/abc.png" into something an <img> can load.
    // Absolute URLs (e.g. Firebase links already saved on a product) pass through untouched.
    resolveUrl: (url) => {
        if (!url || /^https?:\/\//i.test(url)) return url;

        const apiUrl = import.meta.env.VITE_API_URL;
        if (apiUrl && /^https?:\/\//i.test(apiUrl)) {
            return new URL(url, apiUrl).toString();
        }

        return url; // dev: same origin, handled by the Vite proxy
    }
};
