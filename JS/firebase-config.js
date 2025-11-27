// firebase-config.js

import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";

import { getAuth } 
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import { getFirestore }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Tu config
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "TU_SENDER",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
