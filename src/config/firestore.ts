import admin from 'firebase-admin';
import * as serviceAccount from './eterna-db-firebase-adminsdk-fbsvc-a680eb0670.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const db = admin.firestore();
