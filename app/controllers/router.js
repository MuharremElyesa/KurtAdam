/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()

/* Program Akışı */

// Oturum Açmak:
router.use("/GoogleSignIn",(req,res)=>{
    res.send("deneme")
})

// Ana dizin middleware:
router.use("/",(req,res)=>{
    // Express ile "open-login.pug" dosyasını response (göndermek) ediyoruz:
    res.render("open-login")
})


/* Export */
// router'i dış kullanıma açıyoruz:
module.exports = router