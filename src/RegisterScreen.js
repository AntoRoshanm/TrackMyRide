import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from './Firebase'; // Adjust the path as necessary
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a unique ID for the user
      const userId = user.uid;

      // Store additional user information and roles in Firestore
      await setDoc(doc(firestore, 'users', userId), {
        uid: userId,
        username: username,
        email: email,
        mobile: mobile,
        role: 'user' // Set the role, e.g., 'user', 'admin', etc.
      });

      Alert.alert("Registration Successful", `Welcome, ${username}`);
      navigation.navigate('MainPage');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert(
          "Registration Failed",
          "The email address is already in use. Do you want to log in instead?",
          [
            { text: "Cancel" },
            { text: "Log In", onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        Alert.alert("Registration Failed", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <FeatherIcon name="arrow-left" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerText}>
        Hello! Register to get started
      </Text>
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
      <TextInput
        style={[styles.input, { color: 'black' }]}
        placeholder="Confirm password"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TextInput
        style={[styles.input, { color: 'black' }]}
        placeholder="Mobile Number"
        placeholderTextColor="#999"
        value={mobile}
        onChangeText={setMobile}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.spacer} />
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginNowText}>Login Now</Text>
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
  },
  backButton: {
    marginBottom: 20,
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
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    flex: 1,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
  loginNowText: {
    fontSize: 14,
    color: '#57ccca',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
