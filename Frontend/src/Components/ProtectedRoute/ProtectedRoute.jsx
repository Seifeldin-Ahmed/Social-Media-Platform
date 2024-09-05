import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    if (localStorage.getItem('token') == null) {
        return <Navigate to={'/signin'} />
    }

    return (<>{children}</>)
}

export default ProtectedRoute
