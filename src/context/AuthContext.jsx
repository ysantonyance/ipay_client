import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi.js';

// authApi.login/logout dispatch this ('ipay-auth-changed') right after
// touching localStorage, because the native 'storage' event only fires in
// OTHER tabs - never the one that just logged in/out.
const AUTH_EVENT = 'ipay-auth-changed';

function readAuth() {
    return {
        isLoggedIn: authApi.isLoggedIn(),
        userName: localStorage.getItem('userName') || '',
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
