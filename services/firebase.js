import admin from "firebase-admin";
import serviceAccount from "../config/firebase.js";

const firebase = {
  init() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase service initialized");
  },
};
export default firebase
