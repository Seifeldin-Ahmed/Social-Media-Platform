import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import img from "../../../public/images//bg_img.jpg"
import stlye from "./Signup.module.css"
const Signup = () => {
    const naviagte = useNavigate()
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
            console.log(data)
            naviagte('/login')
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
        image: Yup.mixed()
            .notRequired() // Makes the image field optional
            .test('fileType', 'Unsupported file format', (value) => {
                return !value || (value && ['image/jpeg', 'image/png', 'image/gif'].includes(value.type));
            })
    });

    const formik = useFormik({
        initialValues: user,
        validationSchema: validationSchema,
        onSubmit: registerUser,
    });

    return (
        <section className={`${stlye.bgimg} h-[100vh] bg-[#fff]` }>
        <div className="container mx-auto sm:h-full">
            <div className="flex justify-between h-full">
                <div className="sm:w-full md:w-full lg:w-[50%] h-full sm:flex sm:items-center">
                    <form onSubmit={formik.handleSubmit} className="w-[70%] flex flex-wrap justify-between bg-[#ffffff] shadow-2xl drop-shadow-xl p-5 rounded-lg">
                        <h1 className=" text-center py-5 mx-auto text-3xl text-blue-800">
                            Welcome to
                            <span className={`${stlye.logo} h-[10vh] inline-block align-middle`}></span>onnectify
                        </h1>
                        {/* First Name */}
                        <div className="mb-5 w-[45%]">
                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-blue-800">
                                First Name
                            </label>
                            <input type="text" id="firstName" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="First Name"
                            />
                            {formik.touched.firstName && formik.errors.firstName ? <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div> : null}
                        </div>

                        {/* Last Name */}
                        <div className="mb-5 w-[45%]">
                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-blue-800">
                                Last Name
                            </label>
                            <input type="text" id="lastName" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="Last Name"
                            />
                            {formik.touched.lastName && formik.errors.lastName ? <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div> : null}
                        </div>

                        {/* Email */}
                        <div className="mb-5 w-full">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-blue-800">
                                Your email
                            </label>
                            <input type="email" id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="Email"
                            />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div> : null}
                        </div>

                        {/* Password */}
                        <div className="mb-5 w-full">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-blue-800">
                                Your password
                            </label>
                            <input type="password" id="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="Your password"
                            />
                            {formik.touched.password && formik.errors.password ? <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div> : null}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-5 w-full">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-blue-800">
                                Confirm Password
                            </label>
                            <input type="password" id="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="Confirm Password"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div> : null}
                        </div>

                        {/* Gender */}
                        <div className="mb-5 flex flex-wrap justify-center w-[45%]">
                            <label className="w-full block mb-2 text-sm font-medium text-blue-800">Gender</label>
                            <div className="flex w-full justify-evenly">
                                <div className="flex items-center mb-2">
                                    <input type="radio" id="male" name="gender" value="male" onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        checked={formik.values.gender === 'male'}
                                        className="w-4 h-4 text-blue-900 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="male" className="ml-2 text-sm font-medium text-blue-800">Male</label>
                                </div>
                                <div className="flex items-center mb-2">
                                    <input type="radio" id="female" name="gender" value="female" onChange={formik.handleChange} onBlur={formik.handleBlur}
                                        checked={formik.values.gender === 'female'}
                                        className="w-4 h-4 text-blue-900 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="female" className="ml-2 text-sm font-medium text-blue-800">Female</label>
                                </div>
                            </div>
                            {formik.touched.gender && formik.errors.gender ? <div className="text-red-500 text-sm mt-1">{formik.errors.gender}</div> : null}
                        </div>

                        {/* Date of Birth */}
                        <div className="mb-5 w-[45%]">
                            <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-blue-800">
                                Date of Birth
                            </label>
                            <input type="date" id="dateOfBirth" value={formik.values.dateOfBirth} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                            />
                            {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? <div className="text-red-500 text-sm mt-1">{formik.errors.dateOfBirth}</div> : null}
                        </div>

                        {/* Image Upload */}
                        <div className="mb-5 w-full">
                            <label htmlFor="image-upload" className="block mb-2 text-sm font-medium text-blue-800">
                                Upload Image
                            </label>
                            <input type="file" id="image-upload" name="image" accept="image/*"
                                onChange={(event) => { formik.setFieldValue("image", event.currentTarget.files[0]); }}
                                className="block w-full text-sm text-blue-900 border border-[#16d6ff] rounded-lg cursor-pointer bg-[#e2eefc] focus:outline-none"
                            />
                            <p className="mt-1 text-sm text-blue-800">Choose a profile picture (JPEG, PNG, etc.)</p>
                            {formik.errors.image && <div className="text-red-500 text-sm mt-1">{formik.errors.image}</div>}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full mb-5 bg-[#4778ff] text-white hover:bg-[#16d6ff] focus:ring-4 focus:outline-none focus:ring-[#ba87fe] font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto">
                            Register new account
                        </button>
                        <Link to="/signin" className='text-blue-900 w-full text-center p-5'>You Already Have Account ?</Link>
                    </form>
                </div>
                {/* <div className="sm:hidden md:hidden lg:block w-[50%] h-full">
                        <img src={img} className='w-full h-full ' alt="login" />
                    </div> */}
            </div>
        </div>
        </section >

    );
}

export default Signup;
