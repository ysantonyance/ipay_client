import VideoHeader from "../components/media/VideoHeader.jsx";
import HeroCarousel from "../components/media/HeroCarousel.jsx";
import CategoryRow from "../components/media/CategoryRow.jsx";
import useVideos, {isMovie} from "../hooks/useFilms.js";
import {useSearchParams} from "react-router-dom";

function AmazonVideo() {
    const {series: all, genres} = useVideos();
    const type = useSearchParams()[0].get('type');
    const series = type === 'movie' ? all.filter(isMovie)
        : type === 'tv' ? all.filter(s => !isMovie(s))
            : all;
    const featured = series.filter(s => s.posterUrl).slice(0, 5);
    const topRated = [...series].sort((a, b) => b.rating - a.rating);

    return (
        <div className='bg-[#00050D] text-white min-h-screen pb-20'>
            <VideoHeader/>

            <div className='mx-13 mt-4'>
                <HeroCarousel items={featured}/>

                <div className='mt-10'>
                    <CategoryRow title='Top rated' items={topRated}/>
                    {genres.map(g => (
                        <CategoryRow
                            key={g.id}
                            title={g.name}
                            to={`/amazon-videos/categories/${g.id}`}
                            items={series.filter(s => s.genreIds?.includes(g.id))}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AmazonVideo;