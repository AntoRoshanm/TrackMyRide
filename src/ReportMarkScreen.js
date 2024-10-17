import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { firestore, auth } from './Firebase'; // Adjust the path as necessary
import defaultProfileImage from './assests/avatar.jpg';
import FeatherIcon from 'react-native-vector-icons/Feather'; // Import the icon library

const ReportMarkScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(firestore, 'Reportuserdetail'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const reportsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('Fetched reports:', reportsData); // Log fetched data
          setReports(reportsData);
        }
      } catch (error) {
        console.error("Error fetching reports: ", error);
        Alert.alert("Error", "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleCardPress = (report) => {
    navigation.navigate('ReportDetailScreen', { report });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'Reportuserdetail', id));
      setReports((prevReports) => prevReports.filter(report => report.id !== id));
      Alert.alert("Success", "Report deleted successfully.");
    } catch (error) {
      console.error("Error deleting report: ", error);
      Alert.alert("Error", "Failed to delete the report.");
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDelete(id) },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.cardContent}>
              <Image source={{ uri: item.profileImage || Image.resolveAssetSource(defaultProfileImage).uri }} style={styles.profileImage} />
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.mobile}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeIcon} onPress={() => confirmDelete(item.id)}>
              <FeatherIcon name="x" size={24} color="#ff0000" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No reports found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure the close icon is on the far right
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Ensure the content takes up as much space as possible
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
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
  closeIcon: {
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});

export default ReportMarkScreen;
