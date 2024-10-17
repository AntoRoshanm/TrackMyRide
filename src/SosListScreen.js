import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './Firebase'; // Assuming your Firebase setup is in a file named Firebase.js

const SosListScreen = () => {
  const [sosAlerts, setSosAlerts] = useState([]);

  useEffect(() => {
    const fetchSosAlerts = async () => {
      try {
        const sosAlertCollection = collection(firestore, 'sos_alert');
        const sosAlertSnapshot = await getDocs(sosAlertCollection);
        const sosAlertList = sosAlertSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSosAlerts(sosAlertList);
      } catch (error) {
        console.error("Error fetching SOS alerts: ", error);
      }
    };

    fetchSosAlerts();
  }, []);

  const renderSosAlert = ({ item }) => {
    const openGoogleMaps = () => {
      const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={openGoogleMaps}
      >
        <Image
          source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.location}>Latitude: {item.latitude}</Text>
          <Text style={styles.location}>Longitude: {item.longitude}</Text>
          <Text style={styles.timestamp}>{new Date(item.timestamp?.seconds * 1000).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sosAlerts}
        renderItem={renderSosAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#555',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});

export default SosListScreen;
