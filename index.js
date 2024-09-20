import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// import { firebaseConfig, auth, firestore } from '../config';
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendPushNotification } from "../notifications";

import { firebaseConfig } from "../config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const Otp = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [friendPhoneNumber, setFriendPhoneNumber] = useState("");
  const recaptchaVerifier = useRef(null);

  const sendVerification = () => {
    const phoneProvider = new PhoneAuthProvider(auth);

    phoneProvider
      .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
      .then(setVerificationId)
      .catch((error) => {
        Alert.alert("Error", error.message);
      });

    setPhoneNumber("");
  };

  const confirmCode = async () => {
    if (!verificationId) {
      Alert.alert("Error", "Verification ID is not set.");
      return;
    }

    const credential = PhoneAuthProvider.credential(verificationId, code);

    try {
      await signInWithCredential(auth, credential);
      setCode("");
      Alert.alert("Login Successful", "Welcome to Dashboard");
      await requestLocationPermission();
      // navigation.navigate('Home');// Request location permission after successful login
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant location permission to use this feature."
      );
      return;
    }

    Alert.alert("Permission Granted", "Location permission granted.");
  };

  const updateLocation = async () => {
    if (auth.currentUser) {
      const { coords } = await Location.getCurrentPositionAsync({});
      await setDoc(doc(firestore, "locations", auth.currentUser.uid), {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const addFriend = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to add a friend.");
      return;
    }

    try {
      await setDoc(doc(firestore, "friends", auth.currentUser.uid), {
        phoneNumber: friendPhoneNumber,
        userId: auth.currentUser.uid,
      });
      setFriendPhoneNumber("");
      Alert.alert("Success", "Friend added successfully!");
      // Assuming that we are navigating to the Home page after adding the friend
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <Text style={styles.otpText}>Login using OTP</Text>
      <TextInput
        placeholder="Phone Number with country code"
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        autoCompleteType="tel"
        style={styles.textInput}
        value={phoneNumber}
      />
      <TouchableOpacity
        style={styles.sendVerification}
        onPress={sendVerification}
      >
        <Text style={styles.buttonText}>Send verification</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Confirm code"
        onChangeText={setCode}
        keyboardType="number-pad"
        style={styles.textInput}
        value={code}
      />
      <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
        <Text style={styles.buttonText}>Confirm verification</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Friend\ s Phone Number"
        onChangeText={setFriendPhoneNumber}
        keyboardType="phone-pad"
        autoCompleteType="tel"
        style={styles.textInput}
        value={friendPhoneNumber}
      />
      <TouchableOpacity style={styles.addFriend} onPress={addFriend}>
        <Text style={styles.buttonText}>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
  },

  textInput: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  sendVerification: {
    padding: 15,
    backgroundColor: "#3498db",
    borderRadius: 10,
    marginBottom: 10,
  },
  sendCode: {
    padding: 15,
    backgroundColor: "#9b59b6",
    borderRadius: 10,
    marginBottom: 10,
  },
  addFriend: {
    padding: 15,
    backgroundColor: "#2ecc71",
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    margin: 20,
  },
});
