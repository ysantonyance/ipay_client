import {useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {ordersApi} from "../api/ordersApi.js";
import {getErrorMessage} from "../api/api.js";
import {normalizeStatus} from "../utils/orderStatus.js";

const STATUS_INFO = {
    Pending:   {label: 'Order placed',        text: "We've received your order and are waiting for payment to clear.", badge: 'bg-[#FFF4D6] text-[#8A5A00]'},
    Paid:      {label: 'Payment confirmed',   text: 'Payment received. Your order is being prepared for shipping.',    badge: 'bg-[#E3F0FA] text-[#0B5A8C]'},
    Shipped:   {label: 'Shipped',             text: 'Your order is on its way.',                                       badge: 'bg-[#E3F0FA] text-[#0B5A8C]'},
    Delivered: {label: 'Delivered',           text: 'Your order has been delivered.',                                  badge: 'bg-[#DDF3EA] text-[#067D62]'},
    Cancelled: {label: 'Cancelled',           text: 'This order was cancelled.',                                       badge: 'bg-[#FBE4E4] text-[#B12704]'},
};

const STEPS = ['Pending', 'Paid', 'Shipped', 'Delivered'];
const STEP_LABELS = {Pending: 'Placed', Paid: 'Paid', Shipped: 'Shipped', Delivered: 'Delivered'};

const money = v => `$${Number(v ?? 0).toFixed(2)}`;

const formatDate = d => {
    if (!d) return '';
    // The API sends UTC without a "Z" suffix, so add one before parsing.
    const date = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(d) ? d : `${d}Z`);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'});
};

const formatTime = d => d.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', second: '2-digit'});

