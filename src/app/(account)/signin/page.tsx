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
            <div className="card">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)} className='border border-solid border-black border-2 content-center justify-center'>
                        <div className="form-group p-2 m-2">
                            <label>Username</label>
                            <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''} rounded-lg`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group p-2 m-2">
                            <label>Email</label>
                            <input type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''} rounded-lg`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group p-2 m-2">
                            <label>Password</label>
                            <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''} rounded-lg`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                        <Link href="/signup" className="btn btn-link">Register</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignIn;