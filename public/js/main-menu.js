const roomKeyInputText = document.getElementById("room-key-input-text")

// Oturumu Kapat:
function signOut() {
    sessionStorage.removeItem("playerID")
    sessionStorage.removeItem("playerName")
    window.location.href="/logout"
}

// Yeni Oda Oluştur:
function createNewRoom() {

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

// Nasıl Oynanır:
function howToPlay() {
    window.location.href="/NasilOynanir"
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

// Girilmek istenilen oda bilgisi:
socket.on("roomInformationToEnter", (data)=>{

    switch (data.situation) {
        case "noRoom":
            alert("Girdiğiniz oda kodu bulunamadı.")
            break;

        case "theGameHasPassedTheInitialStage":
            alert("Girmek istediğiniz odada oyun başlamış ya da bitmiş.")
            break;
    
        default:
            break;
    }

})

// Oyuncunun adı uzunsa marquee animasyonu uyguluyoruz:
function playerNameLengthCheck_marquee() {
    const container = document.querySelector('.cerceve-ici')
    const text = document.getElementById('player-name-text')

    // Metin genişliği ile container genişliğini karşılaştır
    if (text.scrollWidth > container.clientWidth) {

        text.classList.add('player-name-text-padding-left')

        text.style.minWidth=text.clientWidth+"px;"

        const metinUzunlugu = text.scrollWidth;
        const containerGenisligi = container.clientWidth;

        // Animasyon süresini metnin uzunluğuna göre ayarla
        const animasyonSuresi = (metinUzunlugu + containerGenisligi) / 200; // 100, hız oranı, değiştirilebilir

        // Animasyon süresini CSS olarak ayarla
        text.style.animation = `marquee ${animasyonSuresi}s linear infinite`;
    } else {
        text.classList.remove('player-name-text-padding-left')
        text.style.animationDuration = ''; // Süreyi sıfırla
    }
}

// Sayfa yüklendiğinde kontrol et
window.onload = playerNameLengthCheck_marquee;

// Eğer pencere boyutlandırılırsa tekrar kontrol et
window.onresize = playerNameLengthCheck_marquee;