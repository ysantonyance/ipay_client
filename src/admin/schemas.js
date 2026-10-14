import { seriesApi } from '../api/seriesApi.js';
import { genresApi } from '../api/genresApi.js';
import { categoriesApi } from '../api/categoriesApi.js';
import { manufacturersApi } from '../api/manufacturersApi.js';
import { productsApi } from '../api/productsApi.js';
import { resolveFilmFromOmdb } from '../utils/omdbGenres.js';

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
        // Only the name is entered. Title, year and genres are resolved from OMDb on save, and the
        // poster, plot and rating are fetched from OMDb by the movie page, so they are not stored here.
        fields: [
            { key: 'name', label: 'Film name', required: true },
        ],
        buildPayload: async (values, existing) => {
            const film = await resolveFilmFromOmdb(values.name); // throws a readable error if OMDb can't find it
            const keep = existing ?? {}; // editing keeps whatever the record already had
            return {
                name: film.name,
                year: film.year, // the backend requires a valid release year, so it is filled from OMDb
                description: keep.description ?? '',
                rating: keep.rating ?? 0,
                director: keep.director ?? '',
                ageRating: keep.ageRating ?? '',
                posterUrl: keep.posterUrl ?? '',
                episodeIds: keep.episodeIds ?? [],
                genreIds: [...new Set([...(keep.genreIds ?? []), ...film.genreIds])],
            };
        },
        // A series stores its genreIds, and each genre also stores its series ids - keep both sides in sync.
        afterSave: (id, payload) => Promise.all(payload.genreIds.map((genreId) => genresApi.addSeries(genreId, id))),
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

export const RESOURCE_ORDER = ['products', 'categories', 'manufacturers', 'series', 'genres'];
