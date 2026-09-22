import { Children, useRef, useState } from 'react';

function Carousel({ children, visibleCount = 5 }) {
    const trackRef = useRef(null);
    const [index, setIndex] = useState(0);

    const slides = Children.toArray(children);
    const maxIndex = Math.max(0, slides.length - visibleCount);

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

    return (
        <div className="relative">
            <div ref={trackRef} className="flex gap-3 overflow-x-hidden scroll-smooth">
                {slides.map((child, i) => (
                    <div key={i} className="shrink-0 basis-[calc((100%-5*0.75rem)/5.5)]">
                        {child}
                    </div>
                ))}
            </div>

            {index > 0 && (
                <button
                    onClick={() => scrollToIndex(index - 1)}
                    disabled={index <= 0}
                    aria-label="Previous"
                    className="absolute top-1/2 -left-4.5 -translate-y-1/2 flex h-[100px] w-[48px] rounded-md border border-[#888C8C] border-l-0 items-center justify-center bg-white text-lg disabled:opacity-100 cursor-pointer"
                >
                    ‹
                </button>
            )}

            {index < maxIndex && (
                <button
                    onClick={() => scrollToIndex(index + 1)}
                    disabled={index >= maxIndex}
                    aria-label="Next"
                    className="absolute top-1/2 -right-4.5 -translate-y-1/2 flex h-[100px] w-[48px] rounded-md border border-[#888C8C] border-r-0 items-center justify-center bg-white text-lg disabled:opacity-100 cursor-pointer"
                >
                    ›
                </button>
            )}

        </div>
    );
}

export default Carousel;