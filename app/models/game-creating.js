/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// FirebaseAdmin:
const firebaseAdmin = require("./../../config/firebase-connect")
// Global Değişkenler:
const globalVariables = require("./../../config/global-variables")


// Oyun öncesi odaya girdiğimizde odada kimlerin olduğunu listeleyen ve anlık yenileyen fonksiyon:
globalVariables.preGamePlayerListRefresh = function(io){
    firebaseAdmin.database().ref("roomKeys").child(globalVariables.randomRoomKey).on("value", (snapshot) => {
        var data = snapshot.val()

        // Oda yoksa veritabanını okumayı durdur ve odanın kapandığını istemciye bildir:
        if (data === null) {
            firebaseAdmin.database().ref("roomKeys").child(globalVariables.randomRoomKey).off("value")
            io.sockets.emit("theRoomIsClosed")
        // Odadaki oyuncuları varsa sunucuya gönder:
        }else{
            io.sockets.emit("preGamePlayerListRefresh", {
                data: data,
                id: globalVariables.playerID
            })
        }
    })
    
}

// Odaya katılma fonksiyonu:
globalVariables.joinTheRoom = function(io, data){
    // Girilen oda anahtarı veritabanında mevcut mu?:
    firebaseAdmin.database().ref("roomKeys").once("value", (snapshot)=>{
        if (snapshot.exists()) {
            var kontrol = false
            var keys = Object.keys(snapshot.val())
            keys.forEach((anahtar)=>{
                if (data.enteredRoomKey == anahtar) {
                    // console.log("oda var")
                    firebaseAdmin.database().ref("roomKeys").child(anahtar).update({
                        [globalVariables.playerID]: {
                            admin: false,
                            name: globalVariables.playerName,
                            situation: 1
                        }
                    })
                    io.sockets.emit("returnJoinTheRoom")
                    kontrol = true
                }
            })
            if (kontrol===false) {
                // console.log("oda yok")
                return io.sockets.emit("returnCouldNotJoinTheRoom")
            }
        }else{
            return io.sockets.emit("returnCouldNotJoinTheRoom")
        }
    })
}

router.use("/yeniOdaolustur", globalVariables.isLoggedIn, (req, res) => {
    // 6 haneli rastgele oda kodu oluşturuyoruz:
    globalVariables.randomRoomKey = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    // Açılan odayı adminimizle birlikte gerçekzamanlı veritabanına kayıt ediyoruz:
    firebaseAdmin.database().ref("roomKeys").child(globalVariables.randomRoomKey).set({
        [globalVariables.playerID]: {
            name: globalVariables.playerName,
            situation: 1,
            admin: true,
        },
        gameConfig: {
            situation: 0
        }
    });

    res.render("pregame", { gameName: globalVariables.gameName, roomKey: globalVariables.randomRoomKey })
})

router.use("/odayaKatil", globalVariables.isLoggedIn, (req, res) => {
    const postData = req.body
    firebaseAdmin.database().ref("roomKeys").once("value", (snapshot)=>{
        var data = Object.keys(snapshot.val())
        data.forEach(function(keys){
            if(keys == postData.roomKey){
                // Yazılan odaya giriş:
                res.render("pregame", { gameName: globalVariables.gameName, roomKey: keys })
                res.end("sss")
            }
        })
    })
})

/* Export */
// router'i dış kullanıma açıyoruz:
module.exports = router