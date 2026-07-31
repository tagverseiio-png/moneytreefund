import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import { readFileSync } from 'fs';

// Check if already initialized to prevent errors during hot reloads
if (!getApps().length) {
  // Use absolute path to avoid issues with relative paths on production servers
  const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

export const auth = getAuth();
export const db = getFirestore();
