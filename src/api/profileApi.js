import api from './api.js';
import { saveSession } from './authApi.js';

// Backend: api/profile (all calls need the signed-in user's JWT, which api.js attaches).
export const profileApi = {
    // Resolves to { name, email, hasPassword }.
    // hasPassword is false for accounts created through Google sign-in.
    get: () => api.get('/profile'),

    // Body: { newName, password } -> { name, email, hasPassword }
    // Google-only accounts have no password, so they may send an empty one.
    changeUsername: async ({ newName, password }) => {
        const data = await api.put('/profile/username', { newName, password });

        // The header reads the display name from localStorage (see AuthContext).
        localStorage.setItem('userName', data?.name || newName);
        window.dispatchEvent(new Event('ipay-auth-changed'));

        return data;
    },

    // Body: { currentPassword, newPassword } -> { name, email, hasPassword }
    // The backend updates its own hash AND the Firebase account, so nothing else is needed here.
    changePassword: ({ currentPassword, newPassword }) =>
        api.put('/profile/password', { currentPassword, newPassword }),

    // Email change, step 1. Body: { newEmail, password } -> { name, email, hasPassword }
    // Only checks the password and that the address is free; nothing is changed yet.
    startEmailChange: ({ newEmail, password }) =>
        api.post('/profile/email/start', { newEmail, password }),

    // Email change, step 2. Body: { idToken, password } -> the usual session response.
    // idToken is a Firebase ID token for the account that now carries the verified new address.
    // The JWT contains the email, so the backend returns a fresh one and we store it.
    confirmEmailChange: async ({ idToken, password }) => {
        const data = await api.post('/profile/email/confirm', { idToken, password });
        saveSession(data);
        return data;
    },
};
