// Router simple: renderiza módulos en #modules-container
export function initRouter(){
  document.querySelectorAll('[data-module]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const module = btn.dataset.module;
      renderModule(module);
    });
  });
}

function renderModule(name){
  const container = document.getElementById('modules-container');
  // Limpia
  container.innerHTML = '';
  if(name === 'lead') container.innerHTML = leadTemplate();
  if(name === 'pedido') container.innerHTML = pedidoTemplate();
  if(name === 'stock') container.innerHTML = stockTemplate();
  if(name === 'cobranza') container.innerHTML = cobranzaTemplate();

  // Inicializa handlers del módulo
  import('./modules.js').then(m => m.initModules(name));

}

function leadTemplate(){
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

function pedidoTemplate(){
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

function stockTemplate(){
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

function cobranzaTemplate(){
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
