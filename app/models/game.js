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

        case "night":
            clientRequest = "night"
            break;

        case "day":
            clientRequest = "day"
            break;

        case "vote":
            clientRequest = "vote"
            break;
    
        default:
            break;
    }

    // Client ne istediyse onu veriyoruz:
    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").once("value").then((snapshot)=>{
        io.sockets.to(clientID).emit("sendingTime", {time: snapshot.val()[clientRequest], emit: clientRequest, control: snapshot.val()[clientRequest+"Control"], day: snapshot.val().whichDay})
    }).catch((error)=>{console.error(error)})

}

// Kişileri client'e gönderen socket:
globalVariables.listContats = function(io, clientID, data) {

    // Kişi çıktıysa ya da oyun bittiyse on fonksiyonu durduruluyor:
    if (data.leave == "leave" || data.game == "finished") {
        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).off()
    }else{
        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).on("value", (snapshot)=>{
            if (snapshot.exists()) {
                io.sockets.to(clientID).emit("sendListContats", {data: snapshot.val()})
                if (snapshot.val()["gameConfig"].situation == 2 || (snapshot.val()["gameConfig"].creationDate) < (Date.now()-24*60*60*1000)) {
                    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).off()
                }  
            }
        })
        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).on("child_changed", (snapshot)=>{
            if (snapshot.exists() && snapshot.key != "gameConfig") {
                io.sockets.to(clientID).emit("latestChanges", {data: snapshot.val(), changingData: snapshot.key})
            }
        })
    }

}

// Rol dağıtımı:
globalVariables.roleDistribution = function(io, clientID, data) {

    // Fonksiyon içi değişkenler:
    var players=[]
    var roles=[]
    var v1=-1, v2=0, v3=0 /*Bu değişkenler ilk kurtadam oyunundan geliyor. Aşağıda while döngüsünde kullanıldı.*/

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
        var number_of_wolves = players.length / globalVariables.how_many_people_have_a_wolf

        // Eski kurtadam oyunundan alınan kaç kurt atanması gerektiğini hesap eden döngü:
        while (v3==0) {
            v1++,v2++
           if (number_of_wolves > v1 && number_of_wolves <= v2) {
                v3++
            } 
        }
        
        // Atanmış roller dizisi (Kurt sayısı kadar assignedRoles dizisine "wolf" yazdırıyoruz.):
        var assignedRoles = new Array(v2).fill("wolf")

        // Geriye kaç kişi kaldıysa, o kadar köylü rolu atıyoruz (ŞİMDİLİK):
        var number_of_people_remaining = players.length - v2

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
                role: Object.values(user_roles)[i],
                isTheRoleOpenToEveryone: false
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

// Gece:
globalVariables.night = function(io, clientID, data) {

    endOfStageVoteControl(data.enteredRoomKey)
    isEveryoneOnTheSameTeam(data.enteredRoomKey)
    voteResetter(data.enteredRoomKey)
    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").update({
        showingRolesControl: true,
        voteControl: true,
        night: timeKeeper(globalVariables.nightTime),
        nightControl: false
    })
}

// Gündüz:
globalVariables.day = function(io, clientID, data) {

    endOfStageVoteControl(data.enteredRoomKey)
    isEveryoneOnTheSameTeam(data.enteredRoomKey)
    voteResetter(data.enteredRoomKey)
    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").once("value", (snapshot)=>{
        // console.log(snapshot.val().whichDay)

        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").update({
            nightControl: true,
            day: timeKeeper(globalVariables.dayTime),
            dayControl: false,
            whichDay: snapshot.val().whichDay + 1
        })

    })

}

// Oy:
globalVariables.vote = function(io, clientID, data) {
    voteResetter(data.enteredRoomKey)
    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey+"/gameConfig").update({
        dayControl: true,
        vote: timeKeeper(globalVariables.voteTime),
        voteControl: false
    })
}

// Oyun esnasındayken odadan çıkış isteği:
globalVariables.escapeFromTheRoom = function(io, clientID, data) {

    // Oda anahtarını kontrol için tutuyoruz:
    const roomKeyRef = firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey)

    roomKeyRef.once("value")
    .then((roomSnapshot)=>{
        if (roomSnapshot.exists()) {
            // Oyuncu ID'sini kontrol için tutuyoruz:
            const playerRef = roomKeyRef.child(data.playerID)

            playerRef.once("value")
            .then((playerSnapshot)=>{
                if (playerSnapshot.exists()) {
                    playerRef.update({
                        admin: false,
                        isTheRoleOpenToEveryone: true,
                        situation: 3
                    })
                }
            }).catch((error)=>{console.error(error)})
        }
    }).catch((error)=>{console.error(error)})

    if (data.isItAdmin) {
        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).once("value")
        .then((snapshot)=>{

            var keys = Object.keys(snapshot.val())
    
            for (let i = 0; i < keys.length; i++) {

                if(keys[i] == "gameConfig"){
                    continue
                }

                if (snapshot.val()[keys[i]].admin == false) {
                    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).child(keys[i]).update({admin: true})
                    break
                }
                
            }

        }).catch((error)=>{console.error(error)})
    }    

    // Çıkış yapıldıktan sonra kalan kişiler aynı takıma mı sorgusu:
    isEveryoneOnTheSameTeam(data.enteredRoomKey)
    // Sonrasında client'e çıkış yapması için emit atıyoruz:
    io.sockets.to(clientID).emit("escapeFromTheRoom")
}

// Oy verme isteği:
globalVariables.voting = function(io, clientID, data) {

    // Oylanan kişi:
    // console.log(data.votedPerson)
    // Oyu veren kişi:
    // console.log(data.personVoting)
    // Oylamanın döndüğü oyun:
    // console.log(data.enteredRoomKey)
    // Hangi oylama?:
    // console.log(data.whichVoteIsThis)
    // Kimler oylayabilir ve görebilir:
    // console.log(data.whoDoesItCover)

    // Kendine oy veremezsin :):
    if (data.votedPerson != data.personVoting) {

        // Zaten oy vermişsek, oyumuzu geri alıyoruz:
        firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).child(data.personVoting).once("value", (snapshot)=>{
            // Oy vermişse geri alıyoruz:
            if (snapshot.val().votedPerson == data.votedPerson) {
                
                firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).child(data.personVoting).child("votedPerson").remove()
                firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).child(data.personVoting).child("whichVoteIsThis").remove()
                firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).child(data.personVoting).child("whoDoesItCover").remove()

            // Vermediyse veriyoruz:
            }else{

                firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).child(data.personVoting).update({
                    votedPerson: data.votedPerson,/*Oy verdiği kişinin ID'si*/
                    whoDoesItCover: data.whoDoesItCover,/*Oylamayı kimler görebilir?*/
                    whichVoteIsThis: data.whichVoteIsThis/*Verilen oy türü (köy oylaması, kurt oylaması gibi.)*/
                })
                
            }
        })

    }
}

// Öldü bilgisi tamamlayıcısı
globalVariables.deathInformationComplement = function(io, clientID, data) {

    firebaseAdmin.database().ref("roomKeys/"+data.enteredRoomKey).child(data.playerID).update({
        statusInformation: true
    })

}

// Her süre sonunda (gece, gündüz, oylama gibi) verilen oyları sıfırlayan fonksiyon:
function voteResetter(enteredRoomKey) {
    firebaseAdmin.database().ref("roomKeys/"+enteredRoomKey).once("value", (snapshot)=>{
        var players = Object.keys(snapshot.val())
        for (let i = 0; i < players.length; i++) {

            if (players[i] == "gameConfig") {
                continue
            }

            firebaseAdmin.database().ref("roomKeys/"+enteredRoomKey).child(players[i]).child("votedPerson").remove()
            firebaseAdmin.database().ref("roomKeys/"+enteredRoomKey).child(players[i]).child("whichVoteIsThis").remove()
            firebaseAdmin.database().ref("roomKeys/"+enteredRoomKey).child(players[i]).child("whoDoesItCover").remove()

        }
        
    })
}

