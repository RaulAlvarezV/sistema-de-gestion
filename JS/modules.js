// Funciones CRUD que interactúan con Firestore
import { db } from './firebase-config.js';
import {
  collection, addDoc, getDocs, doc, getDoc, updateDoc, setDoc, query, where
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

export function initModules(name){
  if(name === 'lead') initLead();
  if(name === 'pedido') initPedido();
  if(name === 'stock') initStock();
  if(name === 'cobranza') initCobranza();
}

// LEAD
async function initLead(){
  const form = document.getElementById('lead-form');
  const list = document.getElementById('lead-list');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const email = document.getElementById('cliente-email').value.trim();
    await addDoc(collection(db,'clientes'),{nombre,email,createdAt: Date.now()});
    alert('Cliente creado');
    form.reset();
    renderClientes();
  });
  renderClientes();
}

async function renderClientes(){
  const q = await getDocs(collection(db,'clientes'));
  const list = document.getElementById('lead-list');
  list.innerHTML = '';
  q.forEach(docSnap=>{
    const d = docSnap.data();
    const el = document.createElement('div');
    el.textContent = `${d.nombre} — ${d.email}`;
    list.appendChild(el);
  });
}

// PEDIDO
async function initPedido(){
  const buscarForm = document.getElementById('buscar-stock-form');
  const stockResult = document.getElementById('stock-result');
  buscarForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const id = document.getElementById('producto-id').value.trim();
    const stockDoc = await getDoc(doc(db,'stock', id));
    if(stockDoc.exists()){
      document.getElementById('stock-cantidad').textContent = stockDoc.data().cantidad;
      stockResult.classList.remove('hidden');
      window.currentStockId = id;
    } else { alert('Producto no encontrado'); }
  });

  document.getElementById('btn-create-pedido').addEventListener('click', ()=>{
    document.getElementById('create-pedido-section').classList.remove('hidden');
  });

  document.getElementById('create-pedido-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const cantidad = Number(document.getElementById('pedido-cantidad').value);
    const pedidosRef = collection(db,'pedidos');
    const id = 'ped' + Date.now();
    await setDoc(doc(db,'pedidos', id), {id, cantidad, stockId: window.currentStockId || null, createdAt: Date.now()});
    alert('Pedido creado');
    document.getElementById('create-pedido-form').reset();
  });
}

// STOCK
async function initStock(){
  const form = document.getElementById('stock-form');
  const list = document.getElementById('stock-list');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const id = document.getElementById('stock-id').value.trim();
    const cantidad = Number(document.getElementById('stock-cantidad').value);
    await setDoc(doc(db,'stock', id), {cantidad, updatedAt: Date.now()});
    alert('Stock actualizado');
    form.reset();
    renderStock();
  });
  renderStock();
}

async function renderStock(){
  const q = await getDocs(collection(db,'stock'));
  const list = document.getElementById('stock-list');
  list.innerHTML = '';
  q.forEach(snap=>{
    const d = snap.data();
    const el = document.createElement('div');
    el.textContent = `${snap.id} — ${d.cantidad}`;
    list.appendChild(el);
  });
}

// COBRANZA
async function initCobranza(){
  const buscarForm = document.getElementById('buscar-pedido-form');
  buscarForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const id = document.getElementById('pedido-id').value.trim();
    const pedidoDoc = await getDoc(doc(db,'pedidos',id));
    if(pedidoDoc.exists()){
      document.getElementById('pedido-detalle').textContent = `Cantidad: ${pedidoDoc.data().cantidad}`;
      document.getElementById('pedido-result').classList.remove('hidden');
      window.currentPedidoId = id;
    } else { alert('Pedido no encontrado'); }
  });

  document.getElementById('btn-registrar-pago').addEventListener('click', ()=>{
    document.getElementById('registrar-pago-section').classList.remove('hidden');
  });

  document.getElementById('registrar-pago-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const monto = Number(document.getElementById('pago-monto').value);
    await setDoc(doc(db,'pagos', 'pago' + Date.now()), {monto, pedidoId: window.currentPedidoId || null, createdAt: Date.now()});
    alert('Pago registrado');
    document.getElementById('registrar-pago-form').reset();
  });
}
