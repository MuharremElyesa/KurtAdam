const preGameParticipantsList = document.getElementById("pre-game-participants-list")

const startButton = document.getElementById("start-game-button")
let admin = false


// Odaya girdiğimiz an sunucuyu listeyi yenilemesi için tetikliyoruz:
socket.emit("firstPreGamePlayerListRefresh")

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

            if (data2 === data1.id) {
                startButton.classList.remove("d-none")
                admin = true
            }

        }else{
            preGameParticipantsList.innerHTML += "<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white'>"+data1.data[data2].name+"</div>"
        }
        
    })

    if (admin === false) {
        startButton.classList.add("d-none")
    }
})

// Oda yoksa veya beklenmedik bir şekilde kapandıysa oyuncuyu ana menüye yönlendiriyoruz:
socket.on("theRoomIsClosed",()=>{
    preGameParticipantsList.innerHTML = "<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white' style='background-color:#6fb81b80;'> Oda beklenmedik bir şekilde kayboldu :(. 5 saniye sonra ana menüdesiniz. </div>"
    setTimeout(function(){ window.location.href = "/profile" }, 5000)
})