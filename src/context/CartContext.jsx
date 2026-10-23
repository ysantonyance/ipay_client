import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./AuthContext.jsx";
import {useLanguage} from "./LanguageContext.jsx";
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

// Shown when someone who isn't signed in tries to add something to the cart.
function RegisterPrompt({onCancel, onRegister}) {
    const {t} = useLanguage();

    useEffect(() => {
        const onKey = e => e.key === 'Escape' && onCancel();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onCancel]);

    return (
        <div
            className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4'
            onClick={onCancel}
        >
            <div
                role='dialog'
                aria-modal='true'
                aria-labelledby='register-prompt-title'
                className='w-full max-w-[420px] rounded-lg bg-white p-6 shadow-xl'
                onClick={e => e.stopPropagation()}
            >
                <h2 id='register-prompt-title' className='text-[20px] font-bold text-[#0F1111]'>
                    {t("Register to add items to your cart")}
                </h2>
                <p className='mt-2 text-[14px] text-[#565959]'>
                    {t("You need an account to add products to your cart. Register to continue shopping.")}
                </p>
                <div className='mt-6 flex justify-end gap-3'>
                    <button
                        type='button'
                        onClick={onCancel}
                        className='cursor-pointer rounded-full border border-[#a6a6a6] px-6 py-2 text-[14px] text-[#0F1111] hover:bg-[#F0F2F2]'
                    >
                        {t("Cancel")}
                    </button>
                    <button
                        type='button'
                        onClick={onRegister}
                        className='cursor-pointer rounded-full bg-[#FFD814] px-6 py-2 text-[14px] text-[#0F1111] hover:bg-[#F7CA00]'
                    >
                        {t("Register")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function CartProvider({children}) {
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const [promptOpen, setPromptOpen] = useState(false);
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

    // Resolves to false when nothing was added (not signed in -> the register popup opens instead).
    const add = async product => {
        if (!isLoggedIn) {
            setPromptOpen(true);
            return false;
        }
        const cart = await cartApi.addItem({productId: product.id, quantity: 1});
        setItems(fromServer(cart));
        return true;
    };

    const goRegister = () => {
        setPromptOpen(false);
        navigate('/register');
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

    // Empties the cart (used after an order is placed). Logged in: clears it on the server too.
    const clear = async () => {
        if (isLoggedIn) await cartApi.delete();
        setItems([]);
    };

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <CartContext.Provider value={{items, add, setQty, remove, clear, total}}>
            {children}
            {promptOpen && <RegisterPrompt onCancel={() => setPromptOpen(false)} onRegister={goRegister}/>}
        </CartContext.Provider>
    );
}