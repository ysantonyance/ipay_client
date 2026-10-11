import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi.js';
import { getRoleFromToken, getUserIdFromToken } from '../utils/jwt.js';
import api from '../api/api.js';

// authApi.login/logout dispatch this ('ipay-auth-changed') right after
// touching localStorage, because the native 'storage' event only fires in
// OTHER tabs - never the one that just logged in/out.
const AUTH_EVENT = 'ipay-auth-changed';

function readAuth() {
    const role = getRoleFromToken(localStorage.getItem('authToken'));
    return {
        isLoggedIn: authApi.isLoggedIn(),
        userName: localStorage.getItem('userName') || '',
        role,
        userId: getUserIdFromToken(localStorage.getItem('authToken')),
        isAdmin: role === 'Admin',
        isModerator: role === 'Moderator',
    };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(readAuth);

    useEffect(() => {
        const refresh = () => setAuth(readAuth());
        window.addEventListener(AUTH_EVENT, refresh);
        window.addEventListener('storage', refresh);
        return () => {
            window.removeEventListener(AUTH_EVENT, refresh);
            window.removeEventListener('storage', refresh);
        };
    }, []);

    // While logged in, ping the backend now and then (and whenever the tab regains focus). The backend answers
    // 401 once the person's role has changed, and api.js turns a 401 into a logout + redirect to /login.
    // That is how a role change boots someone out instead of letting them keep the old role.
    useEffect(() => {
        if (!auth.isLoggedIn) return undefined;

        const check = () => {
            if (document.visibilityState === 'hidden') return;
            api.get('/session').catch(() => {}); // a 401 is handled by the interceptor; other errors don't matter here
        };

        check();
        const timer = setInterval(check, 30000);
        window.addEventListener('focus', check);
        document.addEventListener('visibilitychange', check);
        return () => {
            clearInterval(timer);
            window.removeEventListener('focus', check);
            document.removeEventListener('visibilitychange', check);
        };
    }, [auth.isLoggedIn]);

    return (
        <AuthContext.Provider value={{ ...auth, logout: authApi.logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
