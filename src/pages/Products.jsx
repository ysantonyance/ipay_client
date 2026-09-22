import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts.js';
import { imagesApi } from '../api/imagesApi.js';

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Avg. Customer Review' },
];

function getFinalPrice(product) {
    const { price = 0, discountedPrice = 0 } = product;
    return discountedPrice > 0 && discountedPrice < price ? discountedPrice : price;
}

function formatPrice(value) {
    return `$${Number(value).toFixed(2)}`;
}

function Stars({ rating = 0 }) {
    const rounded = Math.round(rating);

    return (
        <div className='flex items-center text-[14px]' aria-label={`${rating} out of 5 stars`}>
            <span className='text-[#FFA41C]'>{'★'.repeat(rounded)}</span>
            <span className='text-[#CCCCCC]'>{'★'.repeat(Math.max(0, 5 - rounded))}</span>
            <span className='ml-1 text-[#007185] text-[12px]'>{Number(rating).toFixed(1)}</span>
        </div>
    );
}

function ProductCard({ product }) {
    const finalPrice = getFinalPrice(product);
    const hasDiscount = finalPrice < product.price;

    return (
        <div className='bg-white border border-[#DDDDDD] rounded p-4 flex flex-col hover:shadow-lg transition-shadow'>
            <Link to={`/products/${product.id}`} className='flex justify-center items-center h-[200px] mb-3'>
                {product.imageUrl ? (
                    <img
                        className='max-h-full max-w-full object-contain'
                        src={imagesApi.resolveUrl(product.imageUrl)}
                        alt={product.name}
                        loading='lazy'
                    />
                ) : (
                    <div className='w-full h-full bg-[#F3F3F3] flex items-center justify-center text-[#999999] text-[12px]'>
                        No image
                    </div>
                )}
            </Link>

            <Link
                to={`/products/${product.id}`}
                className='text-[14px] text-[#0F1111] hover:text-[#C7511F] line-clamp-2 min-h-[40px]'
            >
                {product.name}
            </Link>

            {product.manufacturer && (
                <p className='text-[12px] text-[#565959] mt-1'>by {product.manufacturer}</p>
            )}

            <div className='mt-1'>
                <Stars rating={product.rating} />
            </div>

            <div className='mt-2 flex items-baseline flex-wrap gap-x-2'>
                <span className='text-[22px] text-[#0F1111]'>{formatPrice(finalPrice)}</span>
                {hasDiscount && (
                    <>
                        <span className='text-[12px] text-[#565959] line-through'>
                            {formatPrice(product.price)}
                        </span>
                        {product.discountPercent > 0 && (
                            <span className='text-[12px] text-[#CC0C39]'>
                                -{Math.round(product.discountPercent)}%
                            </span>
                        )}
                    </>
                )}
            </div>

            <div className='mt-auto pt-3'>
                <button
                    type='button'
                    className='w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-[14px] rounded-full py-2 cursor-pointer'
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className='bg-white border border-[#DDDDDD] rounded p-4 animate-pulse'>
            <div className='h-[200px] bg-[#EEEEEE] rounded mb-3'></div>
            <div className='h-4 bg-[#EEEEEE] rounded mb-2'></div>
            <div className='h-4 bg-[#EEEEEE] rounded w-2/3 mb-4'></div>
            <div className='h-6 bg-[#EEEEEE] rounded w-1/3 mb-4'></div>
            <div className='h-9 bg-[#EEEEEE] rounded-full'></div>
        </div>
    );
}

function Products() {
    const { products, loading, error, reload } = useProducts();
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('featured');

    const visibleProducts = useMemo(() => {
        const q = query.trim().toLowerCase();

        const filtered = q
            ? products.filter((p) =>
                `${p.name} ${p.manufacturer}`.toLowerCase().includes(q))
            : [...products];

        switch (sort) {
            case 'price-asc':
                return filtered.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
            case 'price-desc':
                return filtered.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
            case 'rating':
                return filtered.sort((a, b) => b.rating - a.rating);
            default:
                return filtered;
        }
    }, [products, query, sort]);

    return (
        <div className='bg-[#EAEDED] min-h-screen'>
            <div className='bg-white border-b border-[#DDDDDD] px-6 py-3 flex flex-wrap items-center justify-between gap-3'>
                <div>
                    <h1 className='text-[20px] font-bold text-[#0F1111]'>Products</h1>
                    {!loading && !error && (
                        <p className='text-[13px] text-[#565959]'>
                            {visibleProducts.length} result{visibleProducts.length === 1 ? '' : 's'}
                        </p>
                    )}
                </div>

                <div className='flex flex-wrap items-center gap-3 text-[14px]'>
                    <input
                        className='w-[260px] h-[36px] bg-white border border-[#888C8C] rounded-lg px-3 focus:outline-none focus:border-[#E77600]'
                        type='text'
                        placeholder='Filter products'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    <label className='flex items-center gap-2 bg-[#F0F2F2] border border-[#D5D9D9] rounded-lg px-2 h-[36px] shadow-sm'>
                        <span className='text-[#565959]'>Sort by:</span>
                        <select
                            className='bg-transparent focus:outline-none cursor-pointer'
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <div className='max-w-[1500px] mx-auto p-6'>
                {loading && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className='bg-white border border-[#DDDDDD] rounded p-8 text-center'>
                        <p className='text-[#B12704] mb-4'>{error}</p>
                        <button
                            type='button'
                            className='bg-[#FFD814] hover:bg-[#F7CA00] text-[14px] rounded-full px-6 py-2 cursor-pointer'
                            onClick={reload}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && visibleProducts.length === 0 && (
                    <div className='bg-white border border-[#DDDDDD] rounded p-8 text-center text-[#565959]'>
                        No products found.
                    </div>
                )}

                {!loading && !error && visibleProducts.length > 0 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
