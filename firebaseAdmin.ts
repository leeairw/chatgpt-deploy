import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

// re-create the json file service account using the environment variable
const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

if (!getApps().length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const adminDb = admin.firestore();

export {adminDb};