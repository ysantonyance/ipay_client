import { Link } from "react-router-dom";

const team = [
    {name: 'Karina', role: 'Frontend · Scrum Manager', link: 'https://github.com/ysantonyance', photo: 'https://avatars.githubusercontent.com/u/149514654?v=4'},
    {name: 'Arsenii', role: 'Backend · ASP.NET Core API', link: 'https://github.com/Arsenii123', photo: 'https://avatars.githubusercontent.com/u/119303043?v=4'},
    {name: 'Tymofii', role: 'Frontend · Backend · Database', link: 'https://github.com/ThisIsEngineerGaming', photo: 'https://avatars.githubusercontent.com/u/115916718?v=4'},
    {name: 'Michael', role: 'Backend · ASP.NET Core API', link: 'https://github.com/IcedW', photo: 'https://avatars.githubusercontent.com/u/117010225?v=4'},
];

function Footer() {
    return (
        <>
            <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className='bg-[#37475A] text-white text-[14px] flex justify-center hover:bg-[#48576A] cursor-pointer p-3'>
                <button className='cursor-pointer'>
                    Back to top
                </button>
            </div>

            <div className='bg-[#232F3E]'>
                <div className='text-white flex flex-col md:flex-row justify-center items-start p-6 md:p-10 gap-8 md:gap-20'>
                    <div>
                        <b className='block pb-2'>Get to Know Us</b>
                        <div className='text-[#DDDDDD] flex flex-col space-y-2 text-[14px]'>
                            <a className='hover:underline' href="">Careers</a>
                            <a className='hover:underline' href="">Blog</a>
                            <a className='hover:underline' href="">About Ipay</a>
                            <a className='hover:underline' href="">Investor Relations</a>
                            <a className='hover:underline' href="">Ipay Devices</a>
                            <a className='hover:underline' href="">Ipay Science</a>
                        </div>
                    </div>

                    <div>
                        <b className='block pb-2'>Make Money with Us</b>
                        <div className='text-[#DDDDDD] flex flex-col space-y-2 text-[14px]'>
                            <a className='hover:underline' href="">Sell products on Ipay</a>
                            <a className='hover:underline' href="">Sell on Ipay Business</a>
                            <a className='hover:underline' href="">Sell apps on Ipay</a>
                            <a className='hover:underline' href="">Become an Affiliate</a>
                            <a className='hover:underline' href="">Advertise Your Products</a>
                            <a className='hover:underline' href="">Self-Publish with Us</a>
                            <a className='hover:underline' href="">Host an Ipay Hub</a>
                            <a className='hover:underline' href="">› See More Make Money <br className='hidden md:inline'/> with Us</a>
                        </div>
                    </div>

                    <div>
                        <b className='block pb-2'>Ipay Payment Products</b>
                        <div className='text-[#DDDDDD] flex flex-col space-y-2 text-[14px]'>
                            <a className='hover:underline' href="">Ipay Business Card</a>
                            <a className='hover:underline' href="">Shop with Points</a>
                            <a className='hover:underline' href="">Reload Your Balance</a>
                            <a className='hover:underline' href="">Ipay Currency Converter</a>
                        </div>
                    </div>

                    <div>
                        <b className='block pb-2'>Let Us Help You</b>
                        <div className='text-[#DDDDDD] flex flex-col space-y-2 text-[14px]'>
                            <a className='hover:underline' href="">Your Account</a>
                            <a className='hover:underline' href="">Your Orders</a>
                            <a className='hover:underline' href="">Shipping Rates & <br className='hidden md:inline'/> Policies</a>
                            <a className='hover:underline' href="">Returns & <br className='hidden md:inline'/> Replacements</a>
                            <a className='hover:underline' href="">Manage Your <br className='hidden md:inline'/> Content and Devices</a>
                            <a className='hover:underline' href="">Help</a>
                        </div>
                    </div>
                </div>

                <hr className='border-[#3A4553] border'/>

                <div className='p-6 md:p-10 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-20'>
                    <Link to='/'>
                        <img
                            className='w-[75px] h-[25px] object-contain cursor-pointer'
                            src="/amazon-logo-white.png" alt="amazon-logo"/>
                    </Link>

                    <div className='text-white text-[14px] flex flex-wrap justify-center gap-2'>
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

            <div className='bg-[#131A22] text-white p-6 md:p-10'>
                <div className='max-w-6xl mx-auto mb-8'>
                    <h3 className='text-center text-[16px] font-bold mb-1'>Meet the team behind Ipay</h3>
                    <p className='text-center text-[12px] text-[#999999] mb-6'>
                        Built as a team project with React, ASP.NET Core and Firestore
                    </p>

                    <div className='flex flex-wrap justify-center gap-x-10 gap-y-6'>
                        {team.map(m => (
                            <a
                                key={m.name}
                                href={m.link}
                                target='_blank'
                                rel='noreferrer'
                                className='group w-[150px] text-center text-[12px]'
                            >
                                <img src={m.photo} alt={m.name} className='w-[56px] h-[56px] mx-auto mb-2 rounded-full object-cover' />
                                <p className='group-hover:underline'>{m.name}</p>
                                <p className='text-[#999999]'>{m.role}</p>
                            </a>
                        ))}
                    </div>
                </div>

                <div className='text-[12px] space-y-2'>
                    <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center'>
                        <a className='hover:underline' href="">Conditions of Use</a>
                        <a className='hover:underline' href="">Privacy Notice</a>
                        <a className='hover:underline' href="">Consumer Health Data Privacy Disclosure</a>
                        <a className='hover:underline' href="">Your Ads Privacy Choices</a>
                    </div>
                    <p className='text-center text-[#999999]'>© 1996-2026, Ipay.com, Inc. or its affiliates</p>
                </div>
            </div>
        </>
    )
}

export default Footer;