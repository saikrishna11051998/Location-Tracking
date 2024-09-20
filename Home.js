// App.js
import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import * as Location from "expo-location";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import * as Notifications from "expo-notifications";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA_VsGsGRMcInG-wVtsvcDLjunEkZ_cnsY",
//   databseURL: 'https://test1-21ed7-default-rtdb.firebaseio.com/',
//   authDomain: "test1-21ed7.firebaseapp.com",
//   projectId: "test1-21ed7",
//   storageBucket: "test1-21ed7.appspot.com",
//   messagingSenderId: "1045621112707",
//   appId: "1:1045621112707:web:07768a4e816d34d485c0b6",
//   measurementId: "G-BNH4C0S2BR",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messaging = getMessaging(app);

const App = () => {
  const [userId] = useState("user1"); // Replace with actual user ID
  const [otherUserId] = useState("user2"); // Replace with actual other user ID
  const [location, setLocation] = useState(null);

  // Request location permission
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to use this feature."
      );
      return false;
    }
    return true;
  };

  // Share location
  const shareLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    const currentLocation = await Location.getCurrentPositionAsync({});
    const locationRef = ref(database, `locations/${userId}`);
    await set(locationRef, {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      timestamp: Date.now(),
    });

    // Send notification to the other user
    const recipientToken = "RECIPIENT_DEVICE_FCM_TOKEN"; // Replace with the recipient's FCM token
    const message = "Your friend has shared their location!";
    sendNotification(recipientToken, message);
  };

  // Function to send a notification
  const sendNotification = async (token, message) => {
    await fetch("https://localhost:5000//sendNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, message }),
    });
  };

  // Listen for location updates
  const listenForLocation = () => {
    const locationRef = ref(database, `locations/${otherUserId}`);
    onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLocation(data);
      }
    });
  };

  // Notification setup
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          alert("You will not receive notifications!");
          return;
        }
      }

      const token = await getToken(messaging);
      console.log("FCM Token:", token); // Save this token to send notifications
    };

    registerForPushNotificationsAsync();

    // Handle incoming messages
    const unsubscribe = onMessage(messaging, (remoteMessage) => {
      Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
        },
        trigger: null, // Show immediately
      });
    });

    listenForLocation();

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Share My Location" onPress={shareLocation} />
      {location && (
        <Text style={styles.locationText}>
          Other User's Location:{" "}
          {`Latitude: ${location.latitude}, Longitude: ${location.longitude}`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  locationText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
