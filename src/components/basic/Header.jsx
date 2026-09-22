import {Link} from "react-router-dom";
import {useSearch} from "../../context/SearchContext.jsx";

function Header() {
    const {search, setSearch} = useSearch();
    return (
        <>

            <div className='bg-[#131921] text-white text-[12px] items-center'>
                <div className='flex flex-row justify-between items-center px-3'>
                    <img className='w-[100px] h-[50px] border border-transparent hover:border-white p-3 cursor-pointer' src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Famazon-logo-black-background-xb9pdemosnjfz9ej.png&f=1&nofb=1&ipt=1172987294c6bf825c90f06155e9a3b53408e1f3dcead65f11f2b4ce5542c5eb" alt="amazon-logo"/>

                    <div className='h-[50px] border border-transparent hover:border-white flex flex-col justify-center cursor-pointer'>
                        <p className='text-[#CCCCCC]'>Deliver to</p>
                        <div>
                            <img src="" alt=""/>
                            <b>Country</b>
                        </div>
                    </div>

                    <input
                        className='w-[1000px] h-[40px] bg-white my-3 rounded-xl text-black px-3'
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

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

                    <div className='h-[50px] border border-transparent hover:border-white px-2 flex flex-col justify-center cursor-pointer'>
                        <p className='text-[#CCCCCC]'>Returns</p>
                        <b>& Orders</b>
                    </div>

                    <div className='h-[50px] border border-transparent hover:border-white px-2 flex items-center cursor-pointer'>
                        <span>0</span>
                        <b>Cart</b>
                    </div>
                </div>
            </div>

            <div className='bg-[#232F3E] text-white text-[14px] px-3'>
                <div className='flex flex-row items-center space-x-3'>
                    <div className='flex flex-row items-center pr-2 border border-transparent hover:border-white cursor-pointer'>
                        <button
                            type="button"
                            aria-label="Toggle navigation"
                            className="p-2 text-white rounded-md focus:outline-none cursor-pointer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                        <b>All</b>
                    </div>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1'
                        to='/amazon-video'
                    >
                        Prime Video
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1'
                        to='/coupons'
                    >
                        Coupons
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1'
                        to='/contact-us'
                    >
                        Customer Service
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1'
                        to='/labordaysale'
                    >
                        Today's Deal
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1'
                        to='/registries'
                    >
                        Registry
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1'
                        to='/gift-cards'
                    >
                        Gift Cards
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1'
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
