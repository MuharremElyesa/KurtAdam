const roomKeyInputText = document.getElementById("room-key-input-text")

// Oturumu Kapat:
function signOut() {
    sessionStorage.removeItem("playerID")
    sessionStorage.removeItem("playerName")
    window.location.href="/logout"
}

// Yeni Oda Oluştur:
function yeniOdaOlustur() {

    window.location.href="/yeniOdaOlustur?playerName="+playerName+"&playerID="+playerID
    
    // fetch("/yeniOdaOlustur", {
    //     method: "post",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         playerID: playerID
    //     })
    // }).catch(error => {
    //     console.error("Error:", error)
    // })

    // var send = {
    //     playerID: playerID
    // }
    // var xhr = new XMLHttpRequest()
    // var url = "/yeniOdaOlustur"
    // xhr.open("POST", url, false)
    // xhr.setRequestHeader("Content-Type", "application/json")
    // xhr.send(JSON.stringify(send))

    // window.location.href="/yeniOdaOlustur?id="+playerID
}

// Enter tuşuna basıldığında odaya katıl butonu çalışır:
roomKeyInputText.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        joinTheRoom()
    }
})

// Odaya katılma isteği sunucuya gidiyor:
function joinTheRoom() {

    // window.location.href="/odayaKatil?playerName="+playerName+"&playerID="+playerID+"&enteredRoomKey="+roomKeyInputText.value

    socket.emit("joinTheRoom", {enteredRoomKey: roomKeyInputText.value, playerID: playerID, playerName: playerName})
}

// Sunucudan olumlu yanıt gelirse:
socket.on("returnJoinTheRoom", ()=>{

    window.location.href="/odayaKatil?playerName="+playerName+"&playerID="+playerID+"&enteredRoomKey="+roomKeyInputText.value

    // fetch("/odayaKatil", {
    //     method: "post",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         roomKey: roomKeyInputText.value,
    //         playerID: playerID
    //     })
    // }).catch(error => {
    //     console.error("Error:", error)
    // })
})

// Oda veritabanında yoksa:
socket.on("returnCouldNotJoinTheRoom", ()=>{
    alert("Girdiğiniz oda kodu bulunamadı.")
})