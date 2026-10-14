import {useEffect, useState} from "react";
import {useOmdb} from "../../hooks/useOmdb.js";

// One slide: its visuals come from OMDb (looked up by the stored name).
function HeroSlide({item}) {
    const s = useOmdb(item, {full: true});
    const meta = [s.year, s.ageRating, s.rating && `★ ${s.rating}`].filter(Boolean).join(' · ');

    return (
        <>
            {s.posterUrl && (
                <div
                    className='absolute -inset-8 bg-cover bg-center blur-2xl opacity-60'
                    style={{backgroundImage: `url(${s.posterUrl})`}}
                />
            )}
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#00050D_10%,rgba(0,5,13,0.5)_50%,transparent)]' />

            {s.posterUrl && (
                <img
                    src={s.posterUrl}
                    alt={s.name}
                    className='absolute right-24 top-1/2 -translate-y-1/2 h-[340px] rounded-lg shadow-2xl hidden md:block'
                />
            )}

            <div className='absolute inset-0 flex flex-col justify-center gap-3 px-16 max-w-xl'>
                <h1 className='text-4xl font-bold'>{s.name}</h1>
                <p className='text-sm text-gray-300'>{meta}</p>
                <p className='line-clamp-3 text-sm'>{s.description}</p>
            </div>
        </>
    );
}

function HeroCarousel({items}) {
    const [i, setI] = useState(0);
    const n = items.length;

    useEffect(() => {
        if (n < 2) return;
        const t = setTimeout(() => setI(p => (p + 1) % n), 6000);
        return () => clearTimeout(t);
    }, [i, n]);

    if (n === 0) return null;
    const s = items[i % n];
    const arrow = 'absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-white hover:text-black text-2xl cursor-pointer';

    return (
        <div className='relative h-[420px] rounded-xl bg-[#141921] overflow-hidden'>
            <HeroSlide key={s.id} item={s} />

            <button className={`${arrow} left-3`} onClick={() => setI((i - 1 + n) % n)}>‹</button>
            <button className={`${arrow} right-3`} onClick={() => setI((i + 1) % n)}>›</button>

            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                {items.map((_, d) => (
                    <button
                        key={d}
                        onClick={() => setI(d)}
                        className={`h-2 rounded-full cursor-pointer transition-all ${d === i % n ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default HeroCarousel;
