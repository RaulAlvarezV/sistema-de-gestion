# Pasos para Desplegar en Firebase Hosting

## Prerequisitos

1. **Node.js instalado** (si aún no lo tienes, descárgalo desde https://nodejs.org/)
2. **Firebase CLI instalado**:
   ```powershell
   npm install -g firebase-tools
   ```

## Pasos para Subir a Firebase

### 1. Iniciar Sesión en Firebase

```powershell
firebase login
```

Esto abrirá el navegador para que inicies sesión con tu cuenta de Google asociada al proyecto.

### 2. Verificar la Configuración

Desde la carpeta del proyecto, verifica que `firebase.json` esté configurado correctamente:

```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

### 3. Desplegar en Firebase Hosting

```powershell
firebase deploy --only hosting
```

Esto subirá todos los archivos de la carpeta `public/` a Firebase Hosting.

### 4. (Opcional) Actualizar Reglas de Firestore

Si hiciste cambios en `firestore.rules`, despliégalos con:

```powershell
firebase deploy --only firestore:rules
```

### 5. (Opcional) Desplegar Todo

Para desplegar hosting + reglas + índices de una vez:

```powershell
firebase deploy
```

## Verificar el Despliegue

Una vez completado, verás un mensaje como:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/sistema-de-gestion-elcafehnos/overview
Hosting URL: https://sistema-de-gestion-elcafehnos.web.app
```

Abre la URL para ver tu app en línea.

## Estructura de Carpetas Esperada

```
proyecto/
├── public/                    ← Firebase sirve archivos desde aquí
│   ├── index.html
│   ├── styles.css
│   └── js/
│       ├── firebase-config.js
│       ├── auth.js
│       ├── router.js
│       ├── app.js
│       └── modules.js
├── firebase.json              ← Configuración (public: "public")
├── firestore.rules
├── package.json
└── ...otros archivos...
```

## Solución de Problemas

### Error: "No proyecto seleccionado"

Asegúrate de estar en la carpeta correcta y ejecuta:

```powershell
firebase use --add
```

Selecciona tu proyecto: `sistema-de-gestion-elcafehnos`

### Error: "PERMISSION_DENIED"

Verifica que tu cuenta de Google tenga permisos en el proyecto Firebase. Ve a Firebase Console → Settings → Users and permissions.

### Los cambios no aparecen

Limpia el caché del navegador (Ctrl+Shift+Delete) o abre en incógnito.

## Actualizar en el Futuro

Cada vez que quieras actualizar la app:

1. Realiza cambios en los archivos de `public/`
2. Ejecuta:
   ```powershell
   firebase deploy
   ```

¡Eso es! 🚀
