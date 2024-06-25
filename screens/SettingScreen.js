




import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { AuthConText } from '../store/auth-context';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import axios from 'axios';
import { apiAccount } from '../api/apiConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function SettingScreen({ navigation }) {
  const authCtx = useContext(AuthConText);
  const token = authCtx.access_token;

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const [isLoading, setLoading] = useState(true);
  const [avatarURL, setAvatarURL] = useState(null);


  const handleLogout = async () => {
    try {
      authCtx.logout();
    } catch (error) {
      console.log('Error clearing AsyncStorage:', error);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              style={styles.row}
            >
              <Image style={styles.icon_new} source={require('../assets/user.png')} />
              <Text style={styles.rowLabel}>Tài khoản của tôi</Text>
              <Image style={styles.arrowIcon} source={require('../assets/right.png')} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tuỳ chọn</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity onPress={() => { navigation.navigate('Chat') }} style={styles.row}>
              <Image style={styles.icon} source={require('../assets/bubble-chat.png')} />
              <Text style={styles.rowLabel}>Chat với admin</Text>
              <Image style={styles.arrowIcon} source={require('../assets/right.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('PayInfo') }} style={styles.row}>
              <Image style={styles.icon} source={require('../assets/bank_card.png')} />
              <Text style={styles.rowLabel}>Thông tin thanh toán</Text>
              <Image style={styles.arrowIcon} source={require('../assets/right.png')} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionBody, styles.logoutSection]}>
            <TouchableOpacity onPress={handleLogout} style={styles.row}>
              <Text style={styles.logoutLabel}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 20
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileDetails: {
    alignItems: 'center',
    marginTop: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#414d63',
  },
  profileEmail: {
    fontSize: 14,
    color: '#989898',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a69f9f',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  sectionBody: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  icon_new: {
    width: 20,
    height: 18,
    marginRight: 16,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  arrowIcon: {
    width: 16,
    height: 16,
  },
  logoutSection: {
    borderRadius: 10,
  },
  logoutLabel: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
  },
});


// import React, { useCallback, useContext, useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   SafeAreaView,
//   View,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import FeatherIcon from 'react-native-vector-icons/Feather';
// import { AuthConText } from '../store/auth-context';
// import LoadingOverlay from '../components/UI/LoadingOverlay';
// import axios from 'axios';
// import { apiAccount } from '../api/apiConfig';
// import { useFocusEffect } from '@react-navigation/native';

// export default function SettingScreen({ navigation }) {
//   const authCtx = useContext(AuthConText);
//   const token = authCtx.access_token;

//   const [firstName, setFirstName] = useState('')
//   const [lastName, setLastName] = useState('')
//   const [email, setEmail] = useState('')

//   const [isLoading, setLoading] = useState(true);
//   const [avatarURL, setAvatarURL] = useState(null);

//   useFocusEffect(
//     useCallback(() => {
//       getProfile();
//     }, [])
//   );

//   const getProfile = async () => {
//     try {
//       const response = await axios.get(apiAccount.getProfile, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       setFirstName(response.data.first_name);
//       setLastName(response.data.last_name);
//       setEmail(response.data.email);
//       setAvatarURL(response.data.avatar_url || null);
//       console.log('Fetch profile successfully: ', response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       authCtx.logout();
//     } catch (error) {
//       console.error('Error clearing AsyncStorage:', error);
//     }
//   };


//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <LoadingOverlay message='' />
//         </View>
//       ) : (
//         <ScrollView contentContainerStyle={styles.container}>

//           <View style={styles.profileSection}>
//             {avatarURL ?
//               <Image style={styles.profileImage} source={{ uri: avatarURL }} />
//               :
//               <Image
//                 style={styles.profileImage}
//                 source={{ uri: 'https://static.thenounproject.com/png/642902-200.png' }}
//               />
//             }

//             <View style={styles.profileDetails}>
//               <Text style={styles.profileName}>{firstName} {lastName}</Text>
//               <Text style={styles.profileEmail}>{email}</Text>
//             </View>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Tài khoản</Text>
//             <View style={styles.sectionBody}>
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('Profile')}
//                 style={styles.row}
//               >
//                 <Image style={styles.icon} source={require('../assets/account.png')} />
//                 <Text style={styles.rowLabel}>Tài khoản của tôi</Text>
//                 <Image style={styles.arrowIcon} source={require('../assets/right.png')} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Tuỳ chọn</Text>
//             <View style={styles.sectionBody}>
//               <TouchableOpacity onPress={() => { navigation.navigate('Chat') }} style={styles.row}>
//                 <Image style={styles.icon} source={require('../assets/chat.png')} />
//                 <Text style={styles.rowLabel}>Chat với admin</Text>
//                 <Image style={styles.arrowIcon} source={require('../assets/right.png')} />
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => { navigation.navigate('PayInfo') }} style={styles.row}>
//                 <Image style={styles.icon} source={require('../assets/bank_card.png')} />
//                 <Text style={styles.rowLabel}>Thông tin thanh toán</Text>
//                 <Image style={styles.arrowIcon} source={require('../assets/right.png')} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.section}>
//             <View style={[styles.sectionBody, styles.logoutSection]}>
//               <TouchableOpacity onPress={handleLogout} style={styles.row}>
//                 <Text style={styles.logoutLabel}>Đăng xuất</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     paddingHorizontal: 16,
//     paddingBottom: 20,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   profileDetails: {
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#414d63',
//   },
//   profileEmail: {
//     fontSize: 14,
//     color: '#989898',
//   },
//   section: {
//     marginVertical: 10,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#a69f9f',
//     textTransform: 'uppercase',
//     marginBottom: 5,
//   },
//   sectionBody: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   icon: {
//     width: 24,
//     height: 24,
//     marginRight: 16,
//   },
//   rowLabel: {
//     flex: 1,
//     fontSize: 16,
//     color: '#000',
//   },
//   arrowIcon: {
//     width: 16,
//     height: 16,
//   },
//   logoutSection: {
//     borderRadius: 10,
//   },
//   logoutLabel: {
//     width: '100%',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#ff3b30',
//   },
// });
