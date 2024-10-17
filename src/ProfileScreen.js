import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';
import { auth, firestore } from './Firebase'; // Adjust the path as necessary
import { doc, getDoc } from 'firebase/firestore';
import defaultProfileImage from './assests/avatar.jpg'; // Import the default profile image

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(Image.resolveAssetSource(defaultProfileImage).uri);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            setImageUri(userData.profileImage || Image.resolveAssetSource(defaultProfileImage).uri);
          } else {
            console.error('No such document!');
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Redirect to the login screen after successful logout
    } catch (error) {
      console.error("Logout Error: ", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfileScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FeatherIcon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.username}</Text>
        <Text style={styles.profileEmail}>{userData.email}</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <FeatherIcon name="edit" size={20} color="#000" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <FeatherIcon name="help-circle" size={24} color="#000" />
          <Text style={styles.menuItemText}>Help & Support</Text>
          <FeatherIcon name="chevron-right" size={24} color="#000" style={styles.menuItemIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FeatherIcon name="users" size={24} color="#000" />
          <Text style={styles.menuItemText}>Invite a Friend</Text>
          <FeatherIcon name="chevron-right" size={24} color="#000" style={styles.menuItemIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#000" />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  profileEmail: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1c40f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 30,
  },
  editButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItemText: {
    fontSize: 18,
    color: '#000',
    marginLeft: 20,
    flex: 1,
  },
  menuItemIcon: {
    marginLeft: 'auto',
  },
});

export default ProfileScreen;
