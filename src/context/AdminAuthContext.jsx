import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'ipay_admin_unlocked';

// ---------------------------------------------------------------------------
// TEMPORARY, CLIENT-SIDE-ONLY GATE
//
// There is no admin user/role system on the backend yet: Admin.cs (Domain/
// Entities/Users) is an empty stub, and AuthController only knows customer
// login/registration - it has no concept of an "admin" account or a role
// claim to check. Until that exists, this context just guards the /admin
// route with a single shared passcode so it isn't one click away for a
// casual visitor. This is NOT real security: the passcode ships inside the
// bundled JS and anyone can read it there.
//
// When real admin auth exists on the backend (an Admin entity, a login
// endpoint that returns a token scoped to an Admin role, etc.):
//   1. Add something like `authApi.adminLogin(credentials)` mirroring the
//      existing `authApi.login`, storing the returned token the same way
//      (e.g. localStorage under its own key so it doesn't collide with a
//      logged-in customer's token).
//   2. Replace `unlock()` below with a call to that endpoint, and replace
//      `isAuthenticated`'s initial check with "does a valid admin token
//      exist" instead of the sessionStorage flag.
//   3. Everything else here (the context shape, AdminLogin, the Admin page)
//      can stay as-is - they only care about `isAuthenticated`/`unlock`/`lock`.
// ---------------------------------------------------------------------------
const EXPECTED_PASSCODE = import.meta.env.VITE_ADMIN_PASSCODE || 'admin';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => sessionStorage.getItem(STORAGE_KEY) === 'true'
    );

    const unlock = (passcode) => {
        const ok = Boolean(passcode) && passcode === EXPECTED_PASSCODE;
        if (ok) {
            sessionStorage.setItem(STORAGE_KEY, 'true');
            setIsAuthenticated(true);
        }
        return ok;
    };

    const lock = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setIsAuthenticated(false);
    };

    return (
        <AdminAuthContext.Provider value={{ isAuthenticated, unlock, lock }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    return ctx;
}
