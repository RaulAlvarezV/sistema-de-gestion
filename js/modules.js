// ============================================================
// modules.js - CRUD COMPLETO CON FIRESTORE
// ============================================================
// Módulos: Clientes, Pedidos, Stock, Cobranzas, Gestión
// Integración total con Firestore y validación

import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ============================================================
// HELPER: ALMACENAMIENTO LOCAL PARA CARRITO
// ============================================================
const CART_KEY = "app_carrito_temp";

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

// ============================================================
// TEMPLATES HTML
// ============================================================

export function clientesTemplate() {
  return `
    <div class="module-container">
      <h3>👥 Gestión de Clientes</h3>
      
      <form id="cliente-form" class="form-module">
        <div class="row g-3">
          <div class="col-md-4">
            <input id="cliente-nombre" class="form-control" placeholder="Nombre o Razón Social" required>
          </div>
          <div class="col-md-4">
            <input id="cliente-email" type="email" class="form-control" placeholder="Email">
          </div>
          <div class="col-md-2">
            <input id="cliente-telefono" type="tel" class="form-control" placeholder="Teléfono">
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-success w-100">
              <i class="fas fa-plus"></i> Agregar
            </button>
          </div>
        </div>
        <div class="row g-3 mt-2">
          <div class="col-md-6">
            <input id="cliente-direccion" class="form-control" placeholder="Dirección">
          </div>
          <div class="col-md-3">
            <input id="cliente-dni" class="form-control" placeholder="DNI/RUT">
          </div>
          <div class="col-md-3">
            <input id="cliente-ciudad" class="form-control" placeholder="Ciudad">
          </div>
        </div>
      </form>

      <div class="mt-4">
        <input id="buscar-cliente" class="form-control mb-3" placeholder="🔍 Buscar clientes...">
        <div id="clientes-tabla"></div>
      </div>
    </div>
  `;
}

export function pedidoTemplate() {
  return `
    <div class="module-container">
      <h3>🛒 Crear Pedido</h3>
      
      <form id="pedido-form" class="form-module">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Cliente *</label>
            <select id="select-cliente" class="form-select" required>
              <option value="">-- Seleccionar cliente --</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Producto *</label>
            <select id="select-producto" class="form-select" required>
              <option value="">-- Seleccionar --</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Cantidad *</label>
            <input id="input-cantidad" type="number" min="1" class="form-control" required>
          </div>
          <div class="col-md-1 d-flex align-items-end">
            <button type="button" id="btn-agregar-item" class="btn btn-outline-primary w-100">
              <i class="fas fa-check"></i>
            </button>
          </div>
        </div>
      </form>

      <div class="mt-4">
        <h5>📋 Carrito de Compra</h5>
        <div id="carrito-items"></div>
        <div id="carrito-resumen" class="alert alert-info mt-3 d-none">
          <strong>Total: $<span id="carrito-total">0</span></strong>
        </div>
        <div class="d-flex gap-2 mt-3">
          <button id="btn-limpiar-carrito" class="btn btn-outline-danger">
            <i class="fas fa-trash"></i> Limpiar
          </button>
          <button id="btn-guardar-pedido" class="btn btn-success">
            <i class="fas fa-save"></i> Guardar Pedido
          </button>
          <button id="btn-generar-remito" class="btn btn-secondary">
            <i class="fas fa-file-pdf"></i> Remito PDF
          </button>
        </div>
      </div>

      <div class="mt-4">
        <h5>📦 Últimos Pedidos</h5>
        <div id="pedidos-lista"></div>
      </div>
    </div>
  `;
}

export function stockTemplate() {
  return `
    <div class="module-container">
      <h3>📦 Gestión de Stock</h3>
      
      <form id="stock-form" class="form-module">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Producto *</label>
            <select id="stock-producto" class="form-select" required>
              <option value="">-- Seleccionar producto --</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Cantidad *</label>
            <input id="stock-cantidad" type="number" min="0" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Ubicación</label>
            <input id="stock-ubicacion" class="form-control" placeholder="Ej: Estante A1">
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button type="submit" class="btn btn-success w-100">
              <i class="fas fa-check"></i> Actualizar Stock
            </button>
          </div>
        </div>
      </form>

      <div class="mt-4">
        <h5>📊 Stock Disponible</h5>
        <div id="stock-lista"></div>
      </div>
    </div>
  `;
}

export function cobranzaTemplate() {
  return `
    <div class="module-container">
      <h3>💰 Cobranzas</h3>
      
      <form id="cobranza-form" class="form-module">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Pedido *</label>
            <select id="select-pedido" class="form-select" required>
              <option value="">-- Seleccionar pedido --</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Monto *</label>
            <input id="pago-monto" type="number" min="0.01" step="0.01" class="form-control" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Método *</label>
            <select id="pago-metodo" class="form-select" required>
              <option value="">-- Seleccionar --</option>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button type="submit" class="btn btn-success w-100">
              <i class="fas fa-money-bill-wave"></i> Registrar Pago
            </button>
          </div>
        </div>
      </form>

      <div class="mt-4">
        <h5>📋 Detalles del Pedido</h5>
        <div id="cobranza-detalle" class="alert alert-info d-none"></div>
      </div>

      <div class="mt-4">
        <h5>💳 Historial de Pagos</h5>
        <div id="pagos-lista"></div>
      </div>
    </div>
  `;
}

export function gestionTemplate() {
  return `
    <div class="module-container">
      <h3>⚙️ Gestión del Sistema</h3>
      
      <div class="row g-3 mt-3">
        <div class="col-md-4">
          <div class="card p-4 text-center">
            <h5>📊 Estadísticas</h5>
            <p class="text-muted">Total de clientes: <strong id="stat-clientes">0</strong></p>
            <p class="text-muted">Total de pedidos: <strong id="stat-pedidos">0</strong></p>
            <p class="text-muted">Total recaudado: $<strong id="stat-recaudacion">0</strong></p>
            <button class="btn btn-sm btn-primary" id="btn-recargar-stats">🔄 Recargar</button>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card p-4 text-center">
            <h5>⚠️ Alertas</h5>
            <div id="alertas-list">
              <p class="text-muted">Cargando alertas...</p>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card p-4 text-center">
            <h5>🛠️ Utilidades</h5>
            <button class="btn btn-sm btn-secondary w-100 mb-2" id="btn-export-clientes">
              <i class="fas fa-download"></i> Exportar Clientes (CSV)
            </button>
            <button class="btn btn-sm btn-secondary w-100 mb-2" id="btn-export-pedidos">
              <i class="fas fa-download"></i> Exportar Pedidos (CSV)
            </button>
            <button class="btn btn-sm btn-secondary w-100" id="btn-limpiar-cache">
              <i class="fas fa-trash"></i> Limpiar Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// INICIALIZADORES
// ============================================================

export async function initClientes(role) {
  const form = document.getElementById("cliente-form");
  const searchInput = document.getElementById("buscar-cliente");
  const tabla = document.getElementById("clientes-tabla");

  if (!form) return;

  // Crear nuevo cliente
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("cliente-nombre")?.value?.trim();
    const email = document.getElementById("cliente-email")?.value?.trim();
    const telefono = document.getElementById("cliente-telefono")?.value?.trim();
    const direccion = document.getElementById("cliente-direccion")?.value?.trim();
    const dni = document.getElementById("cliente-dni")?.value?.trim();
    const ciudad = document.getElementById("cliente-ciudad")?.value?.trim();

    if (!nombre || nombre.length < 3) {
      return Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "El nombre debe tener al menos 3 caracteres",
      });
    }

    try {
      await addDoc(collection(db, "clientes"), {
        nombre,
        email,
        telefono,
        direccion,
        dni,
        ciudad,
        activo: true,
        createdAt: Date.now(),
      });

      Swal.fire({
        icon: "success",
        title: "Cliente creado",
        text: `${nombre} ha sido agregado`,
        timer: 1500,
        showConfirmButton: false,
      });

      form.reset();
      renderClientes();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    }
  });

  // Búsqueda
  searchInput?.addEventListener("input", renderClientes);

  renderClientes();
}

async function renderClientes() {
  const tabla = document.getElementById("clientes-tabla");
  const searchTerm = document.getElementById("buscar-cliente")?.value?.toLowerCase() || "";

  if (!tabla) return;

  try {
    const snapshot = await getDocs(collection(db, "clientes"));
    const clientes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    const filtered = clientes.filter(
      (c) =>
        c.nombre?.toLowerCase().includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm) ||
        c.telefono?.includes(searchTerm)
    );

    if (filtered.length === 0) {
      tabla.innerHTML = '<div class="alert alert-secondary">No hay clientes</div>';
      return;
    }

    let html = `
      <table class="table table-hover">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>DNI</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
    `;

    filtered.forEach((c) => {
      html += `
        <tr>
          <td>${c.nombre}</td>
          <td>${c.email || "-"}</td>
          <td>${c.telefono || "-"}</td>
          <td>${c.direccion || "-"}</td>
          <td>${c.dni || "-"}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editarCliente('${c.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarCliente('${c.id}', '${c.nombre}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    tabla.innerHTML = html;

    // Guardar clientes globales para usar en otros módulos
    window.clientesGlobales = clientes;
  } catch (err) {
    tabla.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
  }
}

