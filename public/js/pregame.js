const preGameParticipantsList = document.getElementById("pre-game-participants-list")
const startButton = document.getElementById("start-game-button")
const quitButton = document.getElementById("quit-button")
let admin = false


// Odaya girdiğimiz an sunucuyu listeyi yenilemesi için tetikliyoruz:
socket.emit("firstPreGamePlayerListRefresh", {roomKey: roomKey})

// Sunucudan gelen oyuncuları listeliyoruz:
socket.on("preGamePlayerListRefresh", (data1)=>{
    preGameParticipantsList.innerHTML=""
    let keys = Object.keys(data1.data)
    
    keys.forEach((data2)=>{
        // Oyun ayarlarını içeren düğüğmü atlıyoruz:
        if (data2 == "gameConfig") {
            return
        }

        if (data1.data[data2].admin === true) {
            preGameParticipantsList.innerHTML += "<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white' style='background-color:#6fb81b80;'>"+data1.data[data2].name+" (Admin) </div>"

            if (data2 === sessionStorage.getItem("playerID")) {
                startButton.classList.remove("d-none")
                quitButton.innerHTML="Ayrıl ve Odayı Devret!"
                admin = true
            }

        }else{
            preGameParticipantsList.innerHTML += "<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white'>"+data1.data[data2].name+"</div>"
        }
        
    })

    if (admin === false) {
        startButton.classList.add("d-none")
        quitButton.innerHTML="Ayrıl"
    }
    admin = false
})

// Oda yoksa veya beklenmedik bir şekilde kapandıysa oyuncuyu ana menüye yönlendiriyoruz:
socket.on("theRoomIsClosed",()=>{
    preGameParticipantsList.innerHTML = "<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white' style='background-color:#6fb81b80;'> Oda beklenmedik bir şekilde kayboldu :(. 5 saniye sonra ana menüdesiniz. </div>"
    setTimeout(function(){ window.location.href = "/takmaIsimIleGiris?nickName="+sessionStorage.getItem("playerName") }, 5000)
})

// Odadan Ayrıl:
function leaveTheRoom() {
    window.location.href="/odadanAyriliniyor?playerID="+sessionStorage.getItem("playerID")+"&playerName="+sessionStorage.getItem("playerName")+"&enteredRoomKey="+roomKey
}