
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
const Signin = () => {
    const user = {
        email: '',
        password: '',
    };

    async function loginUser(values) {
        console.log(values);
        try {
            const { data } = await axios.post('http://localhost:4000/login', values);
            
        } catch (error) {
            console.log(error);
        }
    }

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .min(7, 'Password must be at least 7 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: user,
        validationSchema: validationSchema,
        onSubmit: loginUser,
    });

    return (
        <section className='w-[40%] mx-auto'>
            <form onSubmit={formik.handleSubmit} className="w-full flex flex-col">
                {/* Email */}
                <div className="mb-5 w-full">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Email"
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-600">{formik.errors.email}</div>
                    ) : null}
                </div>

                {/* Password */}
                <div className="mb-5 w-full">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Your password"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-600">{formik.errors.password}</div>
                    ) : null}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Login
                </button>
            </form>
        </section>
    );

}

export default Signin
