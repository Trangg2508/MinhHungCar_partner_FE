import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNPickerSelect from 'react-native-picker-select';
import { AuthConText } from '../store/auth-context';
import axios from 'axios';
import { apiCar } from '../api/apiConfig';
import LoadingOverlay from '../components/UI/LoadingOverlay';

export default function AddCarInformationScreen({ navigation }) {
  const authCtx = useContext(AuthConText);
  const token = authCtx.access_token;

  const [licensePlate, setLicensePlate] = useState('');
  const [carModelId, setCarModelId] = useState('');
  const [selectedMotionCode, setSelectedMotionCode] = useState('');
  const [selectedFuelCode, setSelectedFuelCode] = useState('');
  const [selectedParking, setSelectedParking] = useState('');
  const [selectedPeriodCode, setSelectedPeriodCode] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [seats, setSeats] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeat, setSelectedSeat] = useState('');

  const [carList, setCarList] = useState([]);
  const [periodData, setPeriodData] = useState([])
  const [fuelData, setFuelData] = useState([])
  const [motionData, setMotionData] = useState([])
  const [parkingLotData, setParkingLotData] = useState([])

  const [isLoading, setLoading] = useState(true);
  const [isLoadButton, setLoadButton] = useState()

  const [id, setId] = useState('');

  useEffect(() => {
    fetchBrandData();
    fetchPeriodData();
    fetchFuelData();
    fetchMotionData();
    fetchParkingLotData();
  }, []);

  useEffect(() => {
    if (carList.length > 0) {
      getIDRegisteredCar();
    }
  }, [carList]);

  // Get periods data
  const fetchPeriodData = async () => {
    try {
      const response = await axios.get(apiCar.getCarMetadata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const periods = response.data.periods;
      console.log('Fetch periods successfully: ', periods)
      setPeriodData(periods);
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  // Get fuels data
  const fetchFuelData = async () => {
    try {
      const response = await axios.get(apiCar.getCarMetadata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fuels = response.data.fuels;
      console.log('Fetch fuels successfully: ', fuels)
      setFuelData(fuels);
    } catch (error) {
      console.error('Error fetching fuels:', error);
    }
  };

  // Get motions data
  const fetchMotionData = async () => {
    try {
      const response = await axios.get(apiCar.getCarMetadata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const motions = response.data.motions;
      console.log('Fetch motions successfully: ', motions)
      setMotionData(motions);
    } catch (error) {
      console.error('Error fetching motions:', error);
    }
  };

  // Get parking_lot data
  const fetchParkingLotData = async () => {
    try {
      const response = await axios.get(apiCar.getCarMetadata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const parking_lot = response.data.parking_lot;
      console.log('Fetch parking_lot successfully: ', parking_lot)
      setParkingLotData(parking_lot);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching parking_lot:', error);
    }
  };


  // Get brand list
  const fetchBrandData = async () => {
    try {
      const response = await axios.get(apiCar.getCarMetadata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const carModels = response.data.models;
      setCarList(carModels);
      const uniqueBrands = [...new Set(carModels.map((model) => model.brand))];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const getRemainData = (brand) => {
    const filteredModels = carList.filter((model) => model.brand === brand);
    setModels(filteredModels.map((model) => model.model));
    setYears([...new Set(filteredModels.map((model) => model.year.toString()))]);
    setSeats([...new Set(filteredModels.map((model) => model.number_of_seats.toString()))]);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSelectedModel('');
    setSelectedYear('');
    setSelectedSeat('');
    getRemainData(brand);
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    setSelectedYear('');
    setSelectedSeat('');
    const filteredModels = carList.filter((m) => m.brand === selectedBrand && m.model === model);
    const uniqueYears = [...new Set(filteredModels.map((m) => m.year.toString()))];
    setYears(uniqueYears);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedSeat('');
    const filteredModels = carList.filter(
      (m) => m.brand === selectedBrand && m.model === selectedModel && m.year.toString() === year
    );
    setSeats(filteredModels.map((m) => m.number_of_seats.toString()));
  };

  const handleSeatChange = (seat) => {
    setSelectedSeat(seat);
    const selectedCarModel = carList.find(
      (model) =>
        model.brand === selectedBrand &&
        model.model === selectedModel &&
        model.year.toString() === selectedYear &&
        model.number_of_seats.toString() === seat
    );
    if (selectedCarModel) {
      setCarModelId(selectedCarModel.id);
      setBasePrice(selectedCarModel.based_price);
    }
  };

  // Get ID of the newest car
  const getNewestCarId = (cars) => {
    if (!cars || cars.length === 0) {
      return null;
    }
    // Sort cars by created_at in descending order
    const sortedCars = cars.sort((a, b) => new Date(b.car_model.created_at) - new Date(a.car_model.created_at));
    // Access the ID of the newest car (first in the sorted array)
    const newestCarId = sortedCars[0]?.id;
    return newestCarId;
  };

  // Get ID of the registered car
  const getIDRegisteredCar = async () => {
    try {
      const response = await axios.get(apiCar.getAllCar, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newestCarId = getNewestCarId(response.data.cars);
      if (newestCarId) {
        setId(newestCarId);
        console.log('ID of the newest car:', newestCarId);
      } else {
        console.warn('No cars available to get the ID from.');
      }
    } catch (error) {
      console.error('Error fetching id:', error);
    }
  };

  const handleSubmit = async () => {

    if (
      !licensePlate ||
      !carModelId ||
      !selectedMotionCode ||
      !selectedFuelCode ||
      !selectedParking ||
      !selectedPeriodCode ||
      !description ||
      !selectedBrand ||
      !selectedModel ||
      !selectedYear ||
      !selectedSeat
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tất cả thông tin');
      return;
    }

    // Check if the license plate length is valid
    if (licensePlate.trim().length < 4) {
      Alert.alert('Lỗi', 'Biển số xe phải có ít nhất 4 kí tự');
      return;
    }




    try {
      setLoadButton(true);

      const response = await axios.post(
        apiCar.registerCar,
        {
          license_plate: licensePlate,
          car_model_id: carModelId,
          motion_code: selectedMotionCode,
          fuel_code: selectedFuelCode,
          parking_lot: selectedParking,
          period_code: selectedPeriodCode,
          description: description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Car created:', response);
      await getIDRegisteredCar();
      const incrementedId = id + 1;

      navigation.navigate('AddCarPhoto', { carId: incrementedId, based_price: basePrice });
    } catch (error) {
      console.error('Error creating car:', error);
    } finally {
      setLoadButton(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingOverlay message='' />
        </View>
      ) : (
        <ScrollView style={styles.container}>

          {/* Tab */}
          <View style={styles.tabContainer}>
            <View style={styles.tabItemContainer}>
              <View style={styles.tabItemActive}>
                <View style={styles.tabItemIconActive}>
                  <Image style={styles.tabImage} source={require('../assets/list_white.png')} />
                </View>
                <Text style={styles.tabTextActive}>Thông tin xe</Text>
              </View>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.tabItemContainer}>
              <View style={styles.tabItem}>
                <View style={styles.tabItemIcon}>
                  <Image style={styles.tabImage} source={require('../assets/image_purple.png')} />
                </View>
                <Text style={styles.tabText}>Hình ảnh</Text>
              </View>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.tabItemContainer}>
              <View style={styles.tabItem}>
                <View style={styles.tabItemIcon}>
                  <Image style={styles.tabImage} source={require('../assets/vehicle_regsister_purple.png')} />
                </View>
                <Text style={styles.tabText}>Giấy tờ xe</Text>
              </View>
              <Divider style={styles.divider} />
            </View>

            <View style={styles.tabItemContainer}>
              <View style={styles.tabItem}>
                <View style={styles.tabItemIcon}>
                  <Image style={styles.tabImage} source={require('../assets/dollar_purple.png')} />
                </View>
                <Text style={styles.tabText}>Giá cho thuê</Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <KeyboardAwareScrollView>
            <View style={styles.form}>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>
                  Biển số xe
                  <Text style={styles.required}>{' '}*</Text></Text>

                <TextInput
                  clearButtonMode="while-editing"
                  onChangeText={(licensePlate) => setLicensePlate(licensePlate.trim())}
                  placeholder="Nhập biển số xe"
                  placeholderTextColor="#C5C5C5"
                  style={styles.inputControl}
                  value={licensePlate.toString()}
                />

              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>
                  Hãng xe
                  <Text style={styles.required}>{' '}*</Text>
                </Text>

                <RNPickerSelect
                  onValueChange={(brand) => handleBrandChange(brand)}
                  placeholder={{
                    label: "Chọn hãng xe",
                    value: null,
                    color: '#9EA0A4',
                  }}
                  items={brands.map((brand, index) => ({
                    key: index.toString(),
                    label: brand,
                    value: brand,
                  }))}
                  style={pickerSelectStyles}
                  Icon={() => {
                    return <Image source={require('../assets/chevron_down.png')} style={styles.icon} />
                  }}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Mẫu xe
                  <Text style={styles.required}>{' '}*</Text>
                </Text>

                <RNPickerSelect
                  onValueChange={(model) => handleModelChange(model)}
                  placeholder={{
                    label: "Chọn mẫu xe",
                    value: null,
                    color: '#9EA0A4',
                  }}
                  items={models.map((model, index) => ({
                    key: index.toString(),
                    label: model,
                    value: model,
                  }))}
                  style={pickerSelectStyles}
                  disabled={!selectedBrand}
                  Icon={() => {
                    return <Image source={require('../assets/chevron_down.png')} style={styles.icon} />
                  }}
                />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.inputShort}>
                  <Text style={styles.inputLabel}>Năm sản xuất
                    <Text style={styles.required}>{' '}*</Text>
                  </Text>

                  <RNPickerSelect
                    onValueChange={(year) => handleYearChange(year)}
                    placeholder={{
                      label: "Năm sản xuất",
                      value: null,
                      color: '#9EA0A4',
                    }}
                    items={years.map((year, index) => ({
                      key: index.toString(),
                      label: year,
                      value: year,
                    }))}
                    style={pickerSelectShortStyles}
                    Icon={() => {
                      return <Image source={require('../assets/chevron_down.png')} style={styles.icon} />
                    }}
                  />
                </View>

                <View style={styles.inputShort}>
                  <Text style={styles.inputLabel}>Số ghế
                    <Text style={styles.required}>{' '}*</Text>
                  </Text>
                  <RNPickerSelect
                    onValueChange={(seat) => handleSeatChange(seat)}
                    placeholder={{
                      label: "Chọn số ghế",
                      value: null,
                      color: '#9EA0A4',
                    }}
                    items={seats.map((seat, index) => ({
                      key: index.toString(),
                      label: `${seat} chỗ`,
                      value: seat,
                    }))}
                    style={pickerSelectShortStyles}
                    Icon={() => {
                      return <Image source={require('../assets/chevron_down.png')} style={styles.icon} />
                    }}
                  />

                </View>
              </View>
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Truyền động
                  <Text style={styles.required}>{' '}*</Text>
                </Text>

                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.radioButtonGroup}>
                    {motionData.map((motion) => (
                      <TouchableOpacity
                        key={motion.code}
                        onPress={() => setSelectedMotionCode(motion.code)}
                        style={[
                          styles.radioButton,
                          selectedMotionCode === motion.code && styles.radioButtonSelected,
                        ]}
                      >
                        <View style={styles.radioCircle}>
                          {selectedMotionCode === motion.code && (
                            <View style={styles.selectedRb} />
                          )}
                        </View>
                        <Text style={styles.radioText}>{motion.text}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Nhiên liệu
                  <Text style={styles.required}>{' '}*</Text>
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.radioButtonGroup}>
                    {fuelData.map((fuel) => (
                      <TouchableOpacity
                        key={fuel.code}
                        onPress={() => setSelectedFuelCode(fuel.code)}
                        style={[
                          styles.radioButton,
                          selectedFuelCode === fuel.code && styles.radioButtonSelected,
                        ]}
                      >
                        <View style={styles.radioCircle}>
                          {selectedFuelCode === fuel.code && (
                            <View style={styles.selectedRb} />
                          )}
                        </View>
                        <Text style={styles.radioText}>{fuel.text}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Chỗ để xe
                  <Text style={styles.required}>{' '}*</Text>
                </Text>

                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.radioButtonGroup}>
                    {parkingLotData.map((lot) => (
                      <TouchableOpacity
                        key={lot.code}
                        onPress={() => setSelectedParking(lot.code)}
                        style={[
                          styles.radioButton,
                          selectedParking === lot.code && styles.radioButtonSelected,
                        ]}
                      >
                        <View style={styles.radioCircle}>
                          {selectedParking === lot.code && (
                            <View style={styles.selectedRb} />
                          )}
                        </View>
                        <Text style={styles.radioText}>{lot.text}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Kì hạn thuê xe
                  <Text style={styles.required}>{' '}*</Text>
                </Text>

                <RNPickerSelect
                  onValueChange={(period) => setSelectedPeriodCode(period)}
                  placeholder={{
                    label: "Chọn kì hạn",
                    value: null,
                    color: '#9EA0A4',
                  }}
                  items={periodData.map((period) => ({
                    key: period.code,
                    label: period.text,
                    value: period.code,
                  }))}
                  style={pickerSelectStyles}
                  Icon={() => {
                    return <Image source={require('../assets/chevron_down.png')} style={styles.icon} />
                  }}
                />
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>
                  Mô tả
                  <Text style={styles.required}>{' '}*</Text></Text>

                <TextInput
                  clearButtonMode="while-editing"
                  onChangeText={des => setDescription(des)}
                  placeholder="Nhập mô tả"
                  placeholderTextColor="#C5C5C5"
                  style={styles.inputControlTextArea}
                  value={description.toString()}
                  multiline={true}
                  numberOfLines={4} />
              </View>
              <View style={styles.formAction}>
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoadButton}
                  style={[styles.btn, isLoadButton && styles.btnDisabled]}
                >
                  <View>
                    {isLoadButton ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.btnText}>Tiếp tục</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </KeyboardAwareScrollView>

        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Tab */
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItemActive: {
    alignItems: 'center',
  },
  tabItemIconActive: {
    width: 47,
    height: 47,
    borderRadius: 50,
    backgroundColor: '#773BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemIcon: {
    width: 47,
    height: 47,
    borderRadius: 50,
    borderColor: '#773BFF',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabImage: {
    width: 26,
    height: 28,
  },
  tabTextActive: {
    color: '#773BFF',
    fontWeight: 'bold',
    marginVertical: 10,
    fontSize: 12,
  },
  tabText: {
    marginVertical: 10,
    fontSize: 12,
  },
  divider: {
    height: 1,
    width: 24,
    marginBottom: 30,
    marginHorizontal: 5,
  },
  tabItem: {
    alignItems: 'center',
  },
  /* Form */
  form: {
    paddingHorizontal: 10,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginTop: 30
  },
  formAction: {
    marginVertical: 24,
    marginBottom: 40
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    textAlign: 'center',
    marginBottom: 70,
  },
  /** Input */
  input: {
    marginBottom: 20,
  },
  inputShort: {
    marginBottom: 20,
    width: 160
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  inputControl: {
    height: 44,
    borderColor: '#B2B2B2',
    borderWidth: 0.5,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderStyle: 'solid',
  },
  inputControlTextArea: {
    height: 100,
    borderColor: '#B2B2B2',
    borderWidth: 0.5,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderStyle: 'solid',
    textAlignVertical: 'top',
    paddingVertical: 10,
    paddingTop: 12
  },
  /** Button */
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
  btnDisabled: {
    backgroundColor: '#ccc',
    borderColor: '#ccc',
  },
  icon: {
    marginRight: 24,
    marginVertical: 18,
    width: 20,
    height: 10
  },

  /* Radio */
  radioButtonGroup: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 15,
    // justifyContent: 'space-between'
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 40
    // padding: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 8,
  },
  radioButtonSelected: {
    borderColor: 'black',
    // backgroundColor: '#e0f7ff',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  radioText: {
    fontSize: 16,
  },
})
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
    width: 335,
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

const pickerSelectShortStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: '#B2B2B2',
    borderRadius: 12,
    width: 160,
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
    borderWidth: 2,
    borderColor: '#B2B2B2',
    borderRadius: 12,
    width: 160,
    height: 44,
    marginBottom: 12,
    color: '#222',
  },

});
