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
// Global Değişkenler:
const globalVariables = require("./../../config/global-variables")
// db--sign-out:
const db__sign_out = require("./../models/db--sign-out")


/* Program Akışı */
// db__nick_name:
router.use(db__nick_name)
// db__sign_out:
router.use(db__sign_out)

// Ana dizin middleware:
router.use("/", (req, res) => {
    // Oyuncu geçici ismini aldı mı?:
    if (globalVariables.playerName && globalVariables.playerID) {
        res.render("main-menu", {gameName: globalVariables.gameName, playerName: globalVariables.playerName})
    }else{
        // Express ile "open-login.pug" dosyasını response (göndermek) ediyoruz:
        // Virgülden sonrasında sayfaya değişken gönderdik.
        res.render("open-login", {gameName: globalVariables.gameName})
    }
})


/* Export */
// router'i dış kullanıma açıyoruz:
module.exports = router