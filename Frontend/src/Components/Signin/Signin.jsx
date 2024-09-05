
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useContext } from 'react';
import { authContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from "../../../public/images/bg_img.jpg"
import stlye from "./Signin.module.css"

const Signin = () => {
    const user = {
        email: '',
        password: '',
    };
    const navigate = useNavigate()
    const { token, setToken } = useContext(authContext)
    async function loginUser(values) {
        console.log(values);
        try {
            const { data } = await axios.post('http://localhost:4000/login', values);
            console.log(data)
            setToken(data.token)
            localStorage.setItem("token", data.token)
            navigate('/')
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
        <section className={`${stlye.bgimg} h-[100vh] bg-[#fff]`}>
            <div className="container mx-auto h-full">
                <div className="flex flex-col lg:flex-row justify-between h-full">
                    {/* <!-- Left Side: Form --> */}
                    <div className="w-full lg:w-[50%] flex items-center justify-start h-full">
                        <form onSubmit={formik.handleSubmit} className="w-[70%] flex flex-col bg-[#ffffff] shadow-2xl  drop-shadow-xl p-5 rounded-lg">
                            <h1 className=" text-center py-5 mx-auto text-3xl text-blue-800">
                                Welcome to
                                <span className={`${stlye.logo} h-[10vh] inline-block align-middle`}></span>onnectify
                            </h1>

                            {/* <!-- Email --> */}
                            <div className="mb-5 w-full">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-blue-800">
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                    placeholder="Email"
                                    aria-label="Email"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                ) : null}
                            </div>

                            {/* <!-- Password --> */}
                            <div className="mb-5 w-full">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-blue-800">
                                    Your password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                    placeholder="Your password"
                                    aria-label="Password"
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                ) : null}
                            </div>

                            {/* <!-- Submit Button --> */}
                            <button
                                type="submit"
                                className="w-full mb-5 bg-[#4778ff] text-white hover:bg-[#16d6ff] focus:ring-4 focus:outline-none focus:ring-[#4778ff] font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto"
                                disabled={formik.isSubmitting || !formik.isValid}
                            >
                                Login
                            </button>

                            <Link className="text-blue-900 text-center pb-10" to="/forgetpassword">
                                Forget Password?
                            </Link>

                            <Link
                                className="text-white w-full mb-5 bg-blue-800 hover:bg-[#16d6ff] focus:ring-4 focus:outline-none focus:ring-[#4778ff] font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto"
                                to="/signup"
                            >
                                Create New Account
                            </Link>
                        </form>
                    </div>

             
                </div>
            </div>
        </section>

    );

}

export default Signin
