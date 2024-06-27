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

        case "showingRoles":
            clientRequest = "showingRoles"
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

    // Fonksiyon içi değişkenler:
    var players=[]
    var roles=[]

    // Bundan önceki kontrol bitirilir:
    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).once("value", (snapshot)=>{
        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").update({
            toTheBeginningOfTheGameControl: true
        })

        // Odadaki kişi sayısını alıyoruz:
        for (let i = 0; i < Object.keys(snapshot.val()).length; i++) {
            if (Object.keys(snapshot.val())[i]=="gameConfig") {
                continue
            }
            // Odada bulunun oyuncuların ID'lerini bir diziye alıyoruz. Bunu yaptıktan sonra kaç kişi olduğunu da tespit edebiliyoruz:
            players.push(Object.keys(snapshot.val())[i])
        }

        // Global-variables'deki roller objesini getirip rolleri diziye aktarıyoruz:
        Object.keys(globalVariables.roles).forEach(element => {
            roles.push(element)
        })

        // Kaç tane kurt atanacağını belirliyoruz:
        var number_of_wolves = Math.floor(players.length / globalVariables.how_many_people_have_a_wolf)

        // Atanmış roller dizisi (Kurt sayısı kadar assignedRoles dizisine "wolf" yazdırıyoruz.):
        var assignedRoles = new Array(number_of_wolves).fill("wolf")

        // Geriye kaç kişi kaldıysa, o kadar köylü rolu atıyoruz (ŞİMDİLİK):
        var number_of_people_remaining = players.length - number_of_wolves

        // Diğer rolleri rastgele bir şekilde dağıtıyoruz  (Şu anda sadece KÖYLÜ):
        var remaining_roles = new Array(number_of_people_remaining).fill("villager")
        // for (let i = 0; i < number_of_people_remaining; i++) {
        //     var randomRole = roles[Math.floor(Math.random()*roles.length)]
        //     remaining_roles.push(randomRole)
        // }

        // Kurtlar ve diğer rolleri tek dizide birleştiriyoruz:
        var all_roles = assignedRoles.concat(remaining_roles)

        // Rolleri karıştırmak için Fisher-Yates algoritmasını kullanıyoruz:
        shuffleArray(all_roles)

        // Kişileri karıştırmak için Fisher-Yates algoritmasını kullanıyoruz:
        shuffleArray(players)

        // Kullanıcı idlerine rolleri değıtıyoruz:
        var user_roles = {}
        players.forEach((id, index) => {
            user_roles[id] = all_roles[index]
        })

        // Atanan rolleri veritabanında kişilere yazdırıyoruz:
        for (let i = 0; i < players.length; i++) {
            firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).child(Object.keys(user_roles)[i]).update({
                role: Object.values(user_roles)[i]
            })
        }

        // Rol dağıtım mevzusu bittikten sonra rolün ekranda gösterileceği süreyi giriyoruz:
        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").update({
            showingRoles: timeKeeper(globalVariables.showing_roles),
            showingRolesControl: false
        })

    })
}

// Dizileri karıştırma işlevi
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Şimdiki zamanın üstüne zaman koymamızı sağlayan fonksiyon:
function timeKeeper(/*Koyulacak zaman*/ timeToBePlaced) {
    return Math.floor(Date.now() / 1000) + timeToBePlaced
}