import {Link} from "react-router-dom";

function Footer() {
    return (
        <>
            <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className='bg-[#37475A] text-white text-[14px] flex justify-center hover:bg-[#48576A] cursor-pointer p-3'>
                <button
                    className='cursor-pointer'>
                    Back to top
                </button>
            </div>

            <div className='bg-[#232F3E]'>
                <div className='text-white flex justify-center space-x-30 p-10'>
                    <div>
                        <b className='block pb-2'>Get to Know Us</b>
                        <div className='text-[#DDDDDD] flex flex-col space-y-2 text-[14px]'>
                            <a className='hover:underline' href="">Careers</a>
                            <a className='hover:underline' href="">Blog</a>
                            <a className='hover:underline' href="">About Amazon</a>
                            <a className='hover:underline' href="">Investor Relations</a>
                            <a className='hover:underline' href="">Amazon Devices</a>
                            <a className='hover:underline' href="">Amazon Science</a>
                        </div>
                    </div>
                    <div>
                        <b className='block pb-2'>Make Money with Us</b>
                        <div className='text-[#DDDDDD] flex flex-col space-y-2 text-[14px]'>
                            <a className='hover:underline' href="">Sell products on Amazon</a>
                            <a className='hover:underline' href="">Sell on Amazon Business</a>
                            <a className='hover:underline' href="">Sell apps on Amazon</a>
                            <a className='hover:underline' href="">Become an Affiliate</a>
                            <a className='hover:underline' href="">Advertise Your Products</a>
                            <a className='hover:underline' href="">Self-Publish with Us</a>
                            <a className='hover:underline' href="">Host an Amazon Hub</a>
                            <a className='hover:underline' href="">› See More Make Money <br/> with Us</a>
                        </div>
                    </div>
                    <div>
                        <b className='block pb-2'>Amazon Payment Products</b>
                        <div className='text-[#DDDDDD] flex flex-col space-y-2 text-[14px]'>
                            <a className='hover:underline' href="">Amazon Business Card</a>
                            <a className='hover:underline' href="">Shop with Points</a>
                            <a className='hover:underline' href="">Reload Your Balance</a>
                            <a className='hover:underline' href="">Amazon Currency Converter</a>
                        </div>
                    </div>
                    <div>
                        <b className='block pb-2'>Let Us Help You</b>
                        <div className='text-[#DDDDDD] flex flex-col space-y-2 text-[14px]'>
                            <a className='hover:underline' href="">Your Account</a>
                            <a className='hover:underline' href="">Your Orders</a>
                            <a className='hover:underline' href="">Shipping Rates & <br/> Policies</a>
                            <a className='hover:underline' href="">Returns & <br/> Replacements</a>
                            <a className='hover:underline' href="">Manage Your <br/> Content and Devices</a>
                            <a className='hover:underline' href="">Help</a>
                        </div>
                    </div>
                </div>

                <hr className='border-[#3A4553] border'/>

                <div className='p-10 flex justify-center items-center space-x-30'>
                    <img
                        className='w-[75px] h-[25px]'
                        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapers.com%2Fimages%2Fhd%2Famazon-logo-black-background-xb9pdemosnjfz9ej.png&f=1&nofb=1&ipt=1172987294c6bf825c90f06155e9a3b53408e1f3dcead65f11f2b4ce5542c5eb" alt="amazon-logo"/>

                    <div className='text-white text-[14px] flex justify-between space-x-2'>
                        <Link
                            className='block border border-[#848688] rounded p-2 hover:border-[#8D9098] cursor-pointer'
                            to='/customer-preference'>
                            English
                        </Link>
                        <Link
                            className='block border border-[#848688] rounded p-2 hover:border-[#8D9098] cursor-pointer'
                            to='/customer-preference'>
                            USD - U.S. Dollar
                        </Link>
                        <Link
                            className='block border border-[#848688] rounded p-2 hover:border-[#8D9098] cursor-pointer'
                            to='/customer-preference'>
                            United States
                        </Link>
                    </div>
                </div>
            </div>

            <div className='bg-[#131A22] text-white p-10'>
                <div className='text-[12px] mb-5'>
                    <div className='flex justify-center space-x-5 space-y-3'>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Amazon Music</p>
                            <p className='text-[#999999]'>
                                Stream millions <br/>
                                of songs
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Amazon Ads</p>
                            <p className='text-[#999999]'>
                                Reach customers <br/>
                                wherever they <br/>
                                spend their time
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>6pm</p>
                            <p className='text-[#999999]'>
                                Score deals <br/>
                                on fashion brands
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>AbeBooks</p>
                            <p className='text-[#999999]'>
                                Books, art <br/>
                                & collectibles
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>ACX</p>
                            <p className='text-[#999999]'>
                                Audiobook <br/>
                                Publishing <br/>
                                Made Easy
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Sell on Amazon</p>
                            <p className='text-[#999999]'>
                                Start a Selling <br/>
                                Account
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Veeqo</p>
                            <p className='text-[#999999]'>
                                Shipping Software <br/>
                                Inventory <br/>
                                Management
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-center space-x-5 space-y-3'>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Amazon Business</p>
                            <p className='text-[#999999]'>
                                Everything For <br/>
                                Your Business
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>AmazonGlobal</p>
                            <p className='text-[#999999]'>
                                Ship Orders <br/>
                                Internationally
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Amazon Web <br/> Services</p>
                            <p className='text-[#999999]'>
                                Scalable Cloud <br/>
                                Computing <br/>
                                Services
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Audible</p>
                            <p className='text-[#999999]'>
                                Listen to Books & <br/>
                                Original <br/>
                                Audio <br/>
                                Performances
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Box Office Mojo</p>
                            <p className='text-[#999999]'>
                                Find Movie <br/>
                                Box Office Data
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Goodreads</p>
                            <p className='text-[#999999]'>
                                Book reviews <br/>
                                & <br/>
                                recommendations
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>IMDb</p>
                            <p className='text-[#999999]'>
                                Movies, TV <br/>
                                & Celebrities
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-center space-x-5 space-y-3'>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>IMDbPro</p>
                            <p className='text-[#999999]'>
                                Get Info <br/>
                                Entertainment <br/>
                                Professionals Need
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Kindle Direct <br/> Publishing</p>
                            <p className='text-[#999999]'>
                                Indie Digital & <br/>
                                Print Publishing <br/>
                                Made Easy
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Prime Video Direct</p>
                            <p className='text-[#999999]'>
                                Video Distribution <br/>
                                Made Easy
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Shopbop</p>
                            <p className='text-[#999999]'>
                                Designer
                                Fashion Brands
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Woot!</p>
                            <p className='text-[#999999]'>
                                Deals and
                                Shenanigans
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Zappos</p>
                            <p className='text-[#999999]'>
                                Shoes &
                                Clothing
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Ring</p>
                            <p className='text-[#999999]'>
                                Smart Home
                                Security Systems
                            </p>
                        </div>
                    </div>
                    <div className='flex justify-center space-x-5 space-y-3'>
                        <div className='hover:underline cursor-pointer w-[120px]'></div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>eero WiFi</p>
                            <p className='text-[#999999]'>
                                Stream 4K Video <br/>
                                in Every Room
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Blink</p>
                            <p className='text-[#999999]'>
                                Smart Security <br/>
                                for Every Home
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>Neighbors App</p>
                            <p className='text-[#999999]'>
                                Real-Time Crime <br/>
                                & Safety Alerts
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'>
                            <p>PillPack</p>
                            <p className='text-[#999999]'>
                                Pharmacy <br/>
                                Simplified
                            </p>
                        </div>
                        <div className='hover:underline cursor-pointer w-[120px]'></div>
                        <div className='hover:underline cursor-pointer w-[120px]'></div>
                    </div>
                </div>

                <div className='text-[12px]'>
                    <div className='flex flex-wrap items-center justify-center space-x-3'>
                        <a className='hover:underline' href="">Conditions of Use</a>
                        <a className='hover:underline' href="">Privacy Notice</a>
                        <a className='hover:underline' href="">Consumer Health Data Privacy Disclosure</a>
                        <a className='hover:underline' href="">Your Ads Privacy Choices</a>
                    </div>
                    <p className='flex flex-wrap items center justify-center'>© 1996-2026, Amazon.com, Inc. or its affiliates</p>
                </div>
            </div>
        </>
    )
}

export default Footer;