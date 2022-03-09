import { AppOptions, credential } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { initializeApp } from 'firebase-admin/app';

const certs = JSON.parse(process.env.firebase_certs);
console.log(certs);

const creds = credential.cert(certs);

export const firebaseOptions: AppOptions = {
  credential: creds,
  storageBucket: process.env.storage_bucket,
};
initializeApp(firebaseOptions);

export const firebaseBucket = getStorage().bucket();
