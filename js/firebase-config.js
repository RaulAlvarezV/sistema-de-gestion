// Firebase v12 - Config + Servicios

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --- CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyCGuR27DAFhEIvzAlmHNMzwj6pMFy4MTBM",
  authDomain: "sistema-de-gestion-elcafehnos.firebaseapp.com",
  projectId: "sistema-de-gestion-elcafehnos",
  storageBucket: "sistema-de-gestion-elcafehnos.firebasestorage.app",
  messagingSenderId: "442068615346",
  appId: "1:442068615346:web:eefe5efc27ae159f90c9ab",
  measurementId: "G-DS5R2RC2JM"
};

// Init app
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
