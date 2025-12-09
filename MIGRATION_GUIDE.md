# 🔄 Script de Migración - Firestore

Este documento describe cómo usar el script `scripts/migrate-collections.js` para migrar, renombrar o modificar colecciones en Firestore.

---

## 📋 Prerequisitos

1. **Node.js instalado** (v14+)
2. **Dependencia `firebase-admin` instalada**:
   ```powershell
   npm install firebase-admin
   ```
3. **Service Account Key descargado desde Firebase Console**

---

## 🔑 Descargar Service Account Key

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **sistema-de-gestion-elcafehnos**
3. Ve a **⚙️ Project Settings** (arriba a la izquierda)
4. Haz clic en la pestaña **"Service Accounts"**
5. Haz clic en **"Generate New Private Key"**
6. Se descargará un archivo JSON (ej: `sistema-de-gestion-elcafehnos-XXXXX.json`)
7. **Renombra a `serviceAccountKey.json`** y colócalo en la raíz del proyecto:
   ```
   proyecto/
   ├── serviceAccountKey.json      ← Aquí
   ├── scripts/
   │   └── migrate-collections.js
   ├── firebase.json
   └── ...
   ```

⚠️ **SEGURIDAD**: Nunca comitas `serviceAccountKey.json` a Git. Está en `.gitignore`.

---

## 🚀 Uso del Script

### 1. Ver estructura actual (sin hacer cambios)

```powershell
node scripts/migrate-collections.js
```

Esto lista los documentos de todas las colecciones actuales.

### 2. Renombrar una colección

```powershell
node scripts/migrate-collections.js migrate <oldName> <newName>
```

**Ejemplo**: Renombrar `prooductos` a `productos` (si existiera el typo):

```powershell
node scripts/migrate-collections.js migrate prooductos productos
```

**¿Qué hace?**
- Copia todos los documentos de `prooductos` a `productos`
- Elimina la colección `prooductos` original
- Muestra progreso en tiempo real

### 3. Listar documentos de una colección

```powershell
node scripts/migrate-collections.js list <collName>
```

**Ejemplo**: Ver qué clientes hay

```powershell
node scripts/migrate-collections.js list clientes
```

### 4. Sembrar datos iniciales (demo/testing)

```powershell
node scripts/migrate-collections.js seed <collName>
```

El script incluye datos de ejemplo para `clientes`.

---

## 📝 Pasos Completos para Migración

### Ejemplo: Migrar `pedidos_items` a subcolección

Si en el futuro quieres cambiar la estructura de items de una colección separada a una subcolección dentro de `pedidos/{id}/items`, sigue estos pasos:

1. **Respalda datos antes** (desde Firebase Console):
   ```powershell
   firebase firestore:export ./backup
   ```

2. **Revisa qué hay en `pedidos_items`**:
   ```powershell
   node scripts/migrate-collections.js list pedidos_items
   ```

3. **Si tienes errores, revierte desde el backup**:
   ```powershell
   firebase firestore:import ./backup
   ```

4. **Después de confirmar la migración, elimina el backup**:
   ```powershell
   Remove-Item -Recurse backup
   ```

---

## ⚙️ Modificar el Script

Si necesitas hacer cambios al script (ej: transformar datos durante la migración):

1. Abre `scripts/migrate-collections.js`
2. Edita la función `migrateCollection()` para transformar datos:

```javascript
for (const doc of snapshot.docs) {
  const data = doc.data();
  
  // Transformar datos aquí
  if (data.precio && !data.precioMayorista) {
    data.precioMayorista = data.precio * 0.9;  // 10% descuento
  }
  
  batch.set(newColl.doc(doc.id), data);
  batch.delete(oldColl.doc(doc.id));
  // ...
}
```

3. Guarda y ejecuta:
```powershell
node scripts/migrate-collections.js migrate oldColl newColl
```

---

## 🐛 Troubleshooting

### Error: "serviceAccountKey.json not found"
**Solución**: Descarga el archivo desde Firebase Console (ver sección 🔑 arriba)

### Error: "Permission denied" al conectar
**Solución**: Verifica que la Service Account tenga permisos:
1. Ve a Firebase Console → **IAM & Admin**
2. Busca el email de la Service Account (ej: `firebase-adminsdk-xxx@PROJECT_ID.iam.gserviceaccount.com`)
3. Asigna el rol: **Editor** o **Cloud Datastore Owner**

### El script se ejecuta lentamente
- Normal si tienes miles de documentos
- El script hace commit cada 450 operaciones para respetar límites de Firestore
- Ten paciencia y no cierres la ventana

### ¿Cómo revertir una migración?
1. Si tienes backup:
   ```powershell
   firebase firestore:import ./backup
   ```
2. Si no, elimina la nueva colección manualmente desde Firebase Console

---

## 📊 Estadísticas Útiles

**Antes y después de migración**, el script muestra:
```
✅ Batch 1 completado (450/1000)
✅ Batch 2 completado (1000/1000)
✨ Migración completada: 1000 documentos copiados y originales eliminados
```

---

## 🔗 Referencias Adicionales

- **COLLECTIONS.md** — Estructura y esquema de todas las colecciones
- **firestore.rules** — Reglas de seguridad (Firestore)
- **firestore.indexes.json** — Índices para optimizar queries

---

**Última actualización:** Diciembre 2024
