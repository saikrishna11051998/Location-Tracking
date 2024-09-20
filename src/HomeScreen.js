// screens/HomeScreen.js
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../config";
import { sendPushNotification } from "../notifications";
import * as Notifications from "expo-notifications";
import { getAuth } from "firebase/auth";

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [friendId, setFriendId] = useState(""); // Replace with logic to get actual friend ID

  // Function to share the current user's location
  const shareLocation = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to share your location.");
      return;
    }
    // Request location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to share your location."
      );
      return;
    }
    // Get current location
    const { coords } = await Location.getCurrentPositionAsync({});
    await setDoc(doc(firestore, "locations", auth.currentUser.uid), {
      latitude: coords.latitude,
      longitude: coords.longitude,
      timestamp: new Date().toISOString(),
    });

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);

    const userId = "your-user-id"; // Replace with actual user ID
    await setDoc(doc(firestore, "locations", userId), {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      timestamp: new Date(),
    });

    Alert.alert("Location Shared", "Your location has been shared.");

    const sendNotificationToFirstUser = async () => {
      const firstUserDoc = await getDoc(doc(firestore, "users", "firstUserId")); // Change to actual first user ID
      if (firstUserDoc.exists()) {
        const expoPushToken = firstUserDoc.data().expoPushToken; // Assuming you store the token in Firestore
        const message = {
          to: expoPushToken,
          sound: "default",
          title: "Friend Login Successful",
          body: "Your friend has logged in successfully!",
          data: { someData: "goes here" },
        };
        await fetch("https://exp.host/192.168.111.149:8081/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
      } else {
        console.log("No push token found for the first user.");
      }
    };

    // Send notification to the other user
    const otherUserPushToken = await getOtherUserPushToken();
    await sendPushNotification(
      otherUserPushToken,
      "Live Location",
      "Your friend is sharing their location. Tap to track."
    );
  };

  // Function to fetch the other user's push token from Firebase
  const getOtherUserPushToken = async () => {
    const otherUserId = "other-user-id"; // Replace with actual friend user ID
    const docRef = doc(firestore, "users", otherUserId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().expoPushToken : null;
  };

  // Navigate to the Track Location screen
  const trackLocation = () => {
    navigation.navigate("TrackLocation");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>
      <Button title="Share Location" onPress={shareLocation} />
      <Button title="Track Location" onPress={trackLocation} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
});
