import {useState} from "react";
import {Link} from "react-router-dom";
import {useInView, useOmdb} from "../../hooks/useOmdb.js";

function VideoCard(props) {
    const [ref, seen] = useInView();
    const [hovered, setHovered] = useState(false);
    const {name, posterUrl, description, year, rating, ageRating, loading} =
        useOmdb(props, {enabled: seen, full: hovered});

    return (
        <Link
            ref={ref}
            to={`/movies/title/${props.id}`}
            onMouseEnter={() => setHovered(true)}
            className='block relative w-full group cursor-pointer origin-top-left transition-transform duration-300 hover:scale-125 hover:z-10'
        >
            {posterUrl
                ? <img src={posterUrl} alt={name} loading='lazy' className='block w-full aspect-[2/3] rounded-lg object-cover bg-[#141921] shadow-md' />
                : (
                    <div className={`w-full aspect-[2/3] rounded-lg bg-[#141921] flex items-center justify-center p-3 text-center text-xs font-bold ${loading || !seen ? 'animate-pulse' : ''}`}>
                        {seen && !loading && name}
                    </div>
                )}

            {/* Details sit on the bottom of the poster on hover */}
            <div className='absolute inset-x-0 bottom-0 flex flex-col gap-1 rounded-b-lg px-3 pb-3 pt-12 text-sm bg-gradient-to-t from-[#00050D] via-[#00050D]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20'>
                <p className='font-bold text-xs line-clamp-2'>{name}</p>
                <p className='text-[10px] text-gray-300 space-x-2'>
                    {ageRating && <span>{ageRating}</span>}
                    {rating && <span>★{rating}/10</span>}
                    {year && <span>{year}</span>}
                </p>
                {description && <p className='text-[10px] line-clamp-2'>{description}</p>}
            </div>
        </Link>
    )
}

export default VideoCard;