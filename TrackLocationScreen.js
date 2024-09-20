// screens/TrackLocationScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { firebaseConfig } from "../config";
import MapView, { Marker } from "react-native-maps";
import { initializeApp } from "firebase/app";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const TrackLocationScreen = () => {
  const [friendLocation, setFriendLocation] = useState(null);

  // Listen to the friend's live location updates from Firebase
  useEffect(() => {
    const friendId = "other-user-id";
    const docRef = doc(firestore, "locations", friendId);
    // Replace with actual friend user ID
    const unsubscribe = onSnapshot(
      doc(firestore, "locations", friendId),
      (doc) => {
        if (doc.exists()) {
          setFriendLocation(doc.data());
        } else {
          Alert.alert("Error", "No location data available.");
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {friendLocation ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: friendLocation.latitude,
            longitude: friendLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: friendLocation.latitude,
              longitude: friendLocation.longitude,
            }}
            title="Friend's Location"
            description="Live location of your friend"
          />
        </MapView>
      ) : (
        <Text style={styles.text}>Fetching friend's location...</Text>
      )}
    </View>
  );
};

export default TrackLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    margin: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
