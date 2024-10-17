import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const MissingListScreen = ({ route, navigation }) => {
  const { name, mobile, licenceImage, insuranceImage, description } = route.params;

  const handleCall = () => {
    Linking.openURL(`tel:${mobile}`);
  };

  const handleChat = () => {
    navigation.navigate('ChatScreen', { name, mobile });
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FeatherIcon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.mobileContainer}>
          <Text style={styles.subtitle}>{mobile}</Text>
          <TouchableOpacity onPress={handleCall} style={styles.callButton}>
            <FeatherIcon name="phone" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.imageContainer}>
          <Text style={styles.imageLabel}>Licence Image:</Text>
          <Image source={{ uri: licenceImage }} style={styles.image} />
        </View>
        <View style={styles.imageContainer}>
          <Text style={styles.imageLabel}>Insurance Image:</Text>
          <Image source={{ uri: insuranceImage }} style={styles.image} />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
        <Text style={styles.chatButtonText}>Chat with {name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60, // To accommodate the back button
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  mobileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  callButton: {
    marginLeft: 10,
    backgroundColor: '#28a745',
    borderRadius: 25,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#444',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chatButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MissingListScreen;
