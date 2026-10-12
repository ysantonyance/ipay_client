import {useParams} from "react-router-dom";
import VideoHeader from "../components/media/VideoHeader.jsx";
import VideoCard from "../components/media/VideoCard.jsx";
import useVideos from "../hooks/useFilms.js";
import useInfiniteList from "../hooks/useInfiniteList.js";

function VideoCategory() {
    const {genreId} = useParams();
    const {series, genres} = useVideos();
    const genre = genres.find(g => String(g.id) === genreId);
    const items = series.filter(s => s.genreIds?.map(String).includes(genreId));
    const {visible, hasMore, sentinelRef} = useInfiniteList(items, genreId);

    return (
        <div className='bg-[#00050D] text-white min-h-screen'>
            <VideoHeader/>
            <div className='mx-13 mt-6'>
                <h1 className='text-3xl font-bold mb-6'>{genre?.name ?? 'Category'}</h1>
                {items.length === 0 && <p className='text-gray-400'>Nothing here yet.</p>}

                <div className='flex flex-wrap gap-x-4 gap-y-6 pb-40'>
                    {visible.map(s => <VideoCard key={s.id} {...s} />)}
                </div>

                {hasMore && <div ref={sentinelRef} className='h-10' />}
            </div>
        </div>
    )
}

export default VideoCategory;