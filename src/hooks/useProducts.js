import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/productsApi.js';
import { getErrorMessage } from '../api/api.js';

// Filtering (price/rating/category/manufacturer) needs the whole catalog to search
// over, not just one page, so this loads everything via /products/all rather than
// the paginated /products endpoint.
function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // api.js interceptor already unwraps response.data
            const data = await productsApi.getAllUnpaged();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load products', err);
            setError(getErrorMessage(err, 'Could not load products. Please try again.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    return { products, loading, error, reload: load };
}

export default useProducts;
