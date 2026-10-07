import api from './api.js'

// Saves the backend's session response (same shape for password and Google login).
export function saveSession(data) {
    if (data?.accessToken) {
        localStorage.setItem('authToken', data.accessToken);
    }
    if (data?.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
    }

    const displayName = data?.user?.name || data?.user?.email || "User";
    localStorage.setItem('userName', displayName);

    // Same-tab listeners (see AuthContext) - the native 'storage' event
    // only fires in OTHER tabs, not the one that just logged in.
    window.dispatchEvent(new Event('ipay-auth-changed'));
}

// Backend: api/auth
export const authApi = {
    // Body: { email, password }
    // Resolves to { accessToken, refreshToken, expiresAt, tokenType, user }
    // The access token is saved so api.js attaches it to every later request.
    // Rejects with HTTP 403 { code: 'EMAIL_NOT_VERIFIED' } until the email has been verified.
    // When emailed codes are on, the password alone is NOT enough: the response is
    // { twoFactorRequired: true, challengeId, maskedEmail } with no token, and nothing is saved
    // until verifyCode() succeeds.
    login: async (credentials) => {
        const data = await api.post('/auth/login', credentials);
        if (!data?.twoFactorRequired) {
            saveSession(data);
        }
        return data;
    },

    // Body: { challengeId, code } - second step of login. Same response shape as a normal login.
    verifyCode: async ({ challengeId, code }) => {
        const data = await api.post('/auth/login/verify-code', { challengeId, code });
        saveSession(data);
        return data;
    },

    // Body: { challengeId } - emails a fresh code. Resolves to { maskedEmail }.
    resendCode: (challengeId) => api.post('/auth/login/resend-code', { challengeId }),

    // Body: { idToken } - a Firebase ID token from "Sign in with Google" (see firebaseAuth.js).
    // Same response as login; the backend creates the customer on first Google sign-in.
    googleLogin: async (idToken) => {
        const data = await api.post('/auth/google', { idToken });
        saveSession(data);
        return data;
    },

    // Body: { email, password, confirmPassword, name }
    register: (userData) => api.post('/auth/register', userData),

    // The backend has no logout endpoint - the JWT is simply forgotten on the client.
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        window.dispatchEvent(new Event('ipay-auth-changed'));
        return Promise.resolve();
    },

    isLoggedIn: () => Boolean(localStorage.getItem('authToken')),
};
