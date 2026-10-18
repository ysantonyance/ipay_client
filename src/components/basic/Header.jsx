import {Link, useNavigate} from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import NavMenu from "./NavMenu.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {useCart} from "../../context/CartContext.jsx";
import {useLanguage, languages} from "../../context/LanguageContext.jsx";

function Header() {
    const { language, changeLanguage, t } = useLanguage();
    const { isLoggedIn, userName, logout } = useAuth();
    const navigate = useNavigate();
    const { items } = useCart();
    const cartCount = items.reduce((n,i) => n + i.qty, 0);

    const handleSignOut = async () => {
        await logout();
        navigate('/');
    };

    return (
        <>
            <div className='bg-[#131921] text-white text-[12px]'>
                <div className='flex flex-col sm:flex-row sm:justify-between items-center px-3 py-2 sm:py-0 gap-2 sm:gap-4'>
                    <div className='flex items-center justify-between w-full sm:w-auto gap-2'>
                        <Link to='/'>
                            <img className=' w-[90px] h-[50px] border border-transparent hover:border-white p-2 sm:p-3 cursor-pointer object-contain items-center'
                                 src="/amazon-logo-white.png"
                                 alt="amazon-logo"/>
                        </Link>

                        <div className='flex items-center gap-1 sm:hidden'>
                            <label className='h-[40px] border border-transparent hover:border-white px-2 flex items-center gap-1 cursor-pointer' aria-label='Choose language'>
                                <span aria-hidden='true'>{languages.find(item => item.code === language)?.flag}</span>
                                <select value={language} onChange={event => changeLanguage(event.target.value)} aria-label='Choose language' className='bg-transparent text-white cursor-pointer outline-none w-[100px]'>
                                    {languages.map(item => <option key={item.code} value={item.code} className='text-black'>{item.label}</option>)}
                                </select>
                            </label>
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        to='/profile'
                                        className='text-white px-2 py-1 border border-transparent hover:border-white text-[11px] whitespace-nowrap shrink-0'
                                    >
                                        {t("Profile")}
                                    </Link>
                                    <button
                                        type='button'
                                        onClick={handleSignOut}
                                        className='text-white px-2 py-1 border border-transparent hover:border-white text-[11px] cursor-pointer whitespace-nowrap shrink-0'
                                    >
                                        {t("Sign out")}
                                    </button>
                                </>
                            ) : (
                                <Link to='/login' className='text-white px-2 py-1 border border-transparent hover:border-white text-[11px] whitespace-nowrap shrink-0'>
                                    {t("Sign in ›")}
                                </Link>
                            )}

                            <Link
                                to='/cart'
                                className='h-[40px] border border-transparent hover:border-white px-2 flex items-center cursor-pointer'
                            >
                                <div className='flex flex-col justify-center items-center'>
                                    <span className='text-[#F08804] font-bold leading-none translate-y-1.5'>{cartCount}</span>
                                    <img className='w-[30px] h-[30px]' src="https://img.icons8.com/?size=100&id=ySRi3OLgoOJX&format=png&color=FFFFFF" alt=""/>
                                </div>
                                <b className='ml-1'>{t("Cart")}</b>
                            </Link>
                        </div>
                    </div>

                    <div className='w-full sm:flex-1 max-w-[1000px] my-1 sm:my-3'>
                        <SearchBar />
                    </div>

                    <div className='hidden sm:flex items-center gap-2 shrink-0'>
                        <label className='h-[50px] shrink-0 border border-transparent hover:border-white px-2 flex items-center gap-1 cursor-pointer' aria-label='Choose language'>
                            <span aria-hidden='true'>{languages.find(item => item.code === language)?.flag}</span>
                            <select value={language} onChange={event => changeLanguage(event.target.value)} aria-label='Choose language' className='bg-transparent text-white cursor-pointer outline-none w-[100px]'>
                                {languages.map(item => <option key={item.code} value={item.code} className='text-black'>{item.label}</option>)}
                            </select>
                        </label>

                        {isLoggedIn ? (
                            <>
                                <Link
                                    to='/profile'
                                    className='h-[50px] w-[130px] shrink-0 border border-transparent hover:border-white px-2 flex flex-col justify-center cursor-pointer text-left whitespace-nowrap'>
                                    <p className='truncate'>{t("Hello,")} {userName}</p>
                                    <b className='truncate'>{t("Your profile")}</b>
                                </Link>
                                <button
                                    type='button'
                                    onClick={handleSignOut}
                                    className='h-[50px] w-[90px] shrink-0 border border-transparent hover:border-white px-2 flex flex-col justify-center cursor-pointer text-left whitespace-nowrap'>
                                    <p className='text-[#CCCCCC] truncate'>{t("Not you?")}</p>
                                    <b className='truncate'>{t("Sign out")}</b>
                                </button>
                            </>
                        ) : (
                            <Link
                                to='/login'
                                className='h-[50px] w-[130px] shrink-0 border border-transparent hover:border-white px-2 flex flex-col justify-center cursor-pointer whitespace-nowrap'>
                                <p className='truncate'>{t("Hello, sign in")}</p>
                                <b className='truncate'>{t("Accounts & Lists")}</b>
                            </Link>
                        )}

                        <Link
                            to='/orders'
                            className='hidden lg:flex h-[50px] w-[96px] shrink-0 border border-transparent hover:border-white px-2 flex-col justify-center cursor-pointer whitespace-nowrap'>
                            <p className='text-[#CCCCCC] truncate'>{t("Returns")}</p>
                            <b className='truncate'>{t("& Orders")}</b>
                        </Link>

                        <Link
                            to='/cart'
                            className='h-[50px] w-[84px] shrink-0 border border-transparent hover:border-white px-2 flex items-center cursor-pointer whitespace-nowrap'
                        >
                            <div className='flex flex-col justify-center items-center'>
                                <span className='text-[#F08804] font-bold leading-none translate-y-1.5'>{cartCount}</span>
                                <img className='w-[30px] h-[30px]' src="https://img.icons8.com/?size=100&id=ySRi3OLgoOJX&format=png&color=FFFFFF" alt=""/>
                            </div>

                            <b className='ml-1 truncate min-w-0'>{t("Cart")}</b>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='bg-[#232F3E] text-white text-[14px] px-3 overflow-x-auto whitespace-nowrap scrollbar-none'>
                <div className='flex flex-row items-center space-x-3 py-1 sm:py-0'>
                    <NavMenu />

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0 w-[92px] text-center whitespace-nowrap truncate'
                        to='/products'
                    >
                        {t("Products")}
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0 w-[92px] text-center whitespace-nowrap truncate'
                        to='/movies'
                    >
                        {t("Pay Video")}
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0 w-[92px] text-center whitespace-nowrap truncate'
                        to='/orders'
                    >
                        {t("Orders")}
                    </Link>

                    <Link
                        className='border border-transparent hover:border-white cursor-pointer py-2 px-1 shrink-0 w-[92px] text-center whitespace-nowrap truncate'
                        to='/sell'
                    >
                        {t("Sell")}
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Header;