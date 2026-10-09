import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { profileApi } from '../api/profileApi.js';
import { getErrorMessage } from '../api/api.js';
import {
    getFirebaseErrorMessage,
    getIdTokenForEmail,
    getIdTokenForNewPassword,
    sendEmailChangeLink,
    sendPasswordResetLink,
} from '../api/firebaseAuth.js';

// Email changes take two steps with a click in an email in between, so the address we are
// waiting on is remembered here. That way a page reload does not lose the second step.
const PENDING_EMAIL_KEY = 'ipayPendingEmail';

// Same idea for password changes: after the reset email went out we remember that a second step is due.
const PENDING_PASSWORD_KEY = 'ipayPendingPasswordChange';

const inputClass =
    'w-full p-2 text-[13px] border border-[#a6a6a6] rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D]';

// Backend errors are axios errors (they carry .response / .request); everything else
// that reaches us comes from the Firebase SDK.
function describeError(error, fallback) {
    if (error?.response || error?.request) return getErrorMessage(error, fallback);
    return getFirebaseErrorMessage(error, fallback) || fallback;
}

function Field({ id, label, type = 'text', value, onChange, placeholder, autoComplete, disabled = false }) {
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
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                className={inputClass}
            />
        </div>
    );
}

// One row of the "Login & security" card: label, current value, Edit button
// and an inline form that expands underneath.
function SettingRow({
    title,
    value,
    isOpen,
    onToggle,
    onSubmit,
    busy = false,
    error = '',
    success = '',
    submitLabel = 'Save changes',
    note = '',
    disabledReason = '',
    children,
    last = false,
}) {
    return (
        <div className={`py-4 ${last ? '' : 'border-b border-[#D5D9D9]'}`}>
            <div className='flex items-start justify-between gap-4'>
                <div className='min-w-0'>
                    <p className='text-[14px] font-bold'>{title}</p>
                    <p className='text-[14px] text-[#565959] break-words'>{value}</p>
                    {success && !isOpen && (
                        <p role='status' className='text-[13px] text-[#007600] mt-1'>
                            {success}
                        </p>
                    )}
                    {disabledReason && (
                        <p className='text-[12px] text-[#767676] mt-1'>{disabledReason}</p>
                    )}
                </div>
                <button
                    type='button'
                    onClick={onToggle}
                    disabled={Boolean(disabledReason)}
                    className='shrink-0 px-6 py-1 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl text-[13px] text-[#111] cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isOpen ? 'Cancel' : 'Edit'}
                </button>
            </div>

            {isOpen && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!busy) onSubmit();
                    }}
                    className='mt-4 p-4 bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl flex flex-col gap-3 max-w-[420px]'
                >
                    {children}

                    {note && <p className='text-[12px] text-[#565959]'>{note}</p>}

                    {error && (
                        <div
                            role='alert'
                            className='text-[13px] text-[#C40000] bg-[#FDF0F0] border border-[#C40000] rounded-xl px-3 py-2'
                        >
                            {error}
                        </div>
                    )}

                    <div className='flex items-center gap-2'>
                        <button
                            type='submit'
                            disabled={busy}
                            className='px-4 py-1.5 bg-[#FFD814] hover:bg-[#FFCE12] border border-[#FCD200] rounded-xl text-[13px] cursor-pointer font-medium active:bg-[#F0B800] disabled:opacity-60 disabled:cursor-not-allowed'
                        >
                            {busy ? 'Please wait…' : submitLabel}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

