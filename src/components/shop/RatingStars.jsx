import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductRating } from '../../context/RatingsContext.jsx';

/**
 * Star rating for one product, used on the product cards and the product page.
 *  - Everyone sees the average (and how many ratings it's based on).
 *  - A registered user who hasn't rated this product yet can hover and click a star to rate it. A rating can't
 *    be changed afterwards, so a click asks for confirmation first.
 *  - Guests are pointed to sign in, and sellers can't rate their own product. (The backend enforces all of
 *    this too; this is just what the UI offers.)
 */
function RatingStars({ product, large = false }) {
    const { rating, ratingCount, myRating, registered, isOwn, canRate, rate } = useProductRating(product);
    const [hover, setHover] = useState(0);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const interactive = canRate && !myRating && !busy;
    const filled = interactive && hover ? hover : Math.round(rating);
    const starSize = large ? 'text-[24px]' : 'text-[17px]';

    const submit = async (stars) => {
        if (!interactive) return;
        const label = `${stars} star${stars === 1 ? '' : 's'}`;
        if (!window.confirm(`Rate this product ${label}? You can't change your rating afterwards.`)) return;

        setBusy(true);
        setError('');
        const result = await rate(stars);
        if (!result.ok) setError(result.message);
        setBusy(false);
        setHover(0);
    };

    const summary =
        ratingCount > 0
            ? `${rating.toFixed(1)} (${ratingCount})`
            : rating > 0
                ? rating.toFixed(1)
                : 'No ratings yet';

    let hint;
    if (myRating) hint = `You rated this ${myRating} ★`;
    else if (isOwn) hint = "You can't rate your own product";
    else if (!registered)
        hint = (
            <Link to='/login' className='text-[#007185] hover:underline'>
                Sign in to rate
            </Link>
        );
    else hint = 'Click a star to rate';

    return (
        <div>
            <div
                className='flex items-center'
                onMouseLeave={() => setHover(0)}
                aria-label={`${rating.toFixed(1)} out of 5 stars`}
            >
                {[1, 2, 3, 4, 5].map((n) => {
                    const color = n <= filled ? 'text-[#FFA41C]' : 'text-[#CCCCCC]';
                    return interactive ? (
                        <button
                            key={n}
                            type='button'
                            onMouseEnter={() => setHover(n)}
                            onFocus={() => setHover(n)}
                            onBlur={() => setHover(0)}
                            onClick={() => submit(n)}
                            aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
                            className={`${starSize} ${color} leading-none px-[1px] cursor-pointer`}
                        >
                            ★
                        </button>
                    ) : (
                        <span
                            key={n}
                            className={`${starSize} ${color} leading-none px-[1px] ${busy ? 'opacity-60' : ''}`}
                        >
                            ★
                        </span>
                    );
                })}
                <span className={`ml-2 text-[#007185] ${large ? 'text-[14px]' : 'text-[12px]'}`}>{summary}</span>
            </div>

            <p className='text-[11px] text-[#565959] mt-0.5'>{busy ? 'Saving your rating…' : hint}</p>
            {error && (
                <p role='alert' className='text-[11px] text-[#B12704] mt-0.5'>
                    {error}
                </p>
            )}
        </div>
    );
}

export default RatingStars;
