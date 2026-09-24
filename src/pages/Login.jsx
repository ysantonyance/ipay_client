import { useState } from 'react';
import {Link} from "react-router-dom";

function Login() {
    const initialFormState = {
        loginOrEmail: '',
        password: ''
    };

    const [formState, setFormState] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formState.loginOrEmail.trim()) {
            newErrors.loginOrEmail = 'Enter your email or mobile phone number';
        } else if (formState.loginOrEmail === "Oleg") {
            newErrors.loginOrEmail = 'Верни 100 баксов и можешь зайти';
        }

        if (!formState.password) {
            newErrors.password = 'Enter your password';
        } else if (
            formState.password.length < 8 ||
            !/[a-zA-Z]/.test(formState.password) ||
            !/[0-9]/.test(formState.password)
        ) {
            newErrors.password = 'Password must be at least 8 characters and contain both letters and numbers';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Login submitted:', formState);
            alert('Logged in successfully!');
            setErrors({});
        }
    };

    return (
        <div className='flex flex-col items-center p-5 min-h-screen bg-white'>
            <img
                className='w-[100px] h-[30px] object-contain mb-4'
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogodownload.org%2Fwp-content%2Fuploads%2F2014%2F04%2Famazon-logo.png&f=1&nofb=1&ipt=fef6cff166c6ed07229dbe4fd6e02ee582c684de49a245bcd6f6473423f92c4e"
                alt="Amazon logo"
            />

            <div className='w-full max-w-[350px] p-6 border border-[#D5D9D9] rounded-xl mb-6 shadow-sm'>
                <h1 className='text-[28px] font-normal mb-4'>Sign in</h1>

                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <label htmlFor='loginOrEmail' className='text-[13px] font-bold mb-1'>
                            Email or mobile phone number
                        </label>
                        <input
                            type='text'
                            id='loginOrEmail'
                            name='loginOrEmail'
                            value={formState.loginOrEmail}
                            onChange={handleInputChange}
                            autoComplete='username'
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.loginOrEmail ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.loginOrEmail && (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>
                                {errors.loginOrEmail}
                            </span>
                        )}
                    </div>

                    <div className='flex flex-col'>
                        <div className='flex justify-between items-center mb-1'>
                            <label htmlFor='password' className='text-[13px] font-bold'>
                                Password
                            </label>
                            <a href='#' className='text-[12px] text-[#2162A1] hover:underline'>
                                Forgot password?
                            </a>
                        </div>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            value={formState.password}
                            onChange={handleInputChange}
                            autoComplete='current-password'
                            className={`w-full p-2 text-[13px] border rounded-xl outline-none focus:ring-2 focus:ring-[#888C8D] focus:border-[#888C8D] ${
                                errors.password ? 'border-[#d32f2f]' : 'border-[#a6a6a6]'
                            }`}
                        />
                        {errors.password && (
                            <span className='text-[#d32f2f] text-[12px] mt-1'>
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <button
                        type='submit'
                        className='w-full py-1.5 mt-2 bg-[#FFD814] hover:bg-[#FFCE12] border border-[#FCD200] rounded-xl text-[13px] cursor-pointer font-medium active:bg-[#F0B800]'
                    >
                        Sign in
                    </button>
                </form>

                <p className='text-[12px] text-[#111] mt-4 leading-normal'>
                    By continuing, you agree to Amazon's{' '}
                    <a href='#' className='text-[#2162A1] hover:underline'>
                        Conditions of Use
                    </a>{' '}
                    and{' '}
                    <a href='#' className='text-[#2162A1] hover:underline'>
                        Privacy Notice
                    </a>
                    .
                </p>

                <div className='mt-4 pt-4 border-t border-[#D5D9D9]'>
                    <a href='#' className='text-[13px] text-[#2162A1] hover:underline flex items-center gap-1'>
                        ▸ Need help?
                    </a>
                </div>
            </div>

            <div className='w-full max-w-[350px] flex items-center gap-2 mb-4'>
                <hr className='flex-1 border-[#D5D9D9]' />
                <span className='text-[12px] text-[#767676]'>New to Amazon?</span>
                <hr className='flex-1 border-[#D5D9D9]' />
            </div>

            <Link
                to='/register'
                className='block w-full max-w-[350px] text-center py-1.5 bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] rounded-xl text-[13px] text-[#111] cursor-pointer shadow-sm mb-8'
            >
                Create your Amazon account
            </Link>

            <hr className='border border-[#D5D9D9] w-full mb-4'/>

            <div className='p-2 flex flex-col items-center gap-2'>
                <div className='text-[#2162A1] text-[12px] flex gap-4'>
                    <a className='hover:text-[#093457] hover:underline' href="#">Conditions of Use</a>
                    <a className='hover:text-[#093457] hover:underline' href="#">Privacy Notice</a>
                    <a className='hover:text-[#093457] hover:underline' href="#">Help</a>
                </div>
                <p className='text-[12px] text-[#555]'> © 1996-2026, Amazon.com, Inc. or its affiliates </p>
            </div>
        </div>
    );
}

export default Login;