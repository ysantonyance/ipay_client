import {useParams, useSearchParams} from "react-router-dom";
import VideoHeader from "../components/media/VideoHeader.jsx";
import VideoCard from "../components/media/VideoCard.jsx";
import useVideos from "../hooks/useFilms.js";
import useInfiniteList from "../hooks/useInfiniteList.js";

function VideoCategory() {
    const {genreId} = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const kind = type === 'movie' ? 'movie' : type === 'tv' ? 'tv' : null;
    const {series, genres, kindOf, kindsLoading} = useVideos();
    const genre = genres.find(g => String(g.id) === genreId);
    const items = series.filter(s =>
        s.genreIds?.map(String).includes(genreId) && (!kind || kindOf(s) === kind));
    const {visible, hasMore, sentinelRef} = useInfiniteList(items, `${genreId}:${kind ?? ''}`);
    const kindLabel = kind === 'movie' ? 'movies' : kind === 'tv' ? 'TV shows' : null;

    return (
        <div className='bg-[#00050D] text-white min-h-screen'>
            <VideoHeader/>
            <div className='mx-4 sm:mx-13 mt-6'>
                <h1 className='text-3xl font-bold mb-6'>
                    {genre?.name ?? 'Category'}
                    {kindLabel && <span className='text-xl font-normal text-gray-400'> · {kindLabel}</span>}
                </h1>
                {items.length === 0 && (
                    <p className='text-gray-400'>
                        {kind && kindsLoading ? 'Sorting titles into movies and TV shows…' : 'Nothing here yet.'}
                    </p>
                )}

                <div className='flex flex-wrap justify-center gap-x-4 gap-y-6 pb-40'>
                    {visible.map(s => (
                        <div key={s.id} className='w-[140px] sm:w-[220px]'>
                            <VideoCard {...s} />
                        </div>
                    ))}
                </div>

                {hasMore && <div ref={sentinelRef} className='h-10' />}
            </div>
        </div>
    )
}

export default VideoCategory;