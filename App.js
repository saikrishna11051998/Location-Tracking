// import React from 'react';
// import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
// import * as Permissions from 'expo-permissions';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from "react-native";
import Otp from "./src";
import SuccessScreen from "./src/SuccessScreen";
import HomeScreen from "./src/HomeScreen";
import TrackLocationScreen from "./src/TrackLocationScreen";
import Push from "./src/Push";
// import Home from './src/Home';
// import { registerForPushNotificationsAsync } from './notifications';
// Ensure you export your main App component properly
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Set up notification handler
Notifications.addNotificationResponseReceivedListener((response) => {
  const { data } = response.notification.request.content;
  if (data && data.someData === "goes here") {
    // Navigate to the TrackLocationScreen
    navigation.navigate("TrackLocation");
  }
});

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Otp">
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TrackLocation" component={TrackLocationScreen} />
        <Stack.Screen name="Push" component={Push} />
        {/* <Stack.Screen name="Home" component={Home}/>  */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
