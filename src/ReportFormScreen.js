import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { firestore, storage, auth } from './Firebase'; // Ensure auth is imported
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ReportFormScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [licenceImage, setLicenceImage] = useState(null);
  const [insuranceImage, setInsuranceImage] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const handleBackPress = () => {
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    } else {
      Alert.alert("Error", "Navigation prop is not valid.");
    }
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }
      
      const licenceImageUrl = licenceImage ? await uploadImage(licenceImage) : null;
      const insuranceImageUrl = insuranceImage ? await uploadImage(insuranceImage) : null;
  
      await addDoc(collection(firestore, 'Reportuserdetail'), {
        name,
        mobile,
        licenceImage: licenceImageUrl,
        insuranceImage: insuranceImageUrl,
        description,
        userId: user.uid, // Save user ID with the report
        createdAt: new Date(),
      });
  
      Alert.alert("Report Submitted", "Your report has been submitted successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting report: ", error);
      Alert.alert("Error", "Failed to submit the report.");
    }
  };
  
  const uploadImage = async (uri) => {
    if (!uri) {
      return null;
    }

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    setUploading(true);
    setTransferred(0);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          setTransferred(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        (error) => {
          console.error(error);
          setUploading(false);
          reject(null);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            resolve(downloadURL);
          } catch (e) {
            console.error(e);
            setUploading(false);
            reject(null);
          }
        }
      );
    });
  };

  const pickImage = (setImage) => {
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
          setImage(selectedImageUri);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <FeatherIcon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.headerText}>Report</Text>
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { color: 'black' }]}
          placeholder="Mobile Number"
          placeholderTextColor="#999"
          value={mobile}
          onChangeText={setMobile}
        />
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setLicenceImage)}>
          <Text style={styles.imagePickerText}>Upload Licence</Text>
        </TouchableOpacity>
        {licenceImage && <Image source={{ uri: licenceImage }} style={styles.imagePreview} />}
        <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage(setInsuranceImage)}>
          <Text style={styles.imagePickerText}>Upload Insurance</Text>
        </TouchableOpacity>
        {insuranceImage && <Image source={{ uri: insuranceImage }} style={styles.imagePreview} />}
        <TextInput
          style={[styles.input, styles.textArea, { color: 'black' }]}
          placeholder="Description"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        {uploading && (
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>{transferred} % Completed!</Text>
          </View>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    margin: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
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
  textArea: {
    height: 100,
  },
  imagePicker: {
    width: '100%',
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#000',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportFormScreen;
