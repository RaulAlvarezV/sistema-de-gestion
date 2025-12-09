# 📊 Colecciones de Firestore - Sistema de Gestión

Documentación sobre la estructura y esquema de las colecciones en Firestore Database.

---

## 📋 Índice de Colecciones

1. [usuarios](#usuarios) — Perfiles y roles de usuarios
2. [clientes](#clientes) — Información de clientes
3. [productos](#productos) — Catálogo de productos
4. [stock](#stock) — Inventario de productos
5. [pedidos](#pedidos) — Pedidos de clientes
6. [pedidos_items](#pedidos_items) — Items dentro de cada pedido
7. [pagos](#pagos) — Registro de pagos y cobranzas

---

## 📌 usuarios

**Colección**: `usuarios`  
**ID Documento**: `{uid}` — El UID del usuario en Firebase Auth  
**Propósito**: Almacenar perfil, rol y datos del usuario

### Esquema

```json
{
  "uid": "abc123xyz...",                  // ID único (coincide con doc ID)
  "email": "usuario@example.com",         // Email del usuario
  "displayName": "Juan Pérez",            // Nombre completo (opcional)
  "rol": "admin|empleado|vendedor",       // Rol del usuario
  "activo": true,                         // Estado (true/false)
  "createdAt": 1702000000000,             // Timestamp de creación (ms)
  "updatedAt": 1702000000000              // Timestamp última actualización (ms)
}
```

### Valores Permitidos para `rol`
- `admin` — Acceso completo (gestión de usuarios, stock, reportes)
- `empleado` — Acceso a clientes, pedidos, cobranzas
- `vendedor` — Acceso reducido (clientes, pedidos)

### Reglas de Seguridad
- ✅ Usuario puede leer su propio documento
- ✅ Admin puede leer/actualizar cualquier usuario
- ✅ Nadie puede crear usuarios desde el frontend (solo via Firebase Auth + `auth.js`)
- ✅ Cambios de rol solo via Admin SDK o Cloud Function

### Ejemplo de Documento
```json
{
  "email": "gerente@cafe.com",
  "displayName": "Carlos Admin",
  "rol": "admin",
  "activo": true,
  "createdAt": 1702000000000,
  "updatedAt": 1702000000000
}
```

---

## 👥 clientes

**Colección**: `clientes`  
**ID Documento**: Auto-generado (Firestore)  
**Propósito**: Base de datos de clientes del negocio

### Esquema

```json
{
  "nombre": "El Café S.A.",               // Nombre o razón social (OBLIGATORIO)
  "razonSocial": "El Café S.A.",         // Razón social (opcional)
  "dni": "20123456789",                   // DNI/RUT (opcional)
  "email": "contacto@elcafe.com",        // Email (opcional)
  "telefono": "+541234567890",            // Teléfono (opcional)
  "direccion": "Av. Siempre Viva 123",   // Dirección (opcional)
  "ciudad": "Buenos Aires",               // Ciudad (opcional)
  "provincia": "Buenos Aires",            // Provincia/Estado (opcional)
  "codigoPostal": "1425",                 // Código postal (opcional)
  "condicionImpositiva": "Responsable Inscripto",  // (opcional)
  "limiteCredito": 50000,                 // Límite de crédito en pesos (opcional)
  "creditoDisponible": 50000,             // Crédito disponible (se actualiza con pagos)
  "contacto": {
    "nombre": "Juan Pérez",
    "email": "juan@elcafe.com",
    "telefono": "+541234567890"
  },
  "activo": true,                         // Cliente activo o inactivo
  "observaciones": "Cliente VIP",         // Notas internas (opcional)
  "createdAt": 1702000000000,             // Timestamp creación
  "updatedAt": 1702000000000              // Timestamp última edición
}
```

### Campos Obligatorios
- `nombre` — Mínimo 3 caracteres

### Reglas de Seguridad
- ✅ Cualquier empleado/admin puede leer clientes
- ✅ Empleados y admin pueden crear y editar
- ✅ Solo admin puede eliminar

### Índices Recomendados
```
nombre (Ascending)
activo (Ascending)
createdAt (Descending)
```

---

## 🏷️ productos

**Colección**: `productos`  
**ID Documento**: `{sku}` o auto-generado  
**Propósito**: Catálogo de productos/servicios que vende el negocio

### Esquema

```json
{
  "nombre": "Café Arabica 1kg",           // Nombre del producto (OBLIGATORIO)
  "sku": "CAF-ARAB-1K",                   // SKU/Código (único, opcional)
  "descripcion": "Granos finos importados",  // Descripción (opcional)
  "precio": 1500,                         // Precio unitario en pesos (OBLIGATORIO)
  "precioMayorista": 1350,                // Precio mayorista (opcional)
  "categoria": "Cafés",                   // Categoría (ej: Cafés, Té, Accesorios)
  "marca": "Café Premium",                // Marca (opcional)
  "peso": "1kg",                          // Peso o unidad (opcional)
  "margenGanancia": 40,                   // % margen (opcional, para análisis)
  "activo": true,                         // Producto disponible
  "createdAt": 1702000000000,
  "updatedAt": 1702000000000
}
```

### Campos Obligatorios
- `nombre` — Mínimo 3 caracteres
- `precio` — Número > 0

### Reglas de Seguridad
- ✅ Cualquier usuario logueado puede leer
- ✅ Solo admin puede crear/editar/eliminar

### Índices Recomendados
```
categoria (Ascending), activo (Ascending)
activo (Ascending), precio (Ascending)
```

---

## 📦 stock

**Colección**: `stock`  
**ID Documento**: `{productoId}` (referencia a productos)  
**Propósito**: Inventario disponible de cada producto

### Esquema

```json
{
  "productoId": "CAF-ARAB-1K",            // Referencia a documento en `productos` (OBLIGATORIO)
  "cantidad": 50,                         // Unidades disponibles (número)
  "cantidadMinima": 10,                   // Alerta si baja de esto (opcional)
  "ubicacion": "Estante A1",              // Ubicación física en almacén (opcional)
  "lote": "LOTE-2024-001",                // Número de lote (opcional)
  "fechaVencimiento": "2025-12-31",       // Fecha vencimiento (opcional, formato YYYY-MM-DD)
  "ultimaActualizacion": 1702000000000,   // Timestamp último cambio
  "notasStock": "Próximo a vencer"        // Notas (opcional)
}
```

### Campos Obligatorios
- `productoId`
- `cantidad` (>= 0)

### Reglas de Seguridad
- ✅ Cualquier usuario logueado puede leer
- ✅ Empleado/admin puede actualizar (restar stock)
- ✅ Solo admin puede crear/eliminar

### Índices Recomendados
```
productoId (Ascending)
productoId (Ascending), cantidad (Ascending)
```

---

## 🛒 pedidos

**Colección**: `pedidos`  
**ID Documento**: Auto-generado o `PED-{YYYY}-{NUM}`  
**Propósito**: Registro de pedidos realizados por clientes

### Esquema

```json
{
  "clienteId": "{docId from clientes}",   // Referencia a cliente (OBLIGATORIO)
  "numero": "PED-2024-001",               // Número de pedido legible
  "estado": "pendiente|confirmado|enviado|entregado|cancelado",
  "items": [
    {
      "productoId": "CAF-ARAB-1K",
      "cantidad": 2,
      "precioUnitario": 1500,
      "subtotal": 3000
    }
  ],
  "total": 3000,                          // Total en pesos (sin IVA, o con según corresponda)
  "iva": 630,                             // IVA (opcional)
  "totalConIva": 3630,                    // Total + IVA (opcional)
  "descuento": 0,                         // Descuento en pesos (opcional)
  "medioEnvio": "retiro|envio",           // Forma de entrega
  "direccionEnvio": "Av. Siempre Viva", // (opcional si es retiro)
  "notasCliente": "Sin azúcar",           // Notas especiales del cliente
  "fechaEntrega": "2024-12-25",           // Fecha comprometida (formato YYYY-MM-DD)
  "createdAt": 1702000000000,             // Fecha creación
  "updatedAt": 1702000000000,
  "createdBy": "{uid}"                    // UID del vendedor que creó el pedido
}
```

### Campos Obligatorios
- `clienteId`
- `estado`
- `items` (array, mínimo 1)
- `total`

### Estados Válidos
- `pendiente` — Creado, sin confirmar
- `confirmado` — Cliente confirmó
- `enviado` — En camino o listo para retiro
- `entregado` — Recibido por cliente
- `cancelado` — Cancelado

### Reglas de Seguridad
- ✅ Cualquier usuario logueado puede leer
- ✅ Empleado/admin pueden crear y editar (cambiar estado)
- ✅ Solo admin puede eliminar

### Índices Recomendados
```
clienteId (Ascending), createdAt (Descending)
estado (Ascending), createdAt (Descending)
createdAt (Descending)
```

---

## 📋 pedidos_items

**Colección**: `pedidos_items`  
**ID Documento**: Auto-generado  
**Propósito**: Detalle de items en cada pedido (alternativa a array `items` dentro de `pedidos`)

> **Nota**: Actualmente los items están dentro del documento `pedidos` como array.  
> Si el negocio crece y los pedidos tienen muchos items, considera mover esto a una subcolección:  
> `pedidos/{pedidoId}/items/{itemId}`

### Esquema (si se usa)

```json
{
  "pedidoId": "{doc from pedidos}",       // Referencia a pedido (OBLIGATORIO)
  "productoId": "CAF-ARAB-1K",            // Referencia a producto (OBLIGATORIO)
  "cantidad": 2,                          // Unidades (OBLIGATORIO)
  "precioUnitario": 1500,                 // Precio al momento del pedido
  "subtotal": 3000,                       // cantidad * precioUnitario
  "descuentoItem": 0,                     // Descuento específico del item
  "notasItem": "Sin azúcar adicional",    // Notas (opcional)
  "createdAt": 1702000000000
}
```

### Migración Recomendada
Si ahora usas array `items` y quieres migrar a subcolección después, usa el script:
```bash
node scripts/migrate-collections.js migrate pedidos_items pedidos_items_backup
```

---

## 💰 pagos

**Colección**: `pagos`  
**ID Documento**: Auto-generado o `PAG-{YYYY}-{NUM}`  
**Propósito**: Registro de pagos y cobranzas de pedidos

### Esquema

```json
{
  "pedidoId": "{docId from pedidos}",     // Referencia a pedido (OBLIGATORIO)
  "clienteId": "{docId from clientes}",   // Referencia a cliente (OBLIGATORIO)
  "numero": "PAG-2024-001",               // Número de pago legible
  "monto": 3630,                          // Monto pagado en pesos (OBLIGATORIO)
  "moneda": "ARS",                        // Código moneda (ARS, USD, etc.)
  "metodoPago": "efectivo|transferencia|tarjeta|cheque",
  "referencia": "TRF-20241220-12345",     // Número de transacción (para transferencias/cheques)
  "estado": "registrado|confirmado|rechazado",
  "fecha": "2024-12-20",                  // Fecha del pago (formato YYYY-MM-DD)
  "notas": "Pago completo del pedido",
  "procesadoPor": "{uid}",                // UID del usuario que registró el pago
  "createdAt": 1702000000000,
  "updatedAt": 1702000000000
}
```

### Campos Obligatorios
- `pedidoId`
- `clienteId`
- `monto` (> 0)
- `metodoPago`

### Métodos de Pago Válidos
- `efectivo`
- `transferencia`
- `tarjeta`
- `cheque`

### Reglas de Seguridad
- ✅ Empleado/admin pueden leer y crear
- ✅ Solo admin puede editar/eliminar

### Índices Recomendados
```
pedidoId (Ascending)
clienteId (Ascending), createdAt (Descending)
createdAt (Descending)
fecha (Descending)
```

---

## 🔒 Seguridad General

### Principios
1. **Verificación de rol** — Todas las escrituras validan el rol del usuario
2. **Sin confianza en cliente** — Las reglas no usan datos del cliente
3. **Auditoría** — Incluir `createdBy`, `updatedAt` en cambios sensibles
4. **Validación** — Firestore rules valida tipos y rangos

### Roles Permitidos en Firestore
- `admin` — Acceso completo a todas las colecciones
- `empleado` — Lectura de todo, escritura en clientes/pedidos/pagos/stock
- `vendedor` — Lectura/escritura limitada a clientes y pedidos

---

## 📈 Índices Recomendados

Firestore sugiere automáticamente índices cuando ejecutas un query que los necesita.  
Si quieres preconfigurar, edita `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "clientes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "activo", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "pedidos",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clienteId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "pagos",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "clienteId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Luego despliega con:
```bash
firebase deploy --only firestore:indexes
```

---

## 🔧 Mantenimiento

### Consultas Útiles (Firestore Console)

**Pedidos pendientes de un cliente:**
```
collection: pedidos
where: clienteId == "{clienteId}" AND estado == "pendiente"
order by: createdAt (descending)
```

**Clientes con crédito disponible:**
```
collection: clientes
where: activo == true AND creditoDisponible > 0
```

**Stock bajo de alerta:**
```
collection: stock
where: cantidad < cantidadMinima
```

---

## 📞 Soporte y Cambios

Si necesitas:
- ✅ Agregar un nuevo campo → Edita este documento y crea una migración
- ✅ Cambiar estructura → Usa el script `migrate-collections.js`
- ✅ Renombrar colección → `node scripts/migrate-collections.js migrate oldName newName`
- ✅ Respaldar datos → `firebase firestore:export ./backup`

---

**Última actualización:** Diciembre 2024  
**Versión Firebase SDK:** 12.6.0
