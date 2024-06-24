import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { AuthConText } from '../store/auth-context';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import Spinner from '../components/UI/Spinner';
import { Switch } from 'react-native';
import LoadingOverlay from '../components/UI/LoadingOverlay';

export default function ContractScreen({ navigation }) {
  const route = useRoute();
  const { carId } = route.params;
  const authCtx = useContext(AuthConText);
  const token = authCtx.access_token;
  const [pdfURL, setPdfURL] = useState('');
  const [contractStatus, setContractStatus] = useState('')   //3 status: approved, active, waiting_car_delivery
  const [isLoading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    getDetailContract();
  }, []);

  const getDetailContract = async () => {
    try {
      const response = await axios.get(`https://minhhungcar.xyz/partner/contract?car_id=${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPdfURL(response.data.url);
      setContractStatus(response.data.status);
      console.log('Fetch contract successfully!');
      setTimeout(() => {
        setLoading(false);
      }, 4500);
    } catch (error) {
      console.log('Fetch contract error: ', error);
      setLoading(false);
    }
  };

  const handleAgreeSwitch = (value) => {
    setIsChecked(value);
  };

  const handleSignContract = async () => {
    try {
      const response = await axios.put(`https://minhhungcar.xyz/partner/contract/agree`,
        {
          car_id: carId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      console.log('Sign contract successfully!');
      Alert.alert(
        'Chúc mừng',
        'Bạn đã kí hợp đồng thành công! Vui lòng đợi phản hồi từ MinhHungCar',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Car')
          }
        ]
      );
    } catch (error) {
      console.log('Sign contract error: ', error);
      Alert.alert('Error', 'Failed to sign the contract. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingOverlay message='' />
        </View>
      ) : (
        <>
          <WebView
            source={{ uri: `https://docs.google.com/gview?embedded=true&url=${pdfURL}` }}
            style={styles.webview}
          />
          {contractStatus === 'waiting_for_agreement' &&
            <>
              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>Tôi đồng ý với các điều khoản trong hợp đồng</Text>
                <Switch
                  value={isChecked}
                  onValueChange={handleAgreeSwitch}
                  trackColor={{ false: '#767577', true: '#773BFF' }}
                  thumbColor={isChecked ? 'white' : 'white'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
              <TouchableOpacity
                style={[styles.button, !isChecked ? styles.disabledButton : null]}
                onPress={handleSignContract}
                disabled={!isChecked}
              >
                <Text style={styles.buttonText}>Kí hợp đồng</Text>
              </TouchableOpacity>
            </>
          }
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    marginTop: 10,
  },
  switchText: {
    fontSize: 16,
    flex: 1,
  },
  button: {
    backgroundColor: '#773BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});