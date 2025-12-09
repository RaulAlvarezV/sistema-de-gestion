// ============================================
//  auth.js — Manejo de login, registro y logout
// ============================================

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

import {
  setDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --------------------------------------------------------
// initAuth(onLogin)
// → Ejecuta callback cuando el usuario inicia sesión
// --------------------------------------------------------
export function initAuth(onLogin) {
  const loginForm = document.getElementById("login-form");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");

  // ---------------------------
  // LOGIN
  // ---------------------------
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      loginForm.reset();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error al ingresar', text: err.message });
    }
  });

  // ---------------------------
  // REGISTRO (rol por defecto = empleado)
  // ---------------------------
  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      Swal.fire({ icon: 'warning', title: 'Faltan datos', text: 'Completa email y contraseña para registrar.' });
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "usuarios", userCred.user.uid), {
        email: email,
        rol: "empleado",
        createdAt: Date.now()
      });

      Swal.fire({ icon: 'success', title: 'Registrado', text: 'Usuario registrado. Pedile al admin que asigne el rol si corresponde.' });
      loginForm.reset();

    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error en registro', text: err.message });
    }
  });

  // ---------------------------
  // LOGOUT
  // ---------------------------
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    document.getElementById("app").innerHTML = "";
  });

  // ---------------------------
  // DETECTOR DE SESIÓN
  // ---------------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("🔴 Usuario deslogueado");
      return;
    }

    // Leer perfil del usuario
    const snap = await getDoc(doc(db, "usuarios", user.uid));
    const data = snap.exists() ? snap.data() : { rol: "empleado" };

    console.log("🟢 Usuario logueado:", user.email, "Rol:", data.rol);

    if (typeof onLogin === "function") {
      onLogin({
        email: user.email,
        uid: user.uid,
        rol: data.rol
      });
    }
  });
}
