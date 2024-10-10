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
globalVariables.preGamePlayerListRefresh = function (io, clientID, data1) {
    firebaseAdmin.database().ref("roomKeys").child(data1.roomKey).on("value", (snapshot) => {
        var data = snapshot.val()

        // Oda yoksa veritabanını okumayı durdur ve odanın kapandığını istemciye bildir:
        if (data === null) {
            firebaseAdmin.database().ref("roomKeys").child(data1.roomKey).off("value")
            io.sockets.to(clientID).emit("theRoomIsClosed")
            // Odadaki oyuncuları varsa sunucuya gönder:
        } else {
            io.sockets.to(clientID).emit("preGamePlayerListRefresh", {
                data: data
            })
        }
    })

}

// Odaya katılma fonksiyonu:
// globalVariables.joinTheRoom = function(io, clientID, data){
//     // Girilen oda anahtarı veritabanında mevcut mu?:
//     firebaseAdmin.database().ref("roomKeys").once("value", (snapshot)=>{
//         if (snapshot.exists()) {
//             var kontrol = false
//             var keys = Object.keys(snapshot.val())
//             keys.forEach((anahtar)=>{
//                 if (data.enteredRoomKey == anahtar) {
//                     // console.log("oda var")

//                     firebaseAdmin.database().ref("users").once("value", (snapshot1)=>{
//                         var usersID = Object.keys(snapshot1.val())

//                         usersID.forEach((anahtar1)=>{
//                             if (anahtar1 == data.playerID) {

//                                 var upd = {
//                                     [anahtar1]: {
//                                         admin: false,
//                                         name: snapshot1.val()[anahtar1].Name,
//                                         situation: 1
//                                     }
//                                 }

//                                 firebaseAdmin.database().ref("roomKeys").child(anahtar).update(upd)
//                                 io.sockets.to(clientID).emit("returnJoinTheRoom")

//                             }
//                         })

//                     })
//                     kontrol = true
//                 }
//             })
//             if (kontrol===false) {
//                 // console.log("oda yok")
//                 return io.sockets.to(clientID).emit("returnCouldNotJoinTheRoom")
//             }
//         }else{
//             return io.sockets.to(clientID).emit("returnCouldNotJoinTheRoom")
//         }
//     })
// }
globalVariables.joinTheRoom = function (io, clientID, data) {

    // Girilen oda anahtarı veritabanında mevcut mu?:
    firebaseAdmin.database().ref("roomKeys").once("value", (snapshot) => {
        if (snapshot.exists()) {
            var kontrol = false
            var hasTheGameStarted = false
            var keys = Object.keys(snapshot.val())
            var data1 = snapshot.val()

            keys.forEach((anahtar) => {

                if (data.enteredRoomKey == anahtar && data1[anahtar].gameConfig.situation != 0) {
                    hasTheGameStarted = true
                } else if (data.enteredRoomKey == anahtar && data1[anahtar].gameConfig.situation == 0) {
                    firebaseAdmin.database().ref("roomKeys").child(anahtar).update({
                        [data.playerID]: {
                            admin: false,
                            name: data.playerName,
                            situation: 1,
                            statusInformation: false
                        }
                    })
                    kontrol = true
                    io.sockets.to(clientID).emit("returnJoinTheRoom")
                }
            })

            if (hasTheGameStarted === true) {
                return io.sockets.to(clientID).emit("roomInformationToEnter", { situation: "theGameHasPassedTheInitialStage" })
            } else if (kontrol === false) {
                // console.log("oda yok")
                return io.sockets.to(clientID).emit("roomInformationToEnter", { situation: "noRoom" })
            }
        } else {
            return io.sockets.to(clientID).emit("roomInformationToEnter", { situation: "noRoom" })
        }
    })

}

