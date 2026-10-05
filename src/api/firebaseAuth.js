import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { firebaseAuth, isFirebaseConfigured } from '../firebase.js';

// Firebase is only used as a helper here:
//  - Google sign-in: Firebase proves who the user is, our backend swaps that proof for its own JWT.
//  - Email verification: Firebase sends the email (template from the Firebase console) and tracks
//    "verified". Our backend asks Firebase whether the address is verified at password login.
// We never keep a Firebase session around - every helper signs out of Firebase when it is done.

function requireFirebase() {
    if (!isFirebaseConfigured || !firebaseAuth) {
        const error = new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to .env.local.');
        error.code = 'app/firebase-not-configured';
        throw error;
    }
    return firebaseAuth;
}

/** Opens the Google popup and returns a Firebase ID token for the backend to verify. */
export async function getGoogleIdToken() {
    const auth = requireFirebase();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
        const result = await signInWithPopup(auth, provider);
        return await result.user.getIdToken();
    } finally {
        await signOut(auth).catch(() => {});
    }
}

/**
 * Makes sure a Firebase account exists for this email/password and (re)sends the verification
 * email. Used right after registering and by the "Resend verification email" button
 * (which also covers accounts created before verification existed).
 */
export async function sendVerificationEmail(email, password) {
    const auth = requireFirebase();

    try {
        let user;
        try {
            user = (await createUserWithEmailAndPassword(auth, email, password)).user;
        } catch (err) {
            if (err.code !== 'auth/email-already-in-use') throw err;
            user = (await signInWithEmailAndPassword(auth, email, password)).user;
        }

        if (user.emailVerified) return { alreadyVerified: true };

        await sendEmailVerification(user);
        return { alreadyVerified: false };
    } finally {
        await signOut(auth).catch(() => {});
    }
}

/** Turns a Firebase error into something a person can read. */
export function getFirebaseErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
    switch (error?.code) {
        case 'app/firebase-not-configured':
            return error.message;
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return ''; // user just closed the window - not worth an error banner
        case 'auth/popup-blocked':
            return 'Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please wait a few minutes and try again.';
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
            return 'We could not send the verification email for this account. Try signing in with Google instead.';
        case 'auth/network-request-failed':
            return 'Network error. Check your connection and try again.';
        default:
            return fallback;
    }
}
