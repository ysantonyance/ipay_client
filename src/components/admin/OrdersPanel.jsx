import { useCallback, useEffect, useMemo, useState } from 'react';
import { ordersApi } from '../../api/ordersApi.js';
import { adminApi } from '../../api/adminApi.js';
import { getErrorMessage } from '../../api/api.js';
import { STATUS_NAMES, normalizeStatus, statusToNumber } from '../../utils/orderStatus.js';
import {useLanguage} from "../../context/LanguageContext.jsx";

const STATUS_STYLES = {
    Pending: 'bg-[#FFF3E0] text-[#8A4B00]',
    Paid: 'bg-[#E3F0FA] text-[#0B5A8C]',
    Shipped: 'bg-[#E3F0FA] text-[#0B5A8C]',
    Delivered: 'bg-[#E8F5E9] text-[#1B5E20]',
    Cancelled: 'bg-[#FDF0F0] text-[#C40000]',
};

const buttonClass =
    'px-3 py-1 text-[12px] bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';

const money = (v) => `$${Number(v ?? 0).toFixed(2)}`;

function formatDate(value) {
    if (!value) return '—';
    // The API sends UTC without a "Z" suffix, so add one before parsing.
    const date = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value}Z`);
    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

/**
 * The admin page's "Orders" section: every order, with Pending / Not pending / Cancelled / All tabs, a status
 * dropdown and a Cancel order button on each row. Shown to admins and moderators (the Admin page already blocks everyone else).
 */
function OrdersPanel() {
    const {t} = useLanguage();
    const [orders, setOrders] = useState([]);
    const [userLookup, setUserLookup] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [filter, setFilter] = useState('Pending'); // 'Pending' | 'NotPending' | 'Cancelled' | 'All'
    const [busyId, setBusyId] = useState(null);
    const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text }
    const [expandedId, setExpandedId] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setLoadError('');
        try {
            const data = await ordersApi.getAll();
            const list = Array.isArray(data) ? data : [];
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id);
            setOrders(list);
        } catch (err) {
            console.error('Failed to load orders', err);
            setLoadError(getErrorMessage(err, 'Could not load orders.'));
        } finally {
            setLoading(false);
        }

        // Names are a nicety: if this fails the table just shows "User #id".
        try {
            const users = await adminApi.getAllUsers();
            setUserLookup(
                Object.fromEntries((Array.isArray(users) ? users : []).map((u) => [u.id, u.name || u.email]))
            );
        } catch {
            setUserLookup({});
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const counts = useMemo(() => {
        const c = { Pending: 0, NotPending: 0, Cancelled: 0, All: orders.length };
        for (const o of orders) {
            const s = normalizeStatus(o.status);
            if (s === 'Pending') c.Pending += 1;
            else if (s === 'Cancelled') c.Cancelled += 1;
            else c.NotPending += 1;
        }
        return c;
    }, [orders]);
    const pendingCount = counts.Pending;

    const visible = useMemo(
        () =>
            orders.filter((o) => {
                const s = normalizeStatus(o.status);
                if (filter === 'Pending') return s === 'Pending';
                if (filter === 'NotPending') return s !== 'Pending' && s !== 'Cancelled';
                if (filter === 'Cancelled') return s === 'Cancelled';
                return true;
            }),
        [orders, filter]
    );

    const changeStatus = async (order, nextStatus) => {
        const current = normalizeStatus(order.status);
        if (nextStatus === current) return;
        if (
            nextStatus === 'Cancelled' &&
            !window.confirm(`Cancel order #${order.id}? The customer will see it as cancelled.`)
        )
            return;

        setBusyId(order.id);
        setNotice(null);
        try {
            await ordersApi.updateStatus(order.id, statusToNumber(nextStatus));
            setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o)));
            setNotice({ type: 'success', text: `Order #${order.id} is now ${nextStatus}.` });
        } catch (err) {
            console.error('Failed to update order status', err);
            setNotice({ type: 'error', text: getErrorMessage(err, `Could not update order #${order.id}.`) });
        } finally {
            setBusyId(null);
        }
    };

    return (
        <section className='bg-white border border-[#DDDDDD] rounded p-6'>
            <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
                <div>
                    <h2 className='text-[18px] font-bold text-[#0F1111]'>{t("Orders")}</h2>
                    <p className='text-[13px] text-[#565959]'>
                        {orders.length} total, {pendingCount} pending, {counts.Cancelled} cancelled.
                    </p>
                </div>

                <div className='flex items-center gap-3'>
                    <button type='button' onClick={load} disabled={loading} className={buttonClass}>
                        {loading ? 'Loading…' : 'Refresh'}
                    </button>
                </div>
            </div>

            <div className='flex flex-wrap gap-2 mb-4' role='tablist' aria-label='Order filter'>
                {[
                    ['Pending', 'Pending'],
                    ['NotPending', 'Not pending'],
                    ['Cancelled', 'Cancelled'],
                    ['All', 'All orders'],
                ].map(([key, label]) => (
                    <button
                        key={key}
                        type='button'
                        role='tab'
                        aria-selected={filter === key}
                        onClick={() => setFilter(key)}
                        className={`px-3 py-1 text-[13px] rounded border cursor-pointer ${
                            filter === key
                                ? 'bg-[#232F3E] text-white border-[#232F3E]'
                                : 'bg-white text-[#0F1111] border-[#D5D9D9] hover:bg-[#F7FAFA]'
                        }`}
                    >
                        {label} ({counts[key]})
                    </button>
                ))}
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

            {loading && orders.length === 0 && <p className='text-[13px] text-[#565959]'>{t("Loading orders…")}</p>}

            {loadError && !loading && (
                <div className='text-[13px] text-[#C40000]'>
                    <p role='alert'>{loadError}</p>
                    <button type='button' onClick={load} className={`${buttonClass} mt-2`}>
                        {t("Try again")}
                    </button>
                </div>
            )}

            {!loading && !loadError && visible.length === 0 && (
                <p className='text-[13px] text-[#565959]'>
                    {orders.length === 0
                        ? 'No orders have been placed yet.'
                        : filter === 'Pending'
                          ? 'No pending orders.'
                          : filter === 'Cancelled'
                            ? 'No cancelled orders.'
                            : 'No orders match this filter.'}
                </p>
            )}

            {!loadError && visible.length > 0 && (
                <div className='overflow-x-auto'>
                    <table className='w-full text-[13px] text-left'>
                        <thead>
                            <tr className='border-b border-[#DDDDDD] text-[#565959]'>
                                <th className='py-2 pr-4 font-medium'>{t("Order")}</th>
                                <th className='py-2 pr-4 font-medium'>{t("Customer")}</th>
                                <th className='py-2 pr-4 font-medium'>{t("Placed")}</th>
                                <th className='py-2 pr-4 font-medium'>{t("Total")}</th>
                                <th className='py-2 pr-4 font-medium'>{t("Status")}</th>
                                <th className='py-2 font-medium'>{t("Change status")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((o) => {
                                const status = normalizeStatus(o.status);
                                const busy = busyId === o.id;
                                const open = expandedId === o.id;
                                const items = o.items ?? [];
                                return (
                                    <FragmentRow key={o.id}>
                                        <tr className='border-b border-[#EEEEEE] align-top'>
                                            <td className='py-2 pr-4 whitespace-nowrap'>
                                                <div className='text-[#0F1111]'>#{o.id}</div>
                                                <button
                                                    type='button'
                                                    onClick={() => setExpandedId(open ? null : o.id)}
                                                    className='text-[12px] text-[#007185] hover:underline cursor-pointer'
                                                >
                                                    {open ? 'Hide items' : `${o.totalQuantity ?? items.length} item(s)`}
                                                </button>
                                            </td>
                                            <td className='py-2 pr-4 break-words'>
                                                {userLookup[o.userId] || `User #${o.userId}`}
                                            </td>
                                            <td className='py-2 pr-4 whitespace-nowrap'>{formatDate(o.createdAt)}</td>
                                            <td className='py-2 pr-4 whitespace-nowrap'>{money(o.totalAmount)}</td>
                                            <td className='py-2 pr-4'>
                                                <span
                                                    className={`inline-block rounded px-2 py-0.5 text-[12px] ${STATUS_STYLES[status]}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>
                                            <td className='py-2'>
                                                <select
                                                    value={status}
                                                    disabled={busy}
                                                    onChange={(e) => changeStatus(o, e.target.value)}
                                                    aria-label={`Change status of order ${o.id}`}
                                                    className='border border-[#a6a6a6] rounded px-2 py-1 bg-white text-[#0F1111] cursor-pointer disabled:opacity-50'
                                                >
                                                    {STATUS_NAMES.map((s) => (
                                                        <option key={s} value={s}>
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                                {status !== 'Cancelled' && (
                                                    <button
                                                        type='button'
                                                        disabled={busy}
                                                        onClick={() => changeStatus(o, 'Cancelled')}
                                                        className={`${buttonClass} ml-2 text-[#C40000]`}
                                                    >
                                                        {t("Cancel order")}
                                                    </button>
                                                )}
                                                {busy && <span className='ml-2 text-[12px] text-[#565959]'>{t("Saving…")}</span>}
                                            </td>
                                        </tr>
                                        {open && (
                                            <tr className='border-b border-[#EEEEEE] bg-[#FAFAFA]'>
                                                <td colSpan={6} className='py-2 px-3'>
                                                    {items.length === 0 ? (
                                                        <span className='text-[#565959]'>{t("No item details.")}</span>
                                                    ) : (
                                                        <ul className='space-y-1'>
                                                            {items.map((i) => (
                                                                <li key={i.id} className='flex justify-between gap-4'>
                                                                    <span>
                                                                        {i.productName ?? `Product #${i.productId}`} ×{' '}
                                                                        {i.quantity}
                                                                    </span>
                                                                    <span>{money(i.totalPrice ?? i.price * i.quantity)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </FragmentRow>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

// A keyed wrapper for the two rows per order (the main row and its expandable items row).
function FragmentRow({ children }) {
    return <>{children}</>;
}

export default OrdersPanel;
