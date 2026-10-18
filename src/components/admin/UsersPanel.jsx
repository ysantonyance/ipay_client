import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi } from '../../api/adminApi.js';
import { getErrorMessage } from '../../api/api.js';
import {useLanguage} from "../../context/LanguageContext.jsx";

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
 *   - Admins and moderators can make a Customer a seller, and turn a Seller back into a Customer.
 *   - Only admins can make a Customer or Seller a moderator, and remove the moderator role from a Moderator.
 *   - Admins can ban and unban anyone except admins; moderators can ban and unban customers and sellers only.
 *   - Nobody can be made an admin here, and existing admins are never changed (the backend refuses
 *     anything else too; the buttons are just hidden so nobody clicks into an error).
 * The backend enforces every rule; hiding buttons below is only convenience.
 */
function UsersPanel({ isAdmin }) {
    const {t} = useLanguage();
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
    // Demotions (banned users can be demoted too).
    const canRemoveModerator = (u) => isAdmin && u.role === 'Moderator';
    const canMakeCustomer = (u) => u.role === 'Seller';
    // Admins can never be banned; moderators can't be banned by other moderators.
    const canModerate = (u) => u.role !== 'Admin' && (isAdmin || u.role !== 'Moderator');
    const canBan = (u) => !u.isBanned && canModerate(u);
    const canUnban = (u) => u.isBanned && canModerate(u);

    // `action` is one of the keys below; each one has its own confirm text, API call and success message.
    const ACTIONS = {
        seller: {
            call: adminApi.makeSeller,
            confirm: (who) => `Make ${who} a seller?`,
            done: (who) => `${who} is now a seller.`,
        },
        moderator: {
            call: adminApi.makeModerator,
            confirm: (who) => `Make ${who} a moderator?`,
            done: (who) => `${who} is now a moderator.`,
        },
        removeModerator: {
            call: adminApi.removeModerator,
            confirm: (who) => `Remove the moderator role from ${who}? They will become a customer.`,
            done: (who) => `${who} is no longer a moderator and is now a customer.`,
        },
        customer: {
            call: adminApi.makeCustomer,
            confirm: (who) => `Make ${who} a customer again? They will lose their seller role.`,
            done: (who) => `${who} is now a customer.`,
        },
        ban: {
            call: (id) => adminApi.banUser(id, isAdmin),
            confirm: (who) => `Ban ${who}?`,
            done: (who) => `${who} is now banned.`,
            relogin: false,
        },
        unban: {
            call: (id) => adminApi.unbanUser(id, isAdmin),
            confirm: (who) => `Unban ${who}?`,
            done: (who) => `${who} is no longer banned.`,
            relogin: false,
        },
    };

    const changeRole = async (user, action) => {
        const who = user.name || user.email || `#${user.id}`;
        const { call, confirm, done, relogin = true } = ACTIONS[action];
        if (!window.confirm(confirm(who))) return;

        setBusyId(user.id);
        setNotice(null);
        try {
            const updated = await call(user.id);

            setUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
            setNotice({
                type: 'success',
                text: relogin
                    ? `${done(who)} They need to sign in again before the new role applies.`
                    : done(who),
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
                    <h2 className='text-[18px] font-bold text-[#0F1111]'>{t("Users")}</h2>
                    <p className='text-[13px] text-[#565959]'>
                        {isAdmin
                            ? 'Change roles (seller, moderator, or back to customer) and ban or unban users.'
                            : 'Make a customer a seller or turn a seller back into a customer, and ban or unban customers and sellers.'}
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

            {loading && <p className='text-[13px] text-[#565959]'>{t("Loading users…")}</p>}

            {loadError && !loading && (
                <div className='text-[13px] text-[#C40000]'>
                    <p role='alert'>{loadError}</p>
                    <button type='button' onClick={load} className={`${buttonClass} mt-2`}>
                        {t("Try again")}
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
                                <th className='py-2 pr-4 font-medium'>{t("Name")}</th>
                                <th className='py-2 pr-4 font-medium'>{t("Email")}</th>
                                <th className='py-2 pr-4 font-medium'>{t("Role")}</th>
                                <th className='py-2 pr-4 font-medium'>{t("Status")}</th>
                                <th className='py-2 font-medium'>{t("Actions")}</th>
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
                                                <span className='text-[#C40000]'>{t("Banned")}</span>
                                            ) : (
                                                <span className='text-[#565959]'>{t("Active")}</span>
                                            )}
                                        </td>
                                        <td className='py-2'>
                                            <div className='flex flex-wrap gap-2'>
                                                {canMakeSeller(u) && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => changeRole(u, 'seller')}
                                                        className={buttonClass}
                                                    >
                                                        {busy ? 'Working…' : 'Make seller'}
                                                    </button>
                                                )}
                                                {canMakeModerator(u) && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => changeRole(u, 'moderator')}
                                                        className={buttonClass}
                                                    >
                                                        {busy ? 'Working…' : 'Make moderator'}
                                                    </button>
                                                )}
                                                {canMakeCustomer(u) && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => changeRole(u, 'customer')}
                                                        className={buttonClass}
                                                    >
                                                        {busy ? 'Working…' : 'Make customer'}
                                                    </button>
                                                )}
                                                {canRemoveModerator(u) && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => changeRole(u, 'removeModerator')}
                                                        className={buttonClass}
                                                    >
                                                        {busy ? 'Working…' : 'Remove moderator'}
                                                    </button>
                                                )}
                                                {canBan(u) && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => changeRole(u, 'ban')}
                                                        className={`${buttonClass} text-[#C40000]`}
                                                    >
                                                        {busy ? 'Working…' : 'Ban'}
                                                    </button>
                                                )}
                                                {canUnban(u) && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => changeRole(u, 'unban')}
                                                        className={buttonClass}
                                                    >
                                                        {busy ? 'Working…' : 'Unban'}
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
