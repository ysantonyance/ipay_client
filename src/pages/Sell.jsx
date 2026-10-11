import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { sellerRequestsApi } from '../api/sellerRequestsApi.js';
import { productsApi } from '../api/productsApi.js';
import { categoriesApi } from '../api/categoriesApi.js';
import { manufacturersApi } from '../api/manufacturersApi.js';
import { getErrorMessage } from '../api/api.js';
import ResourceForm from '../components/admin/ResourceForm.jsx';
import ResourceTable from '../components/admin/ResourceTable.jsx';
import useAdminResource from '../hooks/useAdminResource.js';

// The seller's own catalogue, in the same schema shape the admin page uses so the same form and table work.
// (Declared once at module level: useAdminResource reloads whenever the schema object changes.)
// There is deliberately no rating field - ratings come from customers, see RatingStars.
const MY_PRODUCTS_SCHEMA = {
    label: 'Products',
    singular: 'product',
    api: {
        create: productsApi.createAsSeller,
        update: productsApi.updateAsSeller,
        delete: productsApi.delete,
    },
    // The backend only returns products whose seller id matches the logged-in seller.
    list: () => productsApi.getMine(),
    fields: [
        { key: 'name', label: 'Name', required: true },
        { key: 'price', label: 'Price', type: 'number', step: '0.01', min: 0 },
        { key: 'discountedPrice', label: 'Discounted price', type: 'number', step: '0.01', min: 0 },
        { key: 'discountPercent', label: 'Discount %', type: 'number', step: '0.1', min: 0, max: 100 },
        { key: 'manufacturer', label: 'Manufacturer', type: 'manufacturer-select', required: true },
        { key: 'categoryId', label: 'Category', type: 'category-select', required: true },
        { key: 'imageUrl', label: 'Image', image: true },
    ],
};

function PageShell({ title, subtitle, children }) {
    return (
        <div className='bg-[#EAEDED] min-h-[70vh]'>
            <div className='bg-white border-b border-[#DDDDDD] px-6 py-3'>
                <h1 className='text-[20px] font-bold text-[#0F1111]'>{title}</h1>
                {subtitle && <p className='text-[13px] text-[#565959]'>{subtitle}</p>}
            </div>
            <div className='max-w-[1100px] mx-auto p-6 space-y-6'>{children}</div>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <section className='bg-white border border-[#DDDDDD] rounded p-6'>
            {title && <h2 className='text-[18px] font-bold text-[#0F1111] mb-4'>{title}</h2>}
            {children}
        </section>
    );
}

const primaryButton =
    'bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-60 text-[#0F1111] text-[14px] rounded-full px-6 py-2 cursor-pointer';

/* ---------- logged out / guests ---------- */

function SignInPrompt() {
    return (
        <PageShell title='Sell on IPAY' subtitle='Reach customers with your own products'>
            <Card>
                <p className='text-[14px] text-[#0F1111] mb-4'>
                    Create an account (or sign in) to ask for a seller account.
                </p>
                <div className='flex flex-wrap gap-3'>
                    <Link to='/login' className={primaryButton}>
                        Sign in
                    </Link>
                    <Link
                        to='/register'
                        className='text-[14px] text-[#0F1111] border border-[#a6a6a6] rounded-full px-6 py-2 hover:bg-[#F0F2F2]'
                    >
                        Create account
                    </Link>
                </div>
            </Card>
        </PageShell>
    );
}

/* ---------- customers: ask to become a seller ---------- */

const REQUEST_STATUS_STYLES = {
    Pending: 'bg-[#FFF3E0] text-[#8A4B00]',
    Approved: 'bg-[#E8F5E9] text-[#1B5E20]',
    Rejected: 'bg-[#FDF0F0] text-[#C40000]',
};

