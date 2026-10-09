import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext.jsx';
import { productsApi } from '../../api/productsApi.js';
import { categoriesApi } from '../../api/categoriesApi.js';

const MAX_PRODUCTS = 8;
const MAX_CATEGORIES = 3;

// Lower rank = better match. -1 = no match.
function rankText(text, q, tokens) {
    const t = (text || '').toLowerCase();
    if (!tokens.every((tok) => t.includes(tok))) return -1;
    if (t.startsWith(q)) return 0;
    if (t.split(/\s+/).some((w) => w.startsWith(q))) return 1;
    return 2;
}

function rankProduct(product, categoryName, q, tokens) {
    const nameRank = rankText(product.name, q, tokens);
    if (nameRank !== -1) return nameRank;

    // Name alone doesn't match - try name + manufacturer + category together.
    const haystack = `${product.name} ${product.manufacturer || ''} ${categoryName || ''}`.toLowerCase();
    return tokens.every((t) => haystack.includes(t)) ? 3 : -1;
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
    const [categories, setCategories] = useState([]);
    const [loadStarted, setLoadStarted] = useState(false);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);

    // Products and categories are fetched once, the first time the search box is used.
    const loadData = async () => {
        if (loadStarted) return;
        setLoadStarted(true);
        try {
            const [prods, cats] = await Promise.all([
                productsApi.getAllUnpaged(),
                categoriesApi.getAll().catch(() => []), // categories are optional for search
            ]);
            setProducts(Array.isArray(prods) ? prods : []);
            setCategories(Array.isArray(cats) ? cats : []);
        } catch (err) {
            console.error('Search: failed to load data', err);
            setLoadStarted(false); // try again on next focus
        }
    };

    const q = search.trim().toLowerCase();

    // One flat list so keyboard navigation works across both groups:
    // matching categories first, then matching products.
    const suggestions = useMemo(() => {
        if (!q) return [];
        const tokens = q.split(/\s+/);

        const categoryItems = categories
            .map((c) => ({ c, rank: rankText(c.name, q, tokens) }))
            .filter((r) => r.rank !== -1)
            .sort((a, b) => a.rank - b.rank)
            .slice(0, MAX_CATEGORIES)
            .map((r) => ({ type: 'category', id: `c-${r.c.id}`, category: r.c }));

        const categoryNames = new Map(categories.map((c) => [String(c.id), c.name]));

        const productItems = products
            .map((p) => ({ p, rank: rankProduct(p, categoryNames.get(String(p.categoryId)), q, tokens) }))
            .filter((r) => r.rank !== -1)
            .sort((a, b) => a.rank - b.rank || (a.p.name || '').length - (b.p.name || '').length)
            .slice(0, MAX_PRODUCTS)
            .map((r) => ({ type: 'product', id: `p-${r.p.id}`, product: r.p }));

        return [...categoryItems, ...productItems];
    }, [products, categories, q]);

    useEffect(() => {
        const onPointerDown = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, []);

    const close = () => {
        setOpen(false);
        setActive(-1);
    };

    const submitText = (term) => {
        const value = term.trim();
        setSearch(value);
        close();
        navigate(value ? `/products?q=${encodeURIComponent(value)}` : '/products');
    };

    const pick = (item) => {
        if (item.type === 'category') {
            setSearch(item.category.name);
            close();
            navigate(`/products?category=${encodeURIComponent(item.category.id)}`);
        } else {
            submitText(item.product.name);
        }
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
            if (open && active >= 0 && suggestions[active]) pick(suggestions[active]);
            else submitText(search);
        } else if (e.key === 'Escape') {
            close();
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
                onFocus={() => { loadData(); setOpen(true); }}
                onChange={(e) => { loadData(); setSearch(e.target.value); setOpen(true); setActive(-1); }}
                onKeyDown={onKeyDown}
            />

            <button
                type='button'
                aria-label='Search'
                onClick={() => submitText(search)}
                className='absolute right-0 top-0 h-[40px] w-10 flex items-center justify-center text-[#131921] cursor-pointer'
            >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
            </button>

            {showDropdown && (
                <ul className='absolute left-0 right-0 top-[44px] z-50 bg-white text-black text-[14px] rounded-xl border border-[#D5D9D9] shadow-lg py-1 overflow-hidden'>
                    {suggestions.map((item, i) => (
                        <li key={item.id}>
                            <button
                                type='button'
                                onMouseDown={(e) => e.preventDefault()}
                                onMouseEnter={() => setActive(i)}
                                onClick={() => pick(item)}
                                className={`w-full text-left px-3 py-2 cursor-pointer flex items-baseline justify-between gap-3 ${
                                    i === active ? 'bg-[#F0F2F2]' : ''
                                }`}
                            >
                                {item.type === 'category' ? (
                                    <>
                                        <span className='truncate'>
                                            <Highlighted text={item.category.name || ''} query={q} />
                                        </span>
                                        <span className='text-[12px] text-[#007185] shrink-0'>Category</span>
                                    </>
                                ) : (
                                    <>
                                        <span className='truncate'>
                                            <Highlighted text={item.product.name || ''} query={q} />
                                        </span>
                                        {item.product.manufacturer && (
                                            <span className='text-[12px] text-[#565959] shrink-0'>
                                                {item.product.manufacturer}
                                            </span>
                                        )}
                                    </>
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
