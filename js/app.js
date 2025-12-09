// =======================================
// app.js — VERSIÓN CORREGIDA
// =======================================

import { auth, db } from "./firebase-config.js";   // Firestore YA inicializado
import { initAuth } from "./auth.js";
import { loadModule } from "./router.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// =======================================
// Inicio del sistema de autenticación
// =======================================
initAuth(async (user) => {
  if (!user) return;

  // Traer rol desde Firestore
  const snap = await getDoc(doc(db, "usuarios", user.uid));
  const data = snap.data() || {};
  const role = data.rol || "empleado";

  window.currentUserEmail = user.email;
  window.currentUserRole = role;

  document.getElementById("user-email").innerText = user.email;
  document.getElementById("user-role").innerText = "Rol: " + role;

  mostrarBotonesSegunRol(role);
});

// =======================================
// Mostrar botones según permisos
// =======================================
function mostrarBotonesSegunRol(role) {

  const routerSection = document.getElementById("router-section");
  routerSection.classList.remove("hidden");

  const modClientes = document.getElementById("clientes-btn");
  const modPedidos = document.getElementById("pedido-btn");
  const modStock = document.getElementById("stock-btn");
  const modCobranza = document.getElementById("cobranza-btn");
  const modGestion = document.getElementById("gestion-btn");

  // Todos pueden ver Clientes y Pedidos
  modClientes.classList.remove("hidden");
  modPedidos.classList.remove("hidden");

  // Vendedor NO ve stock
  if (role === "admin") {
    modStock.classList.remove("hidden");
    modGestion.classList.remove("hidden");
  }

  // Cobranzas: admin + vendedor
  modCobranza.classList.remove("hidden");

  // Navegación entre módulos
  document.querySelectorAll("[data-module]").forEach(btn => {
    btn.onclick = () => loadModule(btn.dataset.module, role);
  });
}
