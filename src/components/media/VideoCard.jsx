import {useState} from "react";
import {useInView, useOmdb} from "../../hooks/useOmdb.js";

// Only the film's id and name come from our database; the poster, year, rating and plot come from OMDb.
function VideoCard(props) {
    const [ref, seen] = useInView();
    const [hovered, setHovered] = useState(false);
    const {name, posterUrl, description, year, rating, ageRating, loading} =
        useOmdb(props, {enabled: seen, full: hovered});

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            className='relative w-[200px] group cursor-pointer origin-top-left transition-transform duration-300 hover:scale-150 hover:z-10'
        >
            {posterUrl
                ? <img src={posterUrl} alt={name} loading='lazy' className='block w-[200px] aspect-[2/3] rounded-lg object-cover bg-[#141921]' />
                : (
                    <div className={`w-[200px] aspect-[2/3] rounded-lg bg-[#141921] flex items-center justify-center p-4 text-center font-bold ${loading || !seen ? 'animate-pulse' : ''}`}>
                        {seen && !loading && name}
                    </div>
                )}

            <div className='absolute top-full left-0 w-full flex flex-col gap-1 p-3 text-sm bg-[#00050D] rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <p className='font-bold'>{name}</p>
                <p className='text-xs text-gray-300 space-x-2'>
                    {ageRating && <span>{ageRating}</span>}
                    {rating && <span>★{rating}/10</span>}
                    {year && <span>{year}</span>}
                </p>
                {description && <p className='text-xs line-clamp-4'>{description}</p>}
            </div>
        </div>
    )
}

export default VideoCard;
