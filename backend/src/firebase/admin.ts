import * as dotenv from 'dotenv';
dotenv.config(); // Ensure env vars are loaded before Firebase init

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

// Check if already initialized to prevent errors during hot reloads
if (!getApps().length) {
  let serviceAccount: any;

  // Production: load credentials from environment variables
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
    serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID || '',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    };
  } else {
    // Local dev fallback: load from serviceAccountKey.json file
    const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
    if (!existsSync(serviceAccountPath)) {
      throw new Error(
        'Firebase credentials not found. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables, or provide serviceAccountKey.json for local dev.'
      );
    }
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  }

  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

export const auth = getAuth();
export const db = getFirestore();
