import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Geolocation from '@react-native-community/geolocation';
import { collection, addDoc } from 'firebase/firestore';
import { auth, firestore } from './Firebase'; 

const SosButtonScreen = ({ navigation }) => {
  const [seconds, setSeconds] = useState(5);
  let timer;

  useEffect(() => {
    timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 1) {
          clearInterval(timer);
          sendLocation();
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const user = auth.currentUser;

        if (user) {
          const sosAlertRef = collection(firestore, 'sos_alert');

          try {
            await addDoc(sosAlertRef, {
              userName: user.displayName || 'Anonymous', // Store the user's name or 'Anonymous' if not available
              latitude,
              longitude,
              timestamp: new Date(),
            });
            Alert.alert('Location Sent', 'Your location has been stored in Firebase.');
          } catch (error) {
            console.error('Error saving SOS alert:', error);
          }
        }
        navigation.goBack();
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Could not get location.');
        navigation.goBack();
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleCancel = () => {
    clearInterval(timer);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
        <FeatherIcon name="x" size={30} color="#fff" />
      </TouchableOpacity>
      <View style={styles.circle}>
        <Text style={styles.timerText}>{seconds}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default SosButtonScreen;
