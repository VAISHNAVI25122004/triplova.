import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Environment check to help debug 'Firebase not initialized'
const requiredEnv = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID'
];

requiredEnv.forEach(key => {
    if (!import.meta.env[key] || import.meta.env[key].includes('your_')) {
        console.warn(`⚠️ Firebase Config Warning: ${key} is missing or using placeholder in .env`);
    }
});

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('your_')) {
    throw new Error("Missing or invalid VITE_FIREBASE_API_KEY. Check your frontend .env file.");
}

// Initialize Firebase only if not already initialized
let app;
try {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
        console.log("🔥 Firebase initialized successfully.");
    } else {
        app = getApps()[0];
    }
} catch (error) {
    console.error("❌ Firebase initialization failed:", error);
}

// Export auth even if app failed (methods will throw meaningful errors)
export const auth = getAuth(app);
export default app;
