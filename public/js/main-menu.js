const roomKeyInputText = document.getElementById("room-key-input-text")

// Enter tuşuna basıldığında odaya katıl butonu çalışır:
roomKeyInputText.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        joinTheRoom()
    }
})

// Odaya katılma isteği sunucuya gidiyor:
function joinTheRoom() {
    socket.emit("joinTheRoom", {enteredRoomKey: roomKeyInputText.value})
}

// Sunucudan olumlu yanıt gelirse:
socket.on("returnJoinTheRoom", ()=>{

})

// Oda veritabanında yoksa:
socket.on("returnCouldNotJoinTheRoom", ()=>{
    alert("Girdiğiniz oda kodu bulunamadı.")
})