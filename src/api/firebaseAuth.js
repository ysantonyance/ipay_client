import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    verifyBeforeUpdateEmail,
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

/**
 * Email change, part 1: asks Firebase to email a confirmation link to the NEW address.
 * Firebase only switches the account's address once that link is clicked.
 * Signs in with the current email + password for a moment (the backend has already checked
 * the password); older accounts that never got a Firebase account get one created first.
 */
export async function sendEmailChangeLink(currentEmail, password, newEmail) {
    const auth = requireFirebase();

    try {
        let user;
        try {
            user = (await signInWithEmailAndPassword(auth, currentEmail, password)).user;
        } catch (err) {
            if (err.code !== 'auth/user-not-found' && err.code !== 'auth/invalid-credential') throw err;
            user = (await createUserWithEmailAndPassword(auth, currentEmail, password)).user;
        }

        await verifyBeforeUpdateEmail(user, newEmail);
    } finally {
        await signOut(auth).catch(() => {});
    }
}

/**
 * Email change, part 2: after the link was clicked the Firebase account lives under the new
 * address, so signing in with it proves the click happened. Returns a fresh ID token for the
 * backend to verify. Throws code 'app/email-not-confirmed' while the link has not been used.
 */
export async function getIdTokenForEmail(email, password) {
    const auth = requireFirebase();

    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return await user.getIdToken(true);
    } catch (err) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
            const notConfirmed = new Error('The new email address is not confirmed yet.');
            notConfirmed.code = 'app/email-not-confirmed';
            throw notConfirmed;
        }
        throw err;
    } finally {
        await signOut(auth).catch(() => {});
    }
}

/**
 * Password change, part 1: asks Firebase to email its password reset link to the account's address.
 * The backend has already checked the current password and made sure the Firebase account exists
 * (profileApi.startPasswordChange). Nobody is signed in to Firebase here, so there is nothing to sign out of.
 */
export async function sendPasswordResetLink(email) {
    const auth = requireFirebase();
    await sendPasswordResetEmail(auth, email);
}

/**
 * Password change, part 2: after the reset link was used, the Firebase account has the new password,
 * so signing in with it proves the person opened the link and set it. Returns a fresh ID token for the
 * backend to verify. Throws code 'app/password-not-reset' while Firebase still rejects the new password.
 */
export async function getIdTokenForNewPassword(email, newPassword) {
    const auth = requireFirebase();

    try {
        const { user } = await signInWithEmailAndPassword(auth, email, newPassword);
        return await user.getIdToken(true);
    } catch (err) {
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
            const notReset = new Error('The new password is not set yet.');
            notReset.code = 'app/password-not-reset';
            throw notReset;
        }
        throw err;
    } finally {
        await signOut(auth).catch(() => {});
    }
}

/** Turns a Firebase error into something a person can read. */
export function getFirebaseErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
    switch (error?.code) {
        case 'app/firebase-not-configured':
            return error.message;
        case 'app/email-not-confirmed':
            return 'We cannot see the new address confirmed yet. Open the link we emailed to it, check your password, then try again.';
        case 'app/password-not-reset':
            return 'We cannot see the new password yet. Open the reset link we emailed you, set the new password there, then enter that same password here.';
        case 'auth/invalid-new-email':
            return 'That email address is not valid.';
        case 'auth/email-already-in-use':
            return 'We could not start the email change for this account. Please try again later.';
        case 'auth/requires-recent-login':
            return 'Please sign in again and retry.';
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
