import api from './api.js'

// Backend: api/products
export const productsApi = {
    // Paginated: GET /products?limit=12&lastDocId=...
    getAll: (params) => api.get('/products', { params }),
    // Everything at once: GET /products/all
    getAllUnpaged: () => api.get('/products/all'),
    getById: (id) => api.get(`/products/${id}`),
    // Admin / moderator. Body: { id?, name, price, discountedPrice, imageUrl, manufacturer, categoryId, discountPercent }
    // (there is no rating field: a product's rating is the average of users' ratings, see ratingsApi.js)
    create: (productData) => api.post('/products', productData),
    update: (id, productData) => api.put(`/products/${id}`, productData),
    // Admin / moderator, or a seller deleting one of their own products.
    delete: (id) => api.delete(`/products/${id}`),

    // Seller only. The seller id always comes from the login token, never from the body.
    getMine: () => api.get('/products/seller/mine'),
    createAsSeller: (productData) => api.post('/products/seller', productData),
    // Only works on the seller's own products (403 otherwise).
    updateAsSeller: (id, productData) => api.put(`/products/seller/${id}`, productData)
};
