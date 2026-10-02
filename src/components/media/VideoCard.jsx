function VideoCard({ name, posterUrl, description, year, rating, director, ageRating }) {
    return (
        <div className='relative w-[300px] group cursor-pointer origin-top-left transition-transform duration-300 hover:scale-150 hover:z-10'>
            {posterUrl && <img src={posterUrl} alt={name} className='min-w-[300px] h-[170px] rounded-lg' />}

            <div className='absolute top-full left-0 w-full flex flex-col gap-1 p-3 text-sm bg-[#00050D] rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <p className='font-bold'>{name}</p>
                <p className='text-xs text-gray-300 space-x-2'>{ageRating}+ ★{rating}/5 {year}</p>
                <p className='text-xs line-clamp-4'>{description}</p>
            </div>
        </div>
    )
}

export default VideoCard;