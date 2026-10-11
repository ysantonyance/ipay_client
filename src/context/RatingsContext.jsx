import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ratingsApi } from '../api/ratingsApi.js';
import { getErrorMessage } from '../api/api.js';
import { useAuth } from './AuthContext.jsx';

/**
 * Product ratings live here so every star widget on the page agrees:
 *  - myRatings: productId -> stars the logged-in user already gave (so each product can be rated only once)
 *  - overrides: productId -> the product's fresh { rating, ratingCount } after someone rated it here, so the
 *    cards and the product page update straight away instead of waiting for the product list to reload.
 */
const RatingsContext = createContext(null);

export function RatingsProvider({ children }) {
    const { isLoggedIn, role, userId } = useAuth();

    // Guests can browse but only registered accounts can rate.
    const registered = isLoggedIn && Boolean(role) && role !== 'Guest';

    const [myRatings, setMyRatings] = useState({});
    const [overrides, setOverrides] = useState({});

    const loadMine = useCallback(async () => {
        try {
            const data = await ratingsApi.getMine();
            setMyRatings(data && typeof data === 'object' ? data : {});
        } catch {
            // Not fatal: the stars just won't know which products were already rated.
        }
    }, []);

    useEffect(() => {
        if (!registered) {
            setMyRatings({});
            return;
        }
        loadMine();
    }, [registered, userId, loadMine]);

    const rate = useCallback(
        async (productId, value) => {
            try {
                const result = await ratingsApi.rate(productId, value);
                setMyRatings((prev) => ({ ...prev, [productId]: value }));
                setOverrides((prev) => ({
                    ...prev,
                    [productId]: { rating: result.rating, ratingCount: result.ratingCount },
                }));
                return { ok: true };
            } catch (err) {
                // 409 = already rated (e.g. from another tab): refresh so the stars lock.
                if (err?.response?.status === 409) await loadMine();
                return { ok: false, message: getErrorMessage(err, 'Could not save your rating.') };
            }
        },
        [loadMine]
    );

    // The product with its freshest rating/ratingCount (identity changes whenever a rating does).
    const getLive = useCallback(
        (product) => {
            const live = overrides[product.id];
            return live ? { ...product, ...live } : product;
        },
        [overrides]
    );

    const value = useMemo(
        () => ({ registered, userId, myRatings, rate, getLive }),
        [registered, userId, myRatings, rate, getLive]
    );

    return <RatingsContext.Provider value={value}>{children}</RatingsContext.Provider>;
}

export function useRatings() {
    const ctx = useContext(RatingsContext);
    if (!ctx) throw new Error('useRatings must be used within a RatingsProvider');
    return ctx;
}

/** Everything a star widget needs for one product. */
export function useProductRating(product) {
    const { registered, userId, myRatings, rate, getLive } = useRatings();
    const live = getLive(product);

    const isOwn =
        Boolean(userId) && Boolean(product.sellerId) && String(product.sellerId) === String(userId);

    return {
        rating: Number(live.rating) || 0,
        ratingCount: Number(live.ratingCount) || 0,
        myRating: myRatings[product.id] || 0,
        registered,
        isOwn,
        canRate: registered && !isOwn,
        rate: (stars) => rate(product.id, stars),
    };
}
