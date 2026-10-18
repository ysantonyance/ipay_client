import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useCart} from "../context/CartContext.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {ordersApi} from "../api/ordersApi.js";
import {useLanguage} from "../context/LanguageContext.jsx";

const FREE_SHIPPING_OVER = 50;   // placeholder fee rules, change to your own
const SHIPPING_FEE = 5.99;
const TAX_RATE = 0.1;

const money = v => `$${Number(v).toFixed(2)}`;
const inputCls = 'w-full border border-gray-400 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#E77600]';

const Err = ({msg}) => {
    const {t} = useLanguage();
    return msg ? <span className='text-[#D32F2F] text-xs mt-1 block'>{t(msg)}</span> : null;
};

const nameRe = /^[\p{L}\s'.-]+$/u;

function validateAddress(f) {
    const e = {};
    const name = f.fullName.trim();

    if (!f.country.trim()) e.country = 'Enter your country/region';
    else if (!nameRe.test(f.country.trim())) e.country = 'Country can only contain letters';

    if (!name) e.fullName = 'Enter your first and last name';
    else if (name.split(/\s+/).length < 2 || name.length > 50) e.fullName = 'Enter first and last name (max 50 characters)';
    else if (!nameRe.test(name)) e.fullName = 'Name can only contain letters';

    if (!f.streetNumber.trim()) e.streetNumber = 'Enter the street number';
    else if (!/^\d+[A-Za-z]?$/.test(f.streetNumber.trim())) e.streetNumber = 'Use a number like 12 or 12A';

    if (!f.streetName.trim()) e.streetName = 'Enter the street name';
    else if (f.streetName.trim().length < 2) e.streetName = 'Street name is too short';

    if (!f.city.trim()) e.city = 'Enter your city';
    else if (!nameRe.test(f.city.trim())) e.city = 'City can only contain letters';

    if (!f.state.trim()) e.state = 'Enter your state/province/region';

    if (!f.zip.trim()) e.zip = 'Enter your zip code';
    else if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(f.zip.trim())) e.zip = 'Enter a valid zip code';

    const digits = f.phone.replace(/\D/g, '');
    if (!f.phone.trim()) e.phone = 'Enter your phone number';
    else if (!/^\+?[\d\s()-]+$/.test(f.phone.trim()) || digits.length < 10 || digits.length > 15)
        e.phone = 'Enter a valid phone number (10-15 digits)';

    return e;
}

function validateCard(f) {
    const e = {};

    if (!f.name.trim()) e.name = 'Enter the name on the card';
    else if (!nameRe.test(f.name.trim())) e.name = 'Name can only contain letters';

    if (!f.number) e.number = 'Enter the card number';
    else if (f.number.length < 13 || f.number.length > 16) e.number = 'Card number must be 13-16 digits';

    if (!f.expiry) e.expiry = 'Enter the expiry date';
    else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry)) e.expiry = 'Use the format MM/YY';
    else {
        const [mm, yy] = f.expiry.split('/').map(Number);
        if (new Date(2000 + yy, mm) <= new Date()) e.expiry = 'This card has expired';
    }

    if (!f.cvv) e.cvv = 'Enter the security code';
    else if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = 'CVV must be 3 or 4 digits';

    return e;
}

function Modal({title, onClose, className = 'max-w-md', children}) {
    const {t} = useLanguage();
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    return (
        <div className='fixed inset-0 z-50 overflow-y-auto bg-black/50'>
            <div className='flex min-h-full items-center justify-center p-4' onClick={onClose}>
                <div className={`bg-white rounded p-6 w-full ${className}`} onClick={e => e.stopPropagation()}>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-lg font-bold'>{t(title)}</h2>
                        <button type='button' onClick={onClose} className='text-xl cursor-pointer'>×</button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

function AddressModal({initial, onSave, onClose}) {
    const {t} = useLanguage();
    const [f, setF] = useState(initial ?? {
        country: '', fullName: '', streetNumber: '', streetName: '',
        city: '', state: '', zip: '', phone: ''
    });
    const [errors, setErrors] = useState({});
    const set = k => e => {
        setF({...f, [k]: e.target.value});
        setErrors({...errors, [k]: undefined});
    };
    const label = 'block text-sm font-bold mb-1';

    const submit = e => {
        e.preventDefault();
        const errs = validateAddress(f);
        setErrors(errs);
        if (Object.keys(errs).length === 0) onSave(f);
    };

    return (
        <Modal title='Add a new address' onClose={onClose} className='max-w-[610px] min-h-[700px]'>
            <form noValidate onSubmit={submit} className='space-y-3'>
                <div>
                    <label className={label}>{t("Country/Region")}</label>
                    <input className={inputCls} value={f.country} onChange={set('country')} />
                    <Err msg={errors.country} />
                </div>

                <div>
                    <label className={label}>{t("Full name (First and Last name)")}</label>
                    <input className={inputCls} value={f.fullName} onChange={set('fullName')} />
                    <Err msg={errors.fullName} />
                </div>

                <div>
                    <label className={label}>{t("Street address")}</label>
                    <div className='space-y-2'>
                        <div>
                            <input className={inputCls} placeholder={t('Street number')} value={f.streetNumber} onChange={set('streetNumber')} />
                            <Err msg={errors.streetNumber} />
                        </div>
                        <div>
                            <input className={inputCls} placeholder={t('Street name')} value={f.streetName} onChange={set('streetName')} />
                            <Err msg={errors.streetName} />
                        </div>
                    </div>
                </div>

                <div>
                    <label className={label}>{t("City")}</label>
                    <input className={inputCls} value={f.city} onChange={set('city')} />
                    <Err msg={errors.city} />
                </div>

                <div className='flex gap-3'>
                    <div className='flex-1'>
                        <label className={label}>{t("State/Province/Region")}</label>
                        <input className={inputCls} value={f.state} onChange={set('state')} />
                        <Err msg={errors.state} />
                    </div>
                    <div className='flex-1'>
                        <label className={label}>{t("Zip Code")}</label>
                        <input className={inputCls} value={f.zip} onChange={set('zip')} />
                        <Err msg={errors.zip} />
                    </div>
                </div>

                <div>
                    <label className={label}>{t("Phone number")}</label>
                    <input type='tel' className={inputCls} value={f.phone} onChange={set('phone')} />
                    <Err msg={errors.phone} />
                    <p className='text-xs text-gray-500 mt-1'>{t("May be used to assist delivery")}</p>
                </div>

                <button className='w-full bg-[#FFD814] hover:bg-[#F7CA00] rounded-full py-2 cursor-pointer'>{t("Use this address")}</button>
            </form>
        </Modal>
    );
}

function CardModal({onSave, onClose}) {
    const {t} = useLanguage();
    const [f, setF] = useState({name: '', number: '', expiry: '', cvv: ''});
    const [errors, setErrors] = useState({});
    const text = k => e => {
        setF({...f, [k]: e.target.value});
        setErrors({...errors, [k]: undefined});
    };
    const digits = k => e => {
        setF({...f, [k]: e.target.value.replace(/\D/g, '')});
        setErrors({...errors, [k]: undefined});
    };

    const submit = e => {
        e.preventDefault();
        const errs = validateCard(f);
        setErrors(errs);
        if (Object.keys(errs).length === 0) onSave(f);
    };

    return (
        <Modal title='Add a card' onClose={onClose}>
            <form noValidate onSubmit={submit} className='space-y-3'>
                <div>
                    <input className={inputCls} placeholder={t('Name on card')} value={f.name} onChange={text('name')} />
                    <Err msg={errors.name} />
                </div>
                <div>
                    <input className={inputCls} placeholder={t('Card number')} inputMode='numeric' maxLength={16}
                           value={f.number} onChange={digits('number')} />
                    <Err msg={errors.number} />
                </div>
                <div className='flex gap-3'>
                    <div className='flex-1'>
                        <input className={inputCls} placeholder={t('MM/YY')} maxLength={5}
                               value={f.expiry} onChange={text('expiry')} />
                        <Err msg={errors.expiry} />
                    </div>
                    <div className='flex-1'>
                        <input className={inputCls} placeholder='CVV' inputMode='numeric' maxLength={4}
                               value={f.cvv} onChange={digits('cvv')} />
                        <Err msg={errors.cvv} />
                    </div>
                </div>
                <button className='w-full bg-[#FFD814] hover:bg-[#F7CA00] rounded-full py-2 cursor-pointer'>{t("Add your card")}</button>
            </form>
        </Modal>
    );
}

function OrderProcess() {
    const {t} = useLanguage();
    const {items, total, clear} = useCart();
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState(null);
    const [card, setCard] = useState(null);
    const [modal, setModal] = useState(null); // 'address' | 'card' | null
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);

    const count = items.reduce((n, i) => n + i.qty, 0);
    const shipping = total >= FREE_SHIPPING_OVER || total === 0 ? 0 : SHIPPING_FEE;
    const tax = total * TAX_RATE;
    const orderTotal = total + shipping + tax;

    if (placed)
        return (
            <div className='bg-[#EAEDED] lg:px-20 p-10'>
                <div className='bg-white rounded p-10 text-center'>
                    <h1 className='text-2xl font-bold text-[#067D62] mb-2'>{t("Order placed, thank you!")}</h1>
                    <p className='text-sm mb-6'>{t("Your order was successful.")}</p>
                    <div className='flex flex-wrap justify-center gap-3'>
                        <Link to='/orders' className='bg-[#FFD814] hover:bg-[#F7CA00] rounded-full px-6 py-2 text-sm'>
                            {t("View your orders")}
                        </Link>
                        <Link to='/products' className='border border-[#898D8E] hover:bg-[#F6FAFB] rounded-full px-6 py-2 text-sm'>
                            {t("Continue shopping")}
                        </Link>
                    </div>
                </div>
            </div>
        );

    if (items.length === 0)
        return (
            <div className='bg-[#EAEDED] lg:px-20'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 p-10 items-center'>
                    <div className='bg-white p-5 lg:col-span-3 flex flex-col sm:flex-row items-center gap-6'>
                        <img
                            className='w-[360px] h-[200px] object-contain'
                            src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB445243794_.svg"
                            alt="Empty Cart Kettle"
                        />
                        <div>
                            <div>
                                <h1 className='text-[26px] font-bold'>{t("Your IPAY Cart is empty")}</h1>
                                <Link
                                    className='text-[#20639F] hover:underline hover:text-[#083251]'
                                    to='/products'
                                >
                                    {t("Shop today's deals")}
                                </Link>
                            </div>
                            {!isLoggedIn && (
                                <div className='space-x-2 flex py-3'>
                                    <Link
                                        className='block bg-[#FFD814] hover:bg-[#FFCE12] rounded-2xl px-2 py-1'
                                        to='/login'
                                    >
                                        {t("Sign in to your account")}
                                    </Link>
                                    <Link
                                        className='block border border-[#898D8E] hover:bg-[#F6FAFB] rounded-2xl px-2 py-1'
                                        to='/register'
                                    >
                                        {t("Sign up now")}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        )

    const placeOrder = async () => {
        setPlacing(true);
        try {
            await ordersApi.create({
                shippingAddress: `${address.fullName}, ${address.streetNumber} ${address.streetName}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`,
                items: items.map(i => ({productId: i.id, quantity: i.qty}))
            });
            // The order is in, so empty the cart. If clearing fails the order still went through.
            try {
                await clear();
            } catch (err) {
                console.error('Could not clear the cart after ordering', err);
            }
            setPlaced(true);
        } catch (err) {
            console.error(err);
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className='bg-[#EAEDED] lg:px-20'>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 items-start p-10'>
                <div className='lg:col-span-3 space-y-6'>
                    <div className='bg-white p-5 rounded'>
                        <h2 className='text-xl font-bold mb-3'>{t("1. Select a delivery address")}</h2>
                        {address ? (
                            <div className='flex justify-between items-start text-sm'>
                                <div>
                                    <p className='font-semibold'>{address.fullName} {address.streetNumber}</p>
                                    <p>{address.streetName} {address.city}, {address.state} {address.zip} {address.country}</p>
                                    <p>{address.phone}</p>
                                </div>
                                <button onClick={() => setModal('address')} className='text-[#007185] hover:underline cursor-pointer'>{t("Change")}</button>
                            </div>
                        ) : (
                            <button onClick={() => setModal('address')}
                                    className='text-[#1F649F] hover:underline hover:text-[#0D3253] px-4 py-2 text-sm cursor-pointer'>
                                {t("Add a new address")}
                            </button>
                        )}
                    </div>

                    <div className={`bg-white p-5 rounded ${address ? '' : 'opacity-50 pointer-events-none'}`}>
                        <h2 className='text-xl font-bold mb-3'>{t("2. Payment method")}</h2>
                        {!address ? (
                            <p className='text-sm text-gray-500'>{t("Add a delivery address first.")}</p>
                        ) : card ? (
                            <div className='flex justify-between items-center text-sm'>
                                <p>{t("Card ending in")} <b>{card.number.slice(-4)}</b> · {card.name}</p>
                                <button onClick={() => setModal('card')} className='text-[#007185] hover:underline cursor-pointer'>{t("Change")}</button>
                            </div>
                        ) : (
                            <button onClick={() => setModal('card')} className='border border-gray-400 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer'>
                                {t("+ Add a card")}
                            </button>
                        )}
                    </div>
                </div>

                <div className='bg-white rounded p-4 lg:col-span-1 lg:sticky lg:top-4'>
                    <button
                        disabled={!address || !card || placing}
                        onClick={placeOrder}
                        className='w-full bg-[#FFD814] hover:bg-[#F7CA00] rounded-full py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {t("Use this payment method")}
                    </button>

                    <h3 className='font-bold mt-4 mb-2'>{t("Order Summary")}</h3>
                    <div className='text-sm space-y-1'>
                        <div className='flex justify-between'><span>{t('Items ({count}):', { count })}</span><span>{money(total)}</span></div>
                        <div className='flex justify-between'><span>{t("Shipping:")}</span><span>{shipping ? money(shipping) : t('FREE')}</span></div>
                        <div className='flex justify-between'><span>{t("Estimated tax:")}</span><span>{money(tax)}</span></div>
                    </div>
                    <div className='flex justify-between font-bold text-lg text-[#B12704] border-t border-gray-300 mt-3 pt-3'>
                        <span>{t("Order total:")}</span><span>{money(orderTotal)}</span>
                    </div>
                </div>
            </div>

            {modal === 'address' && (
                <AddressModal initial={address} onClose={() => setModal(null)} onSave={a => { setAddress(a); setModal(null); }} />
            )}
            {modal === 'card' && (
                <CardModal onClose={() => setModal(null)} onSave={c => { setCard(c); setModal(null); }} />
            )}
        </div>
    );
}

export default OrderProcess;