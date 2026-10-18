import { Link } from "react-router-dom";
import {useLanguage} from "../../context/LanguageContext.jsx";

const team = [
    {name: 'Karina', role: 'Frontend · Scrum Manager', link: 'https://github.com/ysantonyance', photo: 'https://avatars.githubusercontent.com/u/149514654?v=4'},
    {name: 'Arsenii', role: 'Backend · ASP.NET Core API', link: 'https://github.com/Arsenii123', photo: 'https://avatars.githubusercontent.com/u/119303043?v=4'},
    {name: 'Tymofii', role: 'Fullstack · Database', link: 'https://github.com/ThisIsEngineerGaming', photo: 'https://avatars.githubusercontent.com/u/115916718?v=4'},
    {name: 'Michael', role: 'Backend · ASP.NET Core API', link: 'https://github.com/IcedW', photo: 'https://avatars.githubusercontent.com/u/117010225?v=4'},
];

function Footer() {
    const {t} = useLanguage();
    return (
        <>
            <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className='bg-[#37475A] text-white text-[14px] flex justify-center hover:bg-[#48576A] cursor-pointer p-3'>
                <button className='cursor-pointer'>
                    {t("Back to top")}
                </button>
            </div>

            <div className='bg-[#232F3E]'>
                <div className='p-6 md:p-10 flex justify-center items-center'>
                    <Link to='/'>
                        <img
                            className='w-[75px] h-[25px] object-contain cursor-pointer'
                            src="/amazon-logo-white.png" alt="amazon-logo"/>
                    </Link>
                </div>
            </div>

            <div className='bg-[#131A22] text-white p-6 md:p-10'>
                <div className='max-w-6xl mx-auto mb-8'>
                    <h3 className='text-center text-[16px] font-bold mb-1'>{t("Meet the team behind Ipay")}</h3>
                    <p className='text-center text-[12px] text-[#999999] mb-6'>
                        {t("Built as a team project with React, ASP.NET Core and Firestore")}
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

                <p className='text-center text-[12px] text-[#999999]'>{t("© 1996-2026, Ipay.com, Inc. or its affiliates")}</p>
            </div>
        </>
    )
}

export default Footer;
