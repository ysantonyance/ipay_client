import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase console > Project settings > General > "Your apps" > Web app > SDK setup and configuration.
// These values are NOT secrets (they ship to every browser) - they just identify the project.
// Put them in .env.local (see .env.example).
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ipaygroup.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ipaygroup',
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.appId);

// Only initialise when configured, so the rest of the app keeps working (password login) without it.
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const firebaseAuth = app ? getAuth(app) : null;
