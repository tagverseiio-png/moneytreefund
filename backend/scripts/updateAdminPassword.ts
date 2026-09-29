import { auth, db } from '../src/firebase/admin';

async function updatePassword() {
  try {
    const adminDocs = await db.collection('users').where('role', 'in', ['Admin', 'Super Admin', 'Administrator']).get();
    if (adminDocs.empty) {
      console.log('No admin users found in Firestore.');
      process.exit(0);
    }

    const admin = adminDocs.docs[0].data();
    const uid = adminDocs.docs[0].id;
    const email = admin.email;

    await auth.updateUser(uid, {
      password: 'Money_TreeAdmin+65'
    });

    console.log(`Admin ID (UID): ${uid}`);
    console.log(`Admin Email: ${email}`);
    console.log(`New Password: Money_TreeAdmin+65`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updatePassword();
