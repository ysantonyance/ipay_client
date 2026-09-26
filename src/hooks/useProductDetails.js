import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/productsApi.js';
import { categoriesApi } from '../api/categoriesApi.js';
import { getErrorMessage } from '../api/api.js';

/**
 * Loads a single product plus everything needed for the comparison sections:
 *  - the product itself (page is rendered as soon as this arrives)
 *  - its category (name for the breadcrumb)
 *  - every other product in the same category (statistics + "similar products")
 *
 * The related data is best-effort: if it fails, the product page still works.
 */
function useProductDetails(id) {
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedError, setRelatedError] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setRelatedLoading(true);
            setError(null);
            setRelatedError(false);
            setNotFound(false);
            setProduct(null);
            setCategory(null);
            setCategoryProducts([]);

            let current;
            try {
                // api.js interceptor already unwraps response.data
                current = await productsApi.getById(id);
            } catch (err) {
                if (cancelled) return;

                if (err?.response?.status === 404) {
                    setNotFound(true);
                } else {
                    console.error('Failed to load product', err);
                    setError(getErrorMessage(err, 'Could not load this product. Please try again.'));
                }
                setLoading(false);
                setRelatedLoading(false);
                return;
            }

            if (cancelled) return;

            if (!current || typeof current !== 'object') {
                setNotFound(true);
                setLoading(false);
                setRelatedLoading(false);
                return;
            }

            setProduct(current);
            setLoading(false);

            // No category -> nothing to compare against.
            if (!current.categoryId) {
                setRelatedLoading(false);
                return;
            }

            const [categoryResult, productsResult] = await Promise.allSettled([
                categoriesApi.getById(current.categoryId),
                productsApi.getAllUnpaged(),
            ]);

            if (cancelled) return;

            if (categoryResult.status === 'fulfilled') {
                setCategory(categoryResult.value ?? null);
            }

            if (productsResult.status === 'fulfilled' && Array.isArray(productsResult.value)) {
                const sameCategory = productsResult.value.filter(
                    (p) =>
                        String(p.categoryId) === String(current.categoryId) &&
                        String(p.id) !== String(current.id)
                );
                setCategoryProducts(sameCategory);
            } else {
                console.error('Failed to load related products', productsResult.reason);
                setRelatedError(true);
            }

            setRelatedLoading(false);
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [id, reloadKey]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return {
        product,
        category,
        categoryProducts,
        loading,
        relatedLoading,
        error,
        relatedError,
        notFound,
        reload,
    };
}

export default useProductDetails;
