import React, { useContext } from 'react'
import { authContext } from '../../context/AuthContext'
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import stlye from "./VerifyCode.module.css"

const VerifyCode = () => {
    const { email } = useContext(authContext)
    const user = {
        email: email,
        resetCode: '',
    };
    const navigate = useNavigate()
    async function codeUser(values) {
        console.log(values);
        try {

            const { data } = await axios.post('http://localhost:4000/verify', values);
            console.log(data)
            navigate('/newpassword')
        } catch (error) {
            console.log(error);
        }
    }
    const formik = useFormik({
        initialValues: user,
        onSubmit: codeUser,
    });

    return (
        <section className={`${stlye.bgimg} h-[100vh] bg-[#fff]`}>
            <div className="container mx-auto h-full">
                <div className="w-full lg:w-[50%] flex items-center !justify-center  lg:justify-start   h-full">
                    <form onSubmit={formik.handleSubmit} className="w-[90%] flex flex-col justify-center items-center bg-[#ffffff] shadow-2xl  drop-shadow-xl p-5 rounded-lg">
                        <h1 className=" text-center mx-auto text-3xl text-blue-800">
                            <span className='inline-block' >
                                <span className={`${stlye.logo} h-[10vh] inline-block align-middle max-[400px]: `}></span>onnectify
                            </span>
                        </h1>
                        {/* <!-- Email --> */}
                        <div className="mb-5 w-full">
                            <label className="block mb-5 text-3xl font-medium text-blue-800">
                                Enter the code
                            </label>
                            <p className="block text-sm font-medium text-blue-900">We have sent a verification code to the email address you provided {formik.values.email} </p>
                            <p className="block text-sm font-medium text-blue-900"> Please enter the code below to verify your email and proceed with resetting your password.</p>
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

                        {/* <!-- Reset Code --> */}
                        <div className="mb-5 w-full">
                            <input
                                type="text"
                                id="resetCode"
                                name="resetCode"
                                value={formik.values.resetCode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="shadow-sm bg-[#e2eefc] border border-[#16d6ff] text-blue-900 text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                                placeholder="Your code"
                            />
                            {formik.touched.resetCode && formik.errors.resetCode ? (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.resetCode}</div>
                            ) : null}
                        </div>
                        <div className="block mb-5 text-sm font-medium text-blue-900">
                            Note: The verification code is time-sensitive and expires in 10 mins.
                        </div>
                        {/* <!-- Submit Button --> */}
                        <button
                            type="submit"
                            className="w-full mb-5 bg-[#4778ff] text-white hover:bg-[#16d6ff] focus:ring-4 focus:outline-none focus:ring-[#ba87fe] font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-auto"
                        >
                            Submit
                        </button>
                    </form>
                </div>
                </div>
        </section>

    )
}

export default VerifyCode
