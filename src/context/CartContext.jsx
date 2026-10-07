import {createContext, useContext, useEffect, useState} from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({children}) {
    const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') ?? '[]'));

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const add = product => setItems(prev =>
        prev.some(i => i.id === product.id)
            ? prev.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i)
            : [...prev, {...product, qty: 1}]
    );

    const setQty = (id, qty) => setItems(prev =>
        qty < 1 ? prev.filter(i => i.id !== id) : prev.map(i => i.id === id ? {...i, qty} : i)
    );

    const remove = id => setItems(prev => prev.filter(i => i.id !== id));

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <CartContext.Provider value={{items, add, setQty, remove, total}}>
            {children}
        </CartContext.Provider>
    );
}