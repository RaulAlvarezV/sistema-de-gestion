import { auth } from './firebase-config.js';
import { initAuth } from './auth.js';
import { initRouter } from './router.js';

initAuth();
initRouter();

// Observador de estado de auth
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const loginSection = document.getElementById('login-section');
const routerSection = document.getElementById('router-section');

onAuthStateChanged(auth, user => {
  if(user){
    loginSection.classList.add('hidden');
    routerSection.classList.remove('hidden');
  } else {
    loginSection.classList.remove('hidden');
    routerSection.classList.add('hidden');
    document.getElementById('modules-container').innerHTML = '';
  }
});
