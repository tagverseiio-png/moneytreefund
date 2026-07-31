const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
async function run() {
  const users = await db.collection('users').get();
  users.forEach(doc => console.log(doc.id, doc.data().email, doc.data().role));
}
run().catch(console.error);
