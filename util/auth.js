import axios from 'axios';
import { apiAccount } from '../api/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export async function getUser(phone_number, password) {
    try {
        const response = await axios.post(apiAccount.login, {
            phone_number,
            password,
        });
        const token = response.data.access_token;

        await AsyncStorage.setItem('token', token);

        return { token };
    } catch (error) {
        Alert.alert('Đăng nhập thất bại!', 'Vui lòng kiểm tra lại!');
    }
}

export async function sendOtpToUser(email, password, first_name, last_name, phone_number) {
    try {
        const response = await axios.post(apiAccount.registerPartner, {
            first_name,
            last_name,
            phone_number,
            email,
            password,
        });
        return response.status;
    } catch (error) {
        const errorMessage = error.response?.data || 'Đã xảy ra lỗi, vui lòng thử lại sau.';
        const status = error.response?.status;

        if (status === 400) {
            Alert.alert('Đăng kí thất bại', 'Số điện thoại này đã được đăng ký bởi người khác.');
        } else {
            Alert.alert('Lỗi đăng kí', errorMessage);
        }
        throw error;
    }
}

export async function verifyOtp(phone_number, otp) {
    try {
        const response = await axios.post(apiAccount.verifyOTP, {
            phone_number,
            otp,
        });
        return response.status;
    } catch (error) {
        Alert.alert('OTP không hợp lệ', 'Vui lòng thử lại!');
    }
}