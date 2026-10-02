import {Link} from "react-router-dom";
import {useEffect, useState} from "react";

const tabs = ['Home', 'Movies', 'TV shows'];

function VideoHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('Home');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 0);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return(
        <>
            <div className={`sticky -top-2 z-50 mx-13 rounded-xl flex justify-between py-2 pt-5 px-5 transition-colors duration-300 ${scrolled ? 'bg-[#141921]/70 backdrop-blur-3xl' : 'bg-black'}`}>
                <div className='flex space-x-2'>
                    <Link
                        className='block p-3 flex items-center'
                        to='/amazon-video'
                    >
                        <b>prime video</b>
                    </Link>

                    {tabs.map(tab => (
                        <p
                            key={tab}
                            onClick={() => setActive(tab)}
                            className={`group cursor-pointer p-3 rounded-xl flex items-center ${
                                active === tab
                                    ? 'bg-[#33373E] bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(255,255,255,0.75),rgba(255,255,255,0.15)_60%,transparent_100%)]'
                                    : 'hover:bg-white hover:text-black'
                            }`}
                        >
                            <b>{tab}</b>
                        </p>
                    ))}
                </div>

                <div className='flex items-center space-x-2'>
                    <button className='cursor-pointer'>
                        <div className='w-[35px] h-[35px] hover:bg-white rounded-3xl group p-2'>
                            <img
                                className='group-hover:brightness-0'
                                src="https://img.icons8.com/?size=100&id=132&format=png&color=FFFFFF" alt=""
                            />
                        </div>

                    </button>

                    <Link 
                        to='/amazon-videos/categories'
                    >
                        <div className='w-[35px] h-[35px] hover:bg-white rounded-3xl group p-2'>
                            <img
                                className='group-hover:brightness-0'
                                src="https://img.icons8.com/?size=100&id=100642&format=png&color=FFFFFF" alt=""
                            />
                        </div>

                    </Link>

                    <Link to='your-account'>
                        <div className='w-[35px] h-[35px] hover:bg-white rounded-3xl group p-2'>
                            <img
                                className='group-hover:brightness-0'
                                src="https://img.icons8.com/?size=100&id=iBZNHkGbms4H&format=png&color=FFFFFF" alt=""/>
                        </div>

                    </Link>
                </div>
            </div>
        </>
    )
}

export default VideoHeader;