import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';

const Signup = () => {
    const formData = new FormData()
    const user = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dateOfBirth: '',
        image: null, // Optional field
    };

    async function registerUser(values) {
        formData.append('firstName', values.firstName)
        formData.append('lastName', values.lastName)
        formData.append('email', values.email)
        formData.append('password', values.password)
        formData.append('confirmPassword', values.confirmPassword)
        formData.append('gender', values.gender)
        formData.append('dateOfBirth', values.dateOfBirth)
        formData.append('image', values.image)

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }


        try {
            const { data } = await axios.put('http://localhost:4000/signup', formData);
        } catch (error) {
            console.log(error);
        }
    }
    const validationSchema = Yup.object({
        firstName: Yup.string()
            .min(3, 'First name must be at least 3 characters')
            .required('First name is required'),
        lastName: Yup.string()
            .min(3, 'Last name must be at least 3 characters')
            .required('Last name is required'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .min(7, 'Password must be at least 7 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),
        gender: Yup.string().required('Gender is required'),
        dateOfBirth: Yup.date().required('Date of Birth is required'),
        image: Yup.mixed() // Optional field
    })
    const formik = useFormik({
        initialValues: user,
        validationSchema: validationSchema,
        onSubmit: registerUser,
    });

    return (
        <section className='w-[40%] mx-auto'>
            <form onSubmit={formik.handleSubmit} className="w-full flex flex-row justify-between flex-wrap">
                {/* First Name */}
                <div className="mb-5 w-[45%]">
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        First Name
                    </label>
                    <input type="text" id="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="First Name"
                    />
                    {formik.touched.firstName && formik.errors.firstName ? <div className="text-red-600">{formik.errors.firstName}</div> : null}
                </div>
                {/* Last Name */}
                <div className="mb-5 w-[45%]">
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Last Name
                    </label>
                    <input type="text" id="lastName" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Last Name"
                    />
                    {formik.touched.lastName && formik.errors.lastName ? <div className="text-red-600">{formik.errors.lastName}</div> : null}
                </div>
                {/* Email */}
                <div className="mb-5 w-full">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your email
                    </label>
                    <input type="email" id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Email"
                    />
                    {formik.touched.email && formik.errors.email ? <div className="text-red-600">{formik.errors.email}</div> : null}
                </div>
                {/* Password */}
                <div className="mb-5 w-full">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Your password
                    </label>
                    <input type="password" id="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Your password"
                    />
                    {formik.touched.password && formik.errors.password ? <div className="text-red-600">{formik.errors.password}</div> : null}
                </div>
                {/* Repeat Password */}
                <div className="mb-5 w-full">
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Confirm Password
                    </label>
                    <input type="password" id="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Confirm Password"
                    />
                    {formik.touched.repeatPassword && formik.errors.confirmPassword ? <div className="text-red-600">{formik.errors.confirmPassword}</div> : null}
                </div>
                {/* Gender */}
                <div className="mb-5 flex flex-wrap justify-center w-[45%]">
                    <label className="w-full block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Gender
                    </label>
                    <div className="flex w-full justify-evenly">
                        <div className="flex items-center mb-2">
                            <input type="radio" id="male" name="gender" value="male" onChange={formik.handleChange} onBlur={formik.handleBlur}
                                checked={formik.values.gender === 'male'}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="male" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
                        </div>

                        <div className="flex items-center mb-2">
                            <input type="radio" id="female" name="gender" value="female" onChange={formik.handleChange} onBlur={formik.handleBlur}
                                checked={formik.values.gender === 'female'}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor="female" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Female</label>
                        </div>
                    </div>
                    {formik.touched.gender && formik.errors.gender ? <div className="text-red-600">{formik.errors.gender}</div> : null}
                </div>
                {/* Date of Birth */}
                <div className="mb-5 w-[45%]">
                    <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Date of Birth
                    </label>
                    <input type="date" id="dateOfBirth" value={formik.values.dateOfBirth} onChange={formik.handleChange} onBlur={formik.handleBlur}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    />
                    {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? <div className="text-red-600">{formik.errors.dateOfBirth}</div> : null}
                </div>
                {/* Image Upload */}
                <div className="mb-5 w-full">
                    <label htmlFor="image-upload" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Upload Image
                    </label>
                    <input type="file" id="image-upload" name="image" accept="image/*"
                        onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">Choose a profile picture (JPEG, PNG, etc.)</p>
                </div>
                {/* Submit Button */}
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Register new account
                </button>
            </form>
        </section>
    );
}

export default Signup;
