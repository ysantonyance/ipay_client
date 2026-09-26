import { imagesApi } from '../../api/imagesApi.js';

function formatCell(field, value) {
    if (value === null || value === undefined || value === '') return '—';
    if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
    if (field?.type === 'number') return Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
    return String(value);
}

function ResourceTable({ schema, items, loading, error, categoryLookup, onEdit, onDelete, deletingId }) {
    if (loading) {
        return (
            <div className='space-y-2 animate-pulse'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='h-10 bg-[#EEEEEE] rounded'></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <p className='text-[#B12704] text-[14px]'>{error}</p>;
    }

    if (items.length === 0) {
        return <p className='text-[#565959] text-[14px]'>No {schema.label.toLowerCase()} yet.</p>;
    }

    const imageField = schema.fields.find((f) => f.image);
    const textFields = schema.fields.filter((f) => !f.image);

    return (
        <div className='overflow-x-auto'>
            <table className='w-full text-[13px] border-collapse'>
                <thead>
                    <tr className='border-b border-[#DDDDDD] text-left text-[#565959]'>
                        <th className='py-2 pr-3'>ID</th>
                        {imageField && <th className='py-2 pr-3'></th>}
                        {textFields.map((f) => (
                            <th key={f.key} className='py-2 pr-3'>
                                {f.label}
                            </th>
                        ))}
                        <th className='py-2'></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className='border-b border-[#EEEEEE] align-middle'>
                            <td className='py-2 pr-3 text-[#565959]'>{item.id}</td>

                            {imageField && (
                                <td className='py-2 pr-3'>
                                    {item[imageField.key] ? (
                                        <img
                                            src={imagesApi.resolveUrl(item[imageField.key])}
                                            alt=''
                                            className='w-10 h-10 object-cover rounded border border-[#DDDDDD]'
                                        />
                                    ) : (
                                        <div className='w-10 h-10 rounded bg-[#F3F3F3]'></div>
                                    )}
                                </td>
                            )}

                            {textFields.map((f) => (
                                <td key={f.key} className='py-2 pr-3 text-[#0F1111]'>
                                    {f.type === 'category-select' && categoryLookup
                                        ? categoryLookup[item[f.key]] ?? `#${item[f.key]}`
                                        : formatCell(f, item[f.key])}
                                </td>
                            ))}

                            <td className='py-2 text-right whitespace-nowrap'>
                                <button
                                    type='button'
                                    onClick={() => onEdit(item)}
                                    className='text-[#007185] hover:underline mr-3 cursor-pointer'
                                >
                                    Edit
                                </button>
                                <button
                                    type='button'
                                    disabled={deletingId === item.id}
                                    onClick={() => onDelete(item)}
                                    className='text-[#B12704] hover:underline disabled:opacity-50 cursor-pointer'
                                >
                                    {deletingId === item.id ? 'Deleting…' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ResourceTable;
