import { Children, useRef, useState, useEffect } from 'react';

function Carousel({ children, visibleCount = 5 }) {
    const trackRef = useRef(null);
    const [index, setIndex] = useState(0);

    const slides = Children.toArray(children);
    const maxIndex = Math.max(0, slides.length - visibleCount);

    useEffect(() => {
        if (index > maxIndex) {
            scrollToIndex(maxIndex);
        }
    }, [visibleCount, maxIndex]);

    const scrollToIndex = (target) => {
        const clamped = Math.min(Math.max(target, 0), maxIndex);
        setIndex(clamped);

        const track = trackRef.current;
        if (!track) return;
        const item = track.children[0];
        if (!item) return;

        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const step = item.offsetWidth + gap;
        track.scrollTo({ left: clamped * step, behavior: 'smooth' });
    };

    const gapRem = 0.75;
    const totalGaps = visibleCount - 1;
    const itemWidthStyle = {
        flexBasis: `calc((100% - ${totalGaps * gapRem}rem) / ${visibleCount})`,
    };

    return (
        <div className="relative">
            <div
                ref={trackRef}
                className="flex gap-3 overflow-x-auto sm:overflow-x-hidden scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
                {slides.map((child, i) => (
                    <div
                        key={i}
                        className="shrink-0 snap-start"
                        style={itemWidthStyle}
                    >
                        {child}
                    </div>
                ))}
            </div>

            {index > 0 && (
                <button
                    onClick={() => scrollToIndex(index - 1)}
                    disabled={index <= 0}
                    aria-label="Previous"
                    className="hidden sm:flex absolute top-1/2 -left-4.5 -translate-y-1/2 h-[100px] w-[48px] rounded-md border border-[#888C8C] border-l-0 items-center justify-center bg-white text-lg disabled:opacity-100 cursor-pointer shadow-md"
                >
                    ‹
                </button>
            )}

            {index < maxIndex && (
                <button
                    onClick={() => scrollToIndex(index + 1)}
                    disabled={index >= maxIndex}
                    aria-label="Next"
                    className="hidden sm:flex absolute top-1/2 -right-4.5 -translate-y-1/2 h-[100px] w-[48px] rounded-md border border-[#888C8C] border-r-0 items-center justify-center bg-white text-lg disabled:opacity-100 cursor-pointer shadow-md"
                >
                    ›
                </button>
            )}
        </div>
    );
}

export default Carousel;