import { createContext, useState } from 'react'
export const authContext = createContext();
const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(null)
    const [email, setEmail] = useState(null)
    return (
        <authContext.Provider value={{ token, setToken, email, setEmail }} >
            {children}
        </authContext.Provider>
    )
}

export default AuthContextProvider
