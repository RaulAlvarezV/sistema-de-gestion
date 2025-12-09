/* Minimal safe modules.js
   - Exports the templates and init functions required by router.js
   - Keeps implementations lightweight so the app can load without syntax errors
   - Replace/extend functions later with full Firebase logic
*/

// Note: uses SweetAlert2 (Swal) included in index.html

export function clientesTemplate(){
  return `
    <div>
      <h3>Clientes</h3>
      <form id="cliente-form" class="row g-2 mb-3">
        <div class="col-md-4"><input id="cliente-nombre" class="form-control" placeholder="Nombre"></div>
        <div class="col-md-4"><input id="cliente-razon" class="form-control" placeholder="Razón social"></div>
        <div class="col-md-4"><button class="btn btn-primary">Guardar</button></div>
      </form>
      <input id="buscar-cliente" class="form-control mb-2" placeholder="Buscar clientes...">
      <div id="clientes-list"></div>
      <div id="clientes-tabla"></div>
    </div>
  `;
}

export function pedidoTemplate(){
  return `
    <div>
      <h3>Crear pedido</h3>
      <select id="select-cliente" class="form-select mb-2"><option value="">-- Cargando clientes --</option></select>
      <div class="mb-2"><input id="buscar-producto" class="form-control" placeholder="Buscar producto..."><button id="btn-buscar-producto" class="btn btn-sm btn-secondary mt-2">Buscar</button></div>
      <div id="productos-result"></div>
      <h5>Carrito</h5>
      <div id="carrito-table"></div>
      <div class="d-flex gap-2"><button id="btn-clear-carrito" class="btn btn-outline-secondary">Limpiar</button><button id="btn-guardar-pedido" class="btn btn-primary">Guardar pedido</button><button id="btn-generar-remito" class="btn btn-secondary">Generar remito</button></div>
    </div>
  `;
}

export function stockTemplate(){
  return `
    <div>
      <h3>Stock</h3>
      <div id="stock-list"></div>
    </div>
  `;
}

export function cobranzaTemplate(){
  return `
    <div>
      <h3>Cobranzas</h3>
      <div id="cobranzas-list"></div>
      <div id="cobranzas-pago-container"></div>
    </div>
  `;
}

export function gestionTemplate(){
  return `
    <div>
      <h3>Gestión</h3>
      <div id="gestion-tabla"></div>
    </div>
  `;
}

// Minimal init functions: perform harmless wiring and show toast if missing resources
export async function initClientes(){
  // attach submit handler to the small form created above
  const form = document.getElementById('cliente-form');
  if(form){
    form.addEventListener('submit', async e=>{
      e.preventDefault();
      const nombre = document.getElementById('cliente-nombre')?.value || '';
      if(!nombre) return Swal.fire({icon:'warning', title:'El nombre es obligatorio'});
      // placeholder behaviour: show confirmation
      Swal.fire({icon:'success', title:'Cliente guardado (placeholder)'});
      form.reset();
    });
  }
}

export async function initPedido(role){
  // placeholder: wire search button to show a message
  document.getElementById('btn-buscar-producto')?.addEventListener('click', ()=>{
    const term = document.getElementById('buscar-producto')?.value || '';
    const result = document.getElementById('productos-result');
    result.innerHTML = `<div class="alert alert-info">Búsqueda simulada: ${term}</div>`;
  });

  document.getElementById('btn-clear-carrito')?.addEventListener('click', ()=>{
    localStorage.removeItem('app_carrito_temp');
    renderCarritoPlaceholder();
    Swal.fire({toast:true, position:'top-end', icon:'info', title:'Carrito limpiado', showConfirmButton:false, timer:1200});
  });

  renderCarritoPlaceholder();
}

function renderCarritoPlaceholder(){
  const cont = document.getElementById('carrito-table');
  if(!cont) return;
  const cart = JSON.parse(localStorage.getItem('app_carrito_temp')||'[]');
  if(cart.length===0){ cont.innerHTML = '<div class="alert alert-secondary">Carrito vacío</div>'; return; }
  let html = '<ul class="list-group mb-2">';
  cart.forEach(i=> html += `<li class="list-group-item">${i.nombre} x ${i.cantidad}</li>`);
  html += '</ul>';
  cont.innerHTML = html;
}

export async function initStock(role){
  const list = document.getElementById('stock-list'); if(!list) return; list.innerHTML = '<div class="alert alert-secondary">Lista de stock (placeholder)</div>';
}

export async function initCobranza(role){
  const list = document.getElementById('cobranzas-list'); if(!list) return; list.innerHTML = '<div class="alert alert-secondary">Lista de cobranzas (placeholder)</div>';
}

export async function initGestion(role){
  const tabla = document.getElementById('gestion-tabla'); if(!tabla) return; tabla.innerHTML = '<div class="alert alert-secondary">Gestión (placeholder)</div>';
}