import {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "./AuthContext.jsx";
import {cartApi} from "../api/cartApi.js";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const fromServer = cart => (cart?.items ?? []).map(i => ({
    id: i.productId,
    itemId: i.id,
    name: i.productName,
    imageUrl: i.imageUrl,
    price: i.price,
    qty: i.quantity
}));

export function CartProvider({children}) {
    const {isLoggedIn} = useAuth();
    const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') ?? '[]'));

    useEffect(() => {
        if (isLoggedIn) {
            cartApi.getAll().then(cart => setItems(fromServer(cart))).catch(console.error);
        } else {
            setItems(JSON.parse(localStorage.getItem('cart') ?? '[]'));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) localStorage.setItem('cart', JSON.stringify(items));
    }, [items, isLoggedIn]);

    const add = async product => {
        if (isLoggedIn) {
            const cart = await cartApi.addItem({productId: product.id, quantity: 1});
            return setItems(fromServer(cart));
        }
        setItems(prev =>
            prev.some(i => i.id === product.id)
                ? prev.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i)
                : [...prev, {...product, qty: 1}]
        );
    };

    const remove = async id => {
        if (isLoggedIn) {
            const item = items.find(i => i.id === id);
            const cart = await cartApi.removeItem(item.itemId);
            return setItems(fromServer(cart));
        }
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const setQty = async (id, qty) => {
        if (qty < 1) return remove(id);
        if (isLoggedIn) {
            const item = items.find(i => i.id === id);
            const cart = await cartApi.updateItem(item.itemId, {productId: id, quantity: qty});
            return setItems(fromServer(cart));
        }
        setItems(prev => prev.map(i => i.id === id ? {...i, qty} : i));
    };

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <CartContext.Provider value={{items, add, setQty, remove, total}}>
            {children}
        </CartContext.Provider>
    );
}