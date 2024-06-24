import { createContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
export const AuthConText = createContext({
    access_token: '',
    id: '',
    refresh_token: '',
    isAuthenticated: false,
    authenticate: (token) => { },
    logout: () => { }
})

export default function AuthConTextProvider({ children }) {
    const [authToken, setAuthToken] = useState()
    const [id, setId] = useState()


    const authenticate = async (token) => {
        setAuthToken(token)
        setId(id)
        await AsyncStorage.setItem('token', token)
        // await AsyncStorage.setItem('id', id)
    }

    const logout = () => {
        AsyncStorage.removeItem('token')
        // AsyncStorage.removeItem("id")
        setAuthToken(null)
        setId(null)
    }
    const value = {
        access_token: authToken,
        authenticate,
        logout,
        id: id,
        isAuthenticated: !!authToken || !!id
    }
    return <AuthConText.Provider value={value}>{children}</AuthConText.Provider>
}