import {useEffect, useState} from "react";
import Carousel from "../components/shop/Carousel.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useSearch} from "../context/SearchContext.jsx";
import TodaysDeal from "./TodaysDeal.jsx";
import {useLanguage} from "../context/LanguageContext.jsx";

function Home() {
    const {t} = useLanguage();
    const {setSearch: setSearchText} = useSearch();
    const navigate = useNavigate();
    // Every card on this page calls setSearch(term): fill the header search box and open /products filtered by that term.
    const setSearch = (term) => {
        const value = (term || '').trim();
        setSearchText(value);
        navigate(value ? `/products?q=${encodeURIComponent(value)}` : '/products');
    };
    // Cards that just open the products page showing only top-rated items (4 stars & up), with no search term.
    const goTopRated = (e) => {
        e.preventDefault();
        setSearchText('');
        navigate('/products?rating=4');
    };
    // The pets card opens the products page on the pets category.
    const goPets = (e) => {
        e.preventDefault();
        setSearchText('');
        navigate('/products?category=pets');
    };
    const [carouselCount, setCarouselCount] = useState(
        window.innerWidth < 640 ? 1.85 : window.innerWidth < 1024 ? 3 : 5
    );
    useEffect(() => {
        const updateCount = () => {
            setCarouselCount(window.innerWidth < 900 ? (window.innerWidth < 600 ? 1.85 : 3) : 5);
        };
        window.addEventListener('resize', updateCount);
        return () => window.removeEventListener('resize', updateCount);
    }, []);
    return (
        <>
            <div className='px-0 sm:px-0 lg:px-15 bg-[#E3E6E6]'>
                <div className='bg-white px-4 py-2'>
                    <Carousel visibleCount={carouselCount}>

                        <div className='relative '>
                            <a
                                onClick={(e) => { e.preventDefault(); console.log('clicked'); setSearch('kitchen appliances'); }}
                                href="">
                                <img
                                    className='block rounded-2xl w-full aspect-[302/484] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/51l7ZOsRo7L._AC_AIweblab1431263,T1_FMavif_SF1282.5,2052_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[18px] sm:text-[20px] xl:text-[26px] absolute top-2 left-0 right-0 px-3 leading-tight pointer-events-none'>{t("Shop kitchen must-haves")}</h1>
                        </div>

                        <div className='relative '>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                href="">
                                <img
                                    className='block rounded-2xl w-full aspect-[302/484] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/61Ld77LHXQL._AC_AIweblab1431263,T1_FMavif_SF1282.5,1981.5_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[18px] sm:text-[20px] xl:text-[26px] absolute top-2 left-0 right-0 px-3 leading-tight pointer-events-none'>{t("Shop all things beauty")}</h1>
                        </div>

                        <div className='relative '>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('fashion clothing'); }}
                                href="">
                                <img
                                    className='block rounded-2xl w-full aspect-[302/484] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/61R7G24e7dL._AC_AIweblab1431263,T1_FMavif_SF1282.5,1981.5_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[18px] sm:text-[20px] xl:text-[26px] absolute top-2 left-0 right-0 px-3 leading-tight pointer-events-none'>{t("Start looking sharp")}</h1>
                        </div>

                        <div className='relative '>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('toys'); }}
                                href="">
                                <img
                                    className='block rounded-2xl w-full aspect-[302/484] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/61upHi2gzaL._AC_AIweblab1431263,T1_FMavif_SF1282.5,2052_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[18px] sm:text-[20px] xl:text-[26px] absolute top-2 left-0 right-0 px-3 leading-tight pointer-events-none'>{t("Toys for little ones")}</h1>
                        </div>

                        <div className='relative '>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('pc'); }}
                                href="">
                                <img
                                    className='block rounded-2xl w-full aspect-[302/484] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/714RPvHc4LL._AC_AIweblab1431263,T1_FMavif_SF1282.5,1981.5_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[18px] sm:text-[20px] xl:text-[26px] absolute top-2 left-0 right-0 px-3 leading-tight pointer-events-none'>{t("Level up your PC here")}</h1>
                        </div>

                        <div className='relative '>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('good books'); }}
                                href="">
                                <img
                                    className='block rounded-2xl w-full aspect-[302/484] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/613fnGHLTYL._AC_AIweblab1431263,T1_FMavif_SF1282.5,1981.5_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[18px] sm:text-[20px] xl:text-[26px] absolute top-2 left-0 right-0 px-3 leading-tight pointer-events-none'>{t("Discover books you can't put down")}</h1>
                        </div>

                    </Carousel>
                </div>

                <div className='bg-white px-4 py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6'>

                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('electronics'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Plug in with our electronics")}
                            </a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('headphones'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/417NhPd56zL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('headphones'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Headphones")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('electronic tablets'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41dMYqsSuGL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('electronic tablets'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Tablets")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('gaming equipment'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41gk0-eoy4L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('gaming equipment'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Gaming")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('speakers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41uuEMle6TL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('speakers'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Speakers")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('computers'); }}
                                href=''
                                className='tracking-tight'>
                                {t("Score the top PCs & Accessories")}
                            </a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('desktop computers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31aw+nYkUmL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('desktop computers'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Desktops")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('laptops'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31hqkoNqvTL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('laptops'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Laptops")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hard drives'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/217Arq+nObL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hard drives'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Hard Drives")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('computer accessories'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/312z6VjcSmL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('computer accessories'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("PC Accessories")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('fitness'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Gear up to get fit")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness clothing'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41CutKsrzNL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness clothing'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Clothing")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness trackers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41RKKF01YxL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness trackers'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Trackers")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness equipment'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41MjMjLh9BL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness equipment'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Equipment")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41idnUIEIZL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Deals")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Trending Fashion'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Apparel under $25")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women Clothing'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41DNYos4L1L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women Clothing'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Women")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men Clothing'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31-zpA1B2zL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men Clothing'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Men")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Girls Fashion'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41J+KoaCycL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Girls Fashion'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Girl")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Boys Fashion'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31YRD7rRprL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Boys Fashion'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Boys")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('kitchen'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Fantastic Finds for Home")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41opB3I6bHL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Kitchen")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31zR9dINh6L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Home Decor")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('dining'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41bvMGlDk4L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('dining'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Dining")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('smart home'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/314AasupNAL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('smart home'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Smart Home")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Shine brighter with your fashion faves")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('jewelry'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31iAfM94Q1L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('jewelry'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Jewelry")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('handbags'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41RsxdVi8QL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('handbags'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Handbags")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41wBvSYrvWL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women footwear'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Footwear")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41Tsj3W9JHL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Beauty")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Unveil your radiance")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hair care'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41+i4d+1YXL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hair care'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Hair Care")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fragrances'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/4115ssxY8RL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fragrances'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Fragrances")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Make up'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/51F8Stay1iL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Make up'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Make-up")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('skin care'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41hBTWbTOvL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('skin care'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Skin Care")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('computers'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Level up your PC here")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('laptops'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41SeoNqumwL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('laptops'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Laptops")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('desktop PCs'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41hls0IW3XL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('desktop PCs'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("PCs")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hard drives'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41DUMIpCRRL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hard drives'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Hard Drives")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('computer monitors'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/410RcCBLHIL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('computer monitors'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Monitors")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('shoes'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Fashion trends in Shoes")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women Shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41yqgtOqxPL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women Shoes'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Women's")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men Shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41wfXsKdqEL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men Shoes'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Men's")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Kid Shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41-zOL2WhXL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Kid Shoes'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Kid's")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/4103VPrZvIL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Shoes'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("All Shoes")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('kitchen'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Home harmony")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen essentials'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41dEpCmTRFL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen essentials'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Kitchen essentials")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('sofa'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41cXdDKGU6L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('sofa'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Home comfort")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41EvbQ64I2L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Decorate with elegance")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Home decor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41hJC3LJ2aL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Home decor'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Light it Right")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Shoes'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Shoes under $50")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31U967D6S3L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women footwear'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Women's")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31Wut-0nWqL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men footwear'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Men's")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('girls footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31JVbBrAgDL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('girls footwear'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Girl's")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('boys footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41DEKPASTNL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('boys footwear'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Boy's")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={goPets}
                                href=''
                                className='tracking-tight'
                            >
                                {t("What you need for furry friends")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={goPets}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41eLkFePVUL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={goPets}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Dogs")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={goPets}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41OERaEZuaL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={goPets}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Cats")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={goPets}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/410BX1Aby0L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={goPets}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Small pets")}</a>
                            </div>

                            <div>
                                <Link to='/products?category=pets' onClick={() => setSearchText('')}
                                      href=""
                                >
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/4172LJHm7gL._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/products?category=pets' onClick={() => setSearchText('')}
                                      href="">{t("Deals")}</Link>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('games'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Video games & accessories")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('xbox controller'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/21HndQWZivL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('xbox controller'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Xbox controllers")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Nintendo'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31L8hlUOKfL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Nintendo'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Nintendo")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('vr headset'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/21+Ccbv5f5L._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('vr headset'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("VR headsets")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('PS5 accessories'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/21DOO2U+rQL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('PS5 accessories'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("PS5 accessories")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('toys'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Have more fun with the family")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('outdoor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31uBBG+KvtL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('outdoor'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Outdoor Play Sets")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('learning toys'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31QJz8+ereL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('learning toys'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Learning Toys")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('action figures'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/310Ke5y4pBL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('action figures'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Action Figures")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('pretend play'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/416Kr1IKmgL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('pretend play'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Pretend Play Toys")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('home bedding'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Finds in Home")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Bedsheets'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/319RC1dCFNL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Bedsheets'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Bedsheets")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Pillows'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41+4Tvu3E0L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Pillows'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Pillows")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('duvet covers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41u90AplYLL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('duvet covers'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Duvet Covers")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Throws'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41iRkfbZX6L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Throws'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Throws")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                  href=''
                                  className='tracking-tight'
                            >
                                {t("Deals on top categories")}</Link>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                      href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41GibUzBeXL._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                      href=''>{t("Books")}</Link>
                            </div>

                            <div>
                                <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                      href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41YDpSUai3L._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                      href="">
                                    {t("Fashion")}
                                </Link>
                            </div>

                            <div>
                                <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                      href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41qG08jk3ML._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                      href="">{t("PC")}</Link>
                            </div>

                            <div>
                                <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                      href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41QFxGoW7IL._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                      href="">{t("Beauty")}</Link>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('home'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("New home arrivals under $50")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('dining'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41I85MytToL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('dining'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Kitchen & dining")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home improvement'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41mb6AUCJSL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home improvement'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Home improvement")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41J1-iazq6L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor '); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Décor")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('bath'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/417HmRJ2WJL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('bath'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Bedding & bath")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <Link to='/products?rating=4' onClick={() => setSearchText('')}
                                  href=''
                                  className='tracking-tight'
                            >
                                {t("Discover the latest arrivals")}</Link>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={goTopRated}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31zLfxfdJ1L._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={goTopRated}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Electronics")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={goTopRated}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31cU8R+ZNFL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={goTopRated}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Home")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={goTopRated}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/21vZBVKPsDL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={goTopRated}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Beauty")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={goTopRated}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/21X3TF86YFL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={goTopRated}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Fashion")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('accessories'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Accessorize your life")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fashion accessories'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/413lM0C0PEL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fashion accessories'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Fashion accessories")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men accessories'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/410LHEUGZ5L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men accessories'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Men's accessories")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('health'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41IIOwmruhL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('health'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Health and beauty")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Sports'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31KVFrr1USL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Sports'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Sports")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('apparel'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Step into style")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41Ty8UTzIFL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women apparel'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Women's clothing")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41WzZLqiLEL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women shoes'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Women's shoes")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31oxb92GmqL._SR170,170_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men apparel    '); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Men's clothing")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41iPIZIMh2L._SR170,170_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men shoes'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Men's shoes")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Level up your beauty routine")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31aJyAdILmL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Makeup")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup brushes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41MIeNiwdhL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup brushes'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Brushes")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup sponge'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/31wSz8gA5wL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup sponge'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Sponges")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup mirror'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/21xHtP1ZnlL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup mirror'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Mirrors")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('home theater'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Handpicked home theater")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('television'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41Nldn0FGML._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('television'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Televisions")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('speakers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/4198T9z6hjL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('speakers'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Speakers")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('soundbars'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41Z1yvPi2rL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('soundbars'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Soundbars")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('projectors'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41J5MFD8nnL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('projectors'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Projectors")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch(''); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Curate your space")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Candles'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/415fShfBidL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Candles'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("Candles")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('stylish pillows'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41eHYxK1H4L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('stylish pillows'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("Stylish pillows")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('indoor gardening'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41RqiI-5T5L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('indoor gardening'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Indoor gardening")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('storage'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41wRrAnGAJL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('storage'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("Storage organization")}</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem] leading-8 min-h-16'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('apparel'); }}
                                href=''
                                className='tracking-tight'
                            >
                                {t("Look your best this season")}</a>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41u9C4AnoaL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women apparel'); }}
                                    href='' className='block leading-tight min-h-[2.5rem]'>{t("For Her")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41mhTFj8EhL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men apparel'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>
                                    {t("For Him")}
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('teen apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/41VUN4-BMYL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('teen apparel'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("For Teens")}</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kids apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-full aspect-square object-cover'
                                        src="https://m.media-amazon.com/images/I/413w78Z-7PL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kids apparel'); }}
                                    href="" className='block leading-tight min-h-[2.5rem]'>{t("For Kids")}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;