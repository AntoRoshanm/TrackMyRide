import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import getStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDEnfmojUE1beII6RH8P6wyqn-79kRVEaA',
  authDomain: 'trackmyride-3eab5.firebaseapp.com',
  projectId: 'trackmyride-3eab5',
  storageBucket: 'trackmyride-3eab5.appspot.com',
  messagingSenderId: '1052476206650',
  appId: '1:1052476206650:web:89f9a996b7461f3616cf03'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app); // Add this line
