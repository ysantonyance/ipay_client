import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import useVideos from "../../hooks/useFilms.js";
import {useOmdb} from "../../hooks/useOmdb.js";
import {useLanguage} from "../../context/LanguageContext.jsx";

// Result tile: the name comes from our database, poster and year from OMDb.
function SearchTile({s, onPick}) {
    const film = useOmdb(s);
    return (
        <Link to={`/movies/title/${s.id}`} onClick={onPick} className='block'>
            {film.posterUrl
                ? <img src={film.posterUrl} alt={film.name} className='aspect-[2/3] w-full rounded-lg object-cover' />
                : <div className='aspect-[2/3] w-full rounded-lg bg-[#33373E]' />}
            <p className='mt-2 text-sm font-bold line-clamp-2'>{film.name}</p>
            <p className='text-xs text-gray-400'>{film.year}</p>
        </Link>
    );
}

function SearchModal({onClose}) {
    const {t} = useLanguage();
    const {series, genres} = useVideos();
    const [q, setQ] = useState('');

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = e => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    const term = q.trim().toLowerCase();
    // A title matches by its name or by the name of any of its genres (e.g. typing "drama").
    const genreNameById = new Map(genres.map(g => [g.id, g.name.toLowerCase()]));
    const matches = term
        ? series.filter(s =>
            s.name.toLowerCase().includes(term) ||
            (s.genreIds ?? []).some(id => genreNameById.get(id)?.includes(term)))
        : [];

    return (
        <div className='fixed inset-0 z-[60] overflow-y-auto bg-black/70'>
            <div className='flex min-h-full items-start justify-center p-4 pt-24' onClick={onClose}>
                <div className='w-full max-w-3xl rounded-xl bg-[#141921] p-5' onClick={e => e.stopPropagation()}>
                    <input
                        autoFocus
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder='Search movies, TV shows and genres'
                        className='w-full rounded-xl bg-[#33373E] px-4 py-3 outline-none focus:ring-2 focus:ring-white/60'
                    />

                    {!term && (
                        <>
                            <p className='mt-4 text-sm text-gray-400'>{t("Start typing to search, or pick a genre.")}</p>
                            {genres.length > 0 && (
                                <div className='mt-3 flex flex-wrap gap-2'>
                                    {genres.map(g => (
                                        <button
                                            key={g.id}
                                            onClick={() => setQ(g.name)}
                                            className='rounded-full bg-[#33373E] px-3 py-1 text-sm font-bold hover:bg-white hover:text-black cursor-pointer'
                                        >
                                            {g.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    {term && matches.length === 0 && <p className='mt-4 text-sm text-gray-400'>{t('No results for "{q}".', { q })}</p>}

                    {matches.length > 0 && (
                        <>
                            <div className='mt-3'>
                                {matches.slice(0, 6).map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setQ(s.name)}
                                        className='block w-full rounded-lg px-3 py-2 text-left hover:bg-[#33373E] cursor-pointer'
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>

                            <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                                {matches.slice(0, 8).map(s => <SearchTile key={s.id} s={s} onPick={onClose} />)}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchModal;