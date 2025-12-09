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

  // Mostrar saludo y ocultar formulario de login
  const loginSection = document.getElementById("login-section");
  const routerSection = document.getElementById("router-section");
  const userGreeting = document.getElementById("user-greeting");
  const userEmailDisplay = document.getElementById("user-email-display");
  const logoutNav = document.getElementById("logout-btn-nav");

  if (loginSection) loginSection.classList.add("hidden");
  if (routerSection) routerSection.classList.remove("hidden");

  const displayName = data.nombre || user.displayName || user.email;
  if (userGreeting) userGreeting.innerText = `Hola, ${displayName}`;
  if (userEmailDisplay) userEmailDisplay.innerText = user.email;
  if (logoutNav) logoutNav.classList.remove("d-none");

  const roleBadge = document.getElementById("user-role");
  if (roleBadge) roleBadge.innerText = role;

  mostrarBotonesSegunRol(role);
});

// =======================================
// Mostrar botones según permisos
// =======================================
function mostrarBotonesSegunRol(role) {
  const routerSection = document.getElementById("router-section");
  if (routerSection) routerSection.classList.remove("hidden");

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

// Logout global
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  // auth signOut viene desde auth.js que expone initAuth
  try {
    await auth.signOut();
    // Restaurar UI
    document.getElementById("login-section")?.classList.remove("hidden");
    document.getElementById("router-section")?.classList.add("hidden");
    document.getElementById("user-greeting").innerText = "";
    document.getElementById("user-email-display").innerText = "";
    document.getElementById("user-role").innerText = "";
    document.getElementById("logout-btn-nav")?.classList.add("d-none");
    Swal.fire({ icon: 'success', title: 'Sesión cerrada', timer: 900, showConfirmButton: false });
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: err.message });
  }
});
