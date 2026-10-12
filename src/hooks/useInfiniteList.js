import {useEffect, useRef, useState} from "react";

function useInfiniteList(items, resetKey, step = 24) {
    const [count, setCount] = useState(step);
    const sentinelRef = useRef(null);

    useEffect(() => { setCount(step); }, [resetKey, step]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setCount(c => c + step);
        }, {rootMargin: '400px'});
        io.observe(el);
        return () => io.disconnect();
    }, [count, items.length, step]);

    return {visible: items.slice(0, count), hasMore: count < items.length, sentinelRef};
}

export default useInfiniteList;