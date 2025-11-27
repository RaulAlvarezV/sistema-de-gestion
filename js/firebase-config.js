  // Import the functions you need from the SDKs you need

  import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';



  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";

  // TODO: Add SDKs for Firebase products that you want to use

  // https://firebase.google.com/docs/web/setup#available-libraries


  // Your web app's Firebase configuration

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = {

    apiKey: "AIzaSyCGuR27DAFhEIvzAlmHNMzwj6pMFy4MTBM",

    authDomain: "sistema-de-gestion-elcafehnos.firebaseapp.com",

    projectId: "sistema-de-gestion-elcafehnos",

    storageBucket: "sistema-de-gestion-elcafehnos.firebasestorage.app",

    messagingSenderId: "442068615346",

    appId: "1:442068615346:web:eefe5efc27ae159f90c9ab",

    measurementId: "G-DS5R2RC2JM"

  };


  // Initialize Firebase

  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);
