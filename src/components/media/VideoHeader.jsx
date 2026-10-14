import {Link, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {genresApi} from "../../api/genresApi.js";
import SearchModal from "./SearchModal.jsx";

const tabs = [
    {label: 'Home', to: '/movies', type: null},
    {label: 'Movies', to: '/movies?type=movie', type: 'movie'},
    {label: 'TV shows', to: '/movies?type=tv', type: 'tv'},
];

function VideoHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [params] = useSearchParams();
    const type = params.get('type');
    // Browsing genres from the Movies / TV shows tab stays inside that tab.
    const typeQuery = type === 'movie' || type === 'tv' ? `?type=${type}` : '';
    const [searchOpen, setSearchOpen] = useState(false);

    const [genres, setGenres] = useState([]);

    useEffect(() => {
        genresApi.getAll().then(res => setGenres(res)).catch(console.error);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <div className={`sticky -top-2 z-50 mx-13 rounded-xl flex justify-between py-2 pt-5 px-5 transition-colors duration-300 ${scrolled ? 'bg-[#141921]/70 backdrop-blur-3xl' : 'bg-black'}`}>
                <div className='flex space-x-2'>
                    <Link
                        className='block p-3 flex items-center'
                        to='/movies'
                    >
                        <b>pay video</b>
                    </Link>

                    {tabs.map(tab => (
                        <Link
                            key={tab.label}
                            to={tab.to}
                            className={`group cursor-pointer p-3 rounded-xl flex items-center ${
                                type === tab.type
                                    ? 'bg-[#33373E] bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(255,255,255,0.75),rgba(255,255,255,0.15)_60%,transparent_100%)]'
                                    : 'hover:bg-white hover:text-black'
                            }`}
                        >
                            <b>{tab.label}</b>
                        </Link>
                    ))}
                </div>

                <div className='flex items-center space-x-2'>
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

                    <div className='relative group/cat'>
                        <Link to={`/movies/categories${typeQuery}`}>
                            <div className='w-[35px] h-[35px] hover:bg-white rounded-3xl group p-2'>
                                <img
                                    className='group-hover:brightness-0'
                                    src="https://img.icons8.com/?size=100&id=100642&format=png&color=FFFFFF" alt=""
                                />
                            </div>
                        </Link>

                        <div className='hidden group-hover/cat:block absolute right-0 top-full pt-2 z-50'>
                            <div className='w-56 max-h-80 overflow-y-auto rounded-xl bg-[#141921] p-2 shadow-lg'>
                                {genres.map(g => (
                                    <Link
                                        key={g.id}
                                        to={`/movies/categories/${g.id}${typeQuery}`}
                                        className='block px-3 py-2 rounded-lg text-sm font-bold hover:bg-white hover:text-black'
                                    >
                                        {g.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
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