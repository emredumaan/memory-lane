import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useLocation } from 'react-router-dom'
import Axios from 'axios'
import { toast } from 'react-toastify'

interface UserType {
    id: number
    name: string
    email: string
}

interface AuthContextType {
    isAuthenticated: boolean
    user?: UserType
    login: (jwtToken: string, user: UserType) => void
    logout: () => void
    verifyToken: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [user, setUser] = useState<UserType>({ id: 0, name: '', email: '' })
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const { pathname } = useLocation()

    const login = (jwtToken: string, user: UserType) => {
        Cookies.set('jwtToken', jwtToken)
        setUser(user)
        setIsAuthenticated(true)
    }

    const logout = () => {
        Cookies.remove('jwtToken')
        setUser({ id: 0, name: '', email: '' })
        setIsAuthenticated(false)
    }

    const verifyToken = async () => {
        const token = Cookies.get('jwtToken')
        if (token) {
            try {
                const response = await Axios.get<{ isValid: boolean; user: UserType }>('/api/verify?token=' + token)
                if (response.data.isValid === true) login(token, response.data.user)
                setIsLoading(false)
            } catch (err) {
                toast.warn('Session expired, please sign in again.')
                logout()
                setIsLoading(false)
            }
        } else {
            logout()
            setIsLoading(false)
        }
    }

    useEffect(() => {
        verifyToken()
    }, [pathname])

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout, verifyToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}