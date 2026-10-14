import {fetchOmdbByName} from "../hooks/useOmdb.js";
import {genresApi} from "../api/genresApi.js";

const norm = s => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// OMDb says "Sci-Fi"; a genre may have been created as "Science Fiction".
const canon = s => (norm(s) === 'science fiction' ? 'sci fi' : norm(s));

// An error whose text can be shown directly in the admin form.
const userError = message => Object.assign(new Error(message), {userMessage: message});

// Ids of OUR genres that match OMDb's genre list. Genres that don't exist yet are created
// automatically (named exactly as OMDb spells them). Never throws: no genres is acceptable.
async function matchGenreIds(omdbGenre) {
    try {
        const names = omdbGenre?.split(',').map(g => g.trim()).filter(Boolean) ?? [];
        if (!names.length) return [];

        const genres = await genresApi.getAll();
        const idByName = new Map(genres.map(g => [canon(g.name), g.id]));

        // Create the genres we don't have yet, one at a time (so two saves can't race into duplicates
        // within this call). A failed create just skips that genre.
        for (const name of names) {
            if (idByName.has(canon(name))) continue;
            try {
                const created = await genresApi.create({name: name.slice(0, 50), filmIds: [], serialIds: []});
                if (created?.id != null) idByName.set(canon(name), created.id);
            } catch (err) {
                console.warn(`Could not create genre "${name}"`, err);
            }
        }

        return [...new Set(names.map(n => idByName.get(canon(n))).filter(id => id != null))];
    } catch (err) {
        console.error('Could not load genres', err);
        return [];
    }
}

/**
 * Resolves a film typed by name against OMDb. Returns the canonical title, the release year
 * (the backend requires one) and the ids of our genres matching OMDb's genres.
 * Throws an error with a readable `userMessage` if OMDb can't identify the film.
 */
export async function resolveFilmFromOmdb(name) {
    const typed = (name ?? '').trim();
    if (!typed) throw userError('Enter a film name.');

    let film;
    try {
        film = await fetchOmdbByName(typed);
    } catch (err) {
        console.error('OMDb lookup failed', err);
        throw userError('Could not reach OMDb. Check the backend is running and its OMDb key is set.');
    }
    if (!film) throw userError(`"${typed}" was not found in OMDb. Check the spelling of the title.`);

    const year = parseInt(film.year?.slice(0, 4) ?? '', 10);
    if (!year) throw userError(`OMDb has no release year for "${film.title}", so it can't be saved.`);

    return {name: film.title ?? typed, year, genreIds: await matchGenreIds(film.genre)};
}
