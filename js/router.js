// ======================================================
//  ROUTER.JS — CONTROLADOR PRINCIPAL DE MÓDULOS
// ======================================================

import {
  pedidoTemplate,
  stockTemplate,
  cobranzaTemplate,
  gestionTemplate,
  clientesTemplate,

  initPedido,
  initStock,
  initCobranza,
  initGestion,
  initClientes
} from "./modules.js";


// ======================================================
//  CARGA DE MÓDULOS SEGÚN SELECCIÓN
//  Siempre recibe (name, role)
// ======================================================

export async function loadModule(name, role) {
  const app = document.getElementById("app");

  if (!app) {
    console.error("❌ No se encontró el elemento #app");
    return;
  }

  console.log("📌 loadModule:", name, " — rol:", role);
  window.currentUserRole = role; // para que modules.js lo use si lo necesita

  // ---------------------------
  // CLIENTES
  // ---------------------------
  if (name === "clientes") {
    app.innerHTML = clientesTemplate();
    await initClientes(role);
    return;
  }

  // ---------------------------
  // PEDIDO
  // ---------------------------
  if (name === "pedido") {
    app.innerHTML = pedidoTemplate();
    await initPedido(role);
    return;
  }

  // ---------------------------
  // STOCK
  // ---------------------------
  if (name === "stock") {
    app.innerHTML = stockTemplate();
    await initStock(role);
    return;
  }

  // ---------------------------
  // COBRANZA
  // ---------------------------
  if (name === "cobranza") {
    app.innerHTML = cobranzaTemplate();
    await initCobranza(role);
    return;
  }

  // ---------------------------
  // GESTIÓN
  // ---------------------------
  if (name === "gestion") {
    app.innerHTML = gestionTemplate();
    await initGestion(role);
    return;
  }

  // ---------------------------
  // ERROR
  // ---------------------------
  app.innerHTML = `
    <div class="alert alert-danger">
      Módulo no encontrado: <strong>${name}</strong>
    </div>
  `;
}