function BecomeSeller() {
    const [request, setRequest] = useState(undefined); // undefined = loading, null = never asked
    const [loadError, setLoadError] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const data = await sellerRequestsApi.getMine(); // '' (204) when there is none
                if (!ignore) setRequest(data || null);
            } catch (err) {
                if (!ignore) {
                    setLoadError(getErrorMessage(err, 'Could not load your seller request.'));
                    setRequest(null);
                }
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setSending(true);
        setFormError('');
        try {
            setRequest(await sellerRequestsApi.create(message.trim()));
            setMessage('');
        } catch (err) {
            setFormError(getErrorMessage(err, 'Could not send your request.'));
        } finally {
            setSending(false);
        }
    };

    const canAsk = request === null || request?.status === 'Rejected';

    return (
        <PageShell title='Sell on IPAY' subtitle='Become a seller to list and manage your own products'>
            {request === undefined && <p className='text-[14px] text-[#565959]'>Loading…</p>}

            {loadError && (
                <p role='alert' className='text-[13px] text-[#C40000]'>
                    {loadError}
                </p>
            )}

            {request && (
                <Card title='Your request'>
                    <div className='flex flex-wrap items-center gap-3'>
                        <span
                            className={`inline-block rounded px-2 py-0.5 text-[12px] ${
                                REQUEST_STATUS_STYLES[request.status] || REQUEST_STATUS_STYLES.Pending
                            }`}
                        >
                            {request.status}
                        </span>
                        <span className='text-[13px] text-[#565959]'>
                            Sent {new Date(request.createdAt).toLocaleString()}
                        </span>
                    </div>

                    {request.message && (
                        <p className='text-[14px] text-[#0F1111] mt-3 whitespace-pre-wrap break-words'>
                            {request.message}
                        </p>
                    )}

                    <p className='text-[14px] text-[#0F1111] mt-3'>
                        {request.status === 'Pending' &&
                            'An admin or moderator will review your request. Check back here to see the result.'}
                        {request.status === 'Approved' &&
                            'Your request was approved! Sign in again and this page will turn into your seller dashboard.'}
                        {request.status === 'Rejected' &&
                            'Your request was rejected. You can send a new one below.'}
                    </p>
                </Card>
            )}

            {canAsk && (
                <Card title='Request a seller account'>
                    <form onSubmit={submit} className='space-y-4'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='seller-message' className='text-[13px] font-bold text-[#0F1111]'>
                                What would you like to sell? <span className='font-normal text-[#565959]'>(optional)</span>
                            </label>
                            <textarea
                                id='seller-message'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={500}
                                rows={4}
                                className='w-full p-2 text-[14px] border border-[#a6a6a6] rounded-lg outline-none focus:ring-2 focus:ring-[#888C8D]'
                            />
                            <span className='text-[12px] text-[#565959] self-end'>{message.length}/500</span>
                        </div>

                        <div className='flex items-center gap-3'>
                            <button type='submit' disabled={sending} className={primaryButton}>
                                {sending ? 'Sending…' : 'Send request'}
                            </button>
                            {formError && <span className='text-[#B12704] text-[13px]'>{formError}</span>}
                        </div>
                    </form>
                </Card>
            )}
        </PageShell>
    );
}

/* ---------- sellers: manage their own products ---------- */

function SellerWorkspace() {
    const { items, loading, error, saving, save, remove } = useAdminResource(MY_PRODUCTS_SCHEMA);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    // Dropdown options for the form - best effort, independent of the product list.
    const [categories, setCategories] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const [cats, mans] = await Promise.all([categoriesApi.getAll(), manufacturersApi.getAll()]);
                if (!ignore) {
                    setCategories(Array.isArray(cats) ? cats : []);
                    setManufacturers(Array.isArray(mans) ? mans : []);
                }
            } catch {
                if (!ignore) {
                    setCategories([]);
                    setManufacturers([]);
                }
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const categoryLookup = useMemo(
        () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
        [categories]
    );
    const manufacturerOptions = useMemo(
        () => manufacturers.map((m) => m.name).sort((a, b) => a.localeCompare(b)),
        [manufacturers]
    );

    const handleSave = async (values, editingId) => {
        const result = await save(values, editingId);
        if (result.ok) setEditingItem(null);
        return result;
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete "${item.name}" (#${item.id})? This can't be undone.`)) return;
        setDeletingId(item.id);
        setDeleteError('');
        const result = await remove(item.id);
        if (!result.ok) setDeleteError(result.message);
        setDeletingId(null);
        if (editingItem?.id === item.id) setEditingItem(null);
    };

    return (
        <PageShell title='Your products' subtitle='List new products and edit or delete the ones you created'>
            <Card title={editingItem ? `Edit ${editingItem.name}` : 'Add a product'}>
                <ResourceForm
                    schema={MY_PRODUCTS_SCHEMA}
                    editingItem={editingItem}
                    categories={categories}
                    manufacturers={manufacturerOptions}
                    onCancelEdit={() => setEditingItem(null)}
                    onSave={handleSave}
                    saving={saving}
                />
            </Card>

            <section className='bg-white border border-[#DDDDDD] rounded p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-[18px] font-bold text-[#0F1111]'>Products you&apos;re selling</h2>
                    <span className='text-[13px] text-[#565959]'>{items.length} total</span>
                </div>

                {deleteError && (
                    <p role='alert' className='mb-3 text-[13px] text-[#B12704]'>
                        {deleteError}
                    </p>
                )}

                <ResourceTable
                    schema={MY_PRODUCTS_SCHEMA}
                    items={items}
                    loading={loading}
                    error={error}
                    categoryLookup={categoryLookup}
                    onEdit={setEditingItem}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                />
            </section>
        </PageShell>
    );
}

/* ---------- page ---------- */

function Sell() {
    const { isLoggedIn, role } = useAuth();

    if (!isLoggedIn || !role || role === 'Guest') return <SignInPrompt />;
    // Admins and moderators have no use for the seller page: send them straight to the admin page (replace = Back won't bounce them here again).
    if (role === 'Admin' || role === 'Moderator') return <Navigate to='/admin' replace />;
    if (role === 'Seller') return <SellerWorkspace />;
    return <BecomeSeller />;
}

export default Sell;
