// Socket.io:
const socket = io("localhost:7777")
const preGameParticipantsList = document.getElementById("pre-game-participants-list")

socket.emit("firstPreGamePlayerListRefresh")

socket.on("preGamePlayerListRefresh", (data1)=>{
    preGameParticipantsList.innerHTML=""
    let keys = Object.keys(data1.data)
    
    keys.forEach((data2)=>{
        // Oyun ayarlarını içeren düğüğmü atlıyoruz:
        if (data2 == "gameConfig") {
            return
        }

        preGameParticipantsList.innerHTML += "<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white'>"+data1.data[data2].name+"</div>"
    })
})