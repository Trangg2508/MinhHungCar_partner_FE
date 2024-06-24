import { Divider } from '@rneui/base';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { apiPayment } from '../api/apiConfig';
import RNPickerSelect from 'react-native-picker-select';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { AuthConText } from '../store/auth-context';
import * as ImagePicker from 'expo-image-picker';

export default function PaymentInformationScreen({ navigation }) {
  const authCtx = useContext(AuthConText);
  const token = authCtx.access_token;

  const [bankOwner, setBankOwner] = useState('');
  const [bankNum, setBankNum] = useState('');
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');

  const [QRUrl, setQRUrl] = useState(null);
  const [image, setImage] = useState({
    selectedImage: null,
    avatarURL: null,
  });

  const [isLoading, setLoading] = useState(true);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isInfoChanged, setIsInfoChanged] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    getPaymentInfo();
    getBankList();
  }, []);

  const getPaymentInfo = async () => {
    try {
      const response = await axios.get(apiPayment.getPaymentInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data) {
        setBankOwner(response.data.bank_owner || '');
        setBankNum(response.data.bank_number || '');
        setSelectedBank(response.data.bank_name || '');
        setQRUrl(response.data.qr_code_url || null)
        console.log('Fetch success: ', response.data);
      } else {
        console.log('No data returned for payment info.');
      }
      setLoading(false);
    } catch (error) {
      console.log('Fetch info failed: ', error);
      setLoading(false);
    }
  };

  const getBankList = async () => {
    try {
      const response = await axios.get(apiPayment.getBankData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data && response.data.banks) {
        setBanks(response.data.banks);
        console.log('Fetch success: ', response.data.banks);
      } else {
        console.log('No data returned for bank list.');
      }
    } catch (error) {
      console.log('Fetch banks failed: ', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage({
        selectedImage: imageUri,
        avatarURL: imageUri, // Update avatarURL when an image is picked
      });
      setIsImageChanged(true); // Set flag to true when image is changed
      console.log('Picked image URI: ', imageUri);
      setImageLoading(false);
    }
  };

  const updatePaymentInfo = async () => {
    try {
      const response = await axios.put(apiPayment.updatePaymentInfo, {
        bank_number: bankNum,
        bank_owner: bankOwner,
        bank_name: selectedBank,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      Alert.alert('Thành công', 'Bạn đã cập nhật thông tin thành công');
      console.log('Update success: ', response.data.status);

    } catch (error) {
      Alert.alert('Thất bại', 'Không thể cập nhật thông tin. Vui lòng thử lại');
      console.log('Update failed: ', error);
    }
  };

  const uploadQR = async () => {
    const imageFormData = new FormData();
    imageFormData.append('file', {
      uri: image.selectedImage,
      name: 'QR.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post(apiPayment.uploadQR, imageFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200 || response.status === 201) {
        setQRUrl(response.data.qr_code_url);
        console.log('Upload image successfully: ', response.data);
      } else {
        console.log('Unexpected response status for image upload:', response.status);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tải lên hình ảnh.');
      }
    } catch (error) {
      console.log('Upload image failed!', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tải lên hình ảnh.');
    }
  };

  const handleSubmit = async () => {
    if (isImageChanged && isInfoChanged) {
      await uploadQR();
      await updatePaymentInfo();
    } else if (isImageChanged) {
      await uploadQR();
    } else if (isInfoChanged) {
      await updatePaymentInfo();
    } else {
      Alert.alert('Lỗi', 'Không có thay đổi nào để cập nhật.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {isLoading && <LoadingOverlay message='' />}
      <ScrollView>
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <View style={styles.form}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Chủ tài khoản</Text>
                <TextInput
                  clearButtonMode="while-editing"
                  onChangeText={(name) => {
                    setBankOwner(name);
                    setIsInfoChanged(true); // Set flag to true when info is changed
                  }}
                  placeholder="abc"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={bankOwner}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Số tài khoản</Text>
                <TextInput
                  clearButtonMode="while-editing"
                  onChangeText={(bankNum) => {
                    setBankNum(bankNum);
                    setIsInfoChanged(true); // Set flag to true when info is changed
                  }}
                  placeholder="00000000000000"
                  placeholderTextColor="#6b7280"
                  style={styles.inputControl}
                  value={bankNum}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Ngân hàng</Text>
                <RNPickerSelect
                  onValueChange={(bank) => {
                    setSelectedBank(bank);
                    setIsInfoChanged(true); // Set flag to true when info is changed
                  }}
                  value={selectedBank}
                  placeholder={{
                    label: "Chọn ngân hàng",
                    value: null,
                    color: '#9EA0A4',
                  }}
                  items={banks.map((bank, index) => ({
                    key: index.toString(),
                    label: bank,
                    value: bank,
                  }))}
                  style={pickerSelectStyles}
                  Icon={() => {
                    return <Image source={require('../assets/chevron_down.png')} style={styles.icon} />
                  }}
                />
              </View>

              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text style={styles.dividerText}>hoặc với mã QR</Text>
                <Divider style={styles.divider} />
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.uploadContainer}>
                  <TouchableOpacity onPress={pickImage} style={styles.QRUploadButton}>
                    <Text style={{ fontWeight: 'bold' }}>Tải lên</Text>
                    <Image style={styles.uploadIcon} source={require('../assets/upload.png')} />
                  </TouchableOpacity>
                </View>
                <View style={styles.QR}>
                  {imageLoading ? (
                    <LoadingOverlay message='' />
                  ) : image.selectedImage ? (
                    <Image key={image.selectedImage} style={styles.qrImage} source={{ uri: image.selectedImage }} />
                  ) : QRUrl ? (
                    <Image style={styles.qrImage} source={{ uri: QRUrl }} />
                  ) : (
                    <Image
                      source={{ uri: 'https://cdn.ttgtmedia.com/rms/misc/qr_code_barcode.jpg' }}
                      style={styles.qrImageDefault}
                    />
                  )}
                </View>
              </View>
              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleSubmit}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Lưu</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
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
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
    height: 44,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderStyle: 'solid',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  divider: {
    width: 100,
  },
  dividerText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  QR: {
    width: 268,
    height: 268,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  qrImage: {
    position: 'absolute',
    width: 268,
    height: 268,
  },
  QRUploadButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  uploadIcon: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
  formAction: {
    marginVertical: 24,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#5548E2',
    borderColor: '#5548E2',
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
  icon: {
    marginRight: 24,
    marginVertical: 18,
    width: 20,
    height: 10
  },
  uploadContainer: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999999',
    marginBottom: 5,
    marginTop: 8,
    borderRadius: 10
  },

});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: '#B2B2B2',
    borderRadius: 12,
    borderWidth: 0.5,
    width: 340,
    height: 44,
    marginBottom: 12,
    color: '#222',
  },
  inputAndroid: {
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#B2B2B2',
    borderRadius: 12,
    width: 335,
    height: 44,
    marginBottom: 12,
    color: '#222',
  },

});