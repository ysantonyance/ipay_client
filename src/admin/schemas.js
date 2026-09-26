import { seriesApi } from '../api/seriesApi.js';
import { episodesApi } from '../api/episodesApi.js';
import { genresApi } from '../api/genresApi.js';
import { categoriesApi } from '../api/categoriesApi.js';
import { manufacturersApi } from '../api/manufacturersApi.js';
import { productsApi } from '../api/productsApi.js';

/**
 * One entry per resource the admin playground can manage.
 *
 * - `list()` loads every item.
 * - `api.create` / `api.update` / `api.delete` come straight from the existing
 *   api/*.js modules, so this file adds no new backend surface.
 * - `fields` drives both the form and the table: `type` picks the <input>,
 *   `image` marks a field as upload-capable, `category-select` renders a
 *   dropdown of categories instead of a raw id.
 * - `buildPayload`, when present, maps the coerced form values onto the
 *   shape the backend DTO actually expects (e.g. categories and genres also
 *   carry list fields the UI doesn't manage yet).
 *
 * Note: Films are intentionally left out. The backend's /api/films only
 * proxies OMDb search/lookup now (see FilmsController) - there's no
 * create/update/delete endpoint for it to call.
 */
export const RESOURCE_SCHEMAS = {
    products: {
        label: 'Products',
        singular: 'product',
        api: productsApi,
        list: () => productsApi.getAllUnpaged(),
        fields: [
            { key: 'name', label: 'Name', required: true },
            { key: 'price', label: 'Price', type: 'number', step: '0.01', min: 0 },
            { key: 'discountedPrice', label: 'Discounted price', type: 'number', step: '0.01', min: 0 },
            { key: 'discountPercent', label: 'Discount %', type: 'number', step: '0.1', min: 0, max: 100 },
            { key: 'rating', label: 'Rating', type: 'number', step: '0.1', min: 0, max: 5 },
            { key: 'manufacturer', label: 'Manufacturer', type: 'manufacturer-select' },
            { key: 'categoryId', label: 'Category', type: 'category-select', required: true },
            { key: 'imageUrl', label: 'Image', image: true },
        ],
    },
    categories: {
        label: 'Categories',
        singular: 'category',
        api: categoriesApi,
        list: () => categoriesApi.getAll(),
        fields: [
            { key: 'name', label: 'Name', required: true },
        ],
        // SaveCategoryDto also wants quantity/productIds; nothing in this UI
        // manages stock counts or manual product lists yet, so default them.
        buildPayload: (values) => ({ name: values.name, quantity: 0, productIds: [] }),
    },
    manufacturers: {
        label: 'Manufacturers',
        singular: 'manufacturer',
        api: manufacturersApi,
        list: () => manufacturersApi.getAll(),
        fields: [
            { key: 'name', label: 'Name', required: true },
        ],
    },
    series: {
        label: 'Series',
        singular: 'series',
        api: seriesApi,
        list: () => seriesApi.getAll(),
        fields: [
            { key: 'name', label: 'Name', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'year', label: 'Year', type: 'number' },
            { key: 'rating', label: 'Rating', type: 'number', step: '0.1', min: 0, max: 10 },
            { key: 'director', label: 'Director' },
            { key: 'ageRating', label: 'Age rating' },
            { key: 'posterUrl', label: 'Poster', image: true },
        ],
        buildPayload: (values) => ({ ...values, episodeIds: [], genreIds: [] }),
    },
    episodes: {
        label: 'Episodes',
        singular: 'episode',
        api: episodesApi,
        list: () => episodesApi.getAll(),
        fields: [
            { key: 'name', label: 'Name', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'rating', label: 'Rating', type: 'number', step: '0.1', min: 0, max: 10 },
            { key: 'director', label: 'Director' },
            { key: 'posterUrl', label: 'Poster', image: true },
            { key: 'videoUrl', label: 'Video URL' },
            { key: 'serialId', label: 'Series ID', type: 'number' },
        ],
    },
    genres: {
        label: 'Genres',
        singular: 'genre',
        api: genresApi,
        list: () => genresApi.getAll(),
        fields: [
            { key: 'name', label: 'Name', required: true },
        ],
        buildPayload: (values) => ({ name: values.name, filmIds: [], serialIds: [] }),
    },
};

export const RESOURCE_ORDER = ['products', 'categories', 'manufacturers', 'series', 'episodes', 'genres'];
