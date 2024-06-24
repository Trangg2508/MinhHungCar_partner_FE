import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import AuthContent from '../components/Auth/AuthContent';
import { sendOtpToUser } from '../util/auth';

export default function SignUpScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const signUpHandler = async ({ email, password, last_name, first_name, phone_number }) => {
    setIsLoading(true);

    try {
      await sendOtpToUser(email, password, last_name, first_name, phone_number);
      navigation.navigate('OTP', {
        email,
        password,
        last_name,
        first_name,
        phone_number
      });
    } catch (error) {
      if (error.response?.status === 400) {
        Alert.alert('Đăng kí thất bại', 'Tài khoản này đã có người đăng kí');
      } else {
        Alert.alert('Lỗi đăng kí', error.response?.data || 'Vui lòng thử lại');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading && <LoadingOverlay />}
      <ScrollView>
        {isAuthenticating && <LoadingOverlay message='' />}
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <View style={styles.header}>
              <Text style={styles.title}>Bắt đầu nào!</Text>
              <Text style={styles.subtitle}>
                Điền đầy đủ thông tin để tạo mới một tài khoản
              </Text>
            </View>
            <AuthContent onAuthenticate={signUpHandler} />
          </KeyboardAwareScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1d',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
    textAlign: 'center'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 18,
    marginBottom: 36
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
    marginBottom: 70,
  },
});
