import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, firestore } from './Firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import MainPage from './MainPage';
import PoliceLoginScreen from "./PoliceLoginScreen";
import PoliceRegisterScreen from "./PoliceRegisterScreen";
import PoliceMainPage from './PoliceMainPage';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import ReportFormScreen from "./ReportFormScreen";
import ReportMarkScreen from './ReportMarkScreen';
import ReportDetailScreen from './ReportDetailScreen';
import SosButoon from './SosButoon';
import MissingListScreen from './MissingListScreen';
import ChatScreen from './ChatScreen';
import UserChatScreen from './UserChatScreen';
import SosListScreen from "./SosListScreen";
import MapScreen from './MapScreen';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Determine the correct document path based on the role
        const userDocRef = doc(firestore, 'police', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role); // Set the user role
        } else {
          console.error("No such document!");
          setRole('user'); // Default role if no document found in police collection
        }
      } else {
        setRole(null);
      }
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          role === 'police' ? (
            <>
              <Stack.Screen name="PoliceMainPage" component={PoliceMainPage} options={{ headerShown: false }} /> 
              <Stack.Screen name="MissingListScreen" component={MissingListScreen} options={{ headerShown: false }} /> 
              <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SosListScreen" component={SosListScreen} options={{ headerShown: false }} />
              <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
            </>
          ) : (
            <>
              <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
              <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ReportFormScreen" component={ReportFormScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ReportMarkScreen" component={ReportMarkScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ReportDetailScreen" component={ReportDetailScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SosButoon" component={SosButoon} options={{ headerShown: false }} />
              <Stack.Screen name="UserChatScreen" component={UserChatScreen} options={{ headerShown: false }} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PoliceLoginScreen" component={PoliceLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PoliceRegisterScreen" component={PoliceRegisterScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
