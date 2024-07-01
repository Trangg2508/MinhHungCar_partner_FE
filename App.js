import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Button, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import { Image } from 'react-native';
import HistoryScreen from './screens/HistoryScreen';
import SettingScreen from './screens/SettingScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyCar from './screens/MyCar';
import ActivityScreen from './screens/ActivityScreen';
import ActivityDetailScreen from './screens/ActivityDetailScreen';
import AddCarInformationScreen from './screens/AddCarInformationScreen';
import AddCarPhotoScreen from './screens/AddCarPhotoScreen';
import AddCarRegistrationScreen from './screens/AddCarRegistrationScreen';
import RentingFeeScreen from './screens/RentingFeeScreen';
import OTPScreen from './screens/OTPScreen'
import AuthConTextProvider, { AuthConText } from './store/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessScreen from './screens/SuccessScreen';
import ContractScreen from './screens/ContractScreen';
import PaymentInformationScreen from './screens/PaymentInformationScreen';
import BackButton from './components/UI/BackButton';
import UploadQR from './screens/UploadQR';

const Stack = createNativeStackNavigator();
const Bottoms = createBottomTabNavigator();

const GlobalStyles = {
  colors: {
    backgroundColorActive: '#773BFF',
    backgroundColorInactive: '#6C6C6C',
  },
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login" component={SignInScreen} />
      <Stack.Screen
        options={{
          headerShown: false
        }}
        name="Register"
        component={SignUpScreen}
      />
      <Stack.Screen
        name='OTP'
        options={{
          headerShown: false
        }}
        component={OTPScreen}
      />
    </Stack.Navigator>
  );
}


const BottomTabs = () => {
  return (
    <Bottoms.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: GlobalStyles.colors.backgroundColorActive,
        tabBarInactiveTintColor: GlobalStyles.colors.backgroundColorInactive,
        tabBarLabelStyle: {
          fontSize: 13,
        },
        tabBarIcon: ({ focused }) => {
          let iconActive;
          let iconInactive;

          if (route.name === 'Home') {
            iconActive = require('./assets/home_active.png');
            iconInactive = require('./assets/home.png');
          } else if (route.name === 'Chat') {
            iconActive = require('./assets/bubble-chat_active.png');
            iconInactive = require('./assets/bubble-chat.png');
          } else if (route.name === 'Activity') {
            iconActive = require('./assets/google-docs_active.png');
            iconInactive = require('./assets/google-docs.png');
          } else if (route.name === 'Car') {
            iconActive = require('./assets/car_active.png');
            iconInactive = require('./assets/car.png');
          } else if (route.name === 'Setting') {
            iconActive = require('./assets/setting_active.png');
            iconInactive = require('./assets/setting.png');
          }
          return (
            <Image
              source={focused ? iconActive : iconInactive}
              style={{ width: 20, height: 20 }}
            />
          );
        },
      })}
    >
      <Bottoms.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          headerShown: false,
        }}
      />
      <Bottoms.Screen
        name='Activity'
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Hoạt động',
          title: 'Hoạt động mới nhất'
        }}
      />
      <Bottoms.Screen
        name='Car'
        component={MyCar}
        options={{
          tabBarLabel: 'Xe',
          title: 'Xe của tôi'
          // headerShown: false,
        }}
      />
      <Bottoms.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          tabBarLabel: 'Chat',
        }}
      />
      <Bottoms.Screen
        name='Setting'
        component={SettingScreen}
        options={{
          tabBarLabel: 'Tôi',
          title: 'Tài khoản của tôi'
        }}
      />
    </Bottoms.Navigator>
  );
};

const AuthenticatedStack = () => {
  const navigate = useNavigation()
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='BottomTabs'
        component={BottomTabs}
        options={{
          headerShown: false,
          title: ''
        }}
      />
      <Stack.Screen
        name='Detail'
        component={DetailScreen}
        options={{
          title: 'Chi tiết xe',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Tài khoản của tôi',
        }}
      />
      <Stack.Screen
        name='History'
        component={HistoryScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Lịch sử hoạt động',
        }}
      />
      <Stack.Screen
        name='ActivityDetail'
        component={ActivityDetailScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Chi tiết hoạt động',
        }}
      />
      <Stack.Screen
        name='AddCarInfor'
        component={AddCarInformationScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Đăng kí xe',
          gestureEnabled: false,
          headerLeft: (props) => <BackButton title="Bạn có muốn trở về?"
            subTitle="Bạn đang ở màn hình thêm ảnh cho xe. Bạn có muốn hủy và trở về?"
            callBack={() => navigate.goBack()}
          />
        }}
      />
      <Stack.Screen
        name='AddCarPhoto'
        component={AddCarPhotoScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Đăng kí xe',
          gestureEnabled: false,
          headerLeft: (props) => <BackButton title="Bạn có muốn trở về?"
            subTitle="Bạn đang ở màn hình nhập thông xin xe. Bạn có muốn hủy và trở về?"
            callBack={() => navigate.navigate("Car")}
          />
        }}
      />
      <Stack.Screen
        name='AddRegist'
        component={AddCarRegistrationScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Đăng kí xe',
          gestureEnabled: false,
          headerLeft: (props) => <BackButton title="Bạn có muốn trở về?"
            subTitle="Bạn đang ở màn hình thêm giấy tờ xe. Bạn có muốn hủy và trở về?"
            callBack={() => navigate.navigate("Car")}
          />
        }}
      />
      <Stack.Screen
        name='RentingFee'
        component={RentingFeeScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Đăng kí xe',
          gestureEnabled: false,
          headerLeft: (props) => <BackButton title="Bạn có muốn trở về?"
            subTitle="Bạn đang ở màn hình thêm phí thuê xe. Bạn có muốn hủy và trở về?"
            callBack={() => navigate.navigate("Car")}
          />
        }}
      />
      <Stack.Screen
        name='Success'
        component={SuccessScreen}
        options={{
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Contract'
        component={ContractScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Hợp đồng',
        }}
      />
      <Stack.Screen
        name='PayInfo'
        component={PaymentInformationScreen}
        options={{
          headerBackTitleVisible: false,
          title: 'Thông tin thanh toán',
        }}
      />
      <Stack.Screen
        name='UpQR'
        component={UploadQR}
        options={{
          headerBackTitleVisible: false,
          title: 'Cập nhật mã QR',
        }}
      />
    </Stack.Navigator>
  )
}

function Navigation() {
  const authCtx = useContext(AuthConText)
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

const Root = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const authCtx = useContext(AuthConText)

  useEffect(() => {
    async function prepare() {
      const fetchToken = async () => {
        const storedToken = await AsyncStorage.getItem('token')
        const id = await AsyncStorage.getItem('id')
        if (storedToken) {
          authCtx.authenticate(storedToken)
        }
        setAppIsReady(false)
      }
      try {
        fetchToken()
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  if (!appIsReady) {
    return null
  }
  return <Navigation onLayout={onLayoutRootView} />
}

export default function App() {
  return (
    <>
      <StatusBar style='dark' />
      <AuthConTextProvider>
        <Root />
      </AuthConTextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
