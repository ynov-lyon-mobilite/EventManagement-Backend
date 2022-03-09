import { AppOptions, credential } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp } from 'firebase-admin/app';

const creds = credential.cert({
  clientEmail: process.env.client_email,
  privateKey: process.env.private_key,
  projectId: process.env.project_id,
});

export const firebaseOptions: AppOptions = {
  credential: creds,
  storageBucket: process.env.storage_bucket,
};
initializeApp(firebaseOptions);

export const firebaseBucket = getStorage().bucket();
