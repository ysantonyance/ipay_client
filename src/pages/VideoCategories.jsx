import {Link, useSearchParams} from "react-router-dom";
import VideoHeader from "../components/media/VideoHeader.jsx";
import useVideos from "../hooks/useFilms.js";

function VideoCategories() {
    const {genres} = useVideos();
    const type = useSearchParams()[0].get('type');
    const typeQuery = type === 'movie' || type === 'tv' ? `?type=${type}` : '';

    return (
        <div className='bg-[#00050D] text-white min-h-screen'>
            <VideoHeader/>
            <div className='mx-13 mt-6'>
                <h1 className='text-3xl font-bold mb-6'>Categories</h1>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {genres.map(g => (
                        <Link
                            key={g.id}
                            to={`/movies/categories/${g.id}${typeQuery}`}
                            className='h-[100px] rounded-xl bg-[#141921] hover:bg-white hover:text-black flex items-center justify-center text-lg font-bold transition-colors'
                        >
                            {g.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default VideoCategories;
