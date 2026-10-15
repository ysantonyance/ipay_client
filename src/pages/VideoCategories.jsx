import {Link, useSearchParams} from "react-router-dom";
import VideoHeader from "../components/media/VideoHeader.jsx";
import useVideos from "../hooks/useFilms.js";

function VideoCategories() {
    const {genres} = useVideos();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const typeQuery = type === 'movie' || type === 'tv' ? `?type=${type}` : '';

    return (
        <div className='bg-[#00050D] text-white min-h-screen pb-20'>
            <VideoHeader/>
            <div className='mx-4 sm:mx-13 mt-6'>
                <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Categories</h1>

                {genres.length === 0 ? (
                    <p className='text-gray-400'>Loading categories...</p>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4'>
                        {genres.map(g => (
                            <Link
                                key={g.id}
                                to={`/movies/categories/${g.id}${typeQuery}`}
                                className='aspect-square p-4 rounded-xl bg-[#141921] hover:bg-white hover:text-black flex items-center justify-center text-center text-sm sm:text-base font-bold transition-colors shadow-md'
                            >
                                {g.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoCategories;