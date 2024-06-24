
import axios from 'axios';
import { apiAccount } from '../api/apiConfig';
// import axios from '../lib/axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUser(email, password) {
    try {
        const response = await axios.post(apiAccount.login, {
            email: email,
            password: password
        });
        const token = response.data.access_token;

        await AsyncStorage.setItem('token', token);

        return { token };
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

export async function sendOtpToUser(email, password, first_name, last_name, phone_number) {
    try {
        const response = await axios.post(apiAccount.registerPartner, {
            first_name,
            last_name,
            phone_number,
            email,
            password
        });
        return response.status;
    } catch (error) {
        console.error('Error sending OTP to user:', error);
        throw error;
    }
}

export async function verifyOtp(email, otp) {
    try {
        const response = await axios.post(apiAccount.verifyOTP, {
            email,
            otp
        });
        return response.status;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
}