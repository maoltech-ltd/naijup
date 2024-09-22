"use client";
import { useAppDispatch } from '@/src/redux/hooks/dispatch';
import { loginUser } from '@/src/redux/slice/userSlice';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineEye, AiOutlineEyeInvisible } from '@/src/components/icon';
import ErrorModal from '@/src/components/Modal/ErrorModal';
import SuccessModal from '@/src/components/Modal/SuccessModal';
import { yupResolver } from '@hookform/resolvers/yup';

const SignIn = () => {
  
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
   
    // form validation rules 
    const validationSchema = Yup.object().shape({
        // username: Yup.string().required('Username is required'),
        email: Yup.string().email().required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    async function onSubmit(data: any) {
        //data.preventDefault();
        dispatch(loginUser(data))
        .unwrap()
        .then((action) => {
            setSuccessMessage("Login successful!");
                setSuccessModalOpen(true);
                setTimeout(() => {
                    setSuccessModalOpen(false);
                    router.push("/");
                }, 2000);
        })
        .catch((error:any) => {
            setErrorMessage(error.message);
                setErrorModalOpen(true);
                setTimeout(() => {
                    setErrorModalOpen(false);
                }, 2000);
        });
        
    }

    // useEffect(() => {
        
    //     if (user.isLoggedIn == true) {
    //         console.log({user})
    //         router.push("/");
    //     }

    // }, [user.isLoggedIn, router]);


    return (
        <div>
            <div className="card flex flex-col justify-center">
                <div className="card-header flex flex-row items-center justify-content">
                    
                </div>
                <div className="card-body flex flex-col items-center justify-center">
                <h4 className="dark:text-white p-2">Login</h4>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-1/2 lg:w-1/3 border-2 border-solid border-black dark:border-white content-center flex flex-col items-center justify-center rounded-lg p-5'>
                        {/* <div className="form-group p-2 m-2">
                            <label className='dark:text-white'>Username</label>
                            <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div> */}
                        <div className="form-group p-2 m-2">
                            <label className='pr-8 dark:text-white'>Email</label>
                            <input type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group p-2 m-2">
                            <label className='dark:text-white'>Password</label>
                            <input type={showPassword ? "text" : "password"} {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="absolute translate-y-[-50%] text-[#899A9A] top-[55%] my-auto right-[3%]">
                                {showPassword ? (
                                    <AiOutlineEyeInvisible
                                    className="block cursor-pointer text-[1.2rem]"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    />
                                ) : (
                                    <AiOutlineEye
                                    className="block cursor-pointer text-[1.2rem]"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    />
                                )}
                                </div>
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div className="flex flex-row justify-content">
                            <button disabled={isSubmitting} className="btn btn-primary p-2 transition duration-300 ease-in-out transform dark:text-white hover:scale-110">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Login
                            </button>
                            <Link href="/signup" className="btn btn-link p-2 transition duration-300 ease-in-out transform hover:scale-110 dark:text-white">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
            <ErrorModal isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} message={errorMessage} />
            <SuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} message={successMessage} />
        </div>
    );
}

export default SignIn;