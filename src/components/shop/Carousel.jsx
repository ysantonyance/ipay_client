import { Children, useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

function Carousel({ children, visibleCount = 5 }) {
    const { t } = useLanguage();
    const trackRef = useRef(null);
    const [index, setIndex] = useState(0);

    const slides = Children.toArray(children);
    const maxIndex = Math.max(0, Math.ceil(slides.length - visibleCount));

    const getStep = () => {
        const track = trackRef.current;
        const item = track?.children[0];
        if (!item) return 0;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return item.offsetWidth + gap;
    };

    const scrollToIndex = (target) => {
        const clamped = Math.min(Math.max(target, 0), maxIndex);
        setIndex(clamped);
        trackRef.current?.scrollTo({ left: clamped * getStep(), behavior: 'smooth' });
    };

    useEffect(() => {
        if (index > maxIndex) setIndex(maxIndex);
    }, [index, maxIndex]);

    const latest = useRef({ index, maxIndex });
    latest.current = { index, maxIndex };

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const ro = new ResizeObserver(() => {
            const { index, maxIndex } = latest.current;
            track.scrollTo({ left: Math.min(index, maxIndex) * getStep(), behavior: 'instant' });
        });
        ro.observe(track);
        return () => ro.disconnect();
    }, []);

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
                    aria-label={t("Previous")}
                    className="hidden sm:flex absolute top-1/2 -left-4.5 -translate-y-1/2 h-[100px] w-[48px] rounded-md border border-[#888C8C] border-l-0 items-center justify-center bg-white text-lg disabled:opacity-100 cursor-pointer shadow-md"
                >
                    ‹
                </button>
            )}

            {index < maxIndex && (
                <button
                    onClick={() => scrollToIndex(index + 1)}
                    disabled={index >= maxIndex}
                    aria-label={t("Next")}
                    className="hidden sm:flex absolute top-1/2 -right-4.5 -translate-y-1/2 h-[100px] w-[48px] rounded-md border border-[#888C8C] border-r-0 items-center justify-center bg-white text-lg disabled:opacity-100 cursor-pointer shadow-md"
                >
                    ›
                </button>
            )}
        </div>
    );
}

export default Carousel;