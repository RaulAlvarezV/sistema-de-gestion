import { initModules, leadTemplate, pedidoTemplate, stockTemplate, cobranzaTemplate } from './modules.js';

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
  container.innerHTML = '';

  if(name==='lead') container.innerHTML = leadTemplate();
  if(name==='pedido') container.innerHTML = pedidoTemplate();
  if(name==='stock') container.innerHTML = stockTemplate();
  if(name==='cobranza') container.innerHTML = cobranzaTemplate();

  // Inicializa la lógica del módulo
  initModules(name);
}
