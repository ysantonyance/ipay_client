import { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from '../api/authApi.js';
import { getErrorMessage } from '../api/api.js';
import { getGoogleIdToken, getFirebaseErrorMessage, sendVerificationEmail } from '../api/firebaseAuth.js';
import TwoFactorStep from '../components/basic/TwoFactorStep.jsx';
import ForgotPasswordStep from '../components/basic/ForgotPasswordStep.jsx';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialFormState = {
        email: '',
        password: ''
    };

    const [formState, setFormState] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    // Set by the backend (403 EMAIL_NOT_VERIFIED) when the password was right but the email isn't verified.
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resending, setResending] = useState(false);
    // Set when the password was accepted but an emailed code is still needed: { challengeId, maskedEmail }.
    const [challenge, setChallenge] = useState(null);
    // True while the "Forgot password?" screen is showing instead of the sign-in form.
    // A reset that was started earlier (email already sent) reopens on its second step after a reload.
    const [forgotOpen, setForgotOpen] = useState(() => Boolean(localStorage.getItem('ipayPendingForgotPassword')));
    // Message passed from the Register page ("we sent you a verification email").
    const [notice, setNotice] = useState(location.state?.notice || '');

    const busy = loading || googleLoading || resending;

    const validateForm = () => {
        const newErrors = {};

        if (!formState.email.trim()) {
            newErrors.email = 'Enter your email address';
        }

        if (!formState.password) {
            newErrors.password = 'Enter your password';
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
        setNeedsVerification(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});
        setNotice('');
        setNeedsVerification(false);

        try {
            const data = await authApi.login({
                email: formState.email,
                password: formState.password,
            });

            if (data?.twoFactorRequired) {
                setChallenge({ challengeId: data.challengeId, maskedEmail: data.maskedEmail });
                return;
            }

            navigate('/');
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
                setNeedsVerification(true);
                setErrors({ server: err.response.data.message });
            } else {
                const serverMessage = getErrorMessage(err, 'Failed to log in. Please try again.');
                setErrors({ server: serverMessage });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setResending(true);
        setErrors({});

        try {
            const { alreadyVerified } = await sendVerificationEmail(formState.email.trim(), formState.password);
            setNeedsVerification(false);
            setNotice(
                alreadyVerified
                    ? 'Your email is already verified. Try signing in again.'
                    : `Verification email sent to ${formState.email.trim()}. Click the link in it, then sign in.`
            );
        } catch (err) {
            setErrors({ server: getFirebaseErrorMessage(err, 'Could not send the verification email. Please try again.') });
        } finally {
            setResending(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        setErrors({});
        setNotice('');
        setNeedsVerification(false);

        try {
            const idToken = await getGoogleIdToken();
            await authApi.googleLogin(idToken);
            navigate('/');
        } catch (err) {
            console.error('Google sign-in error:', err.code, err.message, err);
            const message = err.response
                ? getErrorMessage(err, 'Google sign-in failed. Please try again.')
                : getFirebaseErrorMessage(err, 'Google sign-in failed. Please try again.');
            if (message) setErrors({ server: message });
        } finally {
            setGoogleLoading(false);
        }
    };

    if (forgotOpen) {
        return (
            <ForgotPasswordStep
                initialEmail={formState.email.trim()}
                onDone={(message) => {
                    setForgotOpen(false);
                    setFormState((prev) => ({ ...prev, password: '' }));
                    setErrors({});
                    setNotice(message);
                }}
                onCancel={() => setForgotOpen(false)}
            />
        );
    }

    if (challenge) {
        return (
            <TwoFactorStep
                challengeId={challenge.challengeId}
                maskedEmail={challenge.maskedEmail}
                onSuccess={() => navigate('/')}
                onCancel={() => {
                    setChallenge(null);
                    setFormState((prev) => ({ ...prev, password: '' }));
                }}
            />
        );
    }

    return (
        <div className='flex flex-col items-center p-5 min-h-[70vh] bg-white'>
            <Link to='/'>
                <img
                    className='w-[100px] h-[40px]'
                    src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fapi.freelogodesign.org%2Fassets%2Fblog%2Fimg%2F20180911090509731amazon_logo_RGB.jpg&f=1&nofb=1&ipt=994d9fc7edf1d9ef113111b14d1cb612e3c3e085cea6ad81a30c13950ae67080&ipo=images" alt=""
                />
            </Link>
            <div className='w-full max-w-[350px] p-6 border border-[#D5D9D9] rounded-xl mb-6 shadow-sm mt-8'>
                <h1 className='text-[28px] font-normal mb-4'>Sign in</h1>

                {notice && (
                    <div className='p-2 mb-3 bg-[#f0f9f0] border border-[#2e7d32] rounded-lg text-[#1b5e20] text-[13px]'>
                        {notice}
                    </div>
                )}

                {errors.server && (
                    <div className='p-2 mb-3 bg-[#fdf2f2] border border-[#d32f2f] rounded-lg text-[#d32f2f] text-[13px]'>
                        {errors.server}
                    </div>
                )}

                {needsVerification && (
                    <button
                        type='button'
                        onClick={handleResendVerification}
                        disabled={busy}
                        className='w-full py-1.5 mb-3 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl text-[13px] text-[#111] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {resending ? 'Sending...' : 'Resend verification email'}
                    </button>
                )}

                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <label htmlFor='email' className='text-[13px] font-bold mb-1'>
                            Email address
                        </label>
                        <input
                            type='text'
                            id='email'
                            name='email'
                            value={formState.email}
                            onChange={handleInputChange}
                            autoComplete='username'
                            disabled={loading}
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.email ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.email && (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className='flex flex-col'>
                        <div className='flex justify-between items-center mb-1'>
                            <label htmlFor='password' className='text-[13px] font-bold'>
                                Password
                            </label>
                            <button
                                type='button'
                                onClick={() => setForgotOpen(true)}
                                className='text-[12px] text-[#2162A1] hover:underline cursor-pointer'
                            >
                                Forgot password?
                            </button>
                        </div>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={formState.password}
                            onChange={handleInputChange}
                            autoComplete='current-password'
                            disabled={loading}
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.password ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.password && (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <button
                        type='submit'
                        disabled={busy}
                        className='w-full py-1.5 mt-2 bg-[#FFD814] hover:bg-[#FFCE12] border border-[#FCD200] rounded-xl text-[13px] cursor-pointer font-medium active:bg-[#F0B800] disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className='flex items-center gap-2 my-3'>
                    <hr className='flex-1 border-[#D5D9D9]' />
                    <span className='text-[12px] text-[#767676]'>or</span>
                    <hr className='flex-1 border-[#D5D9D9]' />
                </div>

                <button
                    type='button'
                    onClick={handleGoogleSignIn}
                    disabled={busy}
                    className='w-full py-1.5 flex items-center justify-center gap-2 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl text-[13px] text-[#111] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    <svg width='16' height='16' viewBox='0 0 48 48' aria-hidden='true'>
                        <path fill='#EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'/>
                        <path fill='#4285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'/>
                        <path fill='#FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'/>
                        <path fill='#34A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'/>
                    </svg>
                    {googleLoading ? 'Opening Google...' : 'Continue with Google'}
                </button>

                <p className='text-[12px] text-[#111] mt-4 leading-normal'>
                    By continuing, you agree to Amazon's{' '}
                    <a href='#' className='text-[#2162A1] hover:underline'>
                        Conditions of Use
                    </a>{' '}
                    and{' '}
                    <a href='#' className='text-[#2162A1] hover:underline'>
                        Privacy Notice
                    </a>
                    .
                </p>

                <div className='mt-4 pt-4 border-t border-[#D5D9D9]'>
                    <a href='#' className='text-[13px] text-[#2162A1] hover:underline flex items-center gap-1'>
                        ▸ Need help?
                    </a>
                </div>
            </div>

            <div className='w-full max-w-[350px] flex items-center gap-2 mb-4'>
                <hr className='flex-1 border-[#D5D9D9]' />
                <span className='text-[12px] text-[#767676]'>New to Amazon?</span>
                <hr className='flex-1 border-[#D5D9D9]' />
            </div>

            <Link
                to='/register'
                className='block w-full max-w-[350px] text-center py-1.5 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl text-[13px] text-[#111] cursor-pointer shadow-sm mb-8'
            >
                Create your Amazon account
            </Link>
        </div>
    );
}

export default Login;