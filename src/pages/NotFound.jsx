import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className='min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-white'>
            <p className='text-[64px] font-bold text-[#131921] leading-none'>404</p>
            <h1 className='text-[20px] font-bold text-[#0F1111] mt-2'>We couldn&apos;t find that page</h1>
            <p className='text-[14px] text-[#565959] mt-2 max-w-[420px]'>
                The page you&apos;re looking for doesn&apos;t exist or may have been moved. Check the address, or head back to the shop.
            </p>
            <Link
                to='/'
                className='mt-6 bg-[#FFD814] hover:bg-[#F7CA00] text-[14px] text-[#0F1111] rounded-full px-6 py-2'
            >
                Back to home
            </Link>
        </div>
    );
}

export default NotFound;
