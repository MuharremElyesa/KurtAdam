/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// FirebaseAdmin:
const firebaseAdmin = require("../../config/firebase-connect")
// Body parser:
const bodyParser = require('body-parser')
// Global Değişkenler:
const globalVariables = require("../../config/global-variables")


/* Ayarlar */
// POST islemini cozumlemek icin gerekli bir ayristirici
var urlencodedParser = bodyParser.urlencoded({ extended: false })


/* Program Akışı */
router.get("/cikis-yap", urlencodedParser, (req, res) => {
    
    // Oyuncuyu veritabanından silip ana menüye gönderir:
    firebaseAdmin.database().ref("oyuncular").child(globalVariables.playerID).remove()
    globalVariables.playerID = null
    globalVariables.playerName = null
    res.redirect("/")

})


/* Export */
module.exports = router