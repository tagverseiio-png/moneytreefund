const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  const id = 'oTcK97FPCIhWKNpphdoFXgh89Os2';
  const layoutId = 'hndgvUSMM7rq6y3SulQj';

  try {
    const batch = db.batch();
    batch.update(db.collection('clients').doc(id), { layoutId });
    batch.update(db.collection('users').doc(id), { layoutId });

    // Fetch the layout to get requiredDocs
    const layoutDoc = await db.collection('document_layouts').doc(layoutId).get();
    if (layoutDoc.exists) {
      const requiredDocs = layoutDoc.data()?.requiredDocs || [];
      console.log('Required docs found in layout:', requiredDocs.length);
      
      // Fetch existing requests to prevent duplicate generation
      const existingReqsSnap = await db.collection('document_requests')
        .where('clientId', '==', id)
        .get();
      const existingTitles = new Set(existingReqsSnap.docs.map(doc => doc.data().title));
      console.log('Existing requests:', existingTitles);

      for (const docReq of requiredDocs) {
        if (!existingTitles.has(docReq.title)) {
          console.log('Adding new request for:', docReq.title);
          const newReqRef = db.collection('document_requests').doc();
          batch.set(newReqRef, {
            id: newReqRef.id,
            clientId: id,
            title: docReq.title,
            description: docReq.description || '',
            type: docReq.type || 'file',
            status: 'Pending',
            createdAt: new Date().toISOString(),
            createdBy: 'admin'
          });
        }
      }
    } else {
        console.log('Layout doc does not exist');
    }

    await batch.commit();
    console.log('Batch committed successfully');
  } catch(e) {
      console.error(e);
  }
}
run();
