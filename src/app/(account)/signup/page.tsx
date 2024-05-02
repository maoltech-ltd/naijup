"use client";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const SignUp = () => {
  
    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email().required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const { register, handleSubmit, formState } = useForm();
    const { errors}: any = formState;

    async function onSubmit(data: any) {
        const {error}: any = await validationSchema.validate(data)
        if(error){
            console.log(error)
        }
        
        console.log(data);
    }

    return (
        <div>
            <div className="card flex flex-col justify-center">
                <div className="card-header flex flex-row items-center justify-content">
                    
                </div>
                <div className="card-body flex flex-col items-center justify-center">
                <h4 className="dark:text-white p-2">Register</h4>
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-1/2 lg:w-1/3 border-2 border-solid border-black dark:border-white content-center flex flex-col items-center justify-center rounded-lg p-5'>
                        <div className="form-group p-2 m-2">
                            <label className='dark:text-white'>Username</label>
                            <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group p-2 m-2">
                            <label className='pr-8 dark:text-white'>Email</label>
                            <input type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group p-2 m-2">
                            <label className='dark:text-white'>Password</label>
                            <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div className="flex flex-row justify-content">
                            <button disabled={formState.isSubmitting} className="btn btn-primary p-2 transition duration-300 ease-in-out transform dark:text-white hover:scale-110">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Register
                            </button>
                            <Link href="/signin" className="btn btn-link p-2 transition duration-300 ease-in-out transform hover:scale-110 dark:text-white">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;