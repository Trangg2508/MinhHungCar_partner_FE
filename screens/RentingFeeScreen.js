import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Divider } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { apiCar } from '../api/apiConfig';
import { AuthConText } from '../store/auth-context';

export default function RentingFeeScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { carId, based_price } = route.params;
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;

    const [sliderValue, setSliderValue] = useState(based_price);
    const [isPriceUpdated, setIsPriceUpdated] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpdatePrice = async () => {
        setLoading(true);
        try {
            const response = await axios.put(apiCar.updatePrice, {
                car_id: carId,
                new_price: sliderValue
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Price updated:', response.data.data);
            setIsPriceUpdated(true);
            navigation.navigate('Success');
        } catch (error) {
            if (error.response.data.error_code === 10058) {
                Alert.alert('Lỗi', 'Không thể cập nhật giá ngay lúc này');
            } else {
                console.log('Error updating price:', response.data.message);
            }
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.container}>
                {/* Tab */}
                <View style={styles.tabContainer}>
                    <View style={styles.tabItemContainer}>
                        <View style={styles.tabItemActive}>
                            <View style={styles.tabItemIcon}>
                                <Image style={styles.tabImage} source={require('../assets/list_purple.png')} />
                            </View>
                            <Text style={styles.tabText}>Thông tin xe</Text>
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
                            <View style={styles.tabItemIconActive}>
                                <Image style={styles.tabImage} source={require('../assets/dollar_white.png')} />
                            </View>
                            <Text style={styles.tabTextActive}>Giá cho thuê</Text>
                        </View>
                    </View>
                </View>

                {/* Generate fee */}
                <View style={styles.generateContainer}>
                    <Text style={styles.description}>
                        Mức giá thuê đề xuất cho mẫu xe này là {''}
                        <Text style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{based_price.toLocaleString()}/ ngày</Text>
                    </Text>
                    <View style={{ marginVertical: 30, flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={styles.price}>{sliderValue.toLocaleString()} VND</Text>
                        <Divider style={{ height: 1, backgroundColor: '#773BFF', width: 180, marginTop: 5 }} />
                    </View>
                    <View style={styles.priceRange}>
                        <Text style={styles.priceRangeText}>
                            {Math.max(based_price - 200000, 200000).toLocaleString()} VND
                        </Text>
                        <Text style={styles.priceRangeText}>
                            {(based_price + 200000).toLocaleString()} VND
                        </Text>
                    </View>
                    <View style={styles.sliderContainer}>
                        <LinearGradient
                            colors={['#DACAFF', '#9D71FF', '#8154E8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 2, y: 0 }}
                            style={styles.gradient}
                        />
                        <Slider
                            style={styles.slider}
                            minimumValue={Math.max(based_price - 200000, 200000)}  // Ensure minimum value is at least 200,000 VND
                            maximumValue={based_price + 200000}
                            step={1000}
                            value={sliderValue}
                            onValueChange={(value) => setSliderValue(value)}
                            minimumTrackTintColor="transparent"
                            maximumTrackTintColor="transparent"
                            thumbTintColor="#773BFF"
                            thumbStyle={styles.thumb}
                            trackStyle={styles.track}
                        />
                    </View>
                    <View style={styles.priceRangeLabel}>
                        <Text style={styles.priceRangeText}>Giá thấp nhất</Text>
                        <Text style={styles.priceRangeText}>Giá cao nhất</Text>
                    </View>
                    <View style={styles.action}>
                        <TouchableOpacity onPress={handleUpdatePrice} disabled={loading || isPriceUpdated}>
                            <View style={[styles.btn, (loading || isPriceUpdated) && styles.btnDisabled]}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.btnText}>Tiếp tục</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 25,
        paddingHorizontal: 20,
        paddingBottom: 50
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
    /* Generate fee */
    generateContainer: {
        marginVertical: 40,
        marginHorizontal: 15
    },
    description: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 14,
        color: 'black',
    },
    sliderContainer: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 0,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 5,
        borderRadius: 5,
    },
    slider: {
        width: '100%',
        height: 60,
    },
    thumb: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: '#6c63ff',
        borderWidth: 2,
        borderColor: '#fff',
    },
    track: {
        height: 10,
        borderRadius: 5,
        backgroundColor: 'transparent',
    },
    price: {
        fontSize: 24,
        color: '#773BFF',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    priceRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        fontSize: 14,
        color: '#666',
    },
    priceRangeLabel: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    priceRangeText: {
        fontWeight: '600'
    },
    /* Button */
    action: {
        marginTop: 100
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#773BFF',
        borderColor: '#773BFF',
        borderWidth: 1,
        paddingVertical: 10,
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    btnDisabled: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
    },
});
