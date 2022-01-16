const admin = require("firebase-admin");
const serviceAccount = require("../config/firebase");
module.exports = {
    init() {       
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log("Firebase service initialized");
    }
}
