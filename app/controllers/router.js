/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// express app:
const app = express()
// FirebaseAdmin:
const firebaseAdmin = require("./../../config/firebase-connect")
// Oturum açmak:
const auth = require("../models/auth")
// Global Değişkenler:
const globalVariables = require("./../../config/global-variables")


/* Program Akışı */
// auth:
router.use(auth)

// Ana dizin middleware:
router.use("/", (req, res) => {
    res.render("open-login", {gameName: globalVariables.gameName})
})


/* Export */
// router'i dış kullanıma açıyoruz:
module.exports = router