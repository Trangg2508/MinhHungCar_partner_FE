import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Tooltip } from '@rneui/themed';
import axios from 'axios';
import { AuthConText } from '../store/auth-context';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { useFocusEffect } from '@react-navigation/native';
import Spinner from '../components/UI/Spinner';

const ControlledTooltip = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      visible={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      {...props}
    />
  );
};

const statusMessages = {
  pending_approval: 'Đăng kí xe thành công, vui lòng chờ MinhHungCar kiểm duyệt',
  approved: 'Xe đã được duyệt thành công. Bạn có thể tiến hành kí hợp đồng',
  rejected: 'Thông tin xe bị từ chối. Vui lòng kiểm tra và đăng kí lại',
  active: 'Xe đang được sử dụng bởi MinhHungCar',
  waiting_car_delivery: 'Chủ xe phải tới trung tâm để kiểm chứng giấy tờ',
  'pending_application:pending_car_images': 'Đang chờ hoàn thành thông tin ảnh xe',
  'pending_application:pending_car_caveat': 'Đang chờ hoàn thành thông tin giấy tờ xe',
  'pending_application:pending_price': 'Đang chờ hoàn thành thông tin giá cả',
};

const statusConvert = {
  no_filter: 'Tất cả',
  pending_approval: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Đã từ chối',
  active: 'Đang hoạt động',
  waiting_car_delivery: 'Đợi giao xe',
  'pending_application:pending_car_images': 'Chưa đăng kí hình ảnh',
  'pending_application:pending_car_caveat': 'Chưa đăng kí giấy tờ xe',
  'pending_application:pending_price': 'Chưa đăng kí thông tin giá cả',
};

