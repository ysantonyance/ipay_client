import { useEffect, useRef, useState } from 'react';
import { imagesApi } from '../../api/imagesApi.js';

function emptyValues(fields) {
    return Object.fromEntries(fields.map((f) => [f.key, '']));
}

function ResourceForm({ schema, editingItem, categories, manufacturers = [], onCancelEdit, onSave, saving }) {
    const [values, setValues] = useState(() => emptyValues(schema.fields));
    const [uploading, setUploading] = useState(false);
    const [formError, setFormError] = useState('');
    const fileInputRefs = useRef({});

    useEffect(() => {
        if (editingItem) {
            const next = {};
            for (const field of schema.fields) {
                next[field.key] = editingItem[field.key] ?? '';
            }
            setValues(next);
        } else {
            setValues(emptyValues(schema.fields));
        }
        setFormError('');
    }, [editingItem, schema]);

    const handleChange = (key, value) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageUpload = async (key, file) => {
        if (!file) return;
        setUploading(true);
        setFormError('');
        try {
            const result = await imagesApi.upload(file);
            handleChange(key, result.url);
        } catch {
            setFormError('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        const result = await onSave(values, editingItem?.id ?? null);
        if (!result.ok) {
            setFormError(result.message);
        } else {
            setValues(emptyValues(schema.fields));
        }
    };

    return (
        <form onSubmit={handleSubmit} className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {schema.fields.map((field) => (
                <div
                    key={field.key}
                    className={field.type === 'textarea' ? 'sm:col-span-2 flex flex-col gap-1' : 'flex flex-col gap-1'}
                >
                    <label className='text-[13px] font-bold text-[#0F1111]'>{field.label}</label>

                    {field.type === 'textarea' ? (
                        <textarea
                            value={values[field.key] ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            rows={3}
                            className='w-full p-2 text-[14px] border border-[#a6a6a6] rounded-lg outline-none focus:ring-2 focus:ring-[#888C8D]'
                        />
                    ) : field.type === 'category-select' ? (
                        <select
                            value={values[field.key] ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className='w-full p-2 text-[14px] border border-[#a6a6a6] rounded-lg outline-none focus:ring-2 focus:ring-[#888C8D] bg-white'
                        >
                            <option value=''>Select a category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} (#{c.id})
                                </option>
                            ))}
                        </select>
                    ) : field.type === 'manufacturer-select' ? (
                        <select
                            value={values[field.key] ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className='w-full p-2 text-[14px] border border-[#a6a6a6] rounded-lg outline-none focus:ring-2 focus:ring-[#888C8D] bg-white'
                        >
                            <option value=''>Select a manufacturer</option>
                            {manufacturers.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type || 'text'}
                            step={field.step}
                            min={field.min}
                            max={field.max}
                            value={values[field.key] ?? ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className='w-full p-2 text-[14px] border border-[#a6a6a6] rounded-lg outline-none focus:ring-2 focus:ring-[#888C8D]'
                        />
                    )}

                    {field.image && (
                        <div className='flex items-center gap-3 mt-1'>
                            <input
                                ref={(el) => { fileInputRefs.current[field.key] = el; }}
                                type='file'
                                accept='image/jpeg,image/png,image/gif,image/webp'
                                onChange={(e) => handleImageUpload(field.key, e.target.files[0])}
                                className='hidden'
                            />
                            <button
                                type='button'
                                onClick={() => fileInputRefs.current[field.key]?.click()}
                                disabled={uploading}
                                className='text-[13px] text-[#0F1111] border border-[#a6a6a6] rounded-lg px-3 py-1.5 hover:bg-[#F0F2F2] disabled:opacity-60 cursor-pointer'
                            >
                                Choose file
                            </button>
                            {uploading && <span className='text-[12px] text-[#565959]'>Uploading…</span>}
                            {values[field.key] && (
                                <img
                                    src={imagesApi.resolveUrl(values[field.key])}
                                    alt=''
                                    className='w-10 h-10 object-cover rounded border border-[#DDDDDD]'
                                />
                            )}
                        </div>
                    )}
                </div>
            ))}

            <div className='sm:col-span-2 flex items-center gap-3 pt-2'>
                <button
                    type='submit'
                    disabled={saving || uploading}
                    className='bg-[#FFD814] hover:bg-[#F7CA00] disabled:opacity-60 text-[#0F1111] text-[14px] rounded-full px-6 py-2 cursor-pointer'
                >
                    {saving ? 'Saving…' : editingItem ? 'Save changes' : `Add ${schema.singular}`}
                </button>

                {editingItem && (
                    <button
                        type='button'
                        onClick={onCancelEdit}
                        className='text-[14px] text-[#565959] hover:text-[#0F1111] cursor-pointer'
                    >
                        Cancel
                    </button>
                )}

                {formError && <span className='text-[#B12704] text-[13px]'>{formError}</span>}
            </div>
        </form>
    );
}

export default ResourceForm;
