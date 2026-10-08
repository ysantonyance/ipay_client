import api from './api.js';
import { saveSession } from './authApi.js';

// Backend: api/profile (all calls need the signed-in user's JWT, which api.js attaches).
export const profileApi = {
    // Resolves to { name, email, phone, hasPassword }.
    // phone is '' when none was added; hasPassword is false for accounts created through Google sign-in.
    get: () => api.get('/profile'),

    // Body: { newName, password } -> { name, email, phone, hasPassword }
    // Google-only accounts have no password, so they may send an empty one.
    changeUsername: async ({ newName, password }) => {
        const data = await api.put('/profile/username', { newName, password });

        // The header reads the display name from localStorage (see AuthContext).
        localStorage.setItem('userName', data?.name || newName);
        window.dispatchEvent(new Event('ipay-auth-changed'));

        return data;
    },

    // Body: { newPhone, password } -> { name, email, phone, hasPassword }
    // Same rules as the name: the current password confirms it (Google-only accounts may send an empty one).
    // The backend stores the number normalised (digits with an optional leading +).
    changePhone: ({ newPhone, password }) =>
        api.put('/profile/phone', { newPhone, password }),

    // Password change, step 1. Body: { currentPassword } -> { name, email, phone, hasPassword }
    // Only checks the current password and makes sure a Firebase account exists to send from;
    // nothing is changed yet. The caller then asks Firebase to email the reset link.
    startPasswordChange: ({ currentPassword }) =>
        api.post('/profile/password/start', { currentPassword }),

    // Password change, step 2 (the ONLY way to change it). Body: { idToken, currentPassword, newPassword }.
    // idToken comes from signing in to Firebase with the new password, which proves the person
    // opened the emailed link and set it there.
    confirmPasswordChange: ({ idToken, currentPassword, newPassword }) =>
        api.post('/profile/password/confirm', { idToken, currentPassword, newPassword }),

    // Email change, step 1. Body: { newEmail, password } -> { name, email, phone, hasPassword }
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