window.editarCliente = async (clienteId) => {
  const docSnap = await getDoc(doc(db, "clientes", clienteId));
  if (!docSnap.exists()) {
    Swal.fire({ icon: "error", title: "Cliente no encontrado" });
    return;
  }

  const datos = docSnap.data();
  const { value: nombre } = await Swal.fire({
    title: "Editar nombre",
    input: "text",
    inputValue: datos.nombre,
    showCancelButton: true,
  });

  if (nombre && nombre.length >= 3) {
    try {
      await updateDoc(doc(db, "clientes", clienteId), {
        nombre,
        updatedAt: Date.now(),
      });
      Swal.fire({
        icon: "success",
        title: "Actualizado",
        text: "Cliente actualizado",
        timer: 1000,
        showConfirmButton: false,
      });
      renderClientes();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  }
};

window.eliminarCliente = async (clienteId, nombre) => {
  const { isConfirmed } = await Swal.fire({
    title: "¿Eliminar cliente?",
    text: `¿Estás seguro de que quieres eliminar a ${nombre}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
  });

  if (isConfirmed) {
    try {
      await deleteDoc(doc(db, "clientes", clienteId));
      Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "Cliente eliminado",
        timer: 1000,
        showConfirmButton: false,
      });
      renderClientes();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  }
};

export async function initPedido(role) {
  const form = document.getElementById("pedido-form");
  const btnAgregar = document.getElementById("btn-agregar-item");
  const btnLimpiar = document.getElementById("btn-limpiar-carrito");
  const btnGuardar = document.getElementById("btn-guardar-pedido");
  const btnRemito = document.getElementById("btn-generar-remito");

  if (!form) return;

  // Cargar clientes y productos en selects
  await cargarClientesEnSelect();
  await cargarProductosEnSelect();

  // Agregar item al carrito
  btnAgregar?.addEventListener("click", async (e) => {
    e.preventDefault();
    const productoId = document.getElementById("select-producto")?.value;
    const cantidad = parseInt(document.getElementById("input-cantidad")?.value || 0);

    if (!productoId || cantidad <= 0) {
      return Swal.fire({ icon: "warning", title: "Datos incompletos" });
    }

    try {
      const prodSnap = await getDoc(doc(db, "productos", productoId));
      if (!prodSnap.exists()) {
        return Swal.fire({ icon: "error", title: "Producto no encontrado" });
      }

      const producto = { id: productoId, ...prodSnap.data() };
      const cart = getCart();
      const existente = cart.find((i) => i.id === productoId);

      if (existente) {
        existente.cantidad += cantidad;
      } else {
        cart.push({ ...producto, cantidad });
      }

      saveCart(cart);
      renderCarrito();
      document.getElementById("input-cantidad").value = 1;
      document.getElementById("select-producto").value = "";

      Swal.fire({
        icon: "success",
        title: "Agregado",
        text: `${producto.nombre} agregado al carrito`,
        timer: 800,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  });

  // Limpiar carrito
  btnLimpiar?.addEventListener("click", () => {
    clearCart();
    renderCarrito();
    Swal.fire({
      icon: "info",
      title: "Carrito limpiado",
      timer: 1000,
      showConfirmButton: false,
    });
  });

  // Guardar pedido
  btnGuardar?.addEventListener("click", async () => {
    const clienteId = document.getElementById("select-cliente")?.value;
    const cart = getCart();

    if (!clienteId || cart.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Selecciona cliente y agrega items",
      });
    }

    try {
      const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

      const pedidoRef = await addDoc(collection(db, "pedidos"), {
        clienteId,
        estado: "pendiente",
        items: cart,
        total,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      Swal.fire({
        icon: "success",
        title: "Pedido guardado",
        text: `Pedido creado: ${pedidoRef.id}`,
        timer: 1500,
        showConfirmButton: false,
      });

      clearCart();
      renderCarrito();
      renderPedidos();
      form.reset();
      await cargarClientesEnSelect();
      await cargarProductosEnSelect();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  });

  // Generar remito PDF
  btnRemito?.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
      return Swal.fire({ icon: "warning", title: "Carrito vacío" });
    }
    generarRemitoPDF(cart);
  });

  renderCarrito();
  renderPedidos();
}

async function cargarClientesEnSelect() {
  const select = document.getElementById("select-cliente");
  if (!select) return;

  try {
    const snapshot = await getDocs(collection(db, "clientes"));
    select.innerHTML = '<option value="">-- Seleccionar cliente --</option>';

    snapshot.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = doc.data().nombre;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando clientes:", err);
  }
}

async function cargarProductosEnSelect() {
  const select = document.getElementById("select-producto");
  if (!select) return;

  try {
    const snapshot = await getDocs(collection(db, "productos"));
    select.innerHTML = '<option value="">-- Seleccionar producto --</option>';

    snapshot.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = `${doc.data().nombre} ($${doc.data().precio})`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
}

function renderCarrito() {
  const container = document.getElementById("carrito-items");
  const resumen = document.getElementById("carrito-resumen");
  const cart = getCart();

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div class="alert alert-secondary">Carrito vacío</div>';
    resumen?.classList.add("d-none");
    return;
  }

  resumen?.classList.remove("d-none");

  let html = '<table class="table table-sm"><thead class="table-light"><tr><th>Producto</th><th>Precio</th><th>Cant</th><th>Subtotal</th><th></th></tr></thead><tbody>';
  let total = 0;

  cart.forEach((item, idx) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `
      <tr>
        <td>${item.nombre}</td>
        <td>$${item.precio}</td>
        <td><input type="number" min="1" value="${item.cantidad}" class="form-control form-control-sm" style="width:60px" onchange="actualizarCantidadCarrito(${idx}, this.value)"></td>
        <td>$${subtotal}</td>
        <td><button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${idx})"><i class="fas fa-trash"></i></button></td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;
  document.getElementById("carrito-total").textContent = total.toFixed(2);
}

window.actualizarCantidadCarrito = (idx, nuevaCantidad) => {
  const cart = getCart();
  const cantidad = parseInt(nuevaCantidad);
  if (cantidad > 0) {
    cart[idx].cantidad = cantidad;
    saveCart(cart);
    renderCarrito();
  }
};

window.eliminarDelCarrito = (idx) => {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  renderCarrito();
};

async function renderPedidos() {
  const container = document.getElementById("pedidos-lista");
  if (!container) return;

  try {
    const snapshot = await getDocs(
      query(collection(db, "pedidos"), orderBy("createdAt", "desc"), limit(5))
    );

    if (snapshot.empty) {
      container.innerHTML = '<div class="alert alert-secondary">Sin pedidos</div>';
      return;
    }

    let html = '<table class="table table-sm"><thead class="table-light"><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>';

    for (const pedidoDoc of snapshot.docs) {
      const pedido = pedidoDoc.data();
      const clienteSnap = await getDoc(doc(db, "clientes", pedido.clienteId));
      const clienteNombre = clienteSnap.exists() ? clienteSnap.data().nombre : "Desconocido";
      const fecha = new Date(pedido.createdAt).toLocaleDateString("es-AR");

      html += `
        <tr>
          <td><small>${pedidoDoc.id.substring(0, 8)}...</small></td>
          <td>${clienteNombre}</td>
          <td>$${pedido.total}</td>
          <td><span class="badge bg-info">${pedido.estado}</span></td>
          <td>${fecha}</td>
        </tr>
      `;
    }

    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
  }
}

function generarRemitoPDF(cart) {
  if (typeof jsPDF === "undefined") {
    return Swal.fire({
      icon: "error",
      title: "Error",
      text: "PDF library no disponible",
    });
  }

  const { jsPDF } = window;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("REMITO", 20, 20);

  doc.setFontSize(10);
  let y = 30;
  doc.text("Producto", 20, y);
  doc.text("Cantidad", 100, y);
  doc.text("Precio", 130, y);
  doc.text("Subtotal", 160, y);

  y += 10;
  let total = 0;

  cart.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    doc.text(item.nombre.substring(0, 30), 20, y);
    doc.text(item.cantidad.toString(), 100, y);
    doc.text(`$${item.precio}`, 130, y);
    doc.text(`$${subtotal}`, 160, y);
    y += 8;
  });

  y += 5;
  doc.setFont(undefined, "bold");
  doc.text(`TOTAL: $${total}`, 160, y);

  doc.save(`remito-${Date.now()}.pdf`);

  Swal.fire({
    icon: "success",
    title: "PDF generado",
    text: `Remito descargado exitosamente`,
    timer: 1500,
    showConfirmButton: false,
  });
}

