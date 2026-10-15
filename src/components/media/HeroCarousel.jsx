import {useEffect, useState} from "react";
import {useOmdb} from "../../hooks/useOmdb.js";

function HeroSlide({item}) {
    const s = useOmdb(item, {full: true});
    const meta = [s.year, s.ageRating, s.rating && `★ ${s.rating}`].filter(Boolean).join(' · ');

    return (
        <>
            {s.posterUrl && (
                <div className='absolute inset-0 h-full w-full overflow-hidden bg-[#00050D]'>
                    <img
                        src={s.posterUrl}
                        alt=''
                        aria-hidden='true'
                        className='absolute inset-0 h-full w-full object-cover filter blur-2xl opacity-30 scale-110'
                    />

                    <div className='absolute right-0 top-0 h-full w-full md:w-1/2 flex justify-end items-center pr-12 py-6'>
                        <img
                            src={s.posterUrl}
                            alt={s.name}
                            className='h-full max-h-[360px] object-contain rounded-lg shadow-2xl relative z-10'
                        />
                    </div>
                </div>
            )}

            <div className='absolute inset-0 bg-black/60 md:bg-transparent bg-[linear-gradient(to_right,#00050D_10%,rgba(0,5,13,0.8)_50%,transparent)] z-20 pointer-events-none' />

            <div className='absolute inset-0 flex flex-col justify-center gap-3 px-16 max-w-xl z-30'>
                <h1 className='text-4xl font-bold'>{s.name}</h1>
                <p className='text-sm text-gray-300'>{meta}</p>
                <p className='line-clamp-3 text-sm text-gray-200'>{s.description}</p>
            </div>
        </>
    );
}

function HeroCarousel({items}) {
    const [i, setI] = useState(0);
    const [fade, setFade] = useState(true);
    const n = items.length;

    useEffect(() => {
        if (n < 2) return;
        const t = setTimeout(() => {
            setFade(false);
            setTimeout(() => {
                setI(p => (p + 1) % n);
                setFade(true);
            }, 300);
        }, 6000);
        return () => clearTimeout(t);
    }, [i, n]);

    if (n === 0) return null;
    const s = items[i % n];
    const arrow = 'absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-white hover:text-black text-2xl cursor-pointer flex items-center justify-center z-40 transition-colors';

    const handleManualChange = (newIndex) => {
        setFade(false);
        setTimeout(() => {
            setI(newIndex);
            setFade(true);
        }, 300);
    };

    return (
        <div className='relative h-[420px] rounded-xl bg-[#141921] overflow-hidden shadow-xl'>
            <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
                <HeroSlide key={s.id} item={s} />
            </div>

            <button className={`${arrow} left-3`} onClick={() => handleManualChange((i - 1 + n) % n)}>‹</button>
            <button className={`${arrow} right-3`} onClick={() => handleManualChange((i + 1) % n)}>›</button>

            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40'>
                {items.map((_, d) => (
                    <button
                        key={d}
                        onClick={() => handleManualChange(d)}
                        className={`h-2 rounded-full cursor-pointer transition-all ${d === i % n ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default HeroCarousel;