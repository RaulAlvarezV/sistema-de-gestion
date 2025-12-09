# Comandos Rápidos para Desplegar en Firebase (PowerShell)

## 1️⃣ Instalar Firebase CLI (primera vez)
```powershell
npm install -g firebase-tools
```

## 2️⃣ Autenticarse
```powershell
firebase login
```

## 3️⃣ Seleccionar Proyecto (si no está configurado)
```powershell
firebase use --add
# Selecciona: sistema-de-gestion-elcafehnos
```

## 4️⃣ Verificar la Configuración
```powershell
firebase projects:list
```

## 5️⃣ Desplegar TODO (Hosting + Firestore Rules)
```powershell
firebase deploy
```

## 5️⃣ (Alternativa) Solo Hosting
```powershell
firebase deploy --only hosting
```

## 5️⃣ (Alternativa) Solo Firestore Rules
```powershell
firebase deploy --only firestore:rules
```

---

## ✅ Ver Resultado

Después del deploy, verás algo como:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/sistema-de-gestion-elcafehnos
Hosting URL: https://sistema-de-gestion-elcafehnos.web.app
```

**Abre la URL en el navegador para ver tu app en vivo.**

---

## 🔄 Actualizar Después

Cada vez que hagas cambios en `public/`, simplemente ejecuta:
```powershell
firebase deploy
```

---

## 📋 Verificar Estado del Deployment

```powershell
firebase hosting:channel:list
```

---

## 🚨 Solución Rápida de Problemas

### Si ves "Error: Permission denied"
```powershell
firebase logout
firebase login
```

### Si los cambios no aparecen
- Abre el sitio en **modo incógnito** (Ctrl+Shift+N)
- O limpia caché: Ctrl+Shift+Delete

### Ver logs de deploy
```powershell
firebase deploy --debug
```

---

**¡Listo! Ahora tu app estará en vivo en Firebase Hosting.** 🚀
