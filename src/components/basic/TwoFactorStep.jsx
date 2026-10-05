import { useEffect, useState } from 'react';
import { authApi } from '../../api/authApi.js';
import { getErrorMessage } from '../../api/api.js';

// Matches TwoFactor:ResendCooldownSeconds on the backend (the server enforces it either way).
const RESEND_COOLDOWN_SECONDS = 30;

/**
 * Second step of sign-in: the person types the 6-digit code we emailed them.
 * Props:
 *   challengeId  - from the backend's "code required" login response
 *   maskedEmail  - e.g. "j***@gmail.com", shown so they know where to look
 *   onSuccess()  - called once the code was accepted and the session is saved
 *   onCancel()   - go back to the password form
 */
function TwoFactorStep({ challengeId, maskedEmail, onSuccess, onCancel }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

    // Count the resend cooldown down once per second.
    useEffect(() => {
        if (cooldown <= 0) return undefined;
        const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleChange = (e) => {
        // digits only, max 6
        setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            setError('Enter the 6-digit code from the email.');
            return;
        }

        setVerifying(true);
        setError('');
        setNotice('');

        try {
            await authApi.verifyCode({ challengeId, code });
            onSuccess();
        } catch (err) {
            setError(getErrorMessage(err, 'Could not verify the code. Please try again.'));
            setCode('');
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        setNotice('');

        try {
            await authApi.resendCode(challengeId);
            setNotice('We sent you a new code.');
            setCode('');
            setCooldown(RESEND_COOLDOWN_SECONDS);
        } catch (err) {
            setError(getErrorMessage(err, 'Could not send a new code. Please try again.'));
        } finally {
            setResending(false);
        }
    };

    const busy = verifying || resending;

    return (
        <div className='flex flex-col items-center p-5 min-h-[70vh] bg-white'>
            <div className='w-full max-w-[350px] p-6 border border-[#D5D9D9] rounded-xl mb-6 shadow-sm mt-8'>
                <h1 className='text-[28px] font-normal mb-2'>Verify it&apos;s you</h1>
                <p className='text-[13px] text-[#565959] mb-4'>
                    We emailed a 6-digit code to <b className='text-[#111]'>{maskedEmail}</b>. Enter it
                    below to finish signing in.
                </p>

                {notice && (
                    <div className='p-2 mb-3 bg-[#f0f9f0] border border-[#2e7d32] rounded-lg text-[#1b5e20] text-[13px]'>
                        {notice}
                    </div>
                )}

                {error && (
                    <div className='p-2 mb-3 bg-[#fdf2f2] border border-[#d32f2f] rounded-lg text-[#d32f2f] text-[13px]'>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <label htmlFor='twoFactorCode' className='text-[13px] font-bold mb-1'>
                            Sign-in code
                        </label>
                        <input
                            id='twoFactorCode'
                            name='twoFactorCode'
                            type='text'
                            inputMode='numeric'
                            autoComplete='one-time-code'
                            autoFocus
                            maxLength={6}
                            placeholder='123456'
                            value={code}
                            onChange={handleChange}
                            disabled={busy}
                            className='w-full p-2 text-[18px] tracking-[0.4em] text-center border border-[#a6a6a6] rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D]'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={busy || code.length !== 6}
                        className='w-full py-1.5 mt-1 bg-[#FFD814] hover:bg-[#FFCE12] border border-[#FCD200] rounded-xl text-[13px] cursor-pointer font-medium active:bg-[#F0B800] disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {verifying ? 'Verifying...' : 'Verify and sign in'}
                    </button>
                </form>

                <div className='flex items-center justify-between mt-4 text-[13px]'>
                    <button
                        type='button'
                        onClick={handleResend}
                        disabled={busy || cooldown > 0}
                        className='text-[#2162A1] hover:underline cursor-pointer disabled:text-[#767676] disabled:no-underline disabled:cursor-not-allowed'
                    >
                        {resending
                            ? 'Sending...'
                            : cooldown > 0
                                ? `Resend code in ${cooldown}s`
                                : 'Resend code'}
                    </button>

                    <button
                        type='button'
                        onClick={onCancel}
                        disabled={busy}
                        className='text-[#2162A1] hover:underline cursor-pointer disabled:opacity-50'
                    >
                        Back to sign in
                    </button>
                </div>

                <p className='text-[12px] text-[#767676] mt-4'>
                    The code expires after a few minutes. Can&apos;t find the email? Check your spam folder.
                </p>
            </div>
        </div>
    );
}

export default TwoFactorStep;