router.get("/yeniOdaOlustur"/*, globalVariables.isLoggedIn*/, (req, res) => {

    firebaseAdmin.database().ref("roomKeys").once("value", (snapshot) => {
        var keys = Object.keys(snapshot.val())

        keys.forEach(anahtar => {
            if ((snapshot.val()[anahtar].gameConfig.creationDate) < (Date.now() - 24 * 60 * 60 * 1000)) {
                firebaseAdmin.database().ref("roomKeys").child(anahtar).remove()
            }
        })
    })

    // Rastgele oluşturulan oda kimliği:
    var randomRoomKey = Math.floor(Math.random() * (globalVariables.r_room_max - globalVariables.r_room_min + 1)) + globalVariables.r_room_min

    // Odayı oluşturmak:
    firebaseAdmin.database().ref("roomKeys").child(randomRoomKey).set({
        [req.query.playerID]: {
            name: req.query.playerName,
            situation: 1,
            admin: true,
            statusInformation: false
        },
        gameConfig: {
            situation: 0,
            creationDate: Date.now(),
            whichDay: 0
        }
    })

    // ve sonrasında kullanıcıyı odasına yönlendirmek:
    res.render("pregame", { gameName: globalVariables.gameName, roomKey: randomRoomKey })


    // var id_counter = globalVariables.r_id_length

    // console.log(req.query.playerID)
    // console.log(req.query.playerName)
    // console.log(globalVariables.r_id_length)

    // // Kullanıcıya atanan id'nin kontrolu:
    // req.query.playerID.split("").forEach(element => {
    //     for (let index = 0; index < 10; index++) {
    //         if (index == element) {
    //             // console.log("true")
    //             id_counter--
    //         }
    //     }
    // })
    // if (id_counter == 0) {
    //     console.log("parola sıkıntısız")
    // }else{
    //     console.log("cort")
    // }

    // console.log("id_counter: " + id_counter)


    // res.end()


    // -----------------------------------------------------------------------

    // res.render("pregame", { gameName: globalVariables.gameName, roomKey: "123" })

    // // Açılan odayı adminimizle birlikte gerçekzamanlı veritabanına kayıt ediyoruz:
    // firebaseAdmin.database().ref("users").once("value", (snapshot1)=>{

    //     // 6 haneli rastgele oda kodu oluşturuyoruz:
    //     var randomRoomKey = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000

    //     var usersID = Object.keys(snapshot1.val())

    //     usersID.forEach((anahtar1)=>{

    //         if (anahtar1 == req.body.playerID) {
    //             var upd = {
    //                 [anahtar1]: {
    //                     name: snapshot1.val()[anahtar1].Name,
    //                     situation: 1,
    //                     admin: true,
    //                 },
    //                 gameConfig: {
    //                     situation: 0
    //                 }
    //             }
    //             firebaseAdmin.database().ref("roomKeys").child(randomRoomKey).set(upd);
    //         }

    //     })
    //     res.render("pregame", { gameName: globalVariables.gameName, roomKey: randomRoomKey })
    // })

})

router.get("/odayaKatil"/*, globalVariables.isLoggedIn*/, (req, res) => {
    res.render("pregame", { gameName: globalVariables.gameName, roomKey: req.query.enteredRoomKey })
    res.end()
})

router.get("/NasilOynanir", (req, res)=>{
    res.render("howtoplay", {
        gameName: globalVariables.gameName
    })
    res.end()
})

router.get("/odadanAyriliniyor", (req, res) => {
    firebaseAdmin.database().ref("roomKeys/" + req.query.enteredRoomKey).child(req.query.playerID).remove()

    if (req.query.isItAdmin) {

        firebaseAdmin.database().ref("roomKeys/" + req.query.enteredRoomKey).once("value", (snapshot) => {

            if (snapshot.exists()) {
                var keys = Object.keys(snapshot.val())


                for (let i = 0; i < keys.length; i++) {

                    if (keys[i] == "gameConfig") {
                        continue
                    }

                    if (snapshot.val()[keys[i]].admin == false) {
                        firebaseAdmin.database().ref("roomKeys/" + req.query.enteredRoomKey).child(keys[i]).update({ admin: true })
                        break
                    }

                }

                if (keys.length == 1 && keys == "gameConfig") {
                    firebaseAdmin.database().ref("roomKeys/").child(req.query.enteredRoomKey).remove()
                }

                res.render("main-menu", {
                    gameName: globalVariables.gameName,
                    playerName: req.query.playerName,
                    // playerPhoto: playerPhoto,
                    playerID: req.query.playerID
                    // first: false
                })
                res.end()

            } else {
                res.render("main-menu", {
                    gameName: globalVariables.gameName,
                    playerName: req.query.playerName,
                    // playerPhoto: playerPhoto,
                    playerID: req.query.playerID
                    // first: false
                })
                res.end()
            }
        })
    } else {
        res.render("main-menu", {
            gameName: globalVariables.gameName,
            playerName: req.query.playerName,
            // playerPhoto: playerPhoto,
            playerID: req.query.playerID
            // first: false
        })
        res.end()
    }

})

router.get("/oyunuBaslat", (req, res) => {

    firebaseAdmin.database().ref("roomKeys/" + req.query.enteredRoomKey).child("gameConfig").update({
        situation: 1,
        toTheBeginningOfTheGame: Math.floor(Date.now() / 1000) + globalVariables.time_left_until_the_game_starts,
        // Buradaki kontrol oyunun bu aşaması geçildi mi anlamında:
        toTheBeginningOfTheGameControl: false
    })

})

router.get("/oyunBaslatiliyor", (req, res) => {
    res.render("game", {
        gameName: globalVariables.gameName,
        roomKey: req.query.enteredRoomKey
    })
})

/* Export */
// router'i dış kullanıma açıyoruz:
module.exports = router