export async function initStock(role) {
  const form = document.getElementById("stock-form");
  const lista = document.getElementById("stock-lista");

  if (!form) return;

  // Cargar productos
  await cargarProductosEnSelectStock();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const productoId = document.getElementById("stock-producto")?.value;
    const cantidad = parseInt(document.getElementById("stock-cantidad")?.value || 0);
    const ubicacion = document.getElementById("stock-ubicacion")?.value?.trim() || "General";

    if (!productoId || cantidad < 0) {
      return Swal.fire({ icon: "warning", title: "Datos incompletos" });
    }

    try {
      // Verificar si existe stock del producto
      const q = query(collection(db, "stock"), where("productoId", "==", productoId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Crear nuevo registro de stock
        await addDoc(collection(db, "stock"), {
          productoId,
          cantidad,
          ubicacion,
          ultimaActualizacion: Date.now(),
        });
      } else {
        // Actualizar existente
        const docId = snapshot.docs[0].id;
        await updateDoc(doc(db, "stock", docId), {
          cantidad,
          ubicacion,
          ultimaActualizacion: Date.now(),
        });
      }

      Swal.fire({
        icon: "success",
        title: "Stock actualizado",
        timer: 1000,
        showConfirmButton: false,
      });

      form.reset();
      renderStock();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  });

  renderStock();
}

