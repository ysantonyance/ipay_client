import {useEffect, useState} from "react";
import useVideos from "../../hooks/useFilms.js";

function SearchModal({onClose}) {
    const {series} = useVideos();
    const [q, setQ] = useState('');

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = e => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    const term = q.trim().toLowerCase();
    const matches = term ? series.filter(s => s.name.toLowerCase().includes(term)) : [];

    return (
        <div className='fixed inset-0 z-[60] overflow-y-auto bg-black/70'>
            <div className='flex min-h-full items-start justify-center p-4 pt-24' onClick={onClose}>
                <div className='w-full max-w-3xl rounded-xl bg-[#141921] p-5' onClick={e => e.stopPropagation()}>
                    <input
                        autoFocus
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder='Search movies and TV shows'
                        className='w-full rounded-xl bg-[#33373E] px-4 py-3 outline-none focus:ring-2 focus:ring-white/60'
                    />

                    {!term && <p className='mt-4 text-sm text-gray-400'>Start typing to search.</p>}
                    {term && matches.length === 0 && <p className='mt-4 text-sm text-gray-400'>No results for "{q}".</p>}

                    {matches.length > 0 && (
                        <>
                            <div className='mt-3'>
                                {matches.slice(0, 6).map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setQ(s.name)}
                                        className='block w-full rounded-lg px-3 py-2 text-left hover:bg-[#33373E] cursor-pointer'
                                    >
                                        {s.name}
                                    </button>
                                ))}
                            </div>

                            <div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                                {matches.slice(0, 4).map(s => (
                                    <div key={s.id}>
                                        {s.posterUrl
                                            ? <img src={s.posterUrl} alt={s.name} className='aspect-video w-full rounded-lg object-cover' />
                                            : <div className='aspect-video w-full rounded-lg bg-[#33373E]' />}
                                        <p className='mt-2 text-sm font-bold line-clamp-2'>{s.name}</p>
                                        <p className='text-xs text-gray-400'>{s.year}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchModal;