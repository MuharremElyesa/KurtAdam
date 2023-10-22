/* Moduller */

// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// Firebase bağlantısı:
const firebase = require("../../config/firebase-connect")

// Ana dizin middleware:
router.use("/",(req,res)=>{
    // Express ile "open-login.pug" dosyasını response(göndermek) ediyoruz:
    res.render("open-login")
})

// router'i dış kullanıma açıyoruz:
module.exports = router