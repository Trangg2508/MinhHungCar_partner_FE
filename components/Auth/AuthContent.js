import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AuthForm from './AuthForm';

export default function AuthContent({ isLogin, onAuthenticate }) {
    const navigation = useNavigation();
    const [credentialsInvalid, setCredentialsInvalid] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        last_name: false,
        first_name: false,
        phone_number: false,
    });

    const switchAuthModeHandler = () => {
        if (isLogin) {
            navigation.replace('Register');
        } else {
            navigation.replace('Login');
        }
    };

    const submitHandler = (credentials) => {
        let { email, password, confirmPassword, phone_number, first_name, last_name } = credentials;

        email = email.trim();
        password = password.trim();
        first_name = first_name.trim();
        last_name = last_name.trim();
        confirmPassword = confirmPassword.trim();
        phone_number = phone_number.trim();

        const emailIsValid = email.includes('@');
        const passwordIsValid = password.length > 4;
        const passwordsAreEqual = password === confirmPassword;
        const firstNameIsValid = first_name.length > 0;
        const lastNameIsValid = last_name.length > 0;
        const phoneNumIsValid = /^[0-9]{10,15}$/.test(phone_number);

        if (
            !phoneNumIsValid ||
            !passwordIsValid ||
            (!isLogin && (!passwordsAreEqual || !firstNameIsValid || !lastNameIsValid || !emailIsValid))
        ) {
            Alert.alert('Dữ liệu không hợp lệ', 'Vui lòng kiểm tra giá trị bạn đã nhập.');
            setCredentialsInvalid({
                email: !emailIsValid,
                password: !passwordIsValid,
                confirmPassword: !passwordIsValid || !passwordsAreEqual,
                first_name: !firstNameIsValid,
                last_name: !lastNameIsValid,
                phone_number: !phoneNumIsValid,
            });
            return;
        }
        if (isLogin) {
            onAuthenticate({ phone_number, password });
        } else {
            onAuthenticate({ email, password, last_name, first_name, phone_number });
        }
    };

    return (
        <View style={styles.authContent}>
            <AuthForm
                isLogin={isLogin}
                onSubmit={submitHandler}
                credentialsInvalid={credentialsInvalid}
            />
            <View style={styles.buttons}>
                <TouchableOpacity onPress={switchAuthModeHandler}>
                    {isLogin ? (
                        <Text style={styles.formFooter}>
                            Chưa có tài khoản? <Text style={{ color: '#5548E2' }}>Đăng kí</Text>
                        </Text>
                    ) : (
                        <Text style={styles.formFooter}>
                            Đã có tài khoản? <Text style={{ color: '#5548E2' }}>Đăng nhập</Text>
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    authContent: {
        marginHorizontal: 18,
        padding: 16,
        borderRadius: 8,
        flex: 1,
    },
    buttons: {
        marginTop: 20,
    },
    formFooter: {
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        textAlign: 'center',
        marginBottom: 10,
    },
});