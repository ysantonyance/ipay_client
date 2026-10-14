import {useRef} from "react";
import {Link} from "react-router-dom";
import VideoCard from "./VideoCard.jsx";

function CategoryRow({title, to, items}) {
    const ref = useRef(null);
    const scroll = dir => ref.current.scrollBy({left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth'});
    const arrow = 'absolute top-0 h-[300px] w-12 z-20 bg-black/60 text-3xl opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer';

    if (items.length === 0) return null;

    return (
        <section className='group/row mb-6'>
            <div className='relative z-[5] flex items-baseline justify-between mb-3'>
                <h2 className='text-xl font-bold'>{title}</h2>
                {to && <Link to={to} className='text-sm text-gray-300 hover:text-white hover:underline'>See more ›</Link>}
            </div>

            <div className='relative'>
                <button className={`${arrow} left-0`} onClick={() => scroll(-1)}>‹</button>

                <div
                    ref={ref}
                    className='flex gap-4 overflow-x-auto pb-40 -mb-32 pr-8 pointer-events-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                >
                    {items.map(s => (
                        <div key={s.id} className='shrink-0 pointer-events-auto'>
                            <VideoCard {...s} />
                        </div>
                    ))}
                </div>

                <button className={`${arrow} right-0`} onClick={() => scroll(1)}>›</button>
            </div>
        </section>
    );
}

export default CategoryRow;