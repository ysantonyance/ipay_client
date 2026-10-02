// Builds the list of page buttons to show, e.g. [1, '…', 4, 5, 6, '…', 20].
// Always shows the first page, the last page, and one neighbour on each side of the current page.
function getPageItems(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = new Set([1, total, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const items = [];
    sorted.forEach((page, index) => {
        if (index > 0 && page - sorted[index - 1] > 1) {
            items.push('…');
        }
        items.push(page);
    });

    return items;
}

function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const items = getPageItems(page, totalPages);

    const baseButton =
        'min-w-[36px] h-[36px] px-3 text-[14px] border rounded cursor-pointer transition-colors';
    const idleButton = 'bg-white border-[#D5D9D9] text-[#0F1111] hover:bg-[#F0F2F2]';
    const activeButton = 'bg-[#FFF3E0] border-[#E77600] text-[#0F1111] font-bold';
    const disabledButton = 'bg-[#F7F7F7] border-[#E3E6E6] text-[#999999] cursor-not-allowed';

    return (
        <nav className='flex flex-wrap items-center justify-center gap-2 mt-6' aria-label='Pagination'>
            <button
                type='button'
                className={`${baseButton} ${page === 1 ? disabledButton : idleButton}`}
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                ‹ Previous
            </button>

            {items.map((item, index) =>
                item === '…' ? (
                    <span key={`gap-${index}`} className='px-1 text-[#565959]' aria-hidden='true'>
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type='button'
                        className={`${baseButton} ${item === page ? activeButton : idleButton}`}
                        onClick={() => onPageChange(item)}
                        aria-current={item === page ? 'page' : undefined}
                        aria-label={`Page ${item}`}
                    >
                        {item}
                    </button>
                )
            )}

            <button
                type='button'
                className={`${baseButton} ${page === totalPages ? disabledButton : idleButton}`}
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                Next ›
            </button>
        </nav>
    );
}

export default Pagination;
