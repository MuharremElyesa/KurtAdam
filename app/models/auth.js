/* BU SAYFA ŞİMDİLİK İPTAL EDİLMİŞTİR. BU SÜRÜMDE SADECE NICKNAME İLE GİRİŞ YAPILMASI UYGUN GÖRÜLMÜŞTÜR. BU SAYFA ŞU ANDA SADECE NICKNAME İÇİN KULLANILIYOR.*/

// /* Moduller */
// // Express.js'i tanımladık:
const express = require("express")
// // express'in Router metodunu tanımladık:
const router = express.Router()
// // passport.js:
// const passport = require("passport")
// // express-session:
// const session = require("express-session")
// // FirebaseAdmin:
// const firebaseAdmin = require("./../../config/firebase-connect")
// // crypto:
// const crypto = require('crypto');
// // Global Değişkenler:
const globalVariables = require("./../../config/global-variables")

// // Rastgele bir dizi oluşturuyoruz:
// const secret = crypto.randomBytes(32).toString('hex');

// // passport.js google OAuth2.0 stratejisi:
// var GoogleStrategy = require('passport-google-oauth20').Strategy;
// // Bu kısmı çok bilmiyorum. clientID, clientSecret ve callbackURL kısmını google developer console'dan alıyoruz. callbackURL'yi kendimiz oluşturduk ve verdik. Aşağıdaki fonksiyonun veritabanı kayıt gibi değişik özellikleri varmış ama şimdilik null çektik ve bu şekilde bıraktık.
// passport.use(new GoogleStrategy({
//     clientID: "",
//     clientSecret: "",
//     callbackURL: ""
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     return cb(null, profile);
//   }
// ));
// // Bu iki arkadaş kullanıcının bilgilerinin ne şekilde kullanılacağını belirliyormuş. Ayrıntılarını bilmiyorum.
// passport.serializeUser((user, done)=>{done(null, user)})
// passport.deserializeUser((user, done)=>{done(null, user)})
// // Oturum yöntemini etkinleştirmekte kullanılıyormuş:
// router.use(session({secret:secret}))
// // Passport kütüphanesini Express uygulamanıza entegre eder:
// router.use(passport.initialize())
// // Passport'ın oturum desteğini etkinleştirir. Bu işlev, Express oturumlarını (Session) Passport ile senkronize eder:
// router.use(passport.session())
// // Bu işlev, bir kullanıcının giriş yapmış olup olmadığını kontrol eder. Eğer kullanıcı giriş yapmışsa, işlemi devam ettirir; aksi takdirde, 401 (Yetki Reddedildi) hatası döndürür:
// globalVariables.isLoggedIn = function(req, res, next) {
//     if (req.user) {
//       next()
//     }else{
//       // res.sendStatus(401)
//       res.redirect('/')
//     }
// }

// /* Program Akışı */

// /* Google: */
// // Google ile oturum açma sayfasına yönlendiriyor:
// router.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}))

// // Geri dönen oturumun başarı durumuna göre yönlendirmek:
// router.get("/auth/google/callback", passport.authenticate("google", {
//     successRedirect: "/profile",
//     failureRedirect: "/failure"
// }))

// // Başarılı giriş:
// router.get("/profile", globalVariables.isLoggedIn, (req, res) => {
//   // Kullanıcı bilgileri:
//   const kb = req.user._json
//   // Kullanıcı bilgilerini global değişkene aldık:
//   var playerID = kb.sub
//   var playerFullname = kb.name
//   var playerName = kb.given_name
//   var playerSurame = kb.family_name
//   var playerPhoto = kb.picture

//   // Kullanıcı önceden giriş yapmış mı değişkeni:
//   let istThereAUser = false
//   firebaseAdmin.database().ref("users").once("value").then((snapshot)=>{
//     // Düğüm varsa:
//     if (snapshot.exists()) {
//       let keys = Object.keys(snapshot.val())
//       // Kullanıcının kaydı varsa:
//       keys.forEach(function(key) {
//         // Kullanıcı önceden giriş yapmış mı?:
//         if (key == playerID) {
//           // console.log("devamlı müşteri ;)")
//           istThereAUser = true
//           res.render("main-menu", {
//             gameName: globalVariables.gameName,
//             playerName: playerName,
//             playerPhoto: playerPhoto,
//             playerID: kb.sub,
//             first: false
//           })
//         }
//       })
//       // Kullanıcının kaydı yoksa:
//       if(istThereAUser == false){
//         // console.log("yeni giriş yapıldı")
//         firebaseAdmin.database().ref("users").child(playerID).set({
//           Fullname: playerFullname,
//           Name: playerName,
//           Surname: playerSurame,
//           Photo: playerPhoto,
//           AtGame: false
//         })
//         res.render("main-menu", {
//           gameName: globalVariables.gameName,
//           playerName: playerName,
//           playerPhoto: playerPhoto,
//           playerID: kb.sub,
//           first: true
//         })
//       }
//     }
//     // Düğüm yoksa:
//     else{
//       // Veri tabanı boş ise yeni kullanıcıyı kayıt ediyoruz:
//       // console.log("ilk giriş")
//       firebaseAdmin.database().ref("users").child(playerID).set({
//           Fullname: playerFullname,
//           Name: playerName,
//           Surname: playerSurame,
//           Photo: playerPhoto,
//           AtGame: false
//         })
//         res.render("main-menu", {
//           gameName: globalVariables.gameName,
//           playerName: playerName,
//           playerPhoto: playerPhoto,
//           playerID: kb.sub,
//           first: true
//         })

//     }
//   }).catch((error) => {
//     console.error(error)
//     res.end("<!DOCTYPE html><meta charset='UTF-8'><p>Eyyyvah. olmaması gereken bir durum oluştu. Lütfen ana sayfaya dönüp yaptığınız işlemi tekrar deneyin.</p>")
//   })

// });

// // Başarısız giriş:
// router.get("/failure", (req, res) => {
//   res.end("<!DOCTYPE html><meta charset='UTF-8'><p>Oturum açma hatası!. Lütfen geri dönüp tekrar deneyin!</p>")
// });

// Çıkış yapmak:
router.get("/logout", (req, res) => {
//   req.logout((err)=>{
//       if(err) return
//       res.render("open-login", {gameName: globalVariables.gameName})
//   })
    res.redirect('/')
})

// Misafir Girişi:
router.get("/takmaIsimIleGiris", (req, res)=>{
    globalVariables.bannedCharacters1.split(" ").forEach(function(params) {
        req.query.nickName.split("").forEach(function(params1) {
            if (params == params1) {
                res.redirect('/')
                res.end()
                return
            }
        })
    })
    if (req.query.nickName == "") {
        res.redirect('/')
        res.end()
    }
    // Raastgele id:
    var randomNumber = Math.floor(Math.random() * (globalVariables.r_id_max - globalVariables.r_id_min + 1)) + globalVariables.r_id_min
    res.render("main-menu", {
        gameName: globalVariables.gameName,
        playerName: req.query.nickName,
        // playerPhoto: playerPhoto,
        playerID: randomNumber
        // first: false
    })
    res.end()
})

// /* Export */
module.exports = router