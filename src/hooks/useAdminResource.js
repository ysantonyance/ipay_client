import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/api.js';

function coerceValues(fields, rawValues) {
    const values = {};
    for (const field of fields) {
        const raw = rawValues[field.key];
        values[field.key] = field.type === 'number' ? Number(raw || 0) : (raw ?? '');
    }
    return values;
}

/** Generic list/create/update/delete against whichever schema (see admin/schemas.js) is active. */
function useAdminResource(schema) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await schema.list();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(`Failed to load ${schema.label}`, err);
            setError(getErrorMessage(err, `Could not load ${schema.label.toLowerCase()}.`));
        } finally {
            setLoading(false);
        }
    }, [schema]);

    useEffect(() => {
        load();
    }, [load]);

    const save = useCallback(
        async (rawValues, editingId) => {
            setSaving(true);
            try {
                const values = coerceValues(schema.fields, rawValues);
                const payload = schema.buildPayload ? schema.buildPayload(values) : values;

                if (editingId != null) {
                    await schema.api.update(editingId, payload);
                } else {
                    await schema.api.create(payload);
                }
                await load();
                return { ok: true };
            } catch (err) {
                console.error(`Failed to save ${schema.singular}`, err);
                return { ok: false, message: getErrorMessage(err, `Could not save this ${schema.singular}.`) };
            } finally {
                setSaving(false);
            }
        },
        [schema, load]
    );

    const remove = useCallback(
        async (id) => {
            try {
                await schema.api.delete(id);
                await load();
                return { ok: true };
            } catch (err) {
                console.error(`Failed to delete ${schema.singular}`, err);
                return { ok: false, message: getErrorMessage(err, `Could not delete this ${schema.singular}.`) };
            }
        },
        [schema, load]
    );

    return { items, loading, error, saving, reload: load, save, remove };
}

export default useAdminResource;
