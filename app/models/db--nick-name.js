/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// FirebaseAdmin
const firebaseAdmin = require("./../../config/firebase-connect")
// Body parser
const bodyParser = require('body-parser')


/* Ayarlar */
// POST islemini cozumlemek icin gerekli bir ayristirici
var urlencodedParser = bodyParser.urlencoded({ extended: false })


/* Program Akışı */
router.post("/anlik-isim-kayit", urlencodedParser, (req, res) => {
    console.log(req.body.nick_name)
})


/* Export */
module.exports = router