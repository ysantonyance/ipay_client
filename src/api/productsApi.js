import api from './api.js'

// Backend: api/products
export const productsApi = {
    // Paginated: GET /products?limit=12&lastDocId=...
    getAll: (params) => api.get('/products', { params }),
    // Everything at once: GET /products/all
    getAllUnpaged: () => api.get('/products/all'),
    getById: (id) => api.get(`/products/${id}`),
    // Body: { id?, name, price, rating, discountedPrice, imageUrl, manufacturer, categoryId, discountPercent }
    create: (productData) => api.post('/products', productData),
    update: (id, productData) => api.put(`/products/${id}`, productData),
    delete: (id) => api.delete(`/products/${id}`)
};
