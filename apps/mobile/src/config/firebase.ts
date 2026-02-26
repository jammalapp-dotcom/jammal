// ============================================================================
// JAMMAL — Firebase Configuration (Mobile)
// Project: jammal-19ae4
// ============================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDummyKeyReplace',
    authDomain: 'jammal-19ae4.firebaseapp.com',
    projectId: 'jammal-19ae4',
    storageBucket: 'jammal-19ae4.firebasestorage.app',
    messagingSenderId: '790087662857',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:790087662857:web:placeholder',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
