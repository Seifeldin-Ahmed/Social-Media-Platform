import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Components/Home/Home'
import Layout from './Components/Layout/Layout'
import Signup from './Components/Signup/Signup'
import Signin from './Components/Signin/Signin'

function App() {
  const router = createBrowserRouter([
    {
      path: '',
      element: <Layout />,
      children: [
        {
          index: true, element: <Home />
        },
        {
          path: '/signup'
          , element: <Signup />
        },
        {
          path: '/signin'
          , element: <Signin />
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
