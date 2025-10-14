// import admin from "firebase-admin";
// const serviceAccount = require("../serviceAccountKey.json");

// // Initialize Firebase Admin if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
//   });
// }

// export const db = admin.firestore();
// export const auth = admin.auth();

// export const verifyToken = async (
//   token: string
// ): Promise<admin.auth.DecodedIdToken | null> => {
//   try {
//     const decodedToken = await auth.verifyIdToken(token);
//     return decodedToken;
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return null;
//   }
// };

import admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();
const serviceAccount = require("../../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();

export const verifyToken = async (
  token: string
): Promise<admin.auth.DecodedIdToken | null> => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

export default admin;
