import {Link, useNavigate} from "react-router-dom";
import {useCart} from "../context/CartContext.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {imagesApi} from "../api/imagesApi.js";

function Cart() {
    const {items, setQty, remove, total} = useCart();
    const {isLoggedIn} = useAuth();
    const count = items.reduce((n, i) => n + i.qty, 0);
    const navigate = useNavigate();

    if (items.length === 0)
        return (
            <div className='bg-[#EAEDED] lg:px-20'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 p-3 sm:p-10 items-center'>
                    <div className='bg-white p-5 lg:col-span-3 flex flex-col sm:flex-row items-center gap-6'>
                        <img
                            className='w-full max-w-[360px] h-[200px] object-contain'
                            src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB445243794_.svg"
                            alt="Empty Cart Kettle"
                        />
                        <div>
                            <div>
                                <h1 className='text-[26px] font-bold'>Your IPAY Cart is empty</h1>
                                <Link
                                    className='text-[#20639F] hover:underline hover:text-[#083251]'
                                    to='/products'
                                >
                                    Shop today's deals
                                </Link>
                            </div>
                            {!isLoggedIn && (
                                <div className='flex flex-wrap gap-2 py-3'>
                                    <Link
                                        className='block bg-[#FFD814] hover:bg-[#FFCE12] rounded-2xl px-2 py-1'
                                        to='/login'
                                    >
                                        Sign in to your account
                                    </Link>
                                    <Link
                                        className='block border border-[#898D8E] hover:bg-[#F6FAFB] rounded-2xl px-2 py-1'
                                        to='/register'
                                    >
                                        Sign up now
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        )

    return (
        <div className='bg-[#EAEDED] lg:px-20'>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start p-3 sm:p-10'>
                <div className='bg-white p-3 sm:p-5 lg:col-span-3'>
                    <h1 className='text-2xl font-bold mb-2'>Shopping Cart</h1>

                    <div className='hidden sm:flex justify-end border-b border-[#E7E7E7] pb-1 text-sm text-gray-500'>
                        <span>Price</span>
                    </div>

                    {items.map(i => (
                        <div key={i.id} className='flex gap-3 sm:gap-4 border-b border-[#E7E7E7] py-4'>
                            <Link to={`/products/${i.id}`} className='w-[100px] h-[100px] sm:w-[180px] sm:h-[180px] shrink-0 flex items-center justify-center'>
                                {i.imageUrl && (
                                    <img
                                        src={imagesApi.resolveUrl(i.imageUrl)}
                                        alt={i.name}
                                        className='max-h-full max-w-full object-contain'
                                    />
                                )}
                            </Link>

                            <div className='flex-1 min-w-0'>
                                <p className='font-semibold'>{i.name}</p>
                                <p className='font-bold mt-1 sm:hidden'>${(i.price).toFixed(2)}</p>

                                <div className='flex items-center gap-3 mt-3'>
                                    <div className='flex items-center border-3 border-[#FFD814] rounded-2xl overflow-hidden'>
                                        <button
                                            onClick={() => setQty(i.id, i.qty - 1)}
                                            className='w-9 h-9 sm:w-[16px] sm:h-[16px] sm:mx-2 sm:my-1 cursor-pointer flex items-center justify-center'
                                        >
                                            {i.qty === 1 ? (
                                                <img
                                                    className='w-[16px] h-[16px]'
                                                    src="https://img.icons8.com/?size=100&id=ATzTLrwzRISB&format=png&color=000000" alt=""/>
                                            ) : '-'}
                                        </button>
                                        <span className='px-2 py-1'>{i.qty}</span>
                                        <button
                                            onClick={() => setQty(i.id, i.qty + 1)}
                                            className='w-9 h-9 sm:w-[16px] sm:h-[16px] sm:mx-2 sm:my-1 cursor-pointer flex items-center justify-center'
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button onClick={() => remove(i.id)} className='text-[#2162A1] hover:underline text-sm cursor-pointer py-2'>Remove</button>
                                </div>
                            </div>

                            <p className='font-bold hidden sm:block'>${(i.price).toFixed(2)}</p>
                        </div>
                    ))}
                </div>


                <div className='order-first lg:order-none bg-white lg:col-span-1 rounded p-3 sm:p-4'>
                    <p className='text-lg'>
                        Subtotal ({count} item{count === 1 ? '' : 's'}): <span className='font-bold'>${total.toFixed(2)}</span>
                    </p>
                    <button
                        onClick={() => navigate('/order')}
                        className='w-full mt-4 bg-[#FFD814] hover:bg-[#F7CA00] rounded-full py-3 sm:py-2 cursor-pointer'>
                        Proceed to checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;