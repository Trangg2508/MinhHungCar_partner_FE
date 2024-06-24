import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
} from 'react-native';
import { Divider } from 'react-native-paper';
import Swiper from 'react-native-swiper';
// import FeatherIcon from 'react-native-vector-icons/Feather';
import { AuthConText } from '../store/auth-context';
import axios from 'axios';
import LoadingOverlay from '../components/UI/LoadingOverlay';


const IMAGES = [
  'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGVzbGElMjBtb2RlbCUyMHN8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1639358336404-b847ac2a3272?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80',
  'https://images.unsplash.com/photo-1652509525608-6b44097ea5a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjN8fHRlc2xhJTIwbW9kZWwlMjBzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
];

const characters = [
  {
    img: require('../assets/transmission.png'),
    label: 'Truyền động',
    content: 'Số tự động'
  },
  {
    img: require('../assets/seat.png'),
    label: 'Số ghế',
    content: '4 chỗ'
  },
  {
    img: require('../assets/gasoline.png'),
    label: 'Nhiên liệu',
    content: 'Điện'
  },
];

const comments = [
  {
    id: 1,
    author: 'Jane Doe',
    authorAvatar: 'https://www.bootdey.com/img/Content/avatar/avatar2.png',
    text: 'Dịch vụ tốt!',
  },
  {
    id: 2,
    author: 'John Smith',
    authorAvatar: 'https://www.bootdey.com/img/Content/avatar/avatar3.png',
    text: 'Xe chất lượng ok, giá cả hợp lý, MinhHungCar hỗ trợ khách hàng nhiệt tình',
  },
];

