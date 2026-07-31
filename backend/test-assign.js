const axios = require('axios');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  const layouts = await db.collection('document_layouts').get();
  const layoutId = layouts.docs[0].id;
  const clients = await db.collection('clients').get();
  const clientId = clients.docs[0].id;

  console.log("Client ID:", clientId, "Layout ID:", layoutId);
}
run();
