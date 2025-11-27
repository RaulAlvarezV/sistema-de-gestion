// Punto de entrada: monta UI y conecta módulos
import { auth } from './firebase-config.js';
import { initAuth } from './auth.js';
import { initRouter } from './router.js';
import { initModules } from './modules.js';

// Inicializar pieces
initAuth();
initRouter();
initModules();

// Observador de estado de auth (muestra u oculta secciones)
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

const loginSection = document.getElementById('login-section');
const routerSection = document.getElementById('router-section');

onAuthStateChanged(auth, user => {
  if (user) {
    loginSection.classList.add('hidden');
    routerSection.classList.remove('hidden');
  } else {
    loginSection.classList.remove('hidden');
    routerSection.classList.add('hidden');
    document.getElementById('modules-container').innerHTML = '';
  }
});