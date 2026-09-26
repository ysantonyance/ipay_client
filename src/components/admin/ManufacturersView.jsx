import { useMemo, useState } from 'react';
import { productsApi } from '../../api/productsApi.js';

// PUT /products/{id} expects the full UpdateAdminProductDto shape, so renaming
// or clearing a manufacturer means re-sending each matching product wholesale
// with just that one field changed - there's no dedicated backend endpoint
// for this (manufacturer is a plain string column, not its own table).
function buildPayload(product, manufacturer) {
    return {
        name: product.name,
        price: product.price,
        rating: product.rating,
        discountedPrice: product.discountedPrice,
        imageUrl: product.imageUrl,
        manufacturer,
        categoryId: product.categoryId,
        discountPercent: product.discountPercent,
    };
}

function ManufacturersView({ products, onChanged }) {
    const [busyName, setBusyName] = useState(null);
    const [error, setError] = useState('');

    const manufacturers = useMemo(() => {
        const counts = new Map();
        for (const p of products) {
            const name = (p.manufacturer || '').trim();
            if (!name) continue;
            counts.set(name, (counts.get(name) || 0) + 1);
        }
        return [...counts.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [products]);

    const applyToMatching = async (name, nextManufacturer) => {
        setBusyName(name);
        setError('');
        try {
            const matches = products.filter((p) => (p.manufacturer || '').trim() === name);
            for (const product of matches) {
                await productsApi.update(product.id, buildPayload(product, nextManufacturer));
            }
            await onChanged();
        } catch (err) {
            console.error(`Failed to update manufacturer "${name}"`, err);
            setError(`Could not update every product for "${name}". Some may not have changed.`);
        } finally {
            setBusyName(null);
        }
    };

    const handleRename = (name) => {
        const nextName = window.prompt(`Rename "${name}" to:`, name);
        if (!nextName || !nextName.trim() || nextName.trim() === name) return;
        applyToMatching(name, nextName.trim());
    };

    const handleClear = (name, count) => {
        if (!window.confirm(`Remove "${name}" from ${count} product${count === 1 ? '' : 's'}?`)) return;
        applyToMatching(name, '');
    };

    return (
        <div className='space-y-4'>
            <p className='text-[13px] text-[#565959]'>
                Manufacturers aren't their own table in the backend — this list is built from the
                Manufacturer field already set on your products. Renaming or clearing here updates
                every matching product. To add a brand-new one, just type it into a product's
                Manufacturer field; it'll show up here as soon as a product uses it.
            </p>

            {error && <p className='text-[#B12704] text-[14px]'>{error}</p>}

            {manufacturers.length === 0 ? (
                <p className='text-[#565959] text-[14px]'>No manufacturers set on any product yet.</p>
            ) : (
                <table className='w-full text-[13px] border-collapse'>
                    <thead>
                        <tr className='border-b border-[#DDDDDD] text-left text-[#565959]'>
                            <th className='py-2 pr-3'>Manufacturer</th>
                            <th className='py-2 pr-3'>Products</th>
                            <th className='py-2'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {manufacturers.map(({ name, count }) => (
                            <tr key={name} className='border-b border-[#EEEEEE]'>
                                <td className='py-2 pr-3 text-[#0F1111]'>{name}</td>
                                <td className='py-2 pr-3 text-[#565959]'>{count}</td>
                                <td className='py-2 text-right whitespace-nowrap'>
                                    <button
                                        type='button'
                                        disabled={busyName === name}
                                        onClick={() => handleRename(name)}
                                        className='text-[#007185] hover:underline mr-3 cursor-pointer disabled:opacity-50'
                                    >
                                        {busyName === name ? 'Working…' : 'Rename'}
                                    </button>
                                    <button
                                        type='button'
                                        disabled={busyName === name}
                                        onClick={() => handleClear(name, count)}
                                        className='text-[#B12704] hover:underline cursor-pointer disabled:opacity-50'
                                    >
                                        Clear
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManufacturersView;
