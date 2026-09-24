import {Link} from "react-router-dom";
import {useSearch} from "../../context/SearchContext.jsx";
import {useState} from "react";

function Header() {
    const {search, setSearch} = useSearch();

    return (
        <>
            <div className='bg-[#131921] text-white text-[12px]'>
                <div className='flex flex-col sm:flex-row sm:justify-between items-center px-3 py-2 sm:py-0 gap-2 sm:gap-4'>
                    {/* Top Row on Mobile: Logo + Mobile Actions */}
                    <div className='flex items-center justify-between w-full sm:w-auto gap-2'>
                        <img className='w-[90px] sm:w-[100px] h-[40px] sm:h-[50px] border border-transparent hover:border-white p-2 sm:p-3 cursor-pointer object-contain' src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Famazon-logo-black-background-xb9pdemosnjfz9ej.png&f=1&nofb=1&ipt=1172987294c6bf825c90f06155e9a3b53408e1f3dcead65f11f2b4ce5542c5eb" alt="amazon-logo"/>

                        {/* Deliver to - Hidden on small mobile */}
                        <div className='hidden md:flex h-[50px] border border-transparent hover:border-white flex-col justify-center cursor-pointer px-2 shrink-0'>
                            <p className='text-[#CCCCCC]'>Deliver to</p>
                            <div>
                                <img src="" alt=""/>
                                <b>Country</b>
                            </div>
                        </div>

                        {/* Mobile view quick action icons (Language, SignIn + Cart) */}
                        <div className='flex items-center gap-1 sm:hidden'>
                            <div className='h-[40px] border border-transparent hover:border-white px-2 flex items-center cursor-pointer'>
                                <img src="" alt=""/>
                                EN
                            </div>
                            <Link to='/register' className='text-white px-2 py-1 border border-transparent hover:border-white text-[11px]'>
                                Sign in ›
                            </Link>
                            <div className='h-[40px] border border-transparent hover:border-white px-2 flex items-center cursor-pointer'>
                                <span>0</span>
                                <b className='ml-1'>Cart</b>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar - Full Width on Mobile, Flexible on Desktop */}
                    <div className='w-full sm:flex-1 max-w-[1000px] my-1 sm:my-3'>
                        <input
                            className='w-full h-[40px] bg-white rounded-xl text-black px-3 text-[14px] outline-none'
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Desktop Right Actions */}
                    <div className='hidden sm:flex items-center gap-2 shrink-0'>
                        <div className='h-[50px] border border-transparent hover:border-white px-2 flex items-center cursor-pointer'>
                            <img src="" alt=""/>
                            EN
                        </div>

                        <Link
                            to='/register'
                            className='h-[50px] border border-transparent hover:border-white px-2 flex flex-col justify-center cursor-pointer'>
                            <p>Hello, sign in</p>
                            <b>Accounts & Lists</b>
                        </Link>

                        <div className='hidden lg:flex h-[50px] border border-transparent hover:border-white px-2 flex-col justify-center cursor-pointer'>
                            <p className='text-[#CCCCCC]'>Returns</p>
                            <b>& Orders</b>
                        </div>

                        <div className='h-[50px] border border-transparent hover:border-white px-2 flex items-center cursor-pointer'>
                            <span>0</span>
                            <b className='ml-1'>Cart</b>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-Navigation Bar - Horizontally Scrollable on Mobile */}
            <div className='bg-[#232F3E] text-white text-[14px] px-3 overflow-x-auto whitespace-nowrap scrollbar-none'>
                <div className='flex flex-row items-center space-x-3 py-1 sm:py-0'>
                    <div className='flex flex-row items-center pr-2 border border-transparent hover:border-white cursor-pointer shrink-0'>
                        <button
                            type="button"
                            aria-label="Toggle navigation"
                            className="p-1.5 text-white rounded-md focus:outline-none cursor-pointer"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <b>All</b>
                    </div>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0'
                        to='/products'
                    >
                        Products
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0'
                        to='/amazon-video'
                    >
                        Prime Video
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0'
                        to='/coupons'
                    >
                        Coupons
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0'
                        to='/contact-us'
                    >
                        Customer Service
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0'
                        to='/labordaysale'
                    >
                        Today's Deal
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0'
                        to='/registries'
                    >
                        Registry
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0'
                        to='/gift-cards'
                    >
                        Gift Cards
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0'
                        to='/sell'
                    >
                        Sell
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Header;