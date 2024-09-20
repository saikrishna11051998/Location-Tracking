// App.js
import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, Alert } from "react-native";
// import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";
import * as Location from "expo-location";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyA_VsGsGRMcInG-wVtsvcDLjunEkZ_cnsY",
//   authDomain: "test1-21ed7.firebaseapp.com",
//   projectId: "test1-21ed7",
//   storageBucket: "test1-21ed7.appspot.com",
//   messagingSenderId: "1045621112707",
//   appId: "1:1045621112707:web:07768a4e816d34d485c0b6",
//   measurementId: "G-BNH4C0S2BR",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

const Push = () => {
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

  useEffect(() => {
    listenForLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Share My Location" onPress={shareLocation} />
      <Button title="Track Other User's Location" onPress={listenForLocation} />
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

export default Push;
