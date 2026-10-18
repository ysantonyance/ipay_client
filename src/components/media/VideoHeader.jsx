import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState, useRef} from "react";
import {genresApi} from "../../api/genresApi.js";
import SearchModal from "./SearchModal.jsx";
import {useLanguage} from "../../context/LanguageContext.jsx";

const tabs = [
    {label: 'Home page', to: '/movies', type: null},
    {label: 'Movies', to: '/movies?type=movie', type: 'movie'},
    {label: 'TV shows', to: '/movies?type=tv', type: 'tv'},
];

function VideoHeader() {
    const {t} = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [params] = useSearchParams();
    const type = params.get('type');
    const typeQuery = type === 'movie' || type === 'tv' ? `?type=${type}` : '';
    const [searchOpen, setSearchOpen] = useState(false);

    const [genres, setGenres] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const closeTimeoutRef = useRef(null);

    useEffect(() => {
        genresApi.getAll().then(res => setGenres(res)).catch(console.error);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setDropdownOpen(false);
        }, 200); // 200ms delay before closing
    };

    return (
        <>
            <div className={`sticky -top-2 z-50 mx-3 sm:mx-13 rounded-xl flex flex-wrap items-center py-2 pt-3 sm:pt-5 px-3 sm:px-5 transition-colors duration-300 ${scrolled ? 'bg-[#141921]/70 backdrop-blur-3xl' : 'bg-black'}`}>
                <Link
                    className='order-1 block p-3 flex items-center'
                    to='/movies'
                >
                    <b style={{fontFamily: "'Comic Sans MS', 'Comic Sans', 'Chalkboard SE', cursive"}}>{t("pay video")}</b>
                </Link>

                <div className='order-3 sm:order-2 w-full sm:w-auto sm:ml-2 sm:mr-auto flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                    {tabs.map(tab => (
                        <Link
                            key={tab.label}
                            to={tab.to}
                            className={`group cursor-pointer shrink-0 whitespace-nowrap p-3 rounded-xl flex items-center ${
                                type === tab.type
                                    ? 'bg-[#33373E] bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(255,255,255,0.75),rgba(255,255,255,0.15)_60%,transparent_100%)]'
                                    : 'hover:bg-white hover:text-black'
                            }`}
                        >
                            <b>{t(tab.label)}</b>
                        </Link>
                    ))}
                </div>

                <div className='order-2 sm:order-3 ml-auto flex items-center space-x-2'>
                    <button
                        onClick={() => setSearchOpen(true)}
                        className='cursor-pointer'>
                        <div className='w-[35px] h-[35px] hover:bg-white rounded-3xl group p-2'>
                            <img
                                className='group-hover:brightness-0'
                                src="https://img.icons8.com/?size=100&id=132&format=png&color=FFFFFF" alt=""
                            />
                        </div>
                    </button>

                    <div
                        className='relative group/cat'
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link to={`/movies/categories${typeQuery}`}>
                            <div className='w-[35px] h-[35px] hover:bg-white rounded-3xl group p-2'>
                                <img
                                    className='group-hover:brightness-0'
                                    src="https://img.icons8.com/?size=100&id=100642&format=png&color=FFFFFF" alt=""
                                />
                            </div>
                        </Link>

                        {genres.length > 0 && (
                            <div className={`hidden sm:block absolute right-0 top-full pt-2 z-50 transition-all duration-200 transform ${
                                dropdownOpen
                                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                                    : 'opacity-0 -translate-y-2 pointer-events-none'
                            }`}>
                                <div className='rounded-xl bg-[#141921]/80 backdrop-blur-xl p-3 shadow-xl border border-white/10'>
                                    <div className='text-xs font-bold text-gray-400 uppercase tracking-wider px-3 pb-2'>
                                        {t("Genres")}
                                    </div>
                                    <div
                                        className='grid grid-flow-col auto-cols-[10rem] p-1'
                                        style={{gridTemplateRows: `repeat(${Math.ceil(genres.length / 2)}, auto)`}}
                                    >
                                        {genres.map(g => (
                                            <Link
                                                key={g.id}
                                                to={`/movies/categories/${g.id}${typeQuery}`}
                                                className='block truncate px-3 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-white hover:text-black text-gray-300'
                                            >
                                                {g.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to='/profile'>
                        <div className='w-[35px] h-[35px] hover:bg-white rounded-3xl group p-2'>
                            <img
                                className='group-hover:brightness-0'
                                src="https://img.icons8.com/?size=100&id=iBZNHkGbms4H&format=png&color=FFFFFF" alt=""/>
                        </div>
                    </Link>
                </div>
            </div>

            {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
        </>
    )
}

export default VideoHeader;