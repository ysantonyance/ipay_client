import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {categoriesApi} from "../../api/categoriesApi.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {useSearch} from "../../context/SearchContext.jsx";

const MAX_CATEGORIES = 8;

/**
 * The "All" button in the header's second row plus the slide-out menu it opens.
 * The menu lists a few product categories (each opens /products filtered by that category)
 * and, pinned at the bottom, a sign-in button when logged out or a profile button when logged in.
 */
function NavMenu() {
    const {isLoggedIn, userName} = useAuth();
    const {setSearch} = useSearch();
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // Fetch the categories the first time the menu is opened.
    useEffect(() => {
        if (!open || loaded) return undefined;
        let ignore = false;
        (async () => {
            try {
                const data = await categoriesApi.getAll();
                if (ignore) return;
                const list = (Array.isArray(data) ? data : [])
                    .filter(c => (c.name || '').trim())
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(0, MAX_CATEGORIES);
                setCategories(list);
            } catch {
                if (!ignore) setCategories([]);
            } finally {
                if (!ignore) setLoaded(true);
            }
        })();
        return () => { ignore = true; };
    }, [open, loaded]);

    // Escape closes the menu, and the page behind it doesn't scroll while it is open.
    useEffect(() => {
        if (!open) return undefined;
        const onKey = e => { if (e.key === 'Escape') setOpen(false); };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    const close = () => setOpen(false);
    // Picking a category also clears the header search box, so the old search text doesn't filter the category.
    const pick = () => { setSearch(''); close(); };

    const rowCls = 'block px-5 py-3 text-[14px] text-[#0F1111] hover:bg-[#EAEDED] capitalize';

    return (
        <>
            <button
                type='button'
                onClick={() => setOpen(true)}
                aria-label='Open menu'
                aria-expanded={open}
                className='flex flex-row items-center pr-2 border border-transparent hover:border-white cursor-pointer shrink-0 text-white'
            >
                <span className='p-1.5'>
                    <svg className='w-5 h-5 sm:w-6 sm:h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16'></path>
                    </svg>
                </span>
                <b>All</b>
            </button>

            {open && (
                <div className='fixed inset-0 z-50 flex'>
                    <aside
                        role='dialog'
                        aria-label='Menu'
                        className='relative w-[300px] max-w-[85vw] h-full bg-white text-[#0F1111] flex flex-col shadow-xl'
                    >
                        <div className='bg-[#232F3E] text-white px-5 py-3 text-[18px] font-bold shrink-0'>
                            Hello, {isLoggedIn ? (userName || 'there') : 'sign in'}
                        </div>

                        <nav className='flex-1 overflow-y-auto py-2'>
                            <h2 className='px-5 pt-2 pb-1 text-[16px] font-bold'>Shop by category</h2>

                            {!loaded && <p className='px-5 py-3 text-[13px] text-[#565959]'>Loading…</p>}
                            {loaded && categories.length === 0 && (
                                <p className='px-5 py-3 text-[13px] text-[#565959]'>No categories to show.</p>
                            )}

                            {categories.map(c => (
                                <Link key={c.id} to={`/products?category=${c.id}`} onClick={pick} className={rowCls}>
                                    {c.name}
                                </Link>
                            ))}

                            <div className='border-t border-[#D5D9D9] mt-2 pt-2'>
                                <Link to='/products' onClick={pick} className={rowCls}>
                                    All products
                                </Link>
                            </div>
                        </nav>

                        <div className='border-t border-[#D5D9D9] p-4 shrink-0'>
                            {isLoggedIn ? (
                                <Link
                                    to='/profile'
                                    onClick={close}
                                    className='block w-full text-center bg-[#FFD814] hover:bg-[#F7CA00] rounded-full py-2 text-[14px]'
                                >
                                    Your profile
                                </Link>
                            ) : (
                                <Link
                                    to='/login'
                                    onClick={close}
                                    className='block w-full text-center bg-[#FFD814] hover:bg-[#F7CA00] rounded-full py-2 text-[14px]'
                                >
                                    Sign in
                                </Link>
                            )}
                        </div>
                    </aside>

                    <button
                        type='button'
                        aria-label='Close menu'
                        onClick={close}
                        className='flex-1 bg-black/50 cursor-default'
                    />
                </div>
            )}
        </>
    );
}

export default NavMenu;
