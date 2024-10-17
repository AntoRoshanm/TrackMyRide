import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, LogBox } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { auth, firestore } from './Firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import defaultProfileImage from './assests/avatar.jpg';

// Suppress specific log warnings
LogBox.ignoreLogs([
  'Setting a timer',
  'source.uri should not be an empty string',
]);

const EditProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(Image.resolveAssetSource(defaultProfileImage).uri);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username);
            setEmail(userData.email);
            setImageUri(userData.profileImage || Image.resolveAssetSource(defaultProfileImage).uri);
          } else {
            console.error('No such document!');
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        Alert.alert("Error", "Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(firestore, 'users', user.uid), {
          username,
          email,
          profileImage: imageUri || Image.resolveAssetSource(defaultProfileImage).uri,
        });

        if (email !== user.email) {
          await user.updateEmail(email);
        }
        if (password) {
          await user.updatePassword(password);
        }

        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } catch (error) {
        console.error("Error updating profile:", error);
        Alert.alert('Error', `Failed to update profile: ${error.message}`);
      }
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImageUri = response.assets[0].uri;
          console.log('Selected image URI:', selectedImageUri);
          setImage(selectedImageUri);
          setImageUri(selectedImageUri);
        }
      }
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const capturedImageUri = response.assets[0].uri;
          console.log('Captured image URI:', capturedImageUri);
          setImage(capturedImageUri);
          setImageUri(capturedImageUri);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FeatherIcon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Edit Profile</Text>
      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: image || imageUri }} style={styles.profileImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <FeatherIcon name="camera" size={24} color="#000" />
      </TouchableOpacity>
      <TextInput
        style={[styles.input, { color: 'black' }]}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={[styles.input, { color: 'black' }]}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { color: 'black' }]}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  cameraButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