function StatusTracker({status}) {
    if (status === 'Cancelled')
        return <p className='text-sm text-[#B12704] font-semibold'>This order was cancelled.</p>;

    const current = STEPS.indexOf(status);

    return (
        <ol className='flex items-start w-full'>
            {STEPS.map((step, idx) => {
                const done = idx <= current;
                return (
                    <li key={step} className='flex-1 flex flex-col items-center relative'>
                        {idx > 0 && (
                            <span className={`absolute top-3 right-1/2 w-full h-1 ${idx <= current ? 'bg-[#067D62]' : 'bg-gray-300'}`}/>
                        )}
                        <span className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                            ${done ? 'bg-[#067D62] text-white' : 'bg-gray-300 text-gray-600'}`}>
                            {done ? '✓' : idx + 1}
                        </span>
                        <span className={`mt-1 text-xs text-center ${idx === current ? 'font-bold' : 'text-gray-600'}`}>
                            {STEP_LABELS[step]}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

function OrderCard({order, onRefresh, refreshing, checkedAt, checkError, onCancel, cancelling, cancelError}) {
    const [open, setOpen] = useState(false);
    const status = normalizeStatus(order.status);
    const info = STATUS_INFO[status];
    // Customers can cancel until the order ships.
    const canCancel = status === 'Pending' || status === 'Paid';
    const items = order.items ?? [];
    const count = order.totalQuantity ?? items.reduce((n, i) => n + i.quantity, 0);
    const total = order.totalAmount ?? items.reduce((s, i) => s + (i.totalPrice ?? i.price * i.quantity), 0);

    return (
        <div className='bg-white rounded border border-[#D5D9D9] overflow-hidden'>
            <div className='bg-[#F0F2F2] px-4 py-3 flex flex-wrap gap-x-8 gap-y-2 text-xs text-gray-600'>
                <div>
                    <p className='uppercase'>Order placed</p>
                    <p className='text-sm text-black'>{formatDate(order.createdAt)}</p>
                </div>
                <div>
                    <p className='uppercase'>Total</p>
                    <p className='text-sm text-black'>{money(total)}</p>
                </div>
                <div className='sm:ml-auto'>
                    <p className='uppercase'>Order # {order.id}</p>
                    <button type='button' onClick={() => setOpen(o => !o)}
                            className='text-sm text-[#007185] hover:underline cursor-pointer'>
                        {open ? 'Hide details' : 'View order details'}
                    </button>
                </div>
            </div>

            <div className='p-4 space-y-4'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                    <div>
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${info.badge}`}>{info.label}</span>
                        <p className='text-sm mt-2'>{info.text}</p>
                    </div>
                    <div className='text-right'>
                        <button type='button' onClick={() => onRefresh(order.id)} disabled={refreshing}
                                className='bg-[#FFD814] hover:bg-[#F7CA00] rounded-full px-4 py-1.5 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
                            {refreshing ? 'Checking…' : 'Check status'}
                        </button>
                        {checkError ? (
                            <p className='text-xs text-[#D32F2F] mt-1'>{checkError}</p>
                        ) : checkedAt && (
                            <p className='text-xs text-gray-500 mt-1'>Last checked {formatTime(checkedAt)}</p>
                        )}
                        {canCancel && (
                            <div className='mt-2'>
                                <button type='button' onClick={() => onCancel(order.id)} disabled={cancelling}
                                        className='border border-[#B12704] text-[#B12704] bg-white hover:bg-[#FDF0F0] rounded-full px-4 py-1.5 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
                                    {cancelling ? 'Cancelling…' : 'Cancel order'}
                                </button>
                                {cancelError && (
                                    <p role='alert' className='text-xs text-[#D32F2F] mt-1'>{cancelError}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <StatusTracker status={status}/>

                {open && (
                    <div className='border-t border-[#E7E7E7] pt-3'>
                        <h3 className='font-bold text-sm mb-2'>Items ({count})</h3>
                        {items.length === 0 ? (
                            <p className='text-sm text-gray-500'>No item details available.</p>
                        ) : items.map(i => (
                            <div key={i.id} className='flex justify-between gap-4 py-2 border-b border-[#F0F2F2] last:border-0 text-sm'>
                                <div className='min-w-0'>
                                    {i.productId ? (
                                        <Link to={`/products/${i.productId}`}
                                              className='text-[#007185] hover:underline'>
                                            {i.productName ?? `Product #${i.productId}`}
                                        </Link>
                                    ) : <span>{i.productName}</span>}
                                    <p className='text-gray-500'>Qty: {i.quantity} × {money(i.price)}</p>
                                </div>
                                <span className='font-semibold shrink-0'>{money(i.totalPrice ?? i.price * i.quantity)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Orders() {
    const {isLoggedIn, userId} = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshingId, setRefreshingId] = useState(null);
    const [checks, setChecks] = useState({}); // orderId -> {at: Date, error?: string}
    const [cancellingId, setCancellingId] = useState(null);
    const [cancelErrors, setCancelErrors] = useState({}); // orderId -> message
    const [filter, setFilter] = useState('All');

    const load = useCallback(async () => {
        if (!isLoggedIn || !userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const data = await ordersApi.getByUser(userId);
            const list = Array.isArray(data) ? data : [];
            // Newest first.
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id);
            setOrders(list);
        } catch (err) {
            setError(getErrorMessage(err, 'Could not load your orders.'));
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, userId]);

    useEffect(() => {
        load();
    }, [load]);

    // Re-fetches one order so the person can see whether its status has moved on.
    const checkStatus = async id => {
        setRefreshingId(id);
        try {
            const fresh = await ordersApi.getById(id);
            setOrders(prev => prev.map(o => o.id === id ? fresh : o));
            setChecks(prev => ({...prev, [id]: {at: new Date()}}));
        } catch (err) {
            setChecks(prev => ({...prev, [id]: {at: new Date(), error: getErrorMessage(err, 'Could not check this order.')}}));
        } finally {
            setRefreshingId(null);
        }
    };

    // The person cancelling their own order. The server only allows it before the order ships.
    const cancelOrder = async id => {
        if (!window.confirm(`Cancel order #${id}? This can't be undone.`)) return;

        setCancellingId(id);
        setCancelErrors(prev => ({...prev, [id]: ''}));
        try {
            const updated = await ordersApi.cancel(id);
            setOrders(prev => prev.map(o =>
                o.id === id ? (updated?.id ? updated : {...o, status: 'Cancelled'}) : o));
        } catch (err) {
            setCancelErrors(prev => ({...prev, [id]: getErrorMessage(err, 'Could not cancel this order.')}));
        } finally {
            setCancellingId(null);
        }
    };

    const wrap = children => (
        <div className='bg-[#EAEDED] lg:px-20 min-h-[60vh]'>
            <div className='p-3 sm:p-10 max-w-[1000px] mx-auto'>{children}</div>
        </div>
    );

    if (!isLoggedIn)
        return wrap(
            <div className='bg-white p-6 sm:p-10 rounded text-center'>
                <h1 className='text-2xl font-bold mb-2'>Your Orders</h1>
                <p className='text-sm mb-4'>Sign in to see the orders you've placed.</p>
                <Link to='/login' className='inline-block bg-[#FFD814] hover:bg-[#F7CA00] rounded-full px-6 py-2 text-sm'>
                    Sign in
                </Link>
            </div>
        );

    const filters = ['All', 'In progress', 'Delivered', 'Cancelled'];
    const visible = orders.filter(o => {
        const s = normalizeStatus(o.status);
        if (filter === 'In progress') return s !== 'Delivered' && s !== 'Cancelled';
        if (filter === 'All') return true;
        return s === filter;
    });

    return wrap(
        <>
            <div className='flex flex-wrap items-center justify-between gap-2 mb-4'>
                <h1 className='text-2xl font-bold'>Your Orders</h1>
                <button type='button' onClick={load} disabled={loading}
                        className='border border-[#898D8E] bg-white hover:bg-[#F6FAFB] rounded-full px-4 py-1.5 text-sm cursor-pointer disabled:opacity-50'>
                    {loading ? 'Refreshing…' : 'Refresh all'}
                </button>
            </div>

            <div className='flex flex-wrap gap-2 mb-4'>
                {filters.map(f => (
                    <button key={f} type='button' onClick={() => setFilter(f)}
                            className={`rounded-full px-4 py-1 text-sm border cursor-pointer
                                ${filter === f ? 'bg-[#232F3E] text-white border-[#232F3E]' : 'bg-white border-[#D5D9D9] hover:bg-[#F6FAFB]'}`}>
                        {f}
                    </button>
                ))}
            </div>

            {error && (
                <div className='bg-white border border-[#D32F2F] text-[#D32F2F] rounded p-3 text-sm mb-4'>
                    {error}
                </div>
            )}

            {loading && orders.length === 0 ? (
                <p className='bg-white rounded p-6 text-sm text-gray-600'>Loading your orders…</p>
            ) : orders.length === 0 && !error ? (
                <div className='bg-white rounded p-6 sm:p-10 text-center'>
                    <h2 className='text-xl font-bold mb-2'>You haven't placed any orders yet</h2>
                    <Link to='/products' className='inline-block bg-[#FFD814] hover:bg-[#F7CA00] rounded-full px-6 py-2 text-sm mt-2'>
                        Start shopping
                    </Link>
                </div>
            ) : visible.length === 0 ? (
                <p className='bg-white rounded p-6 text-sm text-gray-600'>No orders match this filter.</p>
            ) : (
                <div className='space-y-4'>
                    {visible.map(o => (
                        <OrderCard key={o.id}
                                   order={o}
                                   onRefresh={checkStatus}
                                   refreshing={refreshingId === o.id}
                                   checkedAt={checks[o.id]?.at}
                                   checkError={checks[o.id]?.error}
                                   onCancel={cancelOrder}
                                   cancelling={cancellingId === o.id}
                                   cancelError={cancelErrors[o.id]}/>
                    ))}
                </div>
            )}
        </>
    );
}

export default Orders;
