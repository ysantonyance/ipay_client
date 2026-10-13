// Backend enum (IPAY.Domain.Enums.OrderStatus): Pending = 0, Paid = 1, Shipped = 2, Delivered = 3, Cancelled = 4.
export const STATUS_NAMES = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

// The API may send the status as a name or as a number, so both are accepted.
export function normalizeStatus(s) {
    if (typeof s === 'number') return STATUS_NAMES[s] ?? 'Pending';
    const text = String(s ?? '').trim();
    const byName = STATUS_NAMES.find(n => n.toLowerCase() === text.toLowerCase());
    if (byName) return byName;
    if (/^\d+$/.test(text)) return STATUS_NAMES[Number(text)] ?? 'Pending';
    return 'Pending';
}

// The number the backend expects when changing a status.
export const statusToNumber = name => STATUS_NAMES.indexOf(name);
