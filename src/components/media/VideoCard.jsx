import {useState} from "react";
import {Link} from "react-router-dom";
import {useInView, useOmdb} from "../../hooks/useOmdb.js";

// Only the film's id and name come from our database; the poster, year, rating and plot come from OMDb.
// The whole card links to the film's own page.
function VideoCard(props) {
    const [ref, seen] = useInView();
    const [hovered, setHovered] = useState(false);
    const {name, posterUrl, description, year, rating, ageRating, loading} =
        useOmdb(props, {enabled: seen, full: hovered});

    return (
        <Link
            ref={ref}
            to={`/amazon-video/title/${props.id}`}
            onMouseEnter={() => setHovered(true)}
            className='block relative w-[200px] group cursor-pointer origin-top-left transition-transform duration-300 hover:scale-150 hover:z-10'
        >
            {posterUrl
                ? <img src={posterUrl} alt={name} loading='lazy' className='block w-[200px] aspect-[2/3] rounded-lg object-cover bg-[#141921]' />
                : (
                    <div className={`w-[200px] aspect-[2/3] rounded-lg bg-[#141921] flex items-center justify-center p-4 text-center font-bold ${loading || !seen ? 'animate-pulse' : ''}`}>
                        {seen && !loading && name}
                    </div>
                )}

            {/* Details sit on the bottom of the poster (not below the card), so the row's scroll area can't clip them. */}
            <div className='absolute inset-x-0 bottom-0 flex flex-col gap-1 rounded-b-lg px-3 pb-3 pt-12 text-sm bg-gradient-to-t from-[#00050D] via-[#00050D]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <p className='font-bold line-clamp-2'>{name}</p>
                <p className='text-xs text-gray-300 space-x-2'>
                    {ageRating && <span>{ageRating}</span>}
                    {rating && <span>★{rating}/10</span>}
                    {year && <span>{year}</span>}
                </p>
                {description && <p className='text-xs line-clamp-3'>{description}</p>}
            </div>
        </Link>
    )
}

export default VideoCard;
