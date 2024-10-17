import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';

const ReportDetailScreen = ({ route }) => {
  const { report } = route.params;

  console.log('Report Details:', report); // Log the report details

  const handleImageError = (error) => {
    console.log('Image Load Error:', error.nativeEvent.error);
    Alert.alert('Error', 'Failed to load image.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>{report.name}</Text>
      <Text style={styles.subHeaderText}>{report.mobile}</Text>
      {report.licenceImage ? (
        <Image
          source={{ uri: report.licenceImage }}
          style={styles.image}
          onError={handleImageError}
        />
      ) : (
        <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
      )}
      {report.insuranceImage ? (
        <Image
          source={{ uri: report.insuranceImage }}
          style={styles.image}
          onError={handleImageError}
        />
      ) : (
        <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
      )}
      <Text style={styles.descriptionText}>{report.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  subHeaderText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'gray',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  descriptionText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ReportDetailScreen;
