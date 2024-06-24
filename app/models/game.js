// FirebaseAdmin:
const firebaseAdmin = require("./../../config/firebase-connect")
// Global Değişkenler:
const globalVariables = require("./../../config/global-variables")

// Süre talebi:
globalVariables.timeQueryFunction = function(io, clientID, data) {
    // Gelen isteğin ne olduğunu kayda aldığımız değişken:
    var clientRequest

    // Gelen isteğin ne olduğunu tespit edip değişkenimize isteği atıyoruz:
    switch (data.timeQuery) {
        case "forTheGameToStart":
            clientRequest = "toTheBeginningOfTheGame"
            break;
    
        default:
            break;
    }

    // Client ne istediyse onu veriyoruz:
    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").once("value", (snapshot)=>{
        io.sockets.to(clientID).emit("sendingTime", {time: snapshot.val()[clientRequest], emit: clientRequest, control: snapshot.val()[clientRequest+"Control"]})
    })

}

// Kişileri client'e gönderen socket:
globalVariables.listContats = function(io, clientID, data) {
    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).on("value", (snapshot)=>{
        io.sockets.to(clientID).emit("sendListContats", {data: snapshot.val()})
    })
}

// Rol dağıtımı:
globalVariables.roleDistribution = function(io, clientID, data) {
    // Bundan önceki kontrol bitirilir:
    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).once("value", (snapshot)=>{
        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").update({
            toTheBeginningOfTheGameControl: true
        })
        // Buradan sonra rol dağıtımı yapılacak ve devam edilecek...
    })
}