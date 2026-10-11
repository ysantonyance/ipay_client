import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Forbidden from './Forbidden.jsx';
import ResourceForm from '../components/admin/ResourceForm.jsx';
import ResourceTable from '../components/admin/ResourceTable.jsx';
import UsersPanel from '../components/admin/UsersPanel.jsx';
import useAdminResource from '../hooks/useAdminResource.js';
import { RESOURCE_SCHEMAS, RESOURCE_ORDER } from '../admin/schemas.js';
import { categoriesApi } from '../api/categoriesApi.js';
import { manufacturersApi } from '../api/manufacturersApi.js';

const RESOURCE_NAV = RESOURCE_ORDER.map((key) => ({ key, label: RESOURCE_SCHEMAS[key].label }));

// The products / categories / media editor. Shown to admins and moderators alike.
function ResourceWorkspace({ resourceKey }) {
    const schema = RESOURCE_SCHEMAS[resourceKey];

    const { items, loading, error, saving, save, remove } = useAdminResource(schema);
    const [editingItem, setEditingItem] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Switching resource closes whatever was being edited.
    useEffect(() => {
        setEditingItem(null);
    }, [resourceKey]);

    // Products reference a category by id, so keep a lookup around for both
    // the form's dropdown and a readable column in the table. Fetched once on
    // mount, then refreshed whenever a category is saved or deleted below.
    const [categories, setCategories] = useState([]);
    const refreshCategories = useCallback(async () => {
        try {
            const data = await categoriesApi.getAll();
            setCategories(Array.isArray(data) ? data : []);
        } catch {
            setCategories([]);
        }
    }, []);

    useEffect(() => {
        refreshCategories();
    }, [refreshCategories]);

    const categoryLookup = useMemo(
        () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
        [categories]
    );

    // Manufacturers reference nothing by id yet - Product.manufacturer is still a
    // plain string - but the dropdown below now lists real Manufacturer rows
    // instead of scanning whatever strings happen to already be on products.
    const [manufacturers, setManufacturers] = useState([]);
    const refreshManufacturers = useCallback(async () => {
        try {
            const data = await manufacturersApi.getAll();
            setManufacturers(Array.isArray(data) ? data : []);
        } catch {
            setManufacturers([]);
        }
    }, []);

    useEffect(() => {
        refreshManufacturers();
    }, [refreshManufacturers]);

    const manufacturerOptions = useMemo(
        () => manufacturers.map((m) => m.name).sort((a, b) => a.localeCompare(b)),
        [manufacturers]
    );

    const handleSave = async (values, editingId) => {
        const result = await save(values, editingId);
        if (result.ok) {
            setEditingItem(null);
            if (resourceKey === 'categories') await refreshCategories();
            if (resourceKey === 'manufacturers') await refreshManufacturers();
        }
        return result;
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete this ${schema.singular} (#${item.id})?`)) return;
        setDeletingId(item.id);
        await remove(item.id);
        setDeletingId(null);
        if (editingItem?.id === item.id) setEditingItem(null);
        if (resourceKey === 'categories') await refreshCategories();
        if (resourceKey === 'manufacturers') await refreshManufacturers();
    };

    return (
        <div className='space-y-6'>
            <section className='bg-white border border-[#DDDDDD] rounded p-6'>
                <h2 className='text-[18px] font-bold text-[#0F1111] mb-4'>
                    {editingItem ? `Edit ${schema.singular}` : `Add ${schema.singular}`}
                </h2>
                <ResourceForm
                    schema={schema}
                    editingItem={editingItem}
                    categories={categories}
                    manufacturers={manufacturerOptions}
                    onCancelEdit={() => setEditingItem(null)}
                    onSave={handleSave}
                    saving={saving}
                />
            </section>

            <section className='bg-white border border-[#DDDDDD] rounded p-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-[18px] font-bold text-[#0F1111]'>{schema.label}</h2>
                    <span className='text-[13px] text-[#565959]'>{items.length} total</span>
                </div>

                <ResourceTable
                    schema={schema}
                    items={items}
                    loading={loading}
                    error={error}
                    categoryLookup={resourceKey === 'products' ? categoryLookup : null}
                    onEdit={setEditingItem}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                />
            </section>
        </div>
    );
}

// Admins and moderators both get the content editor plus the Users section. The one difference is
// inside the Users section: only admins can make someone a moderator or remove a moderator (see UsersPanel).
function AdminDashboard({ isAdmin }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState('resources');
    const [resourceKey, setResourceKey] = useState(RESOURCE_ORDER[0]);

    const handleSignOut = async () => {
        await logout();
        navigate('/');
    };

    const navButtonClass = (active) =>
        `w-full text-left text-[14px] rounded px-3 py-2 cursor-pointer ${
            active ? 'bg-[#FFD814] text-[#0F1111] font-medium' : 'text-[#0F1111] hover:bg-[#F0F2F2]'
        }`;

    return (
        <div className='min-h-screen bg-[#EAEDED]'>
            <div className='bg-[#131921] text-white px-6 py-3 flex items-center justify-between'>
                <div>
                    <h1 className='text-[18px] font-bold'>{isAdmin ? 'IPAY Admin' : 'IPAY Moderation'}</h1>
                    <p className='text-[12px] text-[#CCCCCC]'>
                        Content playground — products, categories, media & users
                    </p>
                </div>
                <button
                    type='button'
                    onClick={handleSignOut}
                    className='text-[13px] border border-transparent hover:border-white rounded px-3 py-1 cursor-pointer'
                >
                    Sign out
                </button>
            </div>

            <div className='max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6'>
                <nav className='bg-white border border-[#DDDDDD] rounded p-3 h-fit'>
                    <ul className='space-y-1'>
                        {RESOURCE_NAV.map(({ key, label }) => (
                            <li key={key}>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setResourceKey(key);
                                        setView('resources');
                                    }}
                                    className={navButtonClass(view === 'resources' && key === resourceKey)}
                                >
                                    {label}
                                </button>
                            </li>
                        ))}
                        <li className='pt-1 mt-1 border-t border-[#EEEEEE]'>
                            <button
                                type='button'
                                onClick={() => setView('users')}
                                className={navButtonClass(view === 'users')}
                            >
                                Users
                            </button>
                        </li>
                    </ul>
                </nav>

                <div>
                    {view === 'users' ? (
                        <UsersPanel isAdmin={isAdmin} />
                    ) : (
                        <ResourceWorkspace resourceKey={resourceKey} />
                    )}
                </div>
            </div>
        </div>
    );
}

function Admin() {
    // Real role check (from the logged-in user's JWT), not a shared passcode. Admins and moderators both get
    // the content editor and the Users section (only admins can make or remove moderators); anyone else gets a 403.
    const { isAdmin, isModerator } = useAuth();

    if (isAdmin) return <AdminDashboard isAdmin />;
    if (isModerator) return <AdminDashboard isAdmin={false} />;
    return <Forbidden />;
}

export default Admin;
