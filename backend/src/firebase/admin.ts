import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Check if already initialized to prevent errors during hot reloads
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(), // Relies on GOOGLE_APPLICATION_CREDENTIALS env var
    // Alternately, you can use: cert(serviceAccountJson)
  });
}

export const auth = getAuth();
export const db = getFirestore();
