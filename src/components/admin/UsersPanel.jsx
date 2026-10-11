import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi.js';
import { getErrorMessage } from '../../api/api.js';

const ROLE_STYLES = {
    Admin: 'bg-[#232F3E] text-white',
    Moderator: 'bg-[#E3F2FD] text-[#0D47A1]',
    Seller: 'bg-[#E8F5E9] text-[#1B5E20]',
    Customer: 'bg-[#F0F2F2] text-[#0F1111]',
    Guest: 'bg-[#F0F2F2] text-[#565959]',
};

function RoleBadge({ role }) {
    return (
        <span className={`inline-block rounded px-2 py-0.5 text-[12px] ${ROLE_STYLES[role] || ROLE_STYLES.Customer}`}>
            {role}
        </span>
    );
}

const buttonClass =
    'px-3 py-1 text-[12px] bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * The admin page's "Users" section.
 *   - Admins and moderators can make a Customer a seller.
 *   - Only admins can make a Customer or Seller a moderator.
 *   - Admins and moderators themselves are never changed here (the backend refuses it too;
 *     the buttons are just hidden so nobody clicks into an error).
 * The backend enforces every rule; hiding buttons below is only convenience.
 */
function UsersPanel({ isAdmin }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [query, setQuery] = useState('');
    const [busyId, setBusyId] = useState(null);
    const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text }

    const load = useCallback(async () => {
        setLoading(true);
        setLoadError('');
        try {
            const data = await adminApi.getAllUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load users', err);
            setLoadError(getErrorMessage(err, 'Could not load users.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const visibleUsers = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return users;
        return users.filter(
            (u) =>
                (u.name || '').toLowerCase().includes(needle) ||
                (u.email || '').toLowerCase().includes(needle)
        );
    }, [users, query]);

    const canMakeSeller = (u) => !u.isBanned && (u.role === 'Customer' || u.role === 'Guest');
    const canMakeModerator = (u) => isAdmin && !u.isBanned && (u.role === 'Customer' || u.role === 'Seller');

    const promote = async (user, target) => {
        const who = user.name || user.email || `#${user.id}`;
        const what = target === 'moderator' ? 'a moderator' : 'a seller';
        if (!window.confirm(`Make ${who} ${what}?`)) return;

        setBusyId(user.id);
        setNotice(null);
        try {
            const updated =
                target === 'moderator'
                    ? await adminApi.makeModerator(user.id)
                    : await adminApi.makeSeller(user.id);

            setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
            setNotice({
                type: 'success',
                text: `${who} is now ${what}. They need to sign in again before the new role applies.`,
            });
        } catch (err) {
            console.error('Failed to change role', err);
            setNotice({ type: 'error', text: getErrorMessage(err, 'Could not change this role.') });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className='bg-white border border-[#DDDDDD] rounded p-6'>
            <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
                <div>
                    <h2 className='text-[18px] font-bold text-[#0F1111]'>Users</h2>
                    <p className='text-[13px] text-[#565959]'>
                        {isAdmin
                            ? 'Make a customer a seller or a moderator.'
                            : 'Make a customer a seller.'}
                    </p>
                </div>
                <span className='text-[13px] text-[#565959]'>{users.length} total</span>
            </div>

            <input
                type='search'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search by name or email'
                aria-label='Search users'
                className='w-full max-w-[360px] p-2 mb-4 text-[13px] border border-[#a6a6a6] rounded outline-none focus:ring-2 focus:ring-[#888C8D]'
            />

            {notice && (
                <div
                    role={notice.type === 'error' ? 'alert' : 'status'}
                    className={`mb-4 px-3 py-2 text-[13px] rounded border ${
                        notice.type === 'error'
                            ? 'text-[#C40000] bg-[#FDF0F0] border-[#C40000]'
                            : 'text-[#007600] bg-[#F0F9F0] border-[#007600]'
                    }`}
                >
                    {notice.text}
                </div>
            )}

            {loading && <p className='text-[13px] text-[#565959]'>Loading users…</p>}

            {loadError && !loading && (
                <div className='text-[13px] text-[#C40000]'>
                    <p role='alert'>{loadError}</p>
                    <button type='button' onClick={load} className={`${buttonClass} mt-2`}>
                        Try again
                    </button>
                </div>
            )}

            {!loading && !loadError && visibleUsers.length === 0 && (
                <p className='text-[13px] text-[#565959]'>
                    {users.length === 0 ? 'No users yet.' : 'No users match your search.'}
                </p>
            )}

            {!loading && !loadError && visibleUsers.length > 0 && (
                <div className='overflow-x-auto'>
                    <table className='w-full text-[13px] text-left'>
                        <thead>
                            <tr className='border-b border-[#DDDDDD] text-[#565959]'>
                                <th className='py-2 pr-4 font-medium'>Name</th>
                                <th className='py-2 pr-4 font-medium'>Email</th>
                                <th className='py-2 pr-4 font-medium'>Role</th>
                                <th className='py-2 pr-4 font-medium'>Status</th>
                                <th className='py-2 font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleUsers.map((u) => {
                                const busy = busyId === u.id;
                                return (
                                    <tr key={u.id} className='border-b border-[#EEEEEE]'>
                                        <td className='py-2 pr-4 break-words'>{u.name || '—'}</td>
                                        <td className='py-2 pr-4 break-all'>{u.email || '—'}</td>
                                        <td className='py-2 pr-4'>
                                            <RoleBadge role={u.role} />
                                        </td>
                                        <td className='py-2 pr-4'>
                                            {u.isBanned ? (
                                                <span className='text-[#C40000]'>Banned</span>
                                            ) : (
                                                <span className='text-[#565959]'>Active</span>
                                            )}
                                        </td>
                                        <td className='py-2'>
                                            <div className='flex flex-wrap gap-2'>
                                                {canMakeSeller(u) && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => promote(u, 'seller')}
                                                        className={buttonClass}
                                                    >
                                                        {busy ? 'Working…' : 'Make seller'}
                                                    </button>
                                                )}
                                                {canMakeModerator(u) && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => promote(u, 'moderator')}
                                                        className={buttonClass}
                                                    >
                                                        {busy ? 'Working…' : 'Make moderator'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default UsersPanel;
