import axios from 'axios';
import React, { useContext } from 'react'
import { authContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import stlye from "./ForgetPassword.module.css"

const ForgetPassword = () => {
    const user = {
        email: '',
    };
    const { setEmail } = useContext(authContext)
    const navigate = useNavigate()
    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
    });
    async function emailUser(values) {
        console.log(values);
        try {

            const { data } = await axios.patch('http://localhost:4000/reset', values);
            console.log(data)
            setEmail(values.email)
            navigate('/verifycode')
        } catch (error) {
            console.log(error);
        }
    }
    const formik = useFormik({
        initialValues: user,
        validationSchema: validationSchema,
        onSubmit: emailUser,
    });

    return (
        <section className={`${stlye.bgimg} h-[100vh] bg-[#fff]`}>
            <div className="container mx-auto flex justify-center items-center h-full">
                <form onSubmit={formik.handleSubmit} className="w-[40%] flex flex-col justify-center items-center bg-[#ffffff] shadow-2xl  drop-shadow-xl p-5 rounded-lg">
                    {/* <!-- Email --> */}
                    <div className="mb-5 w-full ">
                        <label className="block text-2xl font-medium text-blue-800">
                            Forgot Your Password?
                            <span className={`${stlye.logo} h-[10vh] inline-block align-middle`}></span><span className='text-3xl font-medium text-blue-800'>onnectify</span>
                        </label>
                        <div className="block mb-2 text-sm font-medium text-blue-900">If you've forgotten your password, no worries! Just enter your email address below, and we’ll send you a verification code to help you reset it.</div>
                        <input
                            type="email"
                            id="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full"
                            placeholder="Email"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    {/* <!-- Submit Button --> */}
                    <button
                        type="submit"
                        className="w-full mb-5 bg-[#4778ff] text-white hover:bg-[#16d6ff] focus:ring-4 focus:outline-none focus:ring-[#ba87fe] font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto"
                    >
                        Submit
                    </button>
                    <Link
                        className="w-full mb-5 bg-blue-800 text-white hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-[#ba87fe] font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto"
                        to="/signin"
                    >
                        Back
                    </Link>
                </form>
            </div>
        </section>

    )
}

export default ForgetPassword
