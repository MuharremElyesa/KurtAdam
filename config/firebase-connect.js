/* Moduller */
// Firebase-admin'i tanımladık:
const firebaseAdmin = require("firebase-admin")
// Firebase projesinden aldığımız anahtarı tanımladık:
const serviceAccount = require("./service-account-key.json")


// Firebase'i başlatıyoruz
firebaseAdmin.initializeApp({
    // Kimlik olarak aldığımız anahtarı tanımladık:
    credential: firebaseAdmin.credential.cert(serviceAccount),
    // Realtime database'imizin URL'sini tanımladık:
    databaseURL: "/*Firebase realtime database'inizin url'sini bu alana yazın*/"
})

// firebaseAdmin'i dış kullanıma açtık:
module.exports = firebaseAdmin