export default function MyCar({ navigation }) {
  const authCtx = useContext(AuthConText);
  const token = authCtx.access_token;
  const [registeredCars, setRegisteredCars] = useState([]);
  const [activeTab, setActiveTab] = useState('no_filter');
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // State for pagination
  const [hasMore, setHasMore] = useState(true); // State to indicate if there's more data to load


  useEffect(() => {
    getRegisteredCar();
  }, [activeTab, page]);

  useFocusEffect(
    useCallback(() => {
      getRegisteredCar();
    }, [])
  );

  const getRegisteredCar = async () => {
    try {
      setLoading(true);
      let carStatus;
      if (activeTab === 'pending_application') {
        carStatus = [
          'pending_application:pending_car_images',
          'pending_application:pending_car_caveat',
          'pending_application:pending_price',
        ];
      } else {
        carStatus = [activeTab];
      }

      const response = await axios.get(`https://minhhungcar.xyz/partner/cars`, {
        params: {
          offset: (page - 1) * 10,
          limit: 10,
          car_status: carStatus.join(','),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newCars = response.data.cars || [];
      if (newCars.length > 0) {
        setRegisteredCars(page === 1 ? newCars : [...registeredCars, ...newCars]);
        setPage(page + 1);
      } else {
        setHasMore(false); // No more data to load
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    setPage(1);
    setRegisteredCars([]);
    setHasMore(true);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending_approval':
        return { borderColor: '#F89F36', color: '#F89F36' };
      case 'approved':
        return { borderColor: '#773BFF', color: '#773BFF' };
      case 'rejected':
        return { borderColor: '#FF4040', color: '#FF4040' };
      case 'active':
        return { borderColor: '#53D23E', color: '#53D23E' };
      case 'waiting_car_delivery':
        return { borderColor: '#56AEFF', color: '#56AEFF' };
      default:
        return { borderColor: 'gray', color: 'gray' };
    }
  };

  const navigateToScreen = (car) => {
    if (car && car.status === 'pending_application:pending_car_images') {
      navigation.navigate('AddCarPhoto', { carId: car.id, based_price: car.car_model?.based_price });
    } else if (car && car.status === 'pending_application:pending_car_caveat') {
      navigation.navigate('AddRegist', { carId: car.id, based_price: car.car_model?.based_price });
    } else if (car && car.status === 'pending_application:pending_price') {
      navigation.navigate('RentingFee', { carId: car.id, based_price: car.car_model?.based_price });
    } else if (car) {
      navigation.navigate('Detail', { detailID: car.id });
    }
  };

  const getStatusDisplay = (status) => {
    if (status.startsWith('pending_application:')) {
      return statusConvert[status];
    }
    return statusConvert[status];
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToScreen(item)}>
      <View style={styles.card}>
        <View style={{ flexDirection: 'row' }}>
          {item.status === 'pending_application:pending_car_images' ? (
            <Image
              resizeMode="cover"
              source={require('../assets/null_car.png')}
              style={styles.cardImg}
            />
          ) : (
            <Image
              resizeMode="cover"
              source={{ uri: item.images[0] }}
              style={styles.cardImg}
            />
          )}
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{`${item.car_model.brand} ${item.car_model.model}`}</Text>
            <Text style={styles.cardTag}>{`Biển số xe: ${item.license_plate.toUpperCase()}`}</Text>
            <View style={styles.cardRow}>
              <View style={[styles.statusContainer, getStatusStyles(item.status)]}>
                <Text style={{ color: getStatusStyles(item.status).color }}>
                  {getStatusDisplay(item.status)}
                </Text>
              </View>
              <ControlledTooltip
                popover={<Text style={{ color: 'white' }}>{statusMessages[item.status]}</Text>}
                containerStyle={styles.tooltipContainer}
                backgroundColor='#B4B1B1'
                height={60}
              >
                <Image style={styles.statusIcon} source={require('../assets/question_round.png')} />
              </ControlledTooltip>
            </View>
            {(item.status === 'approved' || item.status === 'active' || item.status === 'waiting_car_delivery') && (
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contract', { carId: item.id })}>
                <Text style={styles.buttonText}>Xem hợp đồng</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator message='' />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View>

        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
            {Object.keys(statusConvert).map((statusKey) => (
              <TouchableOpacity
                key={statusKey}
                style={[styles.tabItem, activeTab === statusKey && styles.activeTabItem]}
                onPress={() => handleTabPress(statusKey)}
              >
                <Text style={[styles.tabText, activeTab === statusKey && styles.activeTabText]}>
                  {statusConvert[statusKey]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          {registeredCars.length > 0 && (
            <>
              <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 15, marginBottom: 60 }}>
                <TouchableOpacity style={styles.addCar} onPress={() => navigation.navigate('AddCarInfor')}>
                  <Image style={{ width: 25, height: 25 }} source={require('../assets/add.png')} />
                  <Text style={{ fontWeight: 600 }}>{' '} Thêm xe</Text>
                </TouchableOpacity>
              </View>


              <FlatList
                data={registeredCars}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.1}
                onEndReached={getRegisteredCar}
                contentContainerStyle={styles.listContainer}
              />
            </>
          )}
          {registeredCars.length === 0 && (
            <View >
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <Text style={{ fontSize: 16, color: '#686D76', marginBottom: 20 }}>Chưa có xe nào {statusConvert[activeTab]}</Text>
                <TouchableOpacity style={styles.addCar} onPress={() => navigation.navigate('AddCarInfor')}>
                  <Image style={{ width: 25, height: 25 }} source={require('../assets/add.png')} />
                  <Text style={{ fontWeight: 600 }}>{' '} Thêm xe</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 5,
    paddingBottom: 130,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '100%',
    borderColor: '#E1E1E1',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardImg: {
    width: 160,
    height: '100%',
    borderRadius: 5,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  cardTag: {
    fontSize: 14,
    color: '#939393',
    marginBottom: 9,
    textTransform: 'capitalize',
  },
  cardTitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#D9D9D9',
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    height: 40,
    width: 120
  },
  addCarEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  statusContainer: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusIcon: {
    marginLeft: 5,
    width: 20,
    height: 20,
  },
  button: {
    marginTop: 10,
    borderColor: '#773BFF',
    backgroundColor: '#773BFF',
    width: 130,
    height: 32,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
  },
  tooltipContainer: {
    width: 400,
    padding: 5,
  },
  //Tab
  tabContainer: {
    height: 60,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  tabItem: {
    height: 50,
    justifyContent: 'center',
    marginRight: 25,
  },
  activeTabItem: {
    borderBottomColor: '#773BFF',
    borderBottomWidth: 3,
  },
  activeTabText: {
    fontSize: 16,
    color: '#773BFF',
  },
  tabText: {
    fontSize: 16,
    color: 'black',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#C1C1C1',
    borderRadius: 8,
    color: 'black',
    paddingRight: 10,
    backgroundColor: 'white',
    width: 175,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#C1C1C1',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#F0F0F0',
    width: 150,
  },
  placeholder: {
    color: '#8a8a8a',
  },


});