// Tiny in-memory cache for "load the whole list" endpoints.
//
// Every Firestore read is billed on the backend, and these lists (products, categories, ...) are
// requested again on every page visit, by React StrictMode's double effects in dev, and by every
// admin panel. Sharing one result for a few minutes removes almost all of those repeat reads.
//
//  - cached(key, fetcher): returns the stored (or still in-flight) request, or runs fetcher once.
//  - invalidating(keys, request): runs a create/update/delete and drops the listed keys afterwards,
//    so the next list load fetches fresh data.
//
// The cache lives in memory only, so a full page reload always starts fresh.

const DEFAULT_TTL_MS = 5 * 60 * 1000;

const entries = new Map(); // key -> { promise, expires }

// Hand each caller its own array so one page sorting/mutating its list can't change another's.
const copyIfArray = (data) => (Array.isArray(data) ? [...data] : data);

export function cached(key, fetcher, ttlMs = DEFAULT_TTL_MS) {
    const hit = entries.get(key);
    if (hit && hit.expires > Date.now()) return hit.promise.then(copyIfArray);

    const entry = { promise: fetcher(), expires: Date.now() + ttlMs };
    entries.set(key, entry);

    // A failed request must not stay cached, otherwise "Try again" would replay the error.
    entry.promise.catch(() => {
        if (entries.get(key) === entry) entries.delete(key);
    });

    return entry.promise.then(copyIfArray);
}

export function invalidate(...keys) {
    keys.forEach((key) => entries.delete(key));
}

export function invalidateAll() {
    entries.clear();
}

// Clears the keys once the request has finished (success or failure), so a list loaded straight
// after the mutation is never served stale.
export function invalidating(keys, request) {
    return request.finally(() => invalidate(...keys));
}
