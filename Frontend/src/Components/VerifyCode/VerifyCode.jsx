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
            <div className="container mx-auto h-full flex justify-center items-center">
                <form onSubmit={formik.handleSubmit} className="w-[40%] flex flex-col bg-[#481a5b] shadow-lg p-5 rounded-lg">
                    {/* <!-- Email --> */}
                    <div className="mb-5 w-full">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
                            Your email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="shadow-sm bg-[#481a5b] border border-[#16d6ff] text-white text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                            placeholder="Email"
                            disabled

                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                        ) : null}
                    </div>

                    {/* <!-- Reset Code --> */}
                    <div className="mb-5 w-full">
                        <label htmlFor="resetCode" className="block mb-2 text-sm font-medium text-white">
                            Your Code
                        </label>
                        <input
                            type="text"
                            id="resetCode"
                            name="resetCode"
                            value={formik.values.resetCode}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="shadow-sm bg-[#481a5b] border border-[#16d6ff] text-white text-sm rounded-lg focus:ring-[#4778ff] focus:border-[#4778ff] block w-full p-2.5"
                            placeholder="Your code"
                        />
                        {formik.touched.resetCode && formik.errors.resetCode ? (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.resetCode}</div>
                        ) : null}
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
        </section>

    )
}

export default VerifyCode
