"use client";
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const SignIn = () => {
  
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
            <div className="card flex flex-col items-cente justify-center">
                <h4 className="card-header">Login</h4>
                <div className="card-body flex items-center justify-center">
                    <form onSubmit={handleSubmit(onSubmit)} className='w-full md:w-1/2 lg:w-1/3 border-2 border-solid border-black content-center flex flex-col items-center justify-center rounded-lg'>
                        <div className="form-group p-2 m-2">
                            <label className='black dark:white'>Username</label>
                            <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group p-2 m-2">
                            <label>Email</label>
                            <input type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group p-2 m-2">
                            <label>Password</label>
                            <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''} rounded-lg m-2`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <div className="flex flex-row justify-content">
                            <button disabled={formState.isSubmitting} className="btn btn-primary p-2 transition duration-300 ease-in-out transform hover:scale-110">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Login
                            </button>
                            <Link href="/signup" className="btn btn-link p-2 transition duration-300 ease-in-out transform hover:scale-110">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;