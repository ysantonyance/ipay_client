import {useEffect, useRef, useState} from "react";
import {filmsApi} from "../api/filmsApi.js";

// The database only stores a film's id and name. Everything visual (title, poster,
// year, plot, rating...) is pulled from OMDb through the backend proxy, looked up by name.
//
// Lookups are cached in memory and in localStorage so each film costs OMDb requests only once.

const STORE_KEY = 'omdb-cache-v1';
let store = {search: {}, details: {}};
try {
    store = {...store, ...JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}')};
} catch { /* unreadable cache - start empty */ }

const persist = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* storage full / blocked */ }
};

const clean = v => (v && v !== 'N/A' ? v : null);
const norm = s => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const inflight = new Map();

// Resolves with the cached value, or runs `loader` once (shared between callers).
// A 404 ("not in OMDb") is remembered as null; network errors / rate limits are not cached.
function cached(bucket, key, loader) {
    if (key in store[bucket]) return Promise.resolve(store[bucket][key]);

    const id = `${bucket}:${key}`;
    if (!inflight.has(id)) {
        inflight.set(id, loader()
            .catch(err => {
                const notFound = err?.response?.status === 404
                    && !/limit/i.test(err.response.data?.message ?? '');
                if (!notFound) throw err;
                return null;
            })
            .then(value => {
                store[bucket][key] = value;
                persist();
                return value;
            })
            .finally(() => inflight.delete(id)));
    }
    return inflight.get(id);
}

const fromSearchItem = i => ({
    imdbId: i.imdbID,
    title: clean(i.Title),
    year: clean(i.Year),
    poster: clean(i.Poster),
});

const fromDetails = d => ({
    imdbId: d.imdbID,
    title: clean(d.Title),
    year: clean(d.Year),
    poster: clean(d.Poster),
    plot: clean(d.Plot),
    rated: clean(d.Rated),
    rating: clean(d.imdbRating),
    director: clean(d.Director),
    genre: clean(d.Genre),
    runtime: clean(d.Runtime),
});

function lookupByName(name, year) {
    return cached('search', `${norm(name)}|${year || ''}`, async () => {
        const res = await filmsApi.search(name);
        const items = res?.Search ?? [];
        const target = norm(name);
        const exact = items.filter(i => norm(i.Title) === target);
        const pool = exact.length ? exact : items;
        const match = (year && pool.find(i => String(i.Year ?? '').startsWith(String(year)))) || pool[0];
        return match ? fromSearchItem(match) : null;
    });
}

const lookupDetails = imdbId =>
    cached('details', imdbId, async () => fromDetails(await filmsApi.getByImdbId(imdbId)));

// Non-hook lookup (name -> full OMDb details, including the genre list). Used when saving a film.
export async function fetchOmdbByName(name, year) {
    const hit = await lookupByName(name, year);
    return hit ? lookupDetails(hit.imdbId) : null;
}

/**
 * Visual data for one film, keyed by its stored name (or imdbId when the record has one).
 *   enabled - wait until true before calling OMDb (e.g. once a card scrolls into view)
 *   full    - also load plot / rating / age rating (one extra request per film)
 * Always returns usable values: OMDb data when available, the stored fields otherwise.
 */
export function useOmdb(item, {enabled = true, full = false} = {}) {
    const {name, year, imdbId} = item;
    const [base, setBase] = useState(null);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setBase(null);
        setDetails(null);
        if (!enabled || (!name && !imdbId)) return;

        let alive = true;
        setLoading(true);
        const run = imdbId ? lookupDetails(imdbId) : lookupByName(name, year);
        run.then(r => {
            if (!alive) return;
            if (imdbId) setDetails(r); else setBase(r);
        }).catch(console.error).finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, [enabled, name, year, imdbId]);

    const id = base?.imdbId;
    useEffect(() => {
        if (!enabled || !full || !id) return;
        let alive = true;
        lookupDetails(id).then(r => alive && setDetails(r)).catch(console.error);
        return () => { alive = false; };
    }, [enabled, full, id]);

    const o = details ?? base;
    return {
        loading,
        found: !!o,
        imdbId: o?.imdbId ?? imdbId ?? null,
        name: o?.title ?? name,
        posterUrl: o?.poster ?? item.posterUrl ?? null,
        year: o?.year ?? (item.year || null),
        description: details?.plot ?? item.description ?? null,
        ageRating: details?.rated ?? item.ageRating ?? null,
        rating: details?.rating ?? (item.rating || null),
        director: details?.director ?? item.director ?? null,
    };
}

// True once the element has come within `rootMargin` of the viewport (and stays true).
export function useInView(rootMargin = '300px') {
    const ref = useRef(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || seen) return;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setSeen(true); io.disconnect(); }
        }, {rootMargin});
        io.observe(el);
        return () => io.disconnect();
    }, [seen, rootMargin]);

    return [ref, seen];
}

export default useOmdb;
