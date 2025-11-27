// --- FIREBASE ---
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// --- EXPORT DE INIT ---
export function initModules(name){
  if(name === 'lead') initLead();
  if(name === 'pedido') initPedido();
  if(name === 'stock') initStock();
  if(name === 'cobranza') initCobranza();
}

// --- TEMPLATES ---
export function leadTemplate(){
  return `
    <div class="card card-module">
      <h3>Lead - Crear Cliente</h3>
      <form id="lead-form">
        <div class="mb-3">
          <label class="form-label">Nombre</label>
          <input id="cliente-nombre" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input id="cliente-email" type="email" class="form-control" required>
        </div>
        <button class="btn btn-success">Crear Cliente</button>
      </form>
      <div id="lead-list" class="mt-3"></div>
    </div>
  `;
}

export function pedidoTemplate(){ 
  return `
    <div class="card card-module">
      <h3>Pedido - Buscar Stock</h3>
      <form id="buscar-stock-form">
        <div class="mb-3">
          <label class="form-label">ID del Producto</label>
          <input id="producto-id" class="form-control" required>
        </div>
        <button class="btn btn-info">Buscar Stock</button>
      </form>
      <div id="stock-result" class="mt-3 hidden">
        <p>Stock disponible: <span id="stock-cantidad"></span></p>
        <button class="btn btn-success" id="btn-create-pedido">Crear Pedido</button>
      </div>
      <div id="create-pedido-section" class="hidden mt-3">
        <h4>Crear Pedido</h4>
        <form id="create-pedido-form">
          <div class="mb-3"><label class="form-label">Cantidad</label><input id="pedido-cantidad" type="number" class="form-control" required></div>
          <button class="btn btn-success">Crear Pedido</button>
        </form>
      </div>
    </div>
  `;
}

export function stockTemplate(){ 
  return `
    <div class="card card-module">
      <h3>Stock - Crear/Actualizar Stock</h3>
      <form id="stock-form">
        <div class="mb-3"><label class="form-label">ID del Producto</label><input id="stock-id" class="form-control" required></div>
        <div class="mb-3"><label class="form-label">Cantidad</label><input id="stock-cantidad" type="number" class="form-control" required></div>
        <button class="btn btn-warning">Crear/Actualizar Stock</button>
      </form>
      <div id="stock-list" class="mt-3"></div>
    </div>
  `;
}

export function cobranzaTemplate(){ 
  return `
    <div class="card card-module">
      <h3>Cobranza - Buscar Pedido</h3>
      <form id="buscar-pedido-form">
        <div class="mb-3"><label class="form-label">ID del Pedido</label><input id="pedido-id" class="form-control" required></div>
        <button class="btn btn-info">Buscar Pedido</button>
      </form>
      <div id="pedido-result" class="mt-3 hidden">
        <p>Pedido encontrado: <span id="pedido-detalle"></span></p>
        <button class="btn btn-success" id="btn-registrar-pago">Registrar Pago</button>
      </div>
      <div id="registrar-pago-section" class="hidden mt-3">
        <h4>Registrar Pago</h4>
        <form id="registrar-pago-form">
          <div class="mb-3"><label class="form-label">Monto</label><input id="pago-monto" type="number" class="form-control" required></div>
          <button class="btn btn-success">Registrar Pago</button>
        </form>
      </div>
    </div>
  `;
}

// --- LÓGICA DE MÓDULOS ---
async function initLead(){
  const form = document.getElementById('lead-form');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const email = document.getElementById('cliente-email').value.trim();
    await addDoc(collection(db,'clientes'), { nombre, email, createdAt: Date.now() });
    alert('Cliente creado');
    form.reset();
    renderClientes();
  });
  renderClientes();
}

async function renderClientes(){
  const list = document.getElementById('lead-list');
  list.innerHTML = '';
  const q = await getDocs(collection(db,'clientes'));
  q.forEach(docSnap => {
    const d = docSnap.data();
    const el = document.createElement('div');
    el.textContent = `${d.nombre} — ${d.email}`;
    list.appendChild(el);
  });
}

// --- PEDIDO ---
async function initPedido(){
  const buscarForm = document.getElementById('buscar-stock-form');
  buscarForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('producto-id').value.trim();
    const stockDoc = await getDoc(doc(db,'stock',id));
    if(stockDoc.exists()){
      document.getElementById('stock-cantidad').textContent = stockDoc.data().cantidad;
      document.getElementById('stock-result').classList.remove('hidden');
      window.currentStockId = id;
    } else alert('Producto no encontrado');
  });

  document.getElementById('btn-create-pedido').addEventListener('click', ()=>{
    document.getElementById('create-pedido-section').classList.remove('hidden');
  });

  document.getElementById('create-pedido-form').addEventListener('submit', async e => {
    e.preventDefault();
    const cantidad = Number(document.getElementById('pedido-cantidad').value);
    const id = 'ped'+Date.now();
    await setDoc(doc(db,'pedidos',id), { id, cantidad, stockId: window.currentStockId||null, createdAt: Date.now() });
    alert('Pedido creado');
    document.getElementById('create-pedido-form').reset();
  });
}

// --- STOCK ---
async function initStock(){
  const form = document.getElementById('stock-form');
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const id = document.getElementById('stock-id').value.trim();
    const cantidad = Number(document.getElementById('stock-cantidad').value);
    await setDoc(doc(db,'stock',id), { cantidad, updatedAt: Date.now() });
    alert('Stock actualizado');
    form.reset();
    renderStock();
  });
  renderStock();
}

async function renderStock(){
  const list = document.getElementById('stock-list');
  list.innerHTML = '';
  const q = await getDocs(collection(db,'stock'));
  q.forEach(snap => {
    const d = snap.data();
    const el = document.createElement('div');
    el.textContent = `${snap.id} — ${d.cantidad}`;
    list.appendChild(el);
  });
}

// --- COBRANZA ---
async function initCobranza(){
  const buscarForm = document.getElementById('buscar-pedido-form');
  buscarForm.addEventListener('submit', async e=>{
    e.preventDefault();
    const id = document.getElementById('pedido-id').value.trim();
    const pedidoDoc = await getDoc(doc(db,'pedidos',id));
    if(pedidoDoc.exists()){
      document.getElementById('pedido-detalle').textContent = `Cantidad: ${pedidoDoc.data().cantidad}`;
      document.getElementById('pedido-result').classList.remove('hidden');
      window.currentPedidoId = id;
    } else alert('Pedido no encontrado');
  });

  document.getElementById('btn-registrar-pago').addEventListener('click', ()=>{
    document.getElementById('registrar-pago-section').classList.remove('hidden');
  });

  document.getElementById('registrar-pago-form').addEventListener('submit', async e=>{
    e.preventDefault();
    const monto = Number(document.getElementById('pago-monto').value);
    await setDoc(doc(db,'pagos','pago'+Date.now()), { monto, pedidoId: window.currentPedidoId||null, createdAt: Date.now() });
    alert('Pago registrado');
    document.getElementById('registrar-pago-form').reset();
  });
}
