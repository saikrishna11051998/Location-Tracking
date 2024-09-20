// screens/SuccessScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const SuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.successText}>Login Successful!</Text>
      <TouchableOpacity
        style={styles.addFriendButton}
        onPress={() => navigation.navigate("Friend")}
      >
        <Text style={styles.buttonText}>Go to Add Friend</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  successText: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  addFriendButton: {
    padding: 15,
    backgroundColor: "#3498db",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SuccessScreen;
