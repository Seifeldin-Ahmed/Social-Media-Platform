import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Components/Home/Home'
import Layout from './Components/Layout/Layout'
import Signup from './Components/Signup/Signup'
import Signin from './Components/Signin/Signin'
import AuthContextProvider from './context/AuthContext'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import ForgetPassword from './Components/ForgetPassword/ForgetPassword'
import VerifyCode from './Components/VerifyCode/VerifyCode'
import NewPassword from './Components/NewPassword/NewPassword'

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        {
          index: true, element: <ProtectedRoute> <Home /></ProtectedRoute>
        },
        {
          path: '/signup'
          , element: <Signup />
        },
        {
          path: '/signin'
          , element: <Signin />
        },
        {
          path: '/forgetpassword'
          , element: <ForgetPassword />

        }, {
          path: '/verifycode'
          , element: <VerifyCode />

        }, {
          path: '/newpassword'
          , element: <NewPassword />

        }
      ]
    }
  ])
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}

export default App
