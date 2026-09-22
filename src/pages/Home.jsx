import {useState} from "react";
import Carousel from "../components/shop/Carousel.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useSearch} from "../context/SearchContext.jsx";
import TodaysDeal from "./TodaysDeal.jsx";

function Home() {
    const {setSearch} = useSearch();
    return (
        <>
            <div className='px-15 bg-[#E3E6E6]'>
                <div className='bg-white px-4 py-2'>
                    <Carousel visibleCount={5}>

                        <div className='relative'>
                            <a
                                onClick={(e) => { e.preventDefault(); console.log('clicked'); setSearch('kitchen appliances'); }}
                                href="">
                                <img
                                    className='rounded-2xl min-w-[302px] h-[484px] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/51l7ZOsRo7L._AC_AIweblab1431263,T1_FMavif_SF1282.5,2052_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[30px] absolute top-2 left-0 px-3 leading-9 pointer-events-none'>Shop kitchen must-haves</h1>
                        </div>

                        <div className='relative'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                href="">
                                <img
                                    className='rounded-2xl min-w-[302px] h-[484px] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/61Ld77LHXQL._AC_AIweblab1431263,T1_FMavif_SF1282.5,1981.5_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[30px] absolute top-2 left-0 px-3 leading-9 pointer-events-none'>Shop all things beauty</h1>
                        </div>

                        <div className='relative'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('fashion clothing'); }}
                                href="">
                                <img
                                    className='rounded-2xl min-w-[302px] h-[484px] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/61R7G24e7dL._AC_AIweblab1431263,T1_FMavif_SF1282.5,1981.5_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[30px] absolute top-2 left-0 px-3 leading-9 pointer-events-none'>Start looking sharp</h1>
                        </div>
                        <div className='relative'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('toys'); }}
                                href="">
                                <img
                                    className='rounded-2xl min-w-[302px] h-[484px] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/61upHi2gzaL._AC_AIweblab1431263,T1_FMavif_SF1282.5,2052_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[30px] absolute top-2 left-0 px-3 leading-9 pointer-events-none'>Toys for little ones</h1>
                        </div>

                        <div className='relative'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('pc'); }}
                                href="">
                                <img
                                    className='rounded-2xl min-w-[302px] h-[484px] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/714RPvHc4LL._AC_AIweblab1431263,T1_FMavif_SF1282.5,1981.5_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[30px] absolute top-2 left-0 px-3 leading-9 pointer-events-none'>Level up your PC here</h1>
                        </div>

                        <div className='relative'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('good books'); }}
                                href="">
                                <img
                                    className='rounded-2xl min-w-[302px] h-[484px] object-cover shadow-xl'
                                    src="https://m.media-amazon.com/images/I/613fnGHLTYL._AC_AIweblab1431263,T1_FMavif_SF1282.5,1981.5_QL54_.jpg?aicid=homepage-single-creative-card" alt=""/>
                            </a>
                            <h1 className='font-bold text-[30px] absolute top-2 left-0 px-3 leading-9 pointer-events-none'>Discover books you can't put down</h1>
                        </div>
                    </Carousel>
                </div>

                <div className='bg-white px-4 py-2 grid grid-cols-4 space-x-2 space-y-6'>

                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Best seller in electronics'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Plug in with our electronics
                            </a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('headphones'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/417NhPd56zL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('headphones'); }}
                                    href=''>Headphones</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('electronic tablets'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41dMYqsSuGL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('electronic tablets'); }}
                                    href="">
                                    Tablets
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('gaming equipment'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41gk0-eoy4L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('gaming equipment'); }}
                                    href="">Gaming</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('speakers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41uuEMle6TL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('speakers'); }}
                                    href="">Speakers</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('computers and accessories'); }}
                                href=''
                                className='tracking-tight'>
                                Score the top PCs & Accessories
                            </a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('desktop computers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31aw+nYkUmL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('desktop computers'); }}
                                    href=''>Desktops</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('laptops'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31hqkoNqvTL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('laptops'); }}
                                    href="">
                                    Laptops
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('external hard drives'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/217Arq+nObL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('external hard drives'); }}
                                    href="">Hard Drives</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('computer accessories'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/312z6VjcSmL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('computer accessories'); }}
                                    href="">PC Accessories</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Best sellers in fitness'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Gear up to get fit</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness clothing'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41CutKsrzNL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness clothing'); }}
                                    href=''>Clothing</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness trackers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41RKKF01YxL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness trackers'); }}
                                    href="">
                                    Trackers
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness equipment'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41MjMjLh9BL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness equipment'); }}
                                    href="">Equipment</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41idnUIEIZL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fitness'); }}
                                    href="">Deals</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Trending Fashion'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Apparel under $25</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women Clothing'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41DNYos4L1L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women Clothing'); }}
                                    href=''>Women</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men Clothing'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31-zpA1B2zL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men Clothing'); }}
                                    href="">
                                    Men
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Girls Fashion'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41J+KoaCycL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Girls Fashion'); }}
                                    href="">Girl</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Boys Fashion'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31YRD7rRprL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Boys Fashion'); }}
                                    href="">Boys</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('home and kitchen'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Fantastic Finds for Home</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41opB3I6bHL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen'); }}
                                    href=''>Kitchen</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31zR9dINh6L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="">
                                    Home Decor
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen and dining'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41bvMGlDk4L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen and dining'); }}
                                    href="">Dining</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('smart home'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/314AasupNAL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('smart home'); }}
                                    href="">Smart Home</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('women beauty accessories'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Shine brighter with your fashion faves</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('jewelry'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31iAfM94Q1L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('jewelry'); }}
                                    href=''>Jewelry</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('handbags'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41RsxdVi8QL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('handbags'); }}
                                    href="">
                                    Handbags
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41wBvSYrvWL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women footwear'); }}
                                    href="">Footwear</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41Tsj3W9JHL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                    href="">Beauty</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('beauty and personal care'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Unveil your radiance</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hair care'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41+i4d+1YXL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hair care'); }}
                                    href=''>Hair Care</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fragrances'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/4115ssxY8RL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fragrances'); }}
                                    href="">
                                    Fragrances
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Make up'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/51F8Stay1iL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Make up'); }}
                                    href="">Make-up</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('skin care'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41hBTWbTOvL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('skin care'); }}
                                    href="">Skin Care</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Best sellers in computers'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Level up your PC here</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('laptops'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41SeoNqumwL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('laptops'); }}
                                    href=''>Laptops</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('desktop PCs'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41hls0IW3XL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('desktop PCs'); }}
                                    href="">
                                    PCs
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hard drives'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41DUMIpCRRL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('hard drives'); }}
                                    href="">Hard Drives</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('computer monitors'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/410RcCBLHIL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('computer monitors'); }}
                                    href="">Monitors</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Best sellers in Shoes'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Fashion trends in Shoes</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women Shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41yqgtOqxPL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women Shoes'); }}
                                    href=''>Women's</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men Shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41wfXsKdqEL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men Shoes'); }}
                                    href="">
                                    Men's
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Kid Shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41-zOL2WhXL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Kid Shoes'); }}
                                    href="">Kid's</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/4103VPrZvIL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Shoes'); }}
                                    href="">All Shoes</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('home and kitchen'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Home harmony</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen essentials'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41dEpCmTRFL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen essentials'); }}
                                    href=''>Kitchen essentials</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home sofa living room'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41cXdDKGU6L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home sofa living room'); }}
                                    href="">
                                    Home comfort
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41EvbQ64I2L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="">Decorate with elegance</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Home decor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41hJC3LJ2aL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Home decor'); }}
                                    href="">Light it Right</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Shoes'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Shoes under $50</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31U967D6S3L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women footwear'); }}
                                    href=''>Women's</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31Wut-0nWqL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men footwear'); }}
                                    href="">
                                    Men's
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('girls footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31JVbBrAgDL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('girls footwear'); }}
                                    href="">Girl's</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('boys footwear'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41DEKPASTNL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('boys footwear'); }}
                                    href="">Boy's</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Best sellers in pets'); }}
                                href=''
                                className='tracking-tight'
                            >
                                What you need for furry friends</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('pet dog supplies'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41eLkFePVUL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('pet dog supplies'); }}
                                    href=''>Dogs</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('pet cats supplies'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41OERaEZuaL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('pet cats supplies'); }}
                                    href="">
                                    Cats
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('small pet supplies'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/410BX1Aby0L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('small pet supplies'); }}
                                    href="">Small pets</a>
                            </div>

                            <div>
                                <Link to='/labordaysale'
                                    href=""
                                >
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/4172LJHm7gL._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/labordaysale'
                                    href="">Deals</Link>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('Video games & accessories'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Video games & accessories</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('xbox controller'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/21HndQWZivL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('xbox controller'); }}
                                    href=''>Xbox controllers</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Nintendo'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31L8hlUOKfL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Nintendo'); }}
                                    href="">
                                    Nintendo
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('vr headset'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/21+Ccbv5f5L._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('vr headset'); }}
                                    href="">VR headsets</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('PS5 accessories'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/21DOO2U+rQL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('PS5 accessories'); }}
                                    href="">PS5 accessories</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('toys and games'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Have more fun with the family</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('outdoor play toys'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31uBBG+KvtL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('outdoor play toys'); }}
                                    href=''>Outdoor Play Sets</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('learning toys'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31QJz8+ereL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('learning toys'); }}
                                    href="">
                                    Learning Toys
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('action figures'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/310Ke5y4pBL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('action figures'); }}
                                    href="">Action Figures</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Pretend Play Toys'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/416Kr1IKmgL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Pretend Play Toys'); }}
                                    href="">Pretend Play Toys</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('home bedding'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Finds in Home</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Bedsheets'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/319RC1dCFNL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Bedsheets'); }}
                                    href=''>Bedsheets</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Pillows'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41+4Tvu3E0L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Pillows'); }}
                                    href="">
                                    Pillows
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('duvet covers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41u90AplYLL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('duvet covers'); }}
                                    href="">Duvet Covers</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Throws'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41iRkfbZX6L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Throws'); }}
                                    href="">Throws</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <Link to='/labordaysale'
                                href=''
                                className='tracking-tight'
                            >
                                Deals on top categories</Link>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <Link to='/labordaysale'
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41GibUzBeXL._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/labordaysale'
                                    href=''>Books</Link>
                            </div>

                            <div>
                                <Link to='/labordaysale'
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41YDpSUai3L._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/labordaysale'
                                    href="">
                                    Fashion
                                </Link>
                            </div>

                            <div>
                                <Link to='/labordaysale'
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41qG08jk3ML._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/labordaysale'
                                    href="">PC</Link>
                            </div>

                            <div>
                                <Link to='/labordaysale'
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41QFxGoW7IL._SR210,210_.jpg" alt=""/>
                                </Link>
                                <Link to='/labordaysale'
                                    href="">Beauty</Link>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('home'); }}
                                href=''
                                className='tracking-tight'
                            >
                                New home arrivals under $50</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen and dining'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41I85MytToL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kitchen and dining'); }}
                                    href=''>Kitchen & dining</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home improvement'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41mb6AUCJSL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home improvement'); }}
                                    href="">
                                    Home improvement
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41J1-iazq6L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home decor '); }}
                                    href="">Décor</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('bedding and bath'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/417HmRJ2WJL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('bedding and bath'); }}
                                    href="">Bedding & bath</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <Link to='/labordaysale'
                                href=''
                                className='tracking-tight'
                            >
                                Discover the latest arrivals</Link>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('electronics'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31zLfxfdJ1L._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('electronics'); }}
                                    href=''>Electronics</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31cU8R+ZNFL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('home'); }}
                                    href="">
                                    Home
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/21vZBVKPsDL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('beauty'); }}
                                    href="">Beauty</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fashion'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/21X3TF86YFL._SR100,100_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fashion'); }}
                                    href="">Fashion</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('wellness fashion accessories'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Accessorize your life</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fashion accessories'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/413lM0C0PEL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('fashion accessories'); }}
                                    href=''>Fashion accessories</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men accessories'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/410LHEUGZ5L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men accessories'); }}
                                    href="">
                                    Men's accessories
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('health and beauty'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41IIOwmruhL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('health and beauty'); }}
                                    href="">Health and beauty</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Sports'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31KVFrr1USL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Sports'); }}
                                    href="">Sports</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('apparel'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Step into style</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41Ty8UTzIFL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women apparel'); }}
                                    href=''>Women's clothing</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41WzZLqiLEL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Women shoes'); }}
                                    href="">
                                    Women's shoes
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31oxb92GmqL._SR170,170_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men apparel    '); }}
                                    href="">Men's clothing</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men shoes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41iPIZIMh2L._SR170,170_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Men shoes'); }}
                                    href="">Men's shoes</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('beauty and personal care'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Level up your beauty routine</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31aJyAdILmL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup'); }}
                                    href=''>Makeup</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup brushes'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41MIeNiwdhL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup brushes'); }}
                                    href="">
                                    Brushes
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup sponge'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/31wSz8gA5wL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup sponge'); }}
                                    href="">Sponges</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup mirror'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/21xHtP1ZnlL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('makeup mirror'); }}
                                    href="">Mirrors</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('home theater'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Handpicked home theater</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('television'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41Nldn0FGML._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('television'); }}
                                    href=''>Televisions</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('speakers'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/4198T9z6hjL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('speakers'); }}
                                    href="">
                                    Speakers
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('soundbars'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41Z1yvPi2rL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('soundbars'); }}
                                    href="">Soundbars</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('projectors'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41J5MFD8nnL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('projectors'); }}
                                    href="">Projectors</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch(''); }}
                                href=''
                                className='tracking-tight'
                            >
                                Curate your space</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Candles'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/415fShfBidL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Candles'); }}
                                    href=''>Candles</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('stylish pillows'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41eHYxK1H4L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('stylish pillows'); }}
                                    href="">
                                    Stylish pillows
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('indoor gardening'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41RqiI-5T5L._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('indoor gardening'); }}
                                    href="">Indoor gardening</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Storage organization'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41wRrAnGAJL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('Storage organization'); }}
                                    href="">Storage organization</a>
                            </div>
                        </div>
                    </div>
                    <div className='relative rounded-xl border border-[#D5D9D9] p-3 space-y-2'>
                        <div className='flex justify-between font-bold text-[1.5rem]'>
                            <a
                                onClick={(e) => { e.preventDefault(); setSearch('apparel'); }}
                                href=''
                                className='tracking-tight'
                            >
                                Look your best this season</a>
                            <span>›</span>
                        </div>
                        <div className='grid grid-cols-2 space-x-3 space-y-10'>
                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41u9C4AnoaL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('women apparel'); }}
                                    href=''>For Her</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41mhTFj8EhL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('men apparel'); }}
                                    href="">
                                    For Him
                                </a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('teen apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/41VUN4-BMYL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('teen apparel'); }}
                                    href="">For Teens</a>
                            </div>

                            <div>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kids apparel'); }}
                                    href="">
                                    <img
                                        className='rounded-xl w-[176px] h-[176px] object-cover'
                                        src="https://m.media-amazon.com/images/I/413w78Z-7PL._SR210,210_.jpg" alt=""/>
                                </a>
                                <a
                                    onClick={(e) => { e.preventDefault(); setSearch('kids apparel'); }}
                                    href="">For Kids</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;