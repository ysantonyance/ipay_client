import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext.jsx';
import { productsApi } from '../../api/productsApi.js';

const MAX_SUGGESTIONS = 8;

// Lower rank = better match. -1 = no match.
function rankProduct(product, q, tokens) {
    const name = (product.name || '').toLowerCase();
    const haystack = `${name} ${(product.manufacturer || '').toLowerCase()}`;

    if (!tokens.every((t) => haystack.includes(t))) return -1;
    if (name.startsWith(q)) return 0;
    if (name.split(/\s+/).some((w) => w.startsWith(q))) return 1;
    if (name.includes(q)) return 2;
    return 3;
}

function Highlighted({ text, query }) {
    const index = text.toLowerCase().indexOf(query);
    if (!query || index === -1) return <>{text}</>;

    return (
        <>
            {text.slice(0, index)}
            <b>{text.slice(index, index + query.length)}</b>
            {text.slice(index + query.length)}
        </>
    );
}

function SearchBar() {
    const { search, setSearch } = useSearch();
    const navigate = useNavigate();
    const boxRef = useRef(null);

    const [products, setProducts] = useState([]);
    const [loadStarted, setLoadStarted] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);

    // Products are fetched once, the first time the search box is used.
    const loadProducts = async () => {
        if (loadStarted) return;
        setLoadStarted(true);
        try {
            const data = await productsApi.getAllUnpaged();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Search: failed to load products', err);
            setLoadStarted(false); // try again on next focus
        }
    };

    const q = search.trim().toLowerCase();

    const suggestions = useMemo(() => {
        if (!q) return [];
        const tokens = q.split(/\s+/);

        return products
            .map((p) => ({ product: p, rank: rankProduct(p, q, tokens) }))
            .filter((r) => r.rank !== -1)
            .sort((a, b) => a.rank - b.rank || (a.product.name || '').length - (b.product.name || '').length)
            .slice(0, MAX_SUGGESTIONS)
            .map((r) => r.product);
    }, [products, q]);

    useEffect(() => {
        const onPointerDown = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, []);

    const submit = (term) => {
        const value = term.trim();
        setSearch(value);
        setOpen(false);
        setActive(-1);
        navigate(value ? `/products?q=${encodeURIComponent(value)}` : '/products');
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!suggestions.length) return;
            setOpen(true);
            setActive((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!suggestions.length) return;
            setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            submit(open && active >= 0 ? suggestions[active].name : search);
        } else if (e.key === 'Escape') {
            setOpen(false);
            setActive(-1);
        }
    };

    const showDropdown = open && q !== '' && suggestions.length > 0;

    return (
        <div ref={boxRef} className='relative w-full'>
            <input
                className='w-full h-[40px] bg-white rounded-xl text-black pl-3 pr-10 text-[14px] outline-none'
                type='text'
                placeholder='Search...'
                value={search}
                autoComplete='off'
                onFocus={() => { loadProducts(); setOpen(true); }}
                onChange={(e) => { loadProducts(); setSearch(e.target.value); setOpen(true); setActive(-1); }}
                onKeyDown={onKeyDown}
            />

            <button
                type='button'
                aria-label='Search'
                onClick={() => submit(search)}
                className='absolute right-0 top-0 h-[40px] w-10 flex items-center justify-center text-[#131921] cursor-pointer'
            >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
            </button>

            {showDropdown && (
                <ul className='absolute left-0 right-0 top-[44px] z-50 bg-white text-black text-[14px] rounded-xl border border-[#D5D9D9] shadow-lg py-1 overflow-hidden'>
                    {suggestions.map((p, i) => (
                        <li key={p.id}>
                            <button
                                type='button'
                                onMouseDown={(e) => e.preventDefault()}
                                onMouseEnter={() => setActive(i)}
                                onClick={() => submit(p.name)}
                                className={`w-full text-left px-3 py-2 cursor-pointer flex items-baseline justify-between gap-3 ${
                                    i === active ? 'bg-[#F0F2F2]' : ''
                                }`}
                            >
                                <span className='truncate'>
                                    <Highlighted text={p.name || ''} query={q} />
                                </span>
                                {p.manufacturer && (
                                    <span className='text-[12px] text-[#565959] shrink-0'>{p.manufacturer}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SearchBar;
