import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// VISUAL ONLY for now: none of the forms below talk to the backend yet.
// Planned later: each change goes through extra checks (current password +
// a verification code sent to the email / phone) before it is applied.

const inputClass =
    'w-full p-2 text-[13px] border border-[#a6a6a6] rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D]';

function Field({ id, label, type = 'text', placeholder, autoComplete }) {
    return (
        <div className='flex flex-col'>
            <label htmlFor={id} className='text-[13px] font-bold mb-1'>
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={inputClass}
            />
        </div>
    );
}

// One row of the "Login & security" card: label, current value, Edit button
// and an inline form that expands underneath.
function SettingRow({ title, value, isOpen, onToggle, children, last = false }) {
    return (
        <div className={`py-4 ${last ? '' : 'border-b border-[#D5D9D9]'}`}>
            <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                    <p className='text-[14px] font-bold'>{title}</p>
                    <p className='text-[14px] text-[#565959] break-words'>{value}</p>
                </div>
                <button
                    type='button'
                    onClick={onToggle}
                    className='shrink-0 px-6 py-1 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl text-[13px] text-[#111] cursor-pointer shadow-sm'
                >
                    {isOpen ? 'Cancel' : 'Edit'}
                </button>
            </div>

            {isOpen && (
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className='mt-4 p-4 bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl flex flex-col gap-3 max-w-[420px]'
                >
                    {children}
                    <div className='flex items-start gap-2 text-[12px] text-[#565959]'>
                        <span aria-hidden='true'>🔒</span>
                        <span>
                            For your security we will ask you to verify this change with a
                            one-time code before it is saved.
                        </span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            type='submit'
                            className='px-4 py-1.5 bg-[#FFD814] hover:bg-[#FFCE12] border border-[#FCD200] rounded-xl text-[13px] cursor-pointer font-medium active:bg-[#F0B800]'
                        >
                            Continue
                        </button>
                        <span className='text-[12px] text-[#767676]'>Coming soon</span>
                    </div>
                </form>
            )}
        </div>
    );
}

function Profile() {
    const { isLoggedIn, userName } = useAuth();
    const [openSection, setOpenSection] = useState(null);

    if (!isLoggedIn) {
        return <Navigate to='/login' replace />;
    }

    const toggle = (section) =>
        setOpenSection((current) => (current === section ? null : section));

    const initial = (userName || 'U').trim().charAt(0).toUpperCase();

    return (
        <div className='flex flex-col items-center px-4 py-8 min-h-[70vh] bg-white'>
            <div className='w-full max-w-[700px]'>
                {/* Breadcrumb */}
                <div className='text-[13px] text-[#565959] mb-3'>
                    <Link to='/' className='text-[#2162A1] hover:underline'>
                        Home
                    </Link>
                    <span className='mx-1'>›</span>
                    <span>Your profile</span>
                </div>

                <h1 className='text-[28px] font-normal mb-4'>Your profile</h1>

                {/* Summary card */}
                <div className='flex items-center gap-4 p-5 border border-[#D5D9D9] rounded-xl shadow-sm mb-6'>
                    <div className='w-[64px] h-[64px] rounded-full bg-[#232F3E] text-white flex items-center justify-center text-[28px] font-bold shrink-0'>
                        {initial}
                    </div>
                    <div className='min-w-0'>
                        <p className='text-[20px] font-bold break-words'>{userName}</p>
                        <p className='text-[13px] text-[#565959]'>IPAY member</p>
                    </div>
                </div>

                {/* Login & security */}
                <div className='border border-[#D5D9D9] rounded-xl shadow-sm px-5 mb-6'>
                    <h2 className='text-[20px] font-normal pt-4 pb-2 border-b border-[#D5D9D9]'>
                        Login &amp; security
                    </h2>

                    <SettingRow
                        title='Email'
                        value='Your email address'
                        isOpen={openSection === 'email'}
                        onToggle={() => toggle('email')}
                    >
                        <Field id='newEmail' label='New email address' type='email' autoComplete='email' />
                        <Field id='emailPassword' label='Current password' type='password' autoComplete='current-password' />
                    </SettingRow>

                    <SettingRow
                        title='Mobile phone number'
                        value='Not added yet'
                        isOpen={openSection === 'phone'}
                        onToggle={() => toggle('phone')}
                    >
                        <Field id='newPhone' label='New mobile number' type='tel' placeholder='+48 123 456 789' autoComplete='tel' />
                        <Field id='phonePassword' label='Current password' type='password' autoComplete='current-password' />
                    </SettingRow>

                    <SettingRow
                        title='Password'
                        value='••••••••'
                        isOpen={openSection === 'password'}
                        onToggle={() => toggle('password')}
                        last
                    >
                        <Field id='currentPassword' label='Current password' type='password' autoComplete='current-password' />
                        <Field id='newPassword' label='New password' type='password' autoComplete='new-password' />
                        <Field id='confirmNewPassword' label='Confirm new password' type='password' autoComplete='new-password' />
                    </SettingRow>
                </div>

                <Link
                    to='/'
                    className='inline-block py-1.5 px-6 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl text-[13px] text-[#111] cursor-pointer shadow-sm'
                >
                    Done
                </Link>
            </div>
        </div>
    );
}

export default Profile;
