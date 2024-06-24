import React, { useContext, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Divider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { apiCar } from '../api/apiConfig';
import { AuthConText } from '../store/auth-context';

export default function AddCarPhotoScreen({ navigation }) {
    const route = useRoute();
    const { carId, based_price } = route.params;
    const authCtx = useContext(AuthConText);
    const token = authCtx.access_token;
    console.log('carId: ', carId)
    console.log('based_price: ', based_price)

    const [mainImages, setMainImages] = useState({
        selectedImage: null,
        imageURL: null,
    });
    const [smallImages, setSmallImages] = useState([null, null, null, null]);

    const placeholderImages = [
        require('../assets/front.jpg'),
        require('../assets/back.jpg'),
        require('../assets/left.jpg'),
        require('../assets/right.jpg')
    ];

    const pickImage = async (isMainImage, index = null) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            if (isMainImage) {
                setMainImages({
                    selectedImage: imageUri,
                    imageURL: null,
                });
            } else if (index !== null) {
                const newSmallImages = [...smallImages];
                newSmallImages[index] = imageUri;
                setSmallImages(newSmallImages);
            }
        }
    };

    const handleUpload = async () => {
        if (!mainImages.selectedImage || smallImages.some(image => image === null)) {
            Alert.alert('Error', 'Please select all images.');
            return;
        }

        const formData = new FormData();
        formData.append('car_id', carId);
        formData.append('document_category', 'CAR_IMAGES');

        try {
            // Append main image
            formData.append('files', {
                uri: mainImages.selectedImage,
                name: 'mainImage.jpg',
                type: 'image/jpeg',
            });

            // Append small images
            smallImages.forEach((image, index) => {
                if (image) {
                    formData.append('files', {
                        uri: image,
                        name: `smallImage${index + 1}.jpg`,
                        type: 'image/jpeg',
                    });
                }
            });

            const response = await axios.post(apiCar.uploadCarDoc, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log('Images uploaded:', response.data);
            navigation.navigate('AddRegist', { carId: carId, based_price: based_price });
        } catch (error) {
            console.error('Error uploading images:', error);
            if (error.response) {
                console.error('Server Response:', error.response.data);
            }
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized request. Token may be expired.');
                // Handle token refresh or re-authentication here
            } else {
                Alert.alert('Lỗi', 'Có một vài lỗi xảy ra khi tải lên hình ảnh. Vui lòng thử lại');
            }
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView style={styles.container}>
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
                            <View style={styles.tabItemIconActive}>
                                <Image style={styles.tabImage} source={require('../assets/image_white.png')} />
                            </View>
                            <Text style={styles.tabTextActive}>Hình ảnh</Text>
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

                {/* Upload image */}
                <View style={styles.imageContainer}>
                    {/* Upload main image */}
                    <TouchableOpacity style={styles.mainImage} onPress={() => pickImage(true)}>
                        {mainImages.selectedImage ? (
                            <Image key={mainImages.selectedImage} style={styles.mainImage} source={{ uri: mainImages.selectedImage }} />
                        ) : mainImages.imageURL ? (
                            <Image style={styles.mainImage} source={{ uri: mainImages.imageURL }} />
                        ) : (
                            <Image
                                style={styles.mainImage}
                                source={require('../assets/main.jpg')}
                            />
                        )}
                    </TouchableOpacity>

                    {/* Upload 4 extra images */}
                    <View style={styles.extraImageContainer}>
                        {smallImages.map((image, index) => (
                            <TouchableOpacity key={index} style={styles.smallImage} onPress={() => pickImage(false, index)}>
                                {image ? (
                                    <Image style={styles.smallImage} source={{ uri: image }} />
                                ) : (
                                    <Image
                                        style={styles.smallImage}
                                        source={placeholderImages[index]}
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.action}>
                    <TouchableOpacity onPress={handleUpload}>
                        <View style={[styles.btn, (!mainImages.selectedImage || smallImages.some(image => image === null)) && styles.btnDisabled]}>
                            <Text style={styles.btnText}>Tiếp tục</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingVertical: 25,
        paddingHorizontal: 20,
        paddingBottom: 40
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
    /* Upload image */
    imageContainer: {
        marginVertical: 25,
        marginHorizontal: 15
    },
    mainImage: {
        width: '100%',
        height: 250,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        marginBottom: 10
    },
    extraImageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    smallImage: {
        width: 150,
        height: 150,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
    },
    /* Button */
    action: {
        marginVertical: 8,
        marginHorizontal: 14,
        paddingBottom: 40
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#5548E2',
        borderColor: '#5548E2',
    },
    btnDisabled: {
        backgroundColor: '#ccc',
        borderColor: '#ccc',
    },
    btnText: {
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '600',
        color: '#fff',
    },
});