// Her evre sonunda oylama varsa en çok oy alan kişiyi oyuncan çıkaran yardımcı fonksiyon:
function endOfStageVoteControl(enteredRoomKey) {
    firebaseAdmin.database().ref("roomKeys/"+enteredRoomKey).once("value", (snapshot)=>{
        var keys = Object.keys(snapshot.val())
        var peasantVote = []
        var wolfVote = []

        for (let i = 0; i < keys.length; i++) {

            if (keys[i] == "gameConfig") {
                continue;
            }

            if(snapshot.val()[keys[i]].whichVoteIsThis){

                switch (snapshot.val()[keys[i]].whichVoteIsThis) {
                    case "peasantVote":
                        peasantVote.push(snapshot.val()[keys[i]].votedPerson)
                        break;

                    case "wolfVote":
                        wolfVote.push(snapshot.val()[keys[i]].votedPerson)
                        break;
                
                    default:
                        break;
                }

            }
        }

        functionThatKillsThePersonWithTheMostVotes(peasantVote, enteredRoomKey)
        functionThatKillsThePersonWithTheMostVotes(wolfVote, enteredRoomKey)
    })
}

// Rollere göre en çok oy alan kişiyi öldüren fonksiyon:
function functionThatKillsThePersonWithTheMostVotes(voteData, enteredRoomKey) {
    if (voteData.length != 0) {
            
        var votingResultVar = votingResult(voteData)

        if (votingResultVar) {

            firebaseAdmin.database().ref("roomKeys/"+enteredRoomKey).child(votingResultVar).update({
                isTheRoleOpenToEveryone: true,    
                situation: 0
            })

        }

    }
}

// Oylama dizisinde kimin en çok oy aldığını tespit eden yardımcı fonksiyon (Bu kısım ChatGPT'ye yazdırılmıştır):
function votingResult(voteArray) {
    // İsimlerin sayısını tutmak için bir nesne oluşturuyoruz.
    let isimSayaci = {};

    // Her bir kişiyi gezip isimleri sayıyoruz.
    voteArray.forEach(kisi => {
        if (isimSayaci[kisi]) {
            isimSayaci[kisi]++;
        } else {
            isimSayaci[kisi] = 1;
        }
    });

    // En çok geçen ismi ve sayısını tutmak için değişkenler
    let maxIsim = null;
    let maxSayi = 0;
    let ayniSayiDurumu = false;

    // İsimlerin sayısını kontrol ediyoruz
    for (let isim in isimSayaci) {
        if (isimSayaci[isim] > maxSayi) {
            maxSayi = isimSayaci[isim];
            maxIsim = isim;
            ayniSayiDurumu = false;  // Eğer yeni bir lider bulursak aynılığı sıfırlıyoruz
        } else if (isimSayaci[isim] === maxSayi) {
            ayniSayiDurumu = true;  // Aynı sayıda isim varsa
        }
    }

    // Eğer aynı sayıda en çok geçen isim varsa null döndür
    return ayniSayiDurumu ? null : maxIsim;
}

// Kalan herkes aynı takımdan mı kontrolu, herkes aynı takımda ise oyun bitmiştir:
function isEveryoneOnTheSameTeam(enteredRoomKey) {
    firebaseAdmin.database().ref("roomKeys/"+enteredRoomKey).once("value").then((snapshot)=>{

        // Fonksiyon içi değişkenler:
        let keys = Object.keys(snapshot.val())
        let roles = []

        // Her canlı kişinin rolünü bir diziye atıyoruz:
        for (let i = 0; i < keys.length; i++) {
            
            // gameConfig atlanıyor:
            if (keys[i] == "gameConfig") {
                continue
            }
            
            // Kişi ölü değilse rolünü roles dizisine alıyoruz:
            if (snapshot.val()[keys[i]].situation == 1) {
                roles.push(snapshot.val()[keys[i]].role)
            }

        }

        // Gelen tüm roller aynı ise oyun bitmiştir:
        if (roles.every(item => item === roles[0]) == true) {
            firebaseAdmin.database().ref("roomKeys/"+enteredRoomKey+"/gameConfig").update({
                situation: 2,
                winningRole: roles[0]
            })
        }

    }).catch((error)=>{console.error()})
}