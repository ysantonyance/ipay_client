import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useProductDetails from '../hooks/useProductDetails.js';
import { imagesApi } from '../api/imagesApi.js';

const SIMILAR_LIMIT = 8;

/* ---------- helpers ---------- */

function getFinalPrice(product) {
    const { price = 0, discountedPrice = 0 } = product;
    return discountedPrice > 0 && discountedPrice < price ? discountedPrice : price;
}

function formatPrice(value) {
    return `$${Number(value).toFixed(2)}`;
}

function formatPercent(value) {
    return `${Math.abs(value).toFixed(1)}%`;
}

/** Everything the "Product statistics" section shows, computed against the same category. */
function computeStats(product, categoryProducts) {
    const group = [product, ...categoryProducts];
    const count = group.length;

    const finalPrice = getFinalPrice(product);
    const prices = group.map(getFinalPrice);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / count;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;

    const rating = Number(product.rating) || 0;
    const avgRating = group.reduce((sum, p) => sum + (Number(p.rating) || 0), 0) / count;

    const listPrice = Number(product.price) || 0;
    const savings = Math.max(0, listPrice - finalPrice);
    const discountPercent =
        product.discountPercent > 0
            ? product.discountPercent
            : listPrice > 0
                ? (savings / listPrice) * 100
                : 0;

    return {
        count,
        hasPeers: count > 1,
        finalPrice,
        avgPrice,
        minPrice,
        maxPrice,
        pricePosition: range > 0 ? ((finalPrice - minPrice) / range) * 100 : 50,
        avgPosition: range > 0 ? ((avgPrice - minPrice) / range) * 100 : 50,
        priceDiffPercent: avgPrice > 0 ? ((finalPrice - avgPrice) / avgPrice) * 100 : 0,
        priceRank: 1 + prices.filter((p) => p < finalPrice).length,
        rating,
        avgRating,
        ratingRank: 1 + group.filter((p) => (Number(p.rating) || 0) > rating).length,
        savings,
        discountPercent,
        discountedCount: group.filter((p) => getFinalPrice(p) < p.price).length,
        sameManufacturerCount: product.manufacturer
            ? categoryProducts.filter((p) => p.manufacturer === product.manufacturer).length
            : 0,
    };
}

/* ---------- small UI pieces ---------- */

function Stars({ rating = 0, large = false }) {
    const rounded = Math.round(rating);

    return (
        <div
            className={`flex items-center ${large ? 'text-[18px]' : 'text-[14px]'}`}
            aria-label={`${rating} out of 5 stars`}
        >
            <span className='text-[#FFA41C]'>{'★'.repeat(rounded)}</span>
            <span className='text-[#CCCCCC]'>{'★'.repeat(Math.max(0, 5 - rounded))}</span>
            <span className={`ml-2 text-[#007185] ${large ? 'text-[14px]' : 'text-[12px]'}`}>
                {Number(rating).toFixed(1)}
            </span>
        </div>
    );
}

function Card({ title, subtitle, children, className = '' }) {
    return (
        <section className={`bg-white border border-[#DDDDDD] rounded p-6 ${className}`}>
            {title && (
                <div className='mb-4'>
                    <h2 className='text-[20px] font-bold text-[#0F1111]'>{title}</h2>
                    {subtitle && <p className='text-[13px] text-[#565959]'>{subtitle}</p>}
                </div>
            )}
            {children}
        </section>
    );
}

function StatCard({ label, value, valueClass = 'text-[#0F1111]', hint }) {
    return (
        <div className='border border-[#D5D9D9] rounded-lg p-4 bg-white'>
            <p className='text-[12px] uppercase tracking-wide text-[#565959]'>{label}</p>
            <p className={`text-[26px] leading-tight mt-1 ${valueClass}`}>{value}</p>
            {hint && <p className='text-[13px] text-[#565959] mt-1'>{hint}</p>}
        </div>
    );
}

function ProductImage({ product, className }) {
    if (!product.imageUrl) {
        return (
            <div
                className={`bg-[#F3F3F3] flex items-center justify-center text-[#999999] text-[12px] ${className}`}
            >
                No image
            </div>
        );
    }

    return (
        <img
            className={`object-contain ${className}`}
            src={imagesApi.resolveUrl(product.imageUrl)}
            alt={product.name}
        />
    );
}

/* ---------- sections ---------- */

function Breadcrumb({ product, category }) {
    return (
        <div className='bg-white border-b border-[#DDDDDD] px-6 py-3 text-[13px] text-[#565959] flex flex-wrap items-center gap-x-2'>
            <Link to='/products' className='hover:text-[#C7511F] hover:underline'>
                Products
            </Link>
            {category?.name && (
                <>
                    <span>›</span>
                    <span>{category.name}</span>
                </>
            )}
            {product && (
                <>
                    <span>›</span>
                    <span className='text-[#0F1111] line-clamp-1'>{product.name}</span>
                </>
            )}
        </div>
    );
}

function ProductHero({ product, category, stats }) {
    const finalPrice = getFinalPrice(product);
    const hasDiscount = finalPrice < product.price;
    const discountPercent = product.discountPercent > 0
        ? product.discountPercent
        : ((product.price - finalPrice) / product.price) * 100;

    return (
        <section className='bg-white border border-[#DDDDDD] rounded p-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_280px] gap-8'>
            <div className='flex justify-center items-center min-h-[320px]'>
                <ProductImage product={product} className='max-h-[420px] max-w-full w-full h-[420px]' />
            </div>

            <div>
                <h1 className='text-[24px] leading-8 text-[#0F1111]'>{product.name}</h1>

                {product.manufacturer && (
                    <p className='text-[14px] text-[#007185] mt-1'>Brand: {product.manufacturer}</p>
                )}

                <div className='mt-2 pb-3 border-b border-[#DDDDDD]'>
                    <Stars rating={product.rating} large />
                    {stats?.hasPeers && (
                        <p className='text-[13px] text-[#565959] mt-1'>
                            #{stats.ratingRank} of {stats.count} in {category?.name || 'this category'} by rating
                        </p>
                    )}
                </div>

                <div className='mt-3 flex items-baseline flex-wrap gap-x-3'>
                    {hasDiscount && discountPercent > 0 && (
                        <span className='text-[28px] text-[#CC0C39]'>-{Math.round(discountPercent)}%</span>
                    )}
                    <span className='text-[32px] text-[#0F1111]'>{formatPrice(finalPrice)}</span>
                </div>

                {hasDiscount && (
                    <p className='text-[13px] text-[#565959]'>
                        List Price: <span className='line-through'>{formatPrice(product.price)}</span>
                    </p>
                )}

                <dl className='mt-5 text-[14px] grid grid-cols-[120px_1fr] gap-y-1'>
                    {category?.name && (
                        <>
                            <dt className='text-[#565959]'>Category</dt>
                            <dd className='text-[#0F1111]'>{category.name}</dd>
                        </>
                    )}
                    {product.manufacturer && (
                        <>
                            <dt className='text-[#565959]'>Manufacturer</dt>
                            <dd className='text-[#0F1111]'>{product.manufacturer}</dd>
                        </>
                    )}
                </dl>
            </div>

            <aside className='border border-[#D5D9D9] rounded-lg p-4 self-start'>
                <div className='text-[28px] text-[#0F1111]'>{formatPrice(finalPrice)}</div>
                {hasDiscount && (
                    <p className='text-[13px] text-[#565959]'>
                        You save {formatPrice(product.price - finalPrice)}
                    </p>
                )}

                <div className='mt-4 space-y-2'>
                    <button
                        type='button'
                        className='w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-[14px] rounded-full py-2 cursor-pointer'
                    >
                        Add to Cart
                    </button>
                    <button
                        type='button'
                        className='w-full bg-[#FFA41C] hover:bg-[#FA8900] text-[#0F1111] text-[14px] rounded-full py-2 cursor-pointer'
                    >
                        Buy Now
                    </button>
                </div>

                {product.manufacturer && (
                    <p className='text-[12px] text-[#565959] mt-4'>Ships from and sold by {product.manufacturer}</p>
                )}
            </aside>
        </section>
    );
}

function PricePositionBar({ stats }) {
    // Keep the marker fully inside the track so it never clips at the edges.
    const clamp = (n) => Math.min(97, Math.max(3, n));

    return (
        <div className='mt-6'>
            <p className='text-[14px] text-[#0F1111] mb-8'>Where this price sits in the category</p>

            <div className='relative h-2 bg-[#E3E6E6] rounded-full mx-2'>
                <div
                    className='absolute top-1/2 -translate-y-1/2 w-[2px] h-5 bg-[#565959]'
                    style={{ left: `${clamp(stats.avgPosition)}%` }}
                    title={`Category average ${formatPrice(stats.avgPrice)}`}
                >
                    <span className='absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-[#565959]'>
                        avg {formatPrice(stats.avgPrice)}
                    </span>
                </div>

                <div
                    className='absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FFA41C] border-2 border-white shadow'
                    style={{ left: `${clamp(stats.pricePosition)}%` }}
                    title={`This product ${formatPrice(stats.finalPrice)}`}
                />
            </div>

            <div className='flex justify-between text-[12px] text-[#565959] mt-2'>
                <span>{formatPrice(stats.minPrice)}</span>
                <span>{formatPrice(stats.maxPrice)}</span>
            </div>
        </div>
    );
}

function StatsSection({ product, category, stats, loading, failed }) {
    const categoryName = category?.name || 'this category';

    if (loading) {
        return (
            <Card title='Product statistics'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className='h-[104px] bg-[#EEEEEE] rounded-lg' />
                    ))}
                </div>
            </Card>
        );
    }

    if (failed || !stats) {
        return (
            <Card title='Product statistics'>
                <p className='text-[#565959] text-[14px]'>
                    {failed
                        ? 'Could not load category data to compare this product.'
                        : 'This product is not assigned to a category yet, so there is nothing to compare it with.'}
                </p>
            </Card>
        );
    }

    const cheaper = stats.priceDiffPercent < 0;
    const diffClass =
        Math.abs(stats.priceDiffPercent) < 0.05
            ? 'text-[#0F1111]'
            : cheaper
                ? 'text-[#007600]'
                : 'text-[#B12704]';

    const ratingDelta = stats.rating - stats.avgRating;

    return (
        <Card
            title='Product statistics'
            subtitle={
                stats.hasPeers
                    ? `Compared with ${stats.count - 1} other product${stats.count - 1 === 1 ? '' : 's'} in ${categoryName}`
                    : `No other products in ${categoryName} to compare with yet`
            }
        >
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                <StatCard
                    label='Customer rating'
                    value={`${stats.rating.toFixed(1)} / 5`}
                    valueClass='text-[#0F1111]'
                    hint={
                        stats.hasPeers
                            ? `#${stats.ratingRank} of ${stats.count} · category avg ${stats.avgRating.toFixed(1)}`
                            : undefined
                    }
                />

                <StatCard
                    label='Price vs. category average'
                    value={
                        stats.hasPeers
                            ? `${cheaper ? '−' : '+'}${formatPercent(stats.priceDiffPercent)}`
                            : '—'
                    }
                    valueClass={stats.hasPeers ? diffClass : 'text-[#565959]'}
                    hint={
                        stats.hasPeers
                            ? `${cheaper ? 'Cheaper' : 'More expensive'} than the ${formatPrice(stats.avgPrice)} average`
                            : 'Not enough data'
                    }
                />

                <StatCard
                    label='Price rank'
                    value={stats.hasPeers ? `#${stats.priceRank}` : '—'}
                    hint={
                        stats.hasPeers
                            ? `${stats.priceRank === 1 ? 'Lowest price' : `${stats.priceRank - 1} cheaper`} of ${stats.count} products`
                            : 'Not enough data'
                    }
                />

                <StatCard
                    label='You save'
                    value={stats.savings > 0 ? formatPrice(stats.savings) : '$0.00'}
                    valueClass={stats.savings > 0 ? 'text-[#B12704]' : 'text-[#0F1111]'}
                    hint={
                        stats.savings > 0
                            ? `${Math.round(stats.discountPercent)}% off the list price`
                            : 'No active discount'
                    }
                />

                <StatCard
                    label='Products in category'
                    value={stats.count}
                    hint={`${stats.discountedCount} currently discounted`}
                />

                <StatCard
                    label={product.manufacturer ? `More from ${product.manufacturer}` : 'Manufacturer'}
                    value={product.manufacturer ? stats.sameManufacturerCount : '—'}
                    hint={
                        product.manufacturer
                            ? `other product${stats.sameManufacturerCount === 1 ? '' : 's'} in this category`
                            : 'Not specified'
                    }
                />
            </div>

            {stats.hasPeers && <PricePositionBar stats={stats} />}

            {stats.hasPeers && Math.abs(ratingDelta) >= 0.05 && (
                <p className='text-[13px] text-[#565959] mt-6'>
                    Rated{' '}
                    <span className={ratingDelta > 0 ? 'text-[#007600]' : 'text-[#B12704]'}>
                        {Math.abs(ratingDelta).toFixed(1)} {ratingDelta > 0 ? 'higher' : 'lower'}
                    </span>{' '}
                    than the average product in {categoryName}.
                </p>
            )}
        </Card>
    );
}

function SimilarProductCard({ product, currentPrice }) {
    const finalPrice = getFinalPrice(product);
    const hasDiscount = finalPrice < product.price;
    const diff = finalPrice - currentPrice;

    return (
        <div className='bg-white border border-[#DDDDDD] rounded p-4 flex flex-col hover:shadow-lg transition-shadow'>
            <Link to={`/products/${product.id}`} className='flex justify-center items-center h-[180px] mb-3'>
                <ProductImage product={product} className='max-h-full max-w-full w-full h-full' />
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

            {Math.abs(diff) >= 0.005 && (
                <p className={`text-[12px] mt-1 ${diff < 0 ? 'text-[#007600]' : 'text-[#565959]'}`}>
                    {formatPrice(Math.abs(diff))} {diff < 0 ? 'cheaper' : 'more'} than this product
                </p>
            )}

            <div className='mt-auto pt-3'>
                <Link
                    to={`/products/${product.id}`}
                    className='block text-center w-full bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-[14px] rounded-full py-2'
                >
                    View product
                </Link>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className='bg-white border border-[#DDDDDD] rounded p-4 animate-pulse'>
            <div className='h-[180px] bg-[#EEEEEE] rounded mb-3'></div>
            <div className='h-4 bg-[#EEEEEE] rounded mb-2'></div>
            <div className='h-4 bg-[#EEEEEE] rounded w-2/3 mb-4'></div>
            <div className='h-6 bg-[#EEEEEE] rounded w-1/3 mb-4'></div>
            <div className='h-9 bg-[#EEEEEE] rounded-full'></div>
        </div>
    );
}

function SimilarSection({ product, category, similar, loading, failed }) {
    const categoryName = category?.name;

    return (
        <Card
            title='Similar products'
            subtitle={categoryName ? `More from ${categoryName}` : 'More from the same category'}
        >
            {loading && (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {!loading && failed && (
                <p className='text-[#B12704] text-[14px]'>Could not load similar products.</p>
            )}

            {!loading && !failed && similar.length === 0 && (
                <p className='text-[#565959] text-[14px]'>No other products in this category yet.</p>
            )}

            {!loading && !failed && similar.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {similar.map((p) => (
                        <SimilarProductCard key={p.id} product={p} currentPrice={getFinalPrice(product)} />
                    ))}
                </div>
            )}
        </Card>
    );
}

function HeroSkeleton() {
    return (
        <div className='bg-white border border-[#DDDDDD] rounded p-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_280px] gap-8 animate-pulse'>
            <div className='h-[420px] bg-[#EEEEEE] rounded'></div>
            <div className='space-y-4'>
                <div className='h-6 bg-[#EEEEEE] rounded w-4/5'></div>
                <div className='h-4 bg-[#EEEEEE] rounded w-1/4'></div>
                <div className='h-4 bg-[#EEEEEE] rounded w-1/3'></div>
                <div className='h-9 bg-[#EEEEEE] rounded w-1/4'></div>
            </div>
            <div className='h-[220px] bg-[#EEEEEE] rounded-lg'></div>
        </div>
    );
}

/* ---------- page ---------- */

function ProductDetails() {
    const { id } = useParams();
    const {
        product,
        category,
        categoryProducts,
        loading,
        relatedLoading,
        error,
        relatedError,
        notFound,
        reload,
    } = useProductDetails(id);

    // Clicking a similar product keeps this component mounted, so reset the scroll ourselves.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const stats = useMemo(
        () =>
            product && product.categoryId && !relatedError
                ? computeStats(product, categoryProducts)
                : null,
        [product, categoryProducts, relatedError]
    );

    const similar = useMemo(
        () =>
            [...categoryProducts]
                .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
                .slice(0, SIMILAR_LIMIT),
        [categoryProducts]
    );

    return (
        <div className='bg-[#EAEDED] min-h-screen'>
            <Breadcrumb product={product} category={category} />

            <div className='max-w-[1500px] mx-auto p-6 space-y-6'>
                {loading && <HeroSkeleton />}

                {!loading && notFound && (
                    <div className='bg-white border border-[#DDDDDD] rounded p-8 text-center'>
                        <h1 className='text-[20px] font-bold text-[#0F1111] mb-2'>Product not found</h1>
                        <p className='text-[#565959] mb-4'>
                            This product doesn&apos;t exist or is no longer available.
                        </p>
                        <Link
                            to='/products'
                            className='inline-block bg-[#FFD814] hover:bg-[#F7CA00] text-[14px] rounded-full px-6 py-2'
                        >
                            Back to products
                        </Link>
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

                {!loading && product && (
                    <>
                        <ProductHero product={product} category={category} stats={stats} />

                        <StatsSection
                            product={product}
                            category={category}
                            stats={stats}
                            loading={relatedLoading}
                            failed={relatedError}
                        />

                        <SimilarSection
                            product={product}
                            category={category}
                            similar={similar}
                            loading={relatedLoading}
                            failed={relatedError}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductDetails;
