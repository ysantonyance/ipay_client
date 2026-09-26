import api from './api.js'

// Backend: api/auth
export const authApi = {
    // Body: { email, password }
    // Resolves to { accessToken, refreshToken, expiresAt, tokenType, user }
    // The access token is saved so api.js attaches it to every later request.
    login: async (credentials) => {
        const data = await api.post('/auth/login', credentials);

        if (data?.accessToken) {
            localStorage.setItem('authToken', data.accessToken);
        }
        if (data?.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }

        const displayName = data?.user?.fullname || data?.user?.email || "User";
        localStorage.setItem('userName', displayName);

        return data;
    },

    // Body: { email, password, confirmPassword, name }
    register: async (userData) => {
        const data = api.post('/auth/register', userData);

        if (userData.fullname)
            localStorage.setItem('name', userData.fullname);
        return data;
    },

    // The backend has no logout endpoint - the JWT is simply forgotten on the client.
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        return Promise.resolve();
    },

    isLoggedIn: () => Boolean(localStorage.getItem('authToken')),
};
