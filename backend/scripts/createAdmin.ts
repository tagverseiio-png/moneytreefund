import dotenv from 'dotenv';
dotenv.config();

import { auth, db } from '../src/firebase/admin';

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npx tsx scripts/createAdmin.ts <email> <password>');
    process.exit(1);
  }

  try {
    console.log(`Creating user in Firebase Auth for ${email}...`);
    const userRecord = await auth.createUser({
      email,
      password,
      emailVerified: true,
    });

    console.log(`Setting role to Admin in Firestore for UID: ${userRecord.uid}...`);
    await db.collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      role: 'Admin',
      createdAt: new Date().toISOString()
    });

    console.log('✅ Admin user created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
