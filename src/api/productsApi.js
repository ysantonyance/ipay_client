import api from './api.js'
import { cached, invalidating } from './cache.js'

// A product change can also affect category counts, so both lists are refreshed after a write.
const AFFECTED = ['products', 'categories'];

// Backend: api/products
export const productsApi = {
    // Paginated: GET /products?limit=12&lastDocId=...
    getAll: (params) => api.get('/products', { params }),
    // Everything at once: GET /products/all (cached for a few minutes; cleared by any product write)
    getAllUnpaged: () => cached('products', () => api.get('/products/all')),
    getById: (id) => api.get(`/products/${id}`),
    // Admin / moderator. Body: { id?, name, price, discountedPrice, imageUrl, manufacturer, categoryId, discountPercent }
    // (there is no rating field: a product's rating is the average of users' ratings, see ratingsApi.js)
    create: (productData) => invalidating(AFFECTED, api.post('/products', productData)),
    update: (id, productData) => invalidating(AFFECTED, api.put(`/products/${id}`, productData)),
    // Admin / moderator, or a seller deleting one of their own products.
    delete: (id) => invalidating(AFFECTED, api.delete(`/products/${id}`)),

    // Seller only. The seller id always comes from the login token, never from the body.
    getMine: () => api.get('/products/seller/mine'),
    createAsSeller: (productData) => invalidating(AFFECTED, api.post('/products/seller', productData)),
    // Only works on the seller's own products (403 otherwise).
    updateAsSeller: (id, productData) => invalidating(AFFECTED, api.put(`/products/seller/${id}`, productData))
};
