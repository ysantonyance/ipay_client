import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

function AdminLogin() {
    const { unlock } = useAdminAuth();
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!unlock(passcode)) {
            setError('Incorrect passcode.');
        }
    };

    return (
        <div className='min-h-screen bg-[#EAEDED] flex items-center justify-center p-4'>
            <div className='w-full max-w-[360px] bg-white border border-[#D5D9D9] rounded-xl p-6 shadow-sm'>
                <h1 className='text-[22px] text-[#0F1111] mb-1'>Admin sign in</h1>
                <p className='text-[13px] text-[#565959] mb-5'>
                    Temporary passcode gate — there's no admin account system yet.
                </p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <label className='flex flex-col gap-1'>
                        <span className='text-[13px] font-bold text-[#0F1111]'>Passcode</span>
                        <input
                            type='password'
                            autoFocus
                            value={passcode}
                            onChange={(e) => {
                                setPasscode(e.target.value);
                                setError('');
                            }}
                            className={`w-full p-2 text-[14px] border rounded-lg outline-none focus:ring-2 focus:ring-[#888C8D] ${
                                error ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                    </label>

                    {error && <p className='text-[#d32f2f] text-[12px]'>{error}</p>}

                    <button
                        type='submit'
                        className='w-full py-2 mt-1 bg-[#FFD814] hover:bg-[#F7CA00] rounded-full text-[14px] font-medium cursor-pointer'
                    >
                        Enter
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;
