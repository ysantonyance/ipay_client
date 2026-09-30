// Small, dependency-free JWT payload reader. This never verifies the
// signature - the backend already does that on every request - it only
// reads claims client-side to decide what the UI should show (e.g. whether
// to render the Admin area). Treat anything read here as advisory only.

function decodeJwtPayload(token) {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const json = decodeURIComponent(
            atob(padded)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

// JwtService (backend) builds the token straight from `new Claim(ClaimTypes.Role, ...)`
// without the outbound short-name mapping, so the role claim lands in the payload
// under ClaimTypes.Role's full URI, not a short "role" key. Checking both keeps
// this working even if that ever changes.
const ROLE_CLAIM_URI = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export function getRoleFromToken(token) {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    return payload[ROLE_CLAIM_URI] ?? payload.role ?? null;
}
