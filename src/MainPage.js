import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth, firestore } from './Firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import defaultProfileImage from './assests/avatar.jpg';

const { width } = Dimensions.get('window');

const MainPage = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageUri, setImageUri] = useState(Image.resolveAssetSource(defaultProfileImage).uri);
  const [policeUsers, setPoliceUsers] = useState([]);
  const translateX = useState(new Animated.Value(-width))[0];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setImageUri(userData.profileImage || Image.resolveAssetSource(defaultProfileImage).uri);
          } else {
            console.error('No such document!');
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchPoliceUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'police'));
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPoliceUsers(users);
      } catch (error) {
        console.error("Error fetching police users: ", error);
      }
    };

    fetchUserData();
    fetchPoliceUsers();
  }, []);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => gestureState.dx > 20,
    onPanResponderMove: (evt, gestureState) => {
      translateX.setValue(Math.min(0, gestureState.dx - width));
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 100) {
        openMenu();
      } else {
        closeMenu();
      }
    }
  });

  const openMenu = () => {
    setMenuOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    Animated.timing(translateX, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const navigateToProfile = () => {
    navigation.navigate('ProfileScreen');
  };

  const navigateToReportForm = () => {
    navigation.navigate('ReportFormScreen');
  };

  const navigateToUserChat = (policeUser) => {
    navigation.navigate('UserChatScreen', { policeUser });
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
        <FeatherIcon name="menu" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileButton} onPress={navigateToProfile}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: imageUri }} style={styles.profileImage} />
        </View>
      </TouchableOpacity>
      <Text style={styles.mainText}>MainPage</Text>
      <Animated.View style={[styles.sideMenu, { transform: [{ translateX }] }]}>
        <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
          <FeatherIcon name="x" size={24} color="#000" />
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.policeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {policeUsers.map((policeUser) => (
            <TouchableOpacity
              key={policeUser.id}
              style={styles.policeCard}
              onPress={() => navigateToUserChat(policeUser)}
            >
              <Image
                source={{ uri: policeUser.profileImage || Image.resolveAssetSource(defaultProfileImage).uri }}
                style={styles.policeAvatar}
              />
              <Text style={styles.policeName}>{policeUser.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={navigateToReportForm}>
          <SimpleLineIcons name="envelope-letter" size={26} color="#000" />
          <Text style={[styles.bottomButtonText, { marginLeft: 10 }]}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton1} onPress={() => {navigation.navigate("SosButoon")}}>
          <AntDesign name="Safety" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton2} onPress={() => {navigation.navigate("ReportMarkScreen")}}>
          <FeatherIcon name="check-circle" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  profileButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  profileImageContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: '#000', // Set your desired border color here
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#f8f8f8',
    zIndex: 10,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  policeContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  policeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  policeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  policeName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    justifyContent: 'space-between',
    width: '90%',
  },
  bottomButton: {
    flex: 1,
    backgroundColor: '#f1c40f',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:"center",
  },
  bottomButton1: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 45,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton2: {
    backgroundColor: '#f1c40f',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 35,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
});

export default MainPage;
