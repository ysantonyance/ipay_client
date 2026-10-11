import { useCallback, useEffect, useMemo, useState } from 'react';
import { sellerRequestsApi } from '../../api/sellerRequestsApi.js';
import { getErrorMessage } from '../../api/api.js';

const STATUS_STYLES = {
    Pending: 'bg-[#FFF3E0] text-[#8A4B00]',
    Approved: 'bg-[#E8F5E9] text-[#1B5E20]',
    Rejected: 'bg-[#FDF0F0] text-[#C40000]',
};

const buttonClass =
    'px-3 py-1 text-[12px] bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';

function formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

/**
 * The admin page's "Seller requests" section: customers who asked to become sellers.
 * Admins and moderators can approve (the customer becomes a seller and has to sign in again) or reject.
 */
function SellerRequestsPanel() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [filter, setFilter] = useState('Pending'); // 'Pending' | 'All'
    const [busyId, setBusyId] = useState(null);
    const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text }

    const load = useCallback(async () => {
        setLoading(true);
        setLoadError('');
        try {
            const data = await sellerRequestsApi.getAll();
            setRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load seller requests', err);
            setLoadError(getErrorMessage(err, 'Could not load seller requests.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const pendingCount = useMemo(() => requests.filter((r) => r.status === 'Pending').length, [requests]);
    const visible = useMemo(
        () => (filter === 'Pending' ? requests.filter((r) => r.status === 'Pending') : requests),
        [requests, filter]
    );

    const review = async (request, action) => {
        const who = request.userName || request.email || `#${request.userId}`;
        const approve = action === 'approve';
        const question = approve
            ? `Approve ${who} as a seller? They will be signed out and can sell after signing in again.`
            : `Reject ${who}'s request?`;
        if (!window.confirm(question)) return;

        setBusyId(request.id);
        setNotice(null);
        try {
            const updated = await (approve ? sellerRequestsApi.approve : sellerRequestsApi.reject)(request.id);
            setRequests((list) => list.map((r) => (r.id === updated.id ? updated : r)));
            setNotice({
                type: 'success',
                text: approve ? `${who} is now a seller.` : `${who}'s request was rejected.`,
            });
        } catch (err) {
            console.error('Failed to review seller request', err);
            setNotice({ type: 'error', text: getErrorMessage(err, 'Could not update this request.') });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className='bg-white border border-[#DDDDDD] rounded p-6'>
            <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
                <div>
                    <h2 className='text-[18px] font-bold text-[#0F1111]'>Seller requests</h2>
                    <p className='text-[13px] text-[#565959]'>
                        Customers who asked to start selling. {pendingCount} waiting for review.
                    </p>
                </div>

                <label className='flex items-center gap-2 text-[13px] text-[#565959]'>
                    Show
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className='border border-[#a6a6a6] rounded px-2 py-1 bg-white text-[#0F1111] cursor-pointer'
                    >
                        <option value='Pending'>Pending only</option>
                        <option value='All'>All requests</option>
                    </select>
                </label>
            </div>

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

            {loading && <p className='text-[13px] text-[#565959]'>Loading requests…</p>}

            {loadError && !loading && (
                <div className='text-[13px] text-[#C40000]'>
                    <p role='alert'>{loadError}</p>
                    <button type='button' onClick={load} className={`${buttonClass} mt-2`}>
                        Try again
                    </button>
                </div>
            )}

            {!loading && !loadError && visible.length === 0 && (
                <p className='text-[13px] text-[#565959]'>
                    {requests.length === 0 ? 'Nobody has asked to become a seller yet.' : 'No pending requests.'}
                </p>
            )}

            {!loading && !loadError && visible.length > 0 && (
                <div className='overflow-x-auto'>
                    <table className='w-full text-[13px] text-left'>
                        <thead>
                            <tr className='border-b border-[#DDDDDD] text-[#565959]'>
                                <th className='py-2 pr-4 font-medium'>Customer</th>
                                <th className='py-2 pr-4 font-medium'>Message</th>
                                <th className='py-2 pr-4 font-medium'>Requested</th>
                                <th className='py-2 pr-4 font-medium'>Status</th>
                                <th className='py-2 font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((r) => {
                                const busy = busyId === r.id;
                                return (
                                    <tr key={r.id} className='border-b border-[#EEEEEE] align-top'>
                                        <td className='py-2 pr-4 break-words'>
                                            <div className='text-[#0F1111]'>{r.userName || '—'}</div>
                                            <div className='text-[#565959] break-all'>{r.email || '—'}</div>
                                        </td>
                                        <td className='py-2 pr-4 max-w-[320px] whitespace-pre-wrap break-words'>
                                            {r.message || <span className='text-[#565959]'>—</span>}
                                        </td>
                                        <td className='py-2 pr-4 whitespace-nowrap'>{formatDate(r.createdAt)}</td>
                                        <td className='py-2 pr-4'>
                                            <span
                                                className={`inline-block rounded px-2 py-0.5 text-[12px] ${
                                                    STATUS_STYLES[r.status] || STATUS_STYLES.Pending
                                                }`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className='py-2'>
                                            {r.status === 'Pending' ? (
                                                <div className='flex flex-wrap gap-2'>
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => review(r, 'approve')}
                                                        className={buttonClass}
                                                    >
                                                        {busy ? 'Working…' : 'Approve'}
                                                    </button>
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => review(r, 'reject')}
                                                        className={`${buttonClass} text-[#C40000]`}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className='text-[#565959]'>
                                                    Reviewed {r.reviewedAt ? formatDate(r.reviewedAt) : ''}
                                                </span>
                                            )}
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

export default SellerRequestsPanel;
