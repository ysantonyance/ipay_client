import {fetchOmdbByName} from "../hooks/useOmdb.js";
import {genresApi} from "../api/genresApi.js";

const norm = s => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// OMDb says "Sci-Fi"; a genre may have been created as "Science Fiction".
const canon = s => (norm(s) === 'science fiction' ? 'sci fi' : norm(s));

/**
 * Looks a film up in OMDb by name and returns the ids of OUR genres that match its genre list.
 * Only existing genres are linked - missing ones are not created (logged to the console instead).
 * Never throws: if OMDb is unreachable the film simply saves without genres.
 */
export async function omdbGenreIds(name, year) {
    if (!name) return [];
    try {
        const film = await fetchOmdbByName(name, year);
        const names = film?.genre?.split(',').map(g => g.trim()).filter(Boolean) ?? [];
        if (!names.length) return [];

        const genres = await genresApi.getAll();
        const idByName = new Map(genres.map(g => [canon(g.name), g.id]));

        const missing = names.filter(n => !idByName.has(canon(n)));
        if (missing.length) console.info(`OMDb genres with no matching genre in the database: ${missing.join(', ')}`);

        return [...new Set(names.map(n => idByName.get(canon(n))).filter(id => id != null))];
    } catch (err) {
        console.error('Could not fetch genres from OMDb', err);
        return [];
    }
}