export default function DetailScreen({ navigation }) {
  const route = useRoute();
  const { detailID } = route.params;
  const authCtx = useContext(AuthConText);
  const token = authCtx.access_token;
  console.log('detailID: ', detailID)

  const [detailCar, setDetailCar] = useState({})
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getDetailCar()
  }, [])

  const getDetailCar = async () => {
    try {
      const response = await axios.get(`https://minhhungcar.xyz/car/${detailID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setDetailCar(response.data)
      console.log('Fetch successfully: ', response.data)
      setLoading(false)
    } catch (error) {
      console.log('Fetch failed: ', error)
    }
  }




  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LoadingOverlay message='' />
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerAction}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}>
                  {/* <FeatherIcon
                    color="#000"
                    name="arrow-left"
                    size={24} /> */}
                </TouchableOpacity>
              </View>

              <Text style={styles.headerTitle}>{detailCar.car_model?.brand + ' ' + detailCar.car_model?.model}</Text>

              <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
                <TouchableOpacity
                  onPress={() => {
                    // handle onPress
                  }}>
                  {/* <FeatherIcon
                    color="#000"
                    name="more-vertical"
                    size={24} /> */}
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
              <View style={styles.photos}>
                {Array.isArray(detailCar.images) && detailCar.images.length > 0 ? (
                  <Swiper
                    loop={false}
                    renderPagination={(index, total) => (
                      <View style={styles.photosPagination}>
                        <Text style={styles.photosPaginationText}>
                          {index + 1} of {total}
                        </Text>
                      </View>
                    )}
                  >
                    {detailCar.images.map((src, index) => (
                      <Image
                        key={index}
                        source={{ uri: src }}
                        style={styles.photosImg}
                        resizeMode="cover"
                      />
                    ))}
                  </Swiper>
                ) : (
                  <Text style={styles.errorText}>Không có hình ảnh xe</Text>
                )}
              </View>





              <View style={styles.info}>
                <View>
                  <Text style={styles.infoTitle}>
                    {detailCar.car_model?.brand + ' ' + detailCar.car_model?.model + ' ' + detailCar.car_model?.year}
                  </Text>

                  <View style={styles.infoRating}>
                    <Image
                      style={{ width: 20, height: 20, marginRight: 5 }}
                      source={require('../assets/star.png')}
                    />
                    <Text style={styles.infoRatingLabel}>5.0</Text>

                    <Image
                      style={{ width: 20, height: 20, marginRight: 5, marginLeft: 25 }}
                      source={require('../assets/history_green.png')}
                    />
                    <Text style={styles.infoRatingLabel}>{detailCar.total_trip}</Text>
                  </View>

                  <View>
                    {/* <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#15891A',
                      borderRadius: 15,
                      backgroundColor: 'white',
                      width: 110,
                      marginBottom: 10
                    }}
                  >
                    <Text style={{ margin: 5, textAlign: 'center', color: '#15891A' }}>Đã thanh toán</Text>
                  </View> */}
                    {(detailCar.status === 'approved' || detailCar.status === 'active' || detailCar.status === 'waiting_car_delivery') && (
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contract', { carId: detailID })}>
                          <Text style={styles.buttonText}>Xem hợp đồng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonCancel} onPress={() => { }}>
                          <Text style={{ padding: 5, textAlign: 'center', color: 'white' }}>Hủy</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>


              <Divider style={{ marginTop: 20 }} />
              <View style={styles.character}>
                <Text style={styles.characterTitle}>Đặc điểm</Text>
                <View
                  style={styles.characterContent}
                >
                  <View style={styles.card}>
                    <Image source={require('../assets/transmission.png')} style={styles.cardImg} />
                    <Text style={styles.cardLabel}>Truyền động</Text>
                    <Text style={styles.cardContent}>
                      {detailCar.motion === 'automatic_transmission' ? 'Số tự động' : 'Số sàn'}
                    </Text>
                  </View>

                  <View style={styles.card}>
                    <Image source={require('../assets/seat.png')} style={styles.cardImg} />
                    <Text style={styles.cardLabel}>Số ghế</Text>
                    <Text style={styles.cardContent}>{detailCar.car_model?.number_of_seats} chỗ </Text>
                  </View>

                  <View style={styles.card}>
                    <Image source={require('../assets/transmission.png')} style={styles.cardImg} />
                    <Text style={styles.cardLabel}>Nhiên liệu</Text>
                    <Text style={styles.cardContent}>
                      {detailCar.fuel === 'electricity' ? 'Điện' : (detailCar.fuel === 'oil' ? 'Dầu' : 'Xăng')}
                    </Text>
                  </View>
                </View>
              </View>

              <Divider style={{ marginTop: 20, marginBottom: 5 }} />
              <View style={styles.comment}>
                <Text style={styles.commentTitle}>Đánh giá</Text>
                <View>
                  {comments.map((item) => (
                    <View key={item.id.toString()} style={styles.commentContainer}>
                      <Image source={{ uri: item.authorAvatar }} style={styles.commentAvatar} />
                      <View style={styles.commentTextContainer}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.commentAuthor}>{item.author}</Text>
                          <Text style={styles.commentDate}>19/05/2024</Text>
                        </View>

                        <View style={styles.commentRating}>
                          <Image source={require('../assets/star.png')} style={{ width: 20, height: 20 }} />
                          <Text>5</Text>
                        </View>
                        <Text style={styles.commentText}>{item.text}</Text>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity
                    style={styles.seeMoreContainer}
                    onPress={() => {

                    }}>

                    <Text style={styles.seeMore}>Xem thêm</Text>

                  </TouchableOpacity>
                </View>



              </View>

            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    marginHorizontal: 16,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /** Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
  },
  /** Photos */
  photos: {
    marginTop: 12,
    position: 'relative',
    height: 240,
    overflow: 'hidden',
    borderRadius: 12,
  },
  photosPagination: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#000',
    borderRadius: 12,
  },
  photosPaginationText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fbfbfb',
  },
  photosImg: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    width: '100%',
    height: 240,
  },
  /** Info */
  info: {
    marginTop: 12,
    // backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: 0.38,
    color: '#000000',
    marginBottom: 6,
  },
  infoRating: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRatingLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 2,
  },

  /** character */
  character: {
    marginTop: 3,
    // backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: -15
  },
  characterTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: 0.38,
    color: '#000000',
    marginBottom: 6,
  },
  characterContent: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  /** Card */
  card: {
    width: 100,
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cardImg: {
    width: 40,
    height: 40,
    marginBottom: 12,
  },
  cardLabel: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 18,
    color: '#838383',
  },
  cardContent: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18,
    color: 'black',
    marginTop: 4
  },
  /** comment */
  comment: {
    marginTop: 0,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  commentTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: 0.38,
    color: '#000000',
    marginBottom: 6,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 15,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    marginVertical: 8,
    borderRadius: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 15
  },
  commentDate: {
    color: '#787878',
    marginTop: 2,
    fontSize: 13
  },
  commentRating: {
    marginTop: 5,
    flexDirection: 'row',
  },
  commentText: {
    color: '#333',
    marginTop: 5,
    fontSize: 13
  },
  seeMoreContainer: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#828282',
    marginVertical: 8,
    borderRadius: 5,
    justifyContent: 'center'
  },
  seeMore: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
  },
  /** Button */
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#773BFF',
    borderColor: '#773BFF',
  },
  btnText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  button: {
    width: 110,
    height: 30,
    backgroundColor: '#F4BB4C',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  buttonCancel: {
    width: 110,
    height: 30,
    backgroundColor: '#F91010',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    padding: 5,
    textAlign: 'center',
    alignItems: 'center',
    color: 'white'
  },
  errorText: {
    textAlign: 'center',
    justifyContent: 'center'
  }
});