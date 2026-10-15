import api from './api.js'
import { invalidating } from './cache.js'

// Backend: api/ratings. Only registered (non-guest) users can rate, once per product, never their own product.
export const ratingsApi = {
    // -> { [productId]: stars } for the logged-in user (the products they've already rated)
    getMine: () => api.get('/ratings/mine'),

    // Body: { value: 1..5 } -> { rating, ratingCount, myRating }. Rejects 409 if already rated.
    // Rating changes the product's average, so the cached product list is dropped afterwards.
    rate: (productId, value) => invalidating(['products'], api.post(`/ratings/${productId}`, { value })),
};
