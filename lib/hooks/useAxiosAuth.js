import { useContext, useEffect } from "react"
import { AuthConText } from "../../store/auth-context"
import { axiosAuth } from "../axios"

const useAxiosAuth = () => {
    const authCtx = useContext(AuthConText)
    useEffect(() => {
        const requestIntercept = axiosAuth.interceptors.request.use((config) => {
            if (!config.headers["Content-Type"]) {
                config.headers["Content-Type"] = 'application/json'
            }

            if (!config.headers["Authorization"]) {
                config.headers["Authorization"] = `Bearer ${authCtx.accessToken}`
            }
            return config
        })

        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept)
        }
    }, [authCtx])
    return axiosAuth
}

export default useAxiosAuth