/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// FirebaseAdmin:
const firebaseAdmin = require("./../../config/firebase-connect")
// Body parser:
const bodyParser = require('body-parser')
// Global Değişkenler:
const globalVariables = require("./../../config/global-variables")


/* Ayarlar */
// POST islemini cozumlemek icin gerekli bir ayristirici
var urlencodedParser = bodyParser.urlencoded({ extended: false })


/* Program Akışı */
router.post("/anlik-isim-kayit", urlencodedParser, (req, res) => {
    // Rastgele sayı (10000, 99999):
    function getRandomNumber() {
        return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    }

    // random sayı:
    var rnd = getRandomNumber()
    // geçici isim:
    var nck = req.body.nick_name

    firebaseAdmin.database().ref("oyuncular").child(rnd).set({isim: nck, bosta: 1})
    globalVariables.playerID = rnd
    globalVariables.playerName = nck
    res.redirect("/")
    
})


/* Export */
module.exports = router