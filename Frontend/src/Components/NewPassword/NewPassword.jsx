import React, { useContext } from 'react'
import { authContext } from '../../context/AuthContext';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import stlye from "./NewPassword.module.css"

const NewPassword = () => {
    const { email } = useContext(authContext)
    const user = {
        email: email,
        password: '',
        confirmPassword: '',
    };
    const navigate = useNavigate()
    const validationSchema = Yup.object({
        password: Yup.string()
            .min(7, 'Password must be at least 7 characters')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),

    })

    async function setNewPassword(values) {
        console.log(values);
        try {

            const { data } = await axios.post('http://localhost:4000/set-new-password', values);
            console.log(data)
            navigate('/signin')
        } catch (error) {
            console.log(error);
        }
    }
    const formik = useFormik({
        initialValues: user,
        validationSchema: validationSchema,
        onSubmit: setNewPassword,
    });

    return (
        <section className={`${stlye.bgimg} h-[100vh] bg-[#fff]`}>
            <div className="container mx-auto h-full">
                <div className="w-full lg:w-[50%] flex items-center !justify-center  lg:justify-start   h-full">
                    <form onSubmit={formik.handleSubmit} className="w-[90%] flex flex-col justify-center items-center bg-[#ffffff] shadow-2xl  drop-shadow-xl p-5 rounded-lg">
                        <h1 className=" text-center py-5 mx-auto text-3xl text-blue-800">
                            Welcome to
                            <span className='inline-block' >
                                <span className={`${stlye.logo} h-[10vh] inline-block align-middle max-[400px]: `}></span>onnectify
                            </span>
                        </h1>
                        {/* Email */}
                        <div className="mb-5 w-full">
                            <label className="block text-2xl font-medium text-blue-800">
                                Set a New Password
                            </label>
                            <div className="block mb-2 text-sm font-medium text-blue-900">
                                You’re almost done! Please enter and confirm your new password below. Once you’ve updated your password, you’ll be able to log in with your new credentials.
                            </div>
                            <input
                                type="hidden"
                                id="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="Email"
                                disabled
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        {/* Password */}
                        <div className="mb-5 w-full">
                            <input
                                type="password"
                                id="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="Your password"
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-5 w-full">
                            <input
                                type="password"
                                id="confirmPassword"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="Confirm Password"
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>

                        <button
                            type="submit"
                            className="w-full mb-5 bg-[#4778ff] text-white hover:bg-[#16d6ff] focus:ring-4 focus:outline-none focus:ring-[#ba87fe] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Submit
                        </button>
                    </form>
                </div>
                </div>
        </section>
    )
}

export default NewPassword
