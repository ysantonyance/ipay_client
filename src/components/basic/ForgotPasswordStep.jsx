import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi.js';
import { getErrorMessage } from '../../api/api.js';
import {
    getFirebaseErrorMessage,
    getIdTokenForNewPassword,
    sendPasswordResetLink,
} from '../../api/firebaseAuth.js';

// The address we are waiting on is remembered, so a page reload between "I sent the email" and
// "I set the new password" does not lose the second step.
const PENDING_RESET_KEY = 'ipayPendingForgotPassword';

const inputClass =
    'w-full p-2 text-[13px] border border-[#a6a6a6] rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D]';

// Backend errors are axios errors; everything else comes from the Firebase SDK.
function describeError(error, fallback) {
    if (error?.response || error?.request) return getErrorMessage(error, fallback);
    return getFirebaseErrorMessage(error, fallback) || fallback;
}

function Field({ id, label, type = 'text', value, onChange, autoComplete, disabled = false }) {
    return (
        <div className='flex flex-col'>
            <label htmlFor={id} className='text-[13px] font-bold mb-1'>
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoComplete={autoComplete}
                disabled={disabled}
                className={inputClass}
            />
        </div>
    );
}

/**
 * "Forgot password?" on the login page, in two steps with a click in an email in between:
 *  1. enter the email -> Firebase emails its reset link
 *  2. after setting the new password through the link, enter it here to finish
 * onDone(message) is called when the password was changed; onCancel goes back to the sign-in form.
 */
function ForgotPasswordStep({ initialEmail = '', onDone, onCancel }) {
    const [email, setEmail] = useState(initialEmail);
    const [pendingEmail, setPendingEmail] = useState(() => localStorage.getItem(PENDING_RESET_KEY) || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const waiting = Boolean(pendingEmail);

    const forgetPending = () => {
        localStorage.removeItem(PENDING_RESET_KEY);
        setPendingEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    // Step 1: the backend prepares the Firebase account, then Firebase emails the reset link.
    const sendLink = async () => {
        setError('');

        const address = email.trim().toLowerCase();
        if (!address) {
            setError('Enter your email address.');
            return;
        }

        setBusy(true);
        try {
            await authApi.forgotPasswordStart(address);

            try {
                await sendPasswordResetLink(address);
            } catch (err) {
                // Do not reveal whether the address has an account: act as if the email went out.
                if (err?.code !== 'auth/user-not-found') throw err;
            }

            localStorage.setItem(PENDING_RESET_KEY, address);
            setPendingEmail(address);
        } catch (err) {
            setError(describeError(err, 'We could not send the reset email. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    // Step 2: the new password was set through the emailed link, so signing in to Firebase with it
    // proves that; the backend then updates its own copy.
    const finish = async () => {
        setError('');

        if (!newPassword) {
            setError('Enter the new password you set through the link.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('The new passwords do not match.');
            return;
        }

        setBusy(true);
        try {
            const idToken = await getIdTokenForNewPassword(pendingEmail, newPassword);
            await authApi.forgotPasswordConfirm({ idToken, newPassword });

            localStorage.removeItem(PENDING_RESET_KEY);
            onDone('Your password was updated. Sign in with the new password.');
        } catch (err) {
            setError(describeError(err, 'We could not confirm your new password. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (busy) return;
        if (waiting) finish();
        else sendLink();
    };

    return (
        <div className='flex flex-col items-center p-5 min-h-[70vh] bg-white'>
            <Link to='/'>
                <img
                    className='w-[100px] h-[40px]'
                    src='https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fapi.freelogodesign.org%2Fassets%2Fblog%2Fimg%2F20180911090509731amazon_logo_RGB.jpg&f=1&nofb=1&ipt=994d9fc7edf1d9ef113111b14d1cb612e3c3e085cea6ad81a30c13950ae67080&ipo=images'
                    alt=''
                />
            </Link>

            <div className='w-full max-w-[350px] p-6 border border-[#D5D9D9] rounded-xl mb-6 shadow-sm mt-8'>
                <h1 className='text-[28px] font-normal mb-4'>Reset password</h1>

                {error && (
                    <div
                        role='alert'
                        className='p-2 mb-3 bg-[#fdf2f2] border border-[#d32f2f] rounded-lg text-[#d32f2f] text-[13px]'
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    {waiting ? (
                        <>
                            <p className='text-[13px]'>
                                If <strong className='break-all'>{pendingEmail}</strong> has an account, we sent a
                                reset link to it. Open it and choose your new password there, then come back and
                                enter that same password below.
                            </p>
                            <Field
                                id='forgotNewPassword'
                                label='New password (the one you just set)'
                                type='password'
                                value={newPassword}
                                onChange={setNewPassword}
                                autoComplete='new-password'
                                disabled={busy}
                            />
                            <Field
                                id='forgotConfirmPassword'
                                label='Confirm new password'
                                type='password'
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                                autoComplete='new-password'
                                disabled={busy}
                            />
                            <p className='text-[12px] text-[#565959]'>
                                Finish within 30 minutes of opening the link. At least 8 characters, with an
                                uppercase letter, a lowercase letter, a digit and a special character.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className='text-[13px]'>
                                Enter the email address of your account and we will send you a link to choose a new
                                password.
                            </p>
                            <Field
                                id='forgotEmail'
                                label='Email address'
                                type='email'
                                value={email}
                                onChange={setEmail}
                                autoComplete='username'
                                disabled={busy}
                            />
                        </>
                    )}

                    <button
                        type='submit'
                        disabled={busy}
                        className='w-full py-1.5 mt-2 bg-[#FFD814] hover:bg-[#FFCE12] border border-[#FCD200] rounded-xl text-[13px] cursor-pointer font-medium active:bg-[#F0B800] disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {busy ? 'Please wait...' : waiting ? 'I have set the new password' : 'Send reset email'}
                    </button>
                </form>

                <div className='mt-4 flex flex-col items-start gap-1'>
                    {waiting && (
                        <button
                            type='button'
                            onClick={forgetPending}
                            disabled={busy}
                            className='text-[12px] text-[#2162A1] hover:underline cursor-pointer'
                        >
                            Send a new link
                        </button>
                    )}
                    <button
                        type='button'
                        onClick={onCancel}
                        disabled={busy}
                        className='text-[12px] text-[#2162A1] hover:underline cursor-pointer'
                    >
                        Back to sign in
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordStep;
