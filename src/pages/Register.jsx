import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { authApi } from '../api/authApi.js';
import { getErrorMessage } from '../api/api.js';
import { getFirebaseErrorMessage, sendVerificationEmail } from '../api/firebaseAuth.js';

function Register() {
    const navigate = useNavigate();

    const initialFormState = {
        fullname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    };

    const [formState, setFormState] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formState.fullname.trim()) {
            newErrors.fullname = 'Enter your name';
        } else if (formState.fullname.trim().length < 2 || formState.fullname.trim().length > 50) {
            newErrors.fullname = 'Name must be 2-50 characters';
        } else if (!/^[a-zA-Zа-яА-ЯіІїЇєЄ\s-]+$/.test(formState.fullname.trim())) {
            newErrors.fullname = 'Name can only contain letters, spaces, and hyphens';
        }

        if (!formState.email.trim()) {
            newErrors.email = 'Enter your email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (formState.phone && !/^\+?\d{10,15}$/.test(formState.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Enter a valid phone number (10-15 digits)';
        }

        if (!formState.password) {
            newErrors.password = 'Enter your password';
        } else if (
            formState.password.length < 8 ||
            !/[A-Z]/.test(formState.password) ||
            !/[a-z]/.test(formState.password) ||
            !/[0-9]/.test(formState.password) ||
            !/[^a-zA-Z0-9]/.test(formState.password)
        ) {
            newErrors.password = 'At least 8 characters, with uppercase, lowercase, a number, and a special character';
        }

        if (!formState.confirmPassword) {
            newErrors.confirmPassword = 'Type your password again';
        } else if (formState.confirmPassword !== formState.password) {
            newErrors.confirmPassword = 'Passwords must match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name] || errors.server) {
            setErrors((prev) => ({ ...prev, [name]: '', server: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            await authApi.register({
                email: formState.email,
                password: formState.password,
                confirmPassword: formState.confirmPassword,
                name: formState.fullname.trim() || 'guest'
            });

            // The account exists now. Firebase sends the verification email (template: Firebase console >
            // Authentication > Templates). If that step fails the account is still fine - the person can
            // request another email from the sign-in page.
            let notice;
            try {
                await sendVerificationEmail(formState.email.trim(), formState.password);
                notice = `Account created! We sent a verification email to ${formState.email.trim()}. Click the link in it, then sign in.`;
            } catch (verificationError) {
                const reason = getFirebaseErrorMessage(verificationError, '');
                notice = `Account created, but we could not send the verification email${reason ? ` (${reason})` : ''}. Sign in and choose "Resend verification email".`;
            }

            navigate('/login', { state: { notice } });
        } catch (err) {
            const serverMessage = getErrorMessage(err, 'Registration failed. Please try again.');
            setErrors({ server: serverMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center p-5 min-h-[70vh] bg-white'>
            <Link to='/'>
                <img
                    className='w-[100px] h-[40px]'
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fapi.freelogodesign.org%2Fassets%2Fblog%2Fimg%2F20180911090509731amazon_logo_RGB.jpg&f=1&nofb=1&ipt=994d9fc7edf1d9ef113111b14d1cb612e3c3e085cea6ad81a30c13950ae67080&ipo=images" alt=""
                />
            </Link>
            <div className='w-full max-w-[350px] p-6 border border-[#D5D9D9] rounded-xl mb-6 shadow-sm mt-8'>
                <h1 className='text-[28px] font-normal mb-4'>Create account</h1>

                {errors.server && (
                    <div className='p-2 mb-3 bg-[#fdf2f2] border border-[#d32f2f] rounded-lg text-[#d32f2f] text-[13px]'>
                        {errors.server}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <label htmlFor='fullname' className='text-[13px] font-bold mb-1'>
                            Your name
                        </label>
                        <input
                            type='text'
                            id='fullname'
                            name='fullname'
                            placeholder='First and last name'
                            value={formState.fullname}
                            onChange={handleInputChange}
                            disabled={loading}
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.fullname ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.fullname && (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>{errors.fullname}</span>
                        )}
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='email' className='text-[13px] font-bold mb-1'>
                            Email
                        </label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={formState.email}
                            onChange={handleInputChange}
                            disabled={loading}
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.email ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.email && (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>{errors.email}</span>
                        )}
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='phone' className='text-[13px] font-bold mb-1'>
                            Mobile number (optional)
                        </label>
                        <input
                            type='tel'
                            id='phone'
                            name='phone'
                            placeholder='e.g. +380630300035'
                            value={formState.phone}
                            onChange={handleInputChange}
                            disabled={loading}
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.phone ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.phone && (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>{errors.phone}</span>
                        )}
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='password' className='text-[13px] font-bold mb-1'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            placeholder='At least 8 characters'
                            value={formState.password}
                            onChange={handleInputChange}
                            autoComplete='new-password'
                            disabled={loading}
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.password ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.password ? (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>{errors.password}</span>
                        ) : (
                            <span className='text-[11px] text-[#555] mt-1'>
                                Passwords must be at least 8+ characters, at least 1 uppercase letter, 1 lowercase letter, 1 digit, AND 1 special character (e.g., @, #, !, $)
                            </span>
                        )}
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor='confirmPassword' className='text-[13px] font-bold mb-1'>
                            Re-enter password
                        </label>
                        <input
                            type='password'
                            id='confirmPassword'
                            name='confirmPassword'
                            value={formState.confirmPassword}
                            onChange={handleInputChange}
                            autoComplete='new-password'
                            disabled={loading}
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.confirmPassword ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.confirmPassword && (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>{errors.confirmPassword}</span>
                        )}
                    </div>

                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-1.5 mt-3 bg-[#FFD814] hover:bg-[#FFCE12] border border-[#FCD200] rounded-xl text-[13px] cursor-pointer active:bg-[#F0B800] font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Creating account...' : 'Create your Amazon account'}
                    </button>
                </form>

                <p className='text-[12px] text-[#111] mt-4 leading-normal'>
                    By creating an account, you agree to Amazon's{' '}
                    <a href='#' className='text-[#2162A1] hover:underline'>
                        Conditions of Use
                    </a>{' '}
                    and{' '}
                    <a href='#' className='text-[#2162A1] hover:underline'>
                        Privacy Notice
                    </a>
                    .
                </p>

                <hr className='my-4 border-[#D5D9D9]' />

                <p className='text-[13px]'>
                    Already have an account?{' '}
                    <Link to='/login' className='text-[#2162A1] hover:underline'>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;