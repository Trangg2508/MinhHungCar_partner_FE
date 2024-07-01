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
        const token = response.data.data.access_token;

        await AsyncStorage.setItem('token', token);

        return { token };
    } catch (error) {
        if (error.response) {
            if (error.response.data.error_code === 10014) {
                Alert.alert('Sai mật khẩu hoặc số điện thoại', 'Vui lòng kiểm tra lại');
            } else if (error.response.data.error_code === 10001) {
                Alert.alert('Đăng nhập thất bại!', 'Tài khoản chưa được đăng kí');
            } else if (error.response.data.error_code === 10001) {
                Alert.alert('Không thể đăng nhập', 'Vui lòng thử lại sau');
            } else {
                Alert.alert('Đăng nhập thất bại!', 'Vui lòng thử lại sau');
            }
            console.log('Login Error:', error.response.data.message);
        } else {
            Alert.alert('Đăng nhập thất bại!', 'Vui lòng kiểm tra lại!');
            console.log('Login Error:', error.response.data.message);
        }
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
        return response.data.message;
    } catch (error) {
        if (error.response.data.error_code === 10062) {
            Alert.alert('Tài khoản đã được đăng kí', 'Vui lòng kiểm tra lại');
        } else if (error.response.data.error_code === 10010) {
            Alert.alert('Không thể xác thực OTP', 'Vui lòng thử lại sau')
        } else if (error.response.data.error_code === 10047) {
            Alert.alert('Không thể gửi OTP', 'Vui lòng thử lại sau')
        } else {
            Alert.alert('Đăng nhập thất bại!', 'Vui lòng kiểm tra lại!');
        }
    }
}

export async function verifyOtp(phone_number, otp) {
    try {
        const response = await axios.post(apiAccount.verifyOTP, {
            phone_number,
            otp,
        });
        return response.data.message;
    } catch (error) {
        if (error.response.data.error_code === 10012) {
            Alert.alert('OTP không hợp lệ', 'Vui lòng thử lại!');
        } else if (error.response.data.error_code === 10010) {
            Alert.alert('Không thể xác thực OTP', 'Vui lòng thử lại sau')
        } else if (error.response.data.error_code === 10047) {
            Alert.alert('Không thể gửi OTP', 'Vui lòng thử lại sau')
        }
    }
}