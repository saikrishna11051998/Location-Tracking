<<<<<<< HEAD
// import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

  export const firebaseConfig = {
    
    apiKey: "AIzaSyA_VsGsGRMcInG-wVtsvcDLjunEkZ_cnsY",
    authDomain: "test1-21ed7.firebaseapp.com",
    databaseURL: 'https://test1-21ed7-default-rtdb.firebaseio.com/',
    projectId: "test1-21ed7",
    storageBucket: "test1-21ed7.appspot.com",
    messagingSenderId: "1045621112707",
    appId: "1:1045621112707:web:07768a4e816d34d485c0b6",
    measurementId: "G-BNH4C0S2BR"
};

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);
=======
// import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

  export const firebaseConfig = {
    
    apiKey: "AIzaSyA_VsGsGRMcInG-wVtsvcDLjunEkZ_cnsY",
    authDomain: "test1-21ed7.firebaseapp.com",
    databaseURL: 'https://test1-21ed7-default-rtdb.firebaseio.com/',
    projectId: "test1-21ed7",
    storageBucket: "test1-21ed7.appspot.com",
    messagingSenderId: "1045621112707",
    appId: "1:1045621112707:web:07768a4e816d34d485c0b6",
    measurementId: "G-BNH4C0S2BR"
};

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);
>>>>>>> 88b3506444cc359d23327441f827fa1a376f15ac
export { firestore };