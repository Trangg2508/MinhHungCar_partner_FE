import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import AuthContent from '../components/Auth/AuthContent';
import { sendOtpToUser } from '../util/auth';

export default function SignUpScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const signUpHandler = async ({ email, password, last_name, first_name, phone_number }) => {
    setIsLoading(true);

    try {
      const status = await sendOtpToUser(email, password, last_name, first_name, phone_number);

      if (status === 200) {
        navigation.navigate('OTP', {
          email,
          password,
          last_name,
          first_name,
          phone_number
        });
      }
    } catch (error) {
      console.error('Sign Up Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading && <LoadingOverlay />}
      <ScrollView>
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
});
