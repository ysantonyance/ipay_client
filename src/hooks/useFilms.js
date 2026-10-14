import {useCallback, useEffect, useState} from "react";
import {seriesApi} from "../api/seriesApi.js";
import {genresApi} from "../api/genresApi.js";
import {fetchOmdbKind, peekOmdbKind} from "./useOmdb.js";

// Only true when the record itself lists episodes. Titles are normally saved by name only, so use
// `kindOf` from useFilms() to tell movies from TV shows - it also asks OMDb.
export const isMovie = s => !s.episodeIds?.length;

const LOOKUPS_AT_ONCE = 4; // keeps us well inside OMDb's rate limit

function useFilms() {
    const [series, setSeries] = useState([]);
    const [genres, setGenres] = useState([]);
    const [kinds, setKinds] = useState({}); // title id -> 'movie' | 'tv' | 'unknown', filled in as OMDb answers

    useEffect(() => {
        seriesApi.getAll().then(res => setSeries(res)).catch(console.error);
        genresApi.getAll().then(res => setGenres(res)).catch(console.error);
    }, []);

    // The database doesn't say whether a title is a movie or a TV show, but OMDb does. Looks up every title that
    // isn't cached yet, a few at a time. Answers are cached in localStorage, so this only costs requests once per title.
    useEffect(() => {
        const queue = series.filter(s => !s.episodeIds?.length && peekOmdbKind(s.name, s.year) === undefined);
        if (queue.length === 0) return;

        let alive = true;
        const worker = async () => {
            while (alive && queue.length > 0) {
                const s = queue.shift();
                let kind = 'unknown'; // a failed lookup (network, rate limit) is treated like "not found" for now and retried next visit
                try {
                    kind = await fetchOmdbKind(s.name, s.year);
                } catch (err) {
                    console.error(err);
                }
                if (alive) setKinds(prev => ({...prev, [s.id]: kind}));
            }
        };
        Array.from({length: Math.min(LOOKUPS_AT_ONCE, queue.length)}, worker);
        return () => { alive = false; };
    }, [series]);

    // 'tv' | 'movie', or null while we are still waiting for OMDb's answer for this title.
    // Titles OMDb can't identify count as movies.
    const kindOf = useCallback(s => {
        if (s.episodeIds?.length) return 'tv';
        const kind = kinds[s.id] ?? peekOmdbKind(s.name, s.year);
        if (kind === undefined) return null;
        return kind === 'tv' ? 'tv' : 'movie';
    }, [kinds]);

    const kindsLoading = series.some(s => kindOf(s) === null);

    return {series, genres, kindOf, kindsLoading};
}

export default useFilms;
