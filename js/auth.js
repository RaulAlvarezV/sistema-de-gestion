import { auth } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

export function initAuth(){
  const loginForm = document.getElementById('login-form');
  const registerBtn = document.getElementById('register-btn');
  const logoutBtn = document.getElementById('logout-btn');

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch(err) {
      alert('Error al ingresar: ' + err.message);
    }
  });

  registerBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if(!email || !password){
      alert('Completa email y contraseña para registrar');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Usuario registrado.');
    } catch(err){
      alert('Error registro: ' + err.message);
    }
  });

  logoutBtn.addEventListener('click', () => signOut(auth));
}
