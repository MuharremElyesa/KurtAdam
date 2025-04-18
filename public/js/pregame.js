const preGameParticipantsList = document.getElementById("pre-game-participants-list")
const startButton = document.getElementById("start-game-button")
const quitButton = document.getElementById("quit-button")
let admin = false
let isItMe

// Odaya girdiğimiz an sunucuyu listeyi yenilemesi için tetikliyoruz:
socket.emit("firstPreGamePlayerListRefresh", {roomKey: roomKey})

// Sunucudan gelen oyuncuları listeliyoruz:
socket.on("preGamePlayerListRefresh", (data1)=>{
    preGameParticipantsList.innerHTML=""
    let keys = Object.keys(data1.data)
    
    keys.forEach((data2)=>{

        isItMe = ""

        // Oyun ayarlarını içeren düğüğmü atlıyoruz:
        if (data2 == "gameConfig") {
            if (data1.data[data2].situation==1) {
                window.location.href="/oyunBaslatiliyor?enteredRoomKey="+roomKey
            }
            return
        }

        if (data2 === sessionStorage.getItem("playerID")) {
            isItMe = " custom-frame-shadow"
        }

        if (data1.data[data2].admin === true) {
            preGameParticipantsList.innerHTML += `<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white ${isItMe}' style='background-color:#6fb81b80;'><div class='pre-game-participants-list-box-text'> ${data1.data[data2].name + " (Admin)"} </div></div>`

            if (data2 === sessionStorage.getItem("playerID")) {
                startButton.classList.remove("d-none")
                quitButton.innerHTML="Ayrıl ve Odayı Devret!"
                admin = true
            }

        }else{
            preGameParticipantsList.innerHTML += `<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white ${isItMe}'><div class='pre-game-participants-list-box-text'> ${data1.data[data2].name} </div></div>`

            if (data2 === sessionStorage.getItem("playerID")) {
                admin = false
            }
        }
        
    })

    if (admin === false) {
        startButton.classList.add("d-none")
        quitButton.innerHTML="Ayrıl"
    }
    
    playerNameLengthCheck_marquee()
})

// Oda yoksa veya beklenmedik bir şekilde kapandıysa oyuncuyu ana menüye yönlendiriyoruz:
socket.on("theRoomIsClosed",()=>{
    preGameParticipantsList.innerHTML = "<div class='col-12 p-2 text-center my-1 pre-game-participants-list-box text-snadow-white' style='background-color:#6fb81b80;'> Oda beklenmedik bir şekilde kayboldu :(. 5 saniye sonra ana menüdesiniz. </div>"
    setTimeout(function(){ window.location.href = "/takmaIsimIleGiris?nickName="+sessionStorage.getItem("playerName") }, 5000)
})

// Odadan Ayrıl:
function leaveTheRoom() {
    window.location.href="/odadanAyriliniyor?playerID="+sessionStorage.getItem("playerID")+"&playerName="+sessionStorage.getItem("playerName")+"&enteredRoomKey="+roomKey+"&isItAdmin="+admin
}

// Oyunu Başlat:
function startGame() {
    window.location.href="/oyunuBaslat?enteredRoomKey="+roomKey
}

// Oyuncunun adı uzunsa marquee animasyonu uyguluyoruz:
function playerNameLengthCheck_marquee() {
    const container = document.querySelectorAll(".pre-game-participants-list-box")
    const text = document.querySelectorAll(".pre-game-participants-list-box-text")

    for (let i = 0; i < text.length; i++) {
        
    // Metin genişliği ile container genişliğini karşılaştır
    if (text[i].scrollWidth > container[i].clientWidth) {

        text[i].classList.add('pre-game-participants-list-box-padding-left')

        text[i].style.minWidth=text[i].clientWidth+"px;"

        const metinUzunlugu = text[i].scrollWidth;
        const containerGenisligi = container[i].clientWidth;

        // Animasyon süresini metnin uzunluğuna göre ayarla
        const animasyonSuresi = (metinUzunlugu + containerGenisligi) / 200; // 100, hız oranı, değiştirilebilir

        // Animasyon süresini CSS olarak ayarla
        text[i].style.animation = `marquee ${animasyonSuresi}s linear infinite`;
    } else {
        text[i].classList.remove('pre-game-participants-list-box-padding-left')
        text[i].style.animationDuration = ''; // Süreyi sıfırla
    }

    }
}

// Sayfa yüklendiğinde kontrol et
window.onload = playerNameLengthCheck_marquee;

// Eğer pencere boyutlandırılırsa tekrar kontrol et
window.onresize = playerNameLengthCheck_marquee;