import axios from "axios";

export default axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" }
})

export const axiosAuth = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL

})
