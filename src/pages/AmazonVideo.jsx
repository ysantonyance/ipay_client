import VideoHeader from "../components/media/VideoHeader.jsx";
import HeroCarousel from "../components/media/HeroCarousel.jsx";
import CategoryRow from "../components/media/CategoryRow.jsx";
import useVideos from "../hooks/useFilms.js";
import {useSearchParams} from "react-router-dom";

// Pay Video's home. "Home" shows everything; the Movies and TV shows tabs (?type=movie / ?type=tv) show one kind each.
function AmazonVideo() {
    const {series: all, genres, kindOf, kindsLoading} = useVideos();
    const type = useSearchParams()[0].get('type');
    const kind = type === 'movie' ? 'movie' : type === 'tv' ? 'tv' : null;
    const series = kind ? all.filter(s => kindOf(s) === kind) : all;
    const typeQuery = kind ? `?type=${type}` : '';
    const featured = series.slice(0, 5); // visuals come from OMDb, not a stored posterUrl
    const topRated = [...series].sort((a, b) => b.rating - a.rating);

    return (
        <div className='bg-[#00050D] text-white min-h-screen pb-20'>
            <VideoHeader/>

            <div className='mx-13 mt-4'>
                {kind && series.length === 0 && (
                    <p className='mt-10 text-gray-400'>
                        {kindsLoading
                            ? `Sorting titles into movies and TV shows…`
                            : `No ${kind === 'movie' ? 'movies' : 'TV shows'} yet.`}
                    </p>
                )}

                <HeroCarousel items={featured}/>

                <div className='mt-10'>
                    <CategoryRow title={kind === 'movie' ? 'Top rated movies' : kind === 'tv' ? 'Top rated TV shows' : 'Top rated'} items={topRated}/>
                    {genres.map(g => (
                        <CategoryRow
                            key={g.id}
                            title={g.name}
                            to={`/movies/categories/${g.id}${typeQuery}`}
                            items={series.filter(s => s.genreIds?.includes(g.id))}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AmazonVideo;