async function cargarProductosEnSelectStock() {
  const select = document.getElementById("stock-producto");
  if (!select) return;

  try {
    const snapshot = await getDocs(collection(db, "productos"));
    select.innerHTML = '<option value="">-- Seleccionar producto --</option>';

    snapshot.forEach((doc) => {
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = doc.data().nombre;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error cargando productos:", err);
  }
}

async function renderStock() {
  const container = document.getElementById("stock-lista");
  if (!container) return;

  try {
    const snapshot = await getDocs(collection(db, "stock"));

    if (snapshot.empty) {
      container.innerHTML = '<div class="alert alert-secondary">Sin stock registrado</div>';
      return;
    }

    let html =
      '<table class="table table-sm"><thead class="table-light"><tr><th>Producto</th><th>Cantidad</th><th>Ubicación</th><th>Última actualización</th></tr></thead><tbody>';

    for (const stockDoc of snapshot.docs) {
      const stock = stockDoc.data();
      const prodSnap = await getDoc(doc(db, "productos", stock.productoId));
      const prodNombre = prodSnap.exists() ? prodSnap.data().nombre : "Desconocido";
      const fecha = new Date(stock.ultimaActualizacion).toLocaleDateString("es-AR");

      html += `
        <tr>
          <td>${prodNombre}</td>
          <td><strong>${stock.cantidad}</strong></td>
          <td>${stock.ubicacion}</td>
          <td>${fecha}</td>
        </tr>
      `;
    }

    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
  }
}

export async function initCobranza(role) {
  const form = document.getElementById("cobranza-form");
  const selectPedido = document.getElementById("select-pedido");

  if (!form) return;

  // Cargar pedidos pendientes
  await cargarPedidosEnSelect();

  // Mostrar detalles al seleccionar pedido
  selectPedido?.addEventListener("change", async () => {
    const pedidoId = selectPedido.value;
    if (!pedidoId) return;

    try {
      const pedidoSnap = await getDoc(doc(db, "pedidos", pedidoId));
      if (!pedidoSnap.exists()) return;

      const pedido = pedidoSnap.data();
      const clienteSnap = await getDoc(doc(db, "clientes", pedido.clienteId));
      const clienteNombre = clienteSnap.exists() ? clienteSnap.data().nombre : "Desconocido";

      const detalle = document.getElementById("cobranza-detalle");
      detalle.classList.remove("d-none");
      detalle.innerHTML = `
        <strong>Cliente:</strong> ${clienteNombre}<br>
        <strong>Monto total:</strong> $${pedido.total}<br>
        <strong>Estado:</strong> ${pedido.estado}
      `;

      document.getElementById("pago-monto").value = pedido.total;
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  });

  // Registrar pago
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const pedidoId = selectPedido?.value;
    const monto = parseFloat(document.getElementById("pago-monto")?.value || 0);
    const metodoPago = document.getElementById("pago-metodo")?.value;

    if (!pedidoId || monto <= 0 || !metodoPago) {
      return Swal.fire({ icon: "warning", title: "Datos incompletos" });
    }

    try {
      const pedidoSnap = await getDoc(doc(db, "pedidos", pedidoId));
      if (!pedidoSnap.exists()) {
        return Swal.fire({ icon: "error", title: "Pedido no encontrado" });
      }

      const pedido = pedidoSnap.data();

      await addDoc(collection(db, "pagos"), {
        pedidoId,
        clienteId: pedido.clienteId,
        monto,
        metodoPago,
        estado: "registrado",
        fecha: new Date().toISOString().split("T")[0],
        createdAt: Date.now(),
      });

      // Actualizar estado del pedido si está pago
      if (monto >= pedido.total) {
        await updateDoc(doc(db, "pedidos", pedidoId), {
          estado: "entregado",
          updatedAt: Date.now(),
        });
      }

      Swal.fire({
        icon: "success",
        title: "Pago registrado",
        text: `$${monto} registrado`,
        timer: 1500,
        showConfirmButton: false,
      });

      form.reset();
      await cargarPedidosEnSelect();
      renderPagos();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  });

  renderPagos();
}

async function cargarPedidosEnSelect() {
  const select = document.getElementById("select-pedido");
  if (!select) return;

  try {
    const snapshot = await getDocs(
      query(
        collection(db, "pedidos"),
        where("estado", "!=", "entregado"),
        orderBy("estado"),
        orderBy("createdAt", "desc")
      )
    );

    select.innerHTML = '<option value="">-- Seleccionar pedido --</option>';

    for (const pedidoDoc of snapshot.docs) {
      const pedido = pedidoDoc.data();
      const clienteSnap = await getDoc(doc(db, "clientes", pedido.clienteId));
      const clienteNombre = clienteSnap.exists() ? clienteSnap.data().nombre : "Desconocido";

      const option = document.createElement("option");
      option.value = pedidoDoc.id;
      option.textContent = `${clienteNombre} - $${pedido.total} (${pedido.estado})`;
      select.appendChild(option);
    }
  } catch (err) {
    console.error("Error cargando pedidos:", err);
  }
}

async function renderPagos() {
  const container = document.getElementById("pagos-lista");
  if (!container) return;

  try {
    const snapshot = await getDocs(
      query(collection(db, "pagos"), orderBy("createdAt", "desc"), limit(10))
    );

    if (snapshot.empty) {
      container.innerHTML = '<div class="alert alert-secondary">Sin pagos registrados</div>';
      return;
    }

    let html =
      '<table class="table table-sm"><thead class="table-light"><tr><th>Pedido</th><th>Monto</th><th>Método</th><th>Fecha</th></tr></thead><tbody>';

    for (const pagoDoc of snapshot.docs) {
      const pago = pagoDoc.data();
      const pedidoSnap = await getDoc(doc(db, "pedidos", pago.pedidoId));
      const pedidoId = pedidoSnap.exists() ? pedidoDoc.id.substring(0, 8) : "N/A";

      html += `
        <tr>
          <td><small>${pago.pedidoId.substring(0, 8)}...</small></td>
          <td>$${pago.monto}</td>
          <td><span class="badge bg-primary">${pago.metodoPago}</span></td>
          <td>${pago.fecha}</td>
        </tr>
      `;
    }

    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-danger">Error: ${err.message}</div>`;
  }
}

export async function initGestion(role) {
  const btnStats = document.getElementById("btn-recargar-stats");
  const btnExportClientes = document.getElementById("btn-export-clientes");
  const btnExportPedidos = document.getElementById("btn-export-pedidos");
  const btnLimpiarCache = document.getElementById("btn-limpiar-cache");

  btnStats?.addEventListener("click", cargarEstadisticas);
  btnExportClientes?.addEventListener("click", exportarClientesCSV);
  btnExportPedidos?.addEventListener("click", exportarPedidosCSV);
  btnLimpiarCache?.addEventListener("click", () => {
    localStorage.clear();
    Swal.fire({
      icon: "success",
      title: "Cache limpiado",
      timer: 1000,
      showConfirmButton: false,
    });
  });

  cargarEstadisticas();
  cargarAlertas();
}

async function cargarEstadisticas() {
  try {
    const clientesSnap = await getDocs(collection(db, "clientes"));
    const pedidosSnap = await getDocs(collection(db, "pedidos"));
    const pagosSnap = await getDocs(collection(db, "pagos"));

    let totalRecaudacion = 0;
    pagosSnap.forEach((doc) => {
      totalRecaudacion += doc.data().monto;
    });

    document.getElementById("stat-clientes").textContent = clientesSnap.size;
    document.getElementById("stat-pedidos").textContent = pedidosSnap.size;
    document.getElementById("stat-recaudacion").textContent = totalRecaudacion.toFixed(2);
  } catch (err) {
    console.error("Error cargando estadísticas:", err);
  }
}

async function cargarAlertas() {
  const container = document.getElementById("alertas-list");
  if (!container) return;

  try {
    const stockSnap = await getDocs(collection(db, "stock"));
    const alertas = [];

    stockSnap.forEach((doc) => {
      const stock = doc.data();
      if (stock.cantidad < 5) {
        alertas.push(`⚠️ Stock bajo: ${stock.productoId} (${stock.cantidad} unidades)`);
      }
    });

    if (alertas.length === 0) {
      container.innerHTML = '<p class="text-success">✅ Todo en orden</p>';
    } else {
      container.innerHTML = alertas.map((a) => `<p class="text-warning">${a}</p>`).join("");
    }
  } catch (err) {
    container.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
  }
}

function exportarClientesCSV() {
  if (!window.clientesGlobales || window.clientesGlobales.length === 0) {
    return Swal.fire({ icon: "warning", title: "Sin datos para exportar" });
  }

  let csv = "Nombre,Email,Teléfono,Dirección,DNI,Ciudad\n";
  window.clientesGlobales.forEach((c) => {
    csv += `"${c.nombre}","${c.email || ""}","${c.telefono || ""}","${c.direccion || ""}","${c.dni || ""}","${c.ciudad || ""}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clientes-${Date.now()}.csv`;
  a.click();

  Swal.fire({
    icon: "success",
    title: "Exportado",
    text: "Clientes exportados a CSV",
    timer: 1000,
    showConfirmButton: false,
  });
}

async function exportarPedidosCSV() {
  try {
    const pedidosSnap = await getDocs(collection(db, "pedidos"));
    if (pedidosSnap.empty) {
      return Swal.fire({ icon: "warning", title: "Sin pedidos para exportar" });
    }

    let csv = "ID,Cliente,Total,Estado,Fecha\n";

    for (const pedidoDoc of pedidosSnap.docs) {
      const pedido = pedidoDoc.data();
      const clienteSnap = await getDoc(doc(db, "clientes", pedido.clienteId));
      const clienteNombre = clienteSnap.exists() ? clienteSnap.data().nombre : "Desconocido";
      const fecha = new Date(pedido.createdAt).toLocaleDateString("es-AR");

      csv += `"${pedidoDoc.id}","${clienteNombre}","${pedido.total}","${pedido.estado}","${fecha}"\n`;
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-${Date.now()}.csv`;
    a.click();

    Swal.fire({
      icon: "success",
      title: "Exportado",
      text: "Pedidos exportados a CSV",
      timer: 1000,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({ icon: "error", title: "Error", text: err.message });
  }
}