import {useEffect, useMemo, useState} from "react";
import {Link, useParams} from "react-router-dom";
import VideoHeader from "../components/media/VideoHeader.jsx";
import CategoryRow from "../components/media/CategoryRow.jsx";
import useVideos from "../hooks/useFilms.js";
import {useOmdb} from "../hooks/useOmdb.js";
import {seriesApi} from "../api/seriesApi.js";

const ROW_LIMIT = 12; // titles shown per genre row

function Fact({label, children}) {
    if (!children) return null;
    return (
        <>
            <dt className='text-gray-400'>{label}</dt>
            <dd>{children}</dd>
        </>
    );
}

function VideoDetails() {
    const {id} = useParams();
    const {series, genres, kindOf} = useVideos();
    const [item, setItem] = useState(null);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'notFound' | 'error'

    // Load the title itself. The page stays mounted when a recommendation is clicked, so reload (and scroll up) on every id change.
    useEffect(() => {
        let alive = true;
        window.scrollTo(0, 0);
        setItem(null);
        setStatus('loading');
        seriesApi.getById(id)
            .then(res => {
                if (!alive) return;
                if (res) { setItem(res); setStatus('ready'); } else setStatus('notFound');
            })
            .catch(err => {
                if (!alive) return;
                console.error(err);
                setStatus(err?.response?.status === 404 ? 'notFound' : 'error');
            });
        return () => { alive = false; };
    }, [id]);

    // Poster, year, plot, rating and age rating come from OMDb (looked up by the stored name), like on the cards.
    const film = useOmdb(item ?? {}, {full: true});

    // Movie or TV show, as OMDb classifies it (a title still being looked up counts as a movie for a moment).
    const movie = item ? kindOf(item) !== 'tv' : true;
    const genreList = useMemo(
        () => (item?.genreIds ?? []).map(gid => genres.find(g => g.id === gid)).filter(Boolean),
        [item, genres]
    );

    // One "more like this" row per genre of this title: other titles of the same kind (movie / TV show) in that genre, best rated first.
    const rows = useMemo(() => {
        if (!item) return [];
        return genreList
            .map(genre => ({
                genre,
                items: series
                    .filter(s => s.id !== item.id && kindOf(s) === (movie ? 'movie' : 'tv') && s.genreIds?.includes(genre.id))
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, ROW_LIMIT),
            }))
            .filter(r => r.items.length > 0);
    }, [item, genreList, series, movie, kindOf]);

    const meta = [film.year, film.ageRating, movie ? 'Movie' : 'TV show'].filter(Boolean).join(' · ');

    return (
        <div className='bg-[#00050D] text-white min-h-screen pb-20'>
            <VideoHeader/>

            <div className='mx-13 mt-6'>
                <Link to={movie ? '/movies?type=movie' : '/movies?type=tv'} className='text-sm text-gray-300 hover:text-white hover:underline'>
                    ‹ Back to {movie ? 'movies' : 'TV shows'}
                </Link>

                {status === 'loading' && (
                    <div className='mt-4 h-[420px] rounded-xl bg-[#141921] animate-pulse' />
                )}

                {status === 'notFound' && (
                    <div className='mt-4 rounded-xl bg-[#141921] p-10 text-center'>
                        <h1 className='text-2xl font-bold mb-2'>Title not found</h1>
                        <p className='text-gray-300 mb-4'>This title doesn't exist or is no longer available.</p>
                        <Link to='/movies' className='inline-block rounded-full bg-white text-black font-bold px-6 py-2'>
                            Browse Pay Video
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className='mt-4 rounded-xl bg-[#141921] p-10 text-center'>
                        <p className='text-gray-300'>Could not load this title. Please try again.</p>
                    </div>
                )}

                {status === 'ready' && item && (
                    <>
                        <section className='relative mt-4 overflow-hidden rounded-xl bg-[#141921]'>
                            {film.posterUrl && (
                                <div
                                    className='absolute -inset-8 bg-cover bg-center blur-2xl opacity-40'
                                    style={{backgroundImage: `url(${film.posterUrl})`}}
                                />
                            )}
                            <div className='absolute inset-0 bg-[linear-gradient(to_right,#00050D_5%,rgba(0,5,13,0.6)_60%,rgba(0,5,13,0.3))]' />

                            <div className='relative flex flex-col gap-8 p-6 sm:p-10 md:flex-row'>
                                <div className='shrink-0 self-center md:self-start'>
                                    {film.posterUrl ? (
                                        <img
                                            src={film.posterUrl}
                                            alt={film.name}
                                            className='block w-[260px] aspect-[2/3] rounded-lg object-cover shadow-2xl bg-[#141921]'
                                        />
                                    ) : (
                                        <div className='w-[260px] aspect-[2/3] rounded-lg bg-[#33373E] flex items-center justify-center p-4 text-center font-bold'>
                                            {film.name}
                                        </div>
                                    )}
                                </div>

                                <div className='max-w-2xl'>
                                    <h1 className='text-4xl font-bold'>{film.name}</h1>
                                    {meta && <p className='mt-2 text-sm text-gray-300'>{meta}</p>}

                                    {film.rating && (
                                        <p className='mt-4 flex items-baseline gap-2'>
                                            <span className='text-3xl text-[#FFC107]'>★ {film.rating}</span>
                                            <span className='text-sm text-gray-300'>/ 10 IMDb rating</span>
                                        </p>
                                    )}

                                    <h2 className='mt-6 text-lg font-bold'>Description</h2>
                                    <p className='mt-1 text-[15px] leading-relaxed text-gray-100'>
                                        {film.description || 'No description available.'}
                                    </p>

                                    <dl className='mt-6 grid grid-cols-[110px_1fr] gap-y-2 text-sm'>
                                        <Fact label='Director'>{film.director}</Fact>
                                        <Fact label='Released'>{film.year}</Fact>
                                        <Fact label='Age rating'>{film.ageRating}</Fact>
                                        {!movie && <Fact label='Episodes'>{item.episodeIds?.length}</Fact>}
                                        {genreList.length > 0 && (
                                            <Fact label='Genres'>
                                                <span className='flex flex-wrap gap-2'>
                                                    {genreList.map(g => (
                                                        <Link
                                                            key={g.id}
                                                            to={`/movies/categories/${g.id}?type=${movie ? 'movie' : 'tv'}`}
                                                            className='rounded-full bg-[#33373E] px-3 py-0.5 font-bold hover:bg-white hover:text-black'
                                                        >
                                                            {g.name}
                                                        </Link>
                                                    ))}
                                                </span>
                                            </Fact>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        </section>

                        <div className='mt-10'>
                            {rows.map(r => (
                                <CategoryRow
                                    key={r.genre.id}
                                    title={`More ${movie ? 'movies' : 'TV shows'} in ${r.genre.name}`}
                                    to={`/movies/categories/${r.genre.id}?type=${movie ? 'movie' : 'tv'}`}
                                    items={r.items}
                                />
                            ))}
                            {rows.length === 0 && (
                                <p className='text-gray-400'>No other {movie ? 'movies' : 'TV shows'} in this genre yet.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default VideoDetails;