function UsernameSection({ profile, isOpen, onToggle, onClose, onProfileChanged }) {
    const [newName, setNewName] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setNewName('');
            setPassword('');
            setError('');
        }
    }, [isOpen]);

    const submit = async () => {
        setError('');
        setSuccess('');

        if (!newName.trim()) {
            setError('Enter a new name.');
            return;
        }
        if (profile.hasPassword && !password) {
            setError('Enter your password to confirm the change.');
            return;
        }

        setBusy(true);
        try {
            const updated = await profileApi.changeUsername({ newName: newName.trim(), password });
            onProfileChanged(updated);
            setSuccess('Your name was updated.');
            onClose();
        } catch (err) {
            setError(describeError(err, 'We could not update your name. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <SettingRow
            title='Name'
            value={profile.name}
            isOpen={isOpen}
            onToggle={onToggle}
            onSubmit={submit}
            busy={busy}
            error={error}
            success={success}
            submitLabel='Save name'
        >
            <Field
                id='newName'
                label='New name'
                value={newName}
                onChange={setNewName}
                autoComplete='name'
            />
            {profile.hasPassword && (
                <Field
                    id='namePassword'
                    label='Current password'
                    type='password'
                    value={password}
                    onChange={setPassword}
                    autoComplete='current-password'
                />
            )}
        </SettingRow>
    );
}

function EmailSection({ profile, isOpen, onToggle, onClose, onProfileChanged }) {
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pendingEmail, setPendingEmail] = useState(() => localStorage.getItem(PENDING_EMAIL_KEY) || '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setNewEmail('');
            setPassword('');
            setError('');
        }
    }, [isOpen]);

    const forgetPending = () => {
        localStorage.removeItem(PENDING_EMAIL_KEY);
        setPendingEmail('');
        setPassword('');
        setError('');
    };

    // Step 1: backend checks password + address, then Firebase emails the link to the new address.
    const sendLink = async () => {
        setError('');
        setSuccess('');

        const email = newEmail.trim().toLowerCase();
        if (!email) {
            setError('Enter your new email address.');
            return;
        }
        if (!password) {
            setError('Enter your current password.');
            return;
        }

        setBusy(true);
        try {
            await profileApi.startEmailChange({ newEmail: email, password });
            await sendEmailChangeLink(profile.email, password, email);

            localStorage.setItem(PENDING_EMAIL_KEY, email);
            setPendingEmail(email);
            setPassword('');
        } catch (err) {
            setError(describeError(err, 'We could not send the confirmation email. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    // Step 2: the link was clicked, so Firebase now knows the new address as verified.
    const confirmChange = async () => {
        setError('');

        if (!password) {
            setError('Enter your current password.');
            return;
        }

        setBusy(true);
        try {
            const idToken = await getIdTokenForEmail(pendingEmail, password);
            const session = await profileApi.confirmEmailChange({ idToken, password });

            onProfileChanged({ email: session?.user?.email || pendingEmail });
            localStorage.removeItem(PENDING_EMAIL_KEY);
            setPendingEmail('');
            setSuccess('Your email address was updated.');
            onClose();
        } catch (err) {
            setError(describeError(err, 'We could not confirm the new email address. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    if (!profile.hasPassword) {
        return (
            <SettingRow
                title='Email'
                value={profile.email}
                isOpen={false}
                onToggle={() => {}}
                onSubmit={() => {}}
                disabledReason='This account signs in with Google, so the email is managed by your Google account.'
            />
        );
    }

    const waiting = Boolean(pendingEmail);

    return (
        <SettingRow
            title='Email'
            value={profile.email}
            isOpen={isOpen}
            onToggle={onToggle}
            onSubmit={waiting ? confirmChange : sendLink}
            busy={busy}
            error={error}
            success={success}
            submitLabel={waiting ? 'I have confirmed the new email' : 'Send confirmation email'}
            note={
                waiting
                    ? undefined
                    : 'We will email a confirmation link to the new address. Your email only changes after you open it.'
            }
        >
            {waiting ? (
                <>
                    <p className='text-[13px]'>
                        We sent a link to <strong className='break-all'>{pendingEmail}</strong>. Open it, then come
                        back here and confirm with your password.
                    </p>
                    <Field
                        id='confirmEmailPassword'
                        label='Current password'
                        type='password'
                        value={password}
                        onChange={setPassword}
                        autoComplete='current-password'
                    />
                    <button
                        type='button'
                        onClick={forgetPending}
                        className='self-start text-[12px] text-[#2162A1] hover:underline cursor-pointer'
                    >
                        Use a different address
                    </button>
                </>
            ) : (
                <>
                    <Field
                        id='newEmail'
                        label='New email address'
                        type='email'
                        value={newEmail}
                        onChange={setNewEmail}
                        autoComplete='email'
                    />
                    <Field
                        id='emailPassword'
                        label='Current password'
                        type='password'
                        value={password}
                        onChange={setPassword}
                        autoComplete='current-password'
                    />
                </>
            )}
        </SettingRow>
    );
}

function PasswordSection({ profile, isOpen, onToggle, onClose }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [waiting, setWaiting] = useState(() => localStorage.getItem(PENDING_PASSWORD_KEY) === '1');
    // 'direct' = type the current + new password; 'email' = reset through the Firebase email.
    const [mode, setMode] = useState(() =>
        localStorage.getItem(PENDING_PASSWORD_KEY) === '1' ? 'email' : 'direct',
    );
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
        }
    }, [isOpen]);

    const forgetPending = () => {
        localStorage.removeItem(PENDING_PASSWORD_KEY);
        setWaiting(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    const switchMode = (next) => {
        setMode(next);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    };

    // Option 1: current password + new password, nothing else.
    const changeDirect = async () => {
        setError('');
        setSuccess('');

        if (!currentPassword) {
            setError('Enter your current password.');
            return;
        }
        if (!newPassword) {
            setError('Enter a new password.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('The new passwords do not match.');
            return;
        }

        setBusy(true);
        try {
            await profileApi.changePassword({ currentPassword, newPassword });

            // A half-finished email reset is pointless now.
            localStorage.removeItem(PENDING_PASSWORD_KEY);
            setWaiting(false);
            setSuccess('Your password was updated.');
            onClose();
        } catch (err) {
            setError(describeError(err, 'We could not update your password. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    // Option 2, step 1: no password needed. The backend makes sure the Firebase account exists,
    // then Firebase emails its reset link to your address.
    const sendLink = async () => {
        setError('');
        setSuccess('');

        setBusy(true);
        try {
            await profileApi.startPasswordChange();
            await sendPasswordResetLink(profile.email);

            localStorage.setItem(PENDING_PASSWORD_KEY, '1');
            setWaiting(true);
        } catch (err) {
            setError(describeError(err, 'We could not send the reset email. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    // Step 2: the new password was set through the emailed link, so signing in to Firebase with it
    // proves that; the backend then updates its own copy.
    const confirmChange = async () => {
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
            const idToken = await getIdTokenForNewPassword(profile.email, newPassword);
            await profileApi.confirmPasswordChange({ idToken, newPassword });

            localStorage.removeItem(PENDING_PASSWORD_KEY);
            setWaiting(false);
            setSuccess('Your password was updated.');
            onClose();
        } catch (err) {
            setError(describeError(err, 'We could not confirm your new password. Please try again.'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <SettingRow
            title='Password'
            value='••••••••'
            isOpen={isOpen}
            onToggle={onToggle}
            onSubmit={mode === 'direct' ? changeDirect : waiting ? confirmChange : sendLink}
            busy={busy}
            error={error}
            success={success}
            submitLabel={
                mode === 'direct'
                    ? 'Save password'
                    : waiting
                      ? 'I have set the new password'
                      : 'Send reset email'
            }
            disabledReason={
                profile.hasPassword ? '' : 'This account signs in with Google, so it has no password to change.'
            }
            note={
                mode === 'direct'
                    ? 'At least 8 characters, with an uppercase letter, a lowercase letter, a digit and a special character.'
                    : waiting
                      ? 'Finish within 30 minutes of opening the link. New password: at least 8 characters, with an uppercase letter, a lowercase letter, a digit and a special character.'
                      : 'We will email a password reset link to your current address. You do not need your current password: your password only changes after you set a new one through the link.'
            }
            last
        >
            <div className='flex flex-wrap gap-2'>
                {[
                    ['direct', 'Use current password'],
                    ['email', 'Reset by email'],
                ].map(([key, label]) => (
                    <button
                        key={key}
                        type='button'
                        onClick={() => switchMode(key)}
                        className={`px-3 py-1 rounded-xl text-[12px] border cursor-pointer ${
                            mode === key
                                ? 'bg-white border-[#888C8D] font-bold text-[#111]'
                                : 'bg-transparent border-[#D5D9D9] text-[#565959] hover:bg-white'
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {mode === 'direct' && (
                <>
                    <Field
                        id='currentPassword'
                        label='Current password'
                        type='password'
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        autoComplete='current-password'
                    />
                    <Field
                        id='newPassword'
                        label='New password'
                        type='password'
                        value={newPassword}
                        onChange={setNewPassword}
                        autoComplete='new-password'
                    />
                    <Field
                        id='confirmNewPassword'
                        label='Confirm new password'
                        type='password'
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        autoComplete='new-password'
                    />
                </>
            )}

            {mode === 'email' && waiting && (
                <>
                    <p className='text-[13px]'>
                        We sent a reset link to <strong className='break-all'>{profile.email}</strong>. Open it and
                        choose your new password there, then come back and enter that same password below.
                    </p>
                    <Field
                        id='resetNewPassword'
                        label='New password (the one you just set)'
                        type='password'
                        value={newPassword}
                        onChange={setNewPassword}
                        autoComplete='new-password'
                    />
                    <Field
                        id='resetConfirmPassword'
                        label='Confirm new password'
                        type='password'
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        autoComplete='new-password'
                    />
                    <button
                        type='button'
                        onClick={forgetPending}
                        className='self-start text-[12px] text-[#2162A1] hover:underline cursor-pointer'
                    >
                        Send a new link
                    </button>
                </>
            )}
        </SettingRow>
    );
}

function Profile() {
    const { isLoggedIn, userName } = useAuth();
    const [openSection, setOpenSection] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        if (!isLoggedIn) return undefined;

        let cancelled = false;
        profileApi
            .get()
            .then((data) => {
                if (!cancelled) setProfile(data);
            })
            .catch((err) => {
                if (!cancelled) setLoadError(getErrorMessage(err, 'We could not load your profile.'));
            });

        return () => {
            cancelled = true;
        };
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <Navigate to='/login' replace />;
    }

    const toggle = (section) =>
        setOpenSection((current) => (current === section ? null : section));
    const close = () => setOpenSection(null);
    const mergeProfile = (changes) => setProfile((current) => ({ ...current, ...changes }));

    const displayName = profile?.name || userName;
    const initial = (displayName || 'U').trim().charAt(0).toUpperCase();

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
                        <p className='text-[20px] font-bold break-words'>{displayName}</p>
                        <p className='text-[13px] text-[#565959]'>IPAY member</p>
                    </div>
                </div>

                {/* Login & security */}
                <div className='border border-[#D5D9D9] rounded-xl shadow-sm px-5 mb-6'>
                    <h2 className='text-[20px] font-normal pt-4 pb-2 border-b border-[#D5D9D9]'>
                        Login &amp; security
                    </h2>

                    {loadError && (
                        <p role='alert' className='py-4 text-[13px] text-[#C40000]'>
                            {loadError}
                        </p>
                    )}

                    {!profile && !loadError && (
                        <p className='py-4 text-[13px] text-[#565959]'>Loading your profile…</p>
                    )}

                    {profile && (
                        <>
                            <UsernameSection
                                profile={profile}
                                isOpen={openSection === 'name'}
                                onToggle={() => toggle('name')}
                                onClose={close}
                                onProfileChanged={mergeProfile}
                            />
                            <EmailSection
                                profile={profile}
                                isOpen={openSection === 'email'}
                                onToggle={() => toggle('email')}
                                onClose={close}
                                onProfileChanged={mergeProfile}
                            />
                            <PasswordSection
                                profile={profile}
                                isOpen={openSection === 'password'}
                                onToggle={() => toggle('password')}
                                onClose={close}
                            />
                        </>
                    )}
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
