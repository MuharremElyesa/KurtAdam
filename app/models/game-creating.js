/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// FirebaseAdmin:
const firebaseAdmin = require("./../../config/firebase-connect")
// Global Değişkenler:
const globalVariables = require("./../../config/global-variables")

// Bu işlev, bir kullanıcının giriş yapmış olup olmadığını kontrol eder. Eğer kullanıcı giriş yapmışsa, işlemi devam ettirir; aksi takdirde, 401 (Yetki Reddedildi) hatası döndürür (aynını geçici çözüm olarak auth.js'ye de koyduk):
function isLoggedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        // res.sendStatus(401)
        res.redirect('/')
    }
}

router.use("/yeniOdaolustur", isLoggedIn, (req, res) => {
    // 6 haneli rastgele oda kodu oluşturuyoruz:
    globalVariables.randomRoomKey = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    // Açılan odayı adminimizle birlikte gerçekzamanlı veritabanına kayıt ediyoruz:
    firebaseAdmin.database().ref("roomKeys").child(globalVariables.randomRoomKey).set({
        [globalVariables.playerID]: {
            name: globalVariables.playerName,
            situation: 1,
            admin: true,
        },
        situation: 0
    });
    res.render("pregame", {gameName: globalVariables.gameName, roomKey: globalVariables.randomRoomKey})
})

/* Export */
// router'i dış kullanıma açıyoruz:
module.exports = router