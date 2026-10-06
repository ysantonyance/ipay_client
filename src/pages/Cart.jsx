import {Link} from "react-router-dom";
import {useCart} from "../context/CartContext.jsx";
import {imagesApi} from "../api/imagesApi.js";

function Cart() {
    const {items, setQty, remove, total} = useCart();
    const count = items.reduce((n, i) => n + i.qty, 0);

    if (items.length === 0)
        return <p className='p-10'>Your cart is empty. <Link to='/products' className='underline'>Keep shopping</Link></p>;

    return (
        <div className='bg-[#EAEDED] lg:px-20'>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 items-start p-10'>
                <div className='bg-white p-5 lg:col-span-3'>
                    <h1 className='text-2xl font-bold mb-2'>Shopping Cart</h1>

                    <div className='flex justify-end border-b border-[#E7E7E7] pb-1 text-sm text-gray-500'>
                        <span>Price</span>
                    </div>

                    {items.map(i => (
                        <div key={i.id} className='flex gap-4 border-b border-[#E7E7E7] py-4'>
                            <Link to={`/products/${i.id}`} className='w-[180px] h-[180px] shrink-0 flex items-center justify-center'>
                                {i.imageUrl && (
                                    <img
                                        src={imagesApi.resolveUrl(i.imageUrl)}
                                        alt={i.name}
                                        className='max-h-full max-w-full object-contain'
                                    />
                                )}
                            </Link>

                            <div className='flex-1'>
                                <p className='font-semibold'>{i.name}</p>

                                <div className='flex items-center gap-3 mt-3'>
                                    <div className='flex items-center border-3 border-[#FFD814] rounded-2xl overflow-hidden'>
                                        <button
                                            onClick={() => setQty(i.id, i.qty - 1)}
                                            className='w-[16px] h-[16px] mx-2 my-1 cursor-pointer flex items-center justify-center'
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
                                            className='w-[16px] h-[16px] mx-2 my-1 cursor-pointer flex items-center justify-center'
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button onClick={() => remove(i.id)} className='text-[#2162A1] hover:underline text-sm cursor-pointer'>Remove</button>
                                </div>
                            </div>

                            <p className='font-bold'>${(i.price).toFixed(2)}</p>
                        </div>
                    ))}
                </div>


                <div className='bg-white lg:col-span-1 rounded p-4'>
                    <p className='text-lg'>
                        Subtotal ({count} item{count === 1 ? '' : 's'}): <span className='font-bold'>${total.toFixed(2)}</span>
                    </p>
                    <button className='w-full mt-4 bg-[#FFD814] hover:bg-[#F7CA00] rounded-full py-2 cursor-pointer'>
                        Proceed to checkout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;