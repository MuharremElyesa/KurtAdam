/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// express app:
const app = express()
// FirebaseAdmin:
const firebaseAdmin = require("./../../config/firebase-connect")
// db--nick-name:
const db__nick_name = require("./../models/db--nick-name")


/* Program Akışı */
// db__nick_name:
router.use(db__nick_name)

// Ana dizin middleware:
router.use("/", (req, res) => {
    // Express ile "open-login.pug" dosyasını response (göndermek) ediyoruz:
    res.render("open-login")
})


/* Export */
// router'i dış kullanıma açıyoruz:
module.exports = router