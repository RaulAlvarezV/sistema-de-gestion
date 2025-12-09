// ============================================
// firebase-config.js — Inicialización Firebase
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --------------------------------------------
// CONFIGURACIÓN REAL — (DE TU PROYECTO)
// --------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCGuR27DAFhEIvzAlmHNMzwj6pMFy4MTBM",
  authDomain: "sistema-de-gestion-elcafehnos.firebaseapp.com",
  projectId: "sistema-de-gestion-elcafehnos",
  storageBucket: "sistema-de-gestion-elcafehnos.appspot.com",
  messagingSenderId: "442068615346",
  appId: "1:442068615346:web:eefe5efc27ae159f90c9ab",
  measurementId: "G-DS5R2RC2JM"
};

// --------------------------------------------
// INICIALIZAR APP + SERVICIOS
// --------------------------------------------
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// --------------------------------------------
// Mensaje util para depurar
// --------------------------------------------
console.log("🔥 Firebase inicializado correctamente");
