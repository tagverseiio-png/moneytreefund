const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  const snapshot = await db.collection('document_requests').get();
  console.log("Total requests:", snapshot.size);
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data().title, doc.data().clientId);
  });
}
run();
