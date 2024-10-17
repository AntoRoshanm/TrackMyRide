import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth, firestore } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';
import FeatherIcon from 'react-native-vector-icons/Feather';

const PoliceMainPage = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [password, setPassword] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCredentials = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedPassword = await AsyncStorage.getItem('password');
      setUserId(storedUserId);
      setPassword(storedPassword);
    };

    loadCredentials();
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'Reportuserdetail'));
      const reportsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports: ", error);
      Alert.alert("Error", "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('password');
      await signOut(auth);
      navigation.replace('PoliceLoginScreen');
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const renderItem = (item) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.card} 
      onPress={() => navigation.navigate('MissingListScreen', item)}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>{item.mobile}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Police Main Page</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          reports.map(renderItem)
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('MissingListScreen')}>
          <Text style={styles.bottomButtonText}>Missing List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('SosListScreen')}>
          <Text style={styles.bottomButtonText}>SOS List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FeatherIcon name="log-out" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  cardSubtitle: {
    fontSize: 16,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default PoliceMainPage;
