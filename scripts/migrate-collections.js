#!/usr/bin/env node
// ============================================================
// migrate-collections.js
// Herramienta para migrar/renombrar colecciones en Firestore
// ============================================================
// Uso: node scripts/migrate-collections.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ============================================================
// 1. CARGAR SERVICE ACCOUNT KEY
// ============================================================
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ ERROR: No se encuentra serviceAccountKey.json');
  console.error('   Descárgalo desde Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ============================================================
// 2. FUNCIONES DE MIGRACIÓN
// ============================================================

/**
 * Migra una colección completa a un nuevo nombre
 * @param {string} oldCollName - Nombre actual de la colección
 * @param {string} newCollName - Nuevo nombre de la colección
 */
async function migrateCollection(oldCollName, newCollName) {
  console.log(`\n📦 Migrando: ${oldCollName} → ${newCollName}`);

  const oldColl = db.collection(oldCollName);
  const newColl = db.collection(newCollName);

  try {
    const snapshot = await oldColl.get();
    const totalDocs = snapshot.size;

    if (totalDocs === 0) {
      console.log(`   ⚠️  La colección '${oldCollName}' está vacía. Saltando.`);
      return;
    }

    console.log(`   📋 Total de documentos a migrar: ${totalDocs}`);

    let batchCounter = 0;
    let batch = db.batch();
    let batchSize = 0;
    const MAX_BATCH_SIZE = 450; // Firestore batch limit

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Agregar al nuevo doc
      batch.set(newColl.doc(doc.id), data);

      // Eliminar el viejo
      batch.delete(oldColl.doc(doc.id));

      batchSize++;

      // Cada 450 operaciones, hacer commit
      if (batchSize >= MAX_BATCH_SIZE) {
        await batch.commit();
        batchCounter++;
        console.log(`   ✅ Batch ${batchCounter} completado (${Math.min(batchSize * batchCounter, totalDocs)}/${totalDocs})`);
        batch = db.batch();
        batchSize = 0;
      }
    }

    // Commit final si quedan docs
    if (batchSize > 0) {
      await batch.commit();
      batchCounter++;
      console.log(`   ✅ Batch final completado (${totalDocs}/${totalDocs})`);
    }

    console.log(`   ✨ Migración completada: ${totalDocs} documentos copiados y originales eliminados`);
  } catch (error) {
    console.error(`   ❌ Error durante la migración: ${error.message}`);
    throw error;
  }
}

/**
 * Crea documentos iniciales en una colección (útil para setup)
 */
async function seedCollection(collName, documents) {
  console.log(`\n🌱 Sembrando colección: ${collName}`);

  const coll = db.collection(collName);

  try {
    for (const doc of documents) {
      const docId = doc.id || `doc-${Date.now()}`;
      delete doc.id;

      await coll.doc(docId).set(doc);
      console.log(`   ✅ Documento '${docId}' creado`);
    }

    console.log(`   ✨ ${documents.length} documentos sembrados en '${collName}'`);
  } catch (error) {
    console.error(`   ❌ Error al sembrar: ${error.message}`);
    throw error;
  }
}

/**
 * Lista todos los documentos de una colección
 */
async function listCollection(collName) {
  console.log(`\n📋 Listando colección: ${collName}`);

  const coll = db.collection(collName);

  try {
    const snapshot = await coll.get();

    if (snapshot.empty) {
      console.log(`   (vacía)`);
      return;
    }

    snapshot.forEach(doc => {
      console.log(`   • ${doc.id}:`, JSON.stringify(doc.data(), null, 2).split('\n').slice(0, 3).join('\n'));
    });

    console.log(`   Total: ${snapshot.size} documentos`);
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

// ============================================================
// 3. MENÚ INTERACTIVO (O EJECUTAR DIRECTAMENTE)
// ============================================================

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   HERRAMIENTA DE MIGRACIÓN DE FIRESTORE');
  console.log('═══════════════════════════════════════════════════════');

  // Detectar argumentos de línea de comandos
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Modo demostración: mostrar estructura actual
    console.log('\n📊 ESTRUCTURA ACTUAL DE FIRESTORE:\n');

    const collections = ['clientes', 'pedidos', 'pedidos_items', 'productos', 'stock', 'usuarios', 'pagos'];

    for (const collName of collections) {
      await listCollection(collName);
    }

    console.log('\n' +
      '═══════════════════════════════════════════════════════\n' +
      '💡 USO:\n' +
      '   node scripts/migrate-collections.js <comando> [args]\n\n' +
      'Comandos:\n' +
      '   migrate <oldName> <newName>  : Renombrar colección\n' +
      '   list <collName>              : Listar documentos\n' +
      '   seed <collName>              : Sembrar datos iniciales\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      'Ejemplos:\n' +
      '   node scripts/migrate-collections.js migrate prooductos productos\n' +
      '   node scripts/migrate-collections.js list clientes\n' +
      '═══════════════════════════════════════════════════════\n'
    );

    process.exit(0);
  }

  // Procesar comandos
  const command = args[0];

  switch (command) {
    case 'migrate':
      if (args.length < 3) {
        console.error('❌ Uso: migrate <oldName> <newName>');
        process.exit(1);
      }
      await migrateCollection(args[1], args[2]);
      break;

    case 'list':
      if (args.length < 2) {
        console.error('❌ Uso: list <collName>');
        process.exit(1);
      }
      await listCollection(args[1]);
      break;

    case 'seed':
      if (args.length < 2) {
        console.error('❌ Uso: seed <collName>');
        process.exit(1);
      }
      // Ejemplo: sembrar colección de prueba
      const sampleDocs = [
        { id: 'cliente-001', nombre: 'Juan Pérez', email: 'juan@example.com', createdAt: Date.now() },
        { id: 'cliente-002', nombre: 'María López', email: 'maria@example.com', createdAt: Date.now() }
      ];
      await seedCollection(args[1], sampleDocs);
      break;

    default:
      console.error(`❌ Comando desconocido: ${command}`);
      process.exit(1);
  }

  // Cerrar conexión
  await admin.app().delete();
  console.log('\n✅ Proceso completado\n');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
