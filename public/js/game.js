// Ana sayaç:
const counterBox = document.getElementById("counter-box")
// Kişilerin kartlarını yazdıracağımız element:
const printCards = document.getElementById("contacts-card-div").querySelector(".row")
// İstemcide (yani tarayıcıda) bulunan id değeri:
const browserID = sessionStorage.getItem("playerID")
// Serverdan gelen kişi bilgilerinin tutulduğu değişken:
var contactsCard = ""
// Adminlik kontrolu
var adminControl = false

// Oyunun başlaması için kalan süre sorgusu:
socket.emit("timeQuery", {
    timeQuery: "forTheGameToStart",
    enteredRoomKey: roomKey
})

// Her hangi bir süre isteği sonucunda gönderilen süre:
socket.on("sendingTime", (data) => {

    // Gelen süre ne ise ilgili alana yönlendiriyoruz:
    switch (data.emit) {
        case "toTheBeginningOfTheGame":
            if (data.control == false) {
                // Oyunun başlamasına kalan süre sayacı:
                timerFunction(data.time, "toTheBeginningOfTheGame")
                break;  
            }

        default:
            break;
    }

})

// Süre fonksiyonu:
function timerFunction(/*Süre değeri*/ time,/*Sayılan zaman ne?*/ whatTime) {
    // Fonksiyonu süre bitene kadar her saniye çalıştırıyoruz:
    var timerVariable = setInterval(() => {
        // Kalan süreyi saniye cinsinden değişkene atıyoruz:
        var sure = (time - (Math.floor(Date.now() / 1000)))
        // Süreyi sayaca yazdırıyoruz:
        switch (whatTime) {
            case "toTheBeginningOfTheGame":
                counterBox.innerHTML = "Oyunun Başlamasına: " + sure + " Saniye!"
                // Süre bitti mi diye kontrol ediyoruz:
                if (sure <= 0) {
                    clearInterval(timerVariable)
                    roleDistribution()
                }
                break;
        
            default:
                break;
        }

    }, 1000)
}

// Sayfada kişilerin ekrana dizilmesini sağlayan kod:
socket.emit("listContats", {
    enteredRoomKey: roomKey
})

// Serverdan gelen veritabanı bilgisi:
socket.on("sendListContats", (data) => {

    // İç değişkenler:
    var no_scroll_name

    // İşlemlere başlamadan sayfayı temizliyoruz:
    printCards.innerHTML = ""

    // Gelen verilerinin anahtarları alındı:
    var keys = Object.keys(data.data)

    // Gelen anahtarlar kadar döngüyü döndürüyoruz:
    for (let i = 0; i < keys.length; i++) {

        // Gelen değer bizsek yapılacak işlemler:
        if (keys[i] == browserID) {
            // Burda oyuncunun admin olup olmadığını tespit ediyoruz. Adminse dönecek bütün süre gibi ayarlar burdan giden isteklerle değiştirilir:
            if (data.data[keys[i]].admin == true) {
                adminControl = true
            }else{
                adminControl = false
            }
        }

        // Gelen değer oyuncu değilse (yani "gameConfig"e eşitse) döngüyü atla:
        if (keys[i] == "gameConfig") {
            continue
        }

        // Gelen isimin karakter sayısı 9'dan büyükse kayırmalı yazıyı etkinleştiren sınıfı çağırarak getir:
        if (data.data[keys[i]].name.length > 9) {
            // console.log("büyük")
            no_scroll_name = ""
        }else{
            // console.log("küçük ya da eşit")
            no_scroll_name = "no-scroll"
        }

        // Burada da aşağıda hazırlanmış olan contactCardDraft fonksiyonuna kontrollerden geçirdiğimiz değişkenleri göndererek contactsCard isimli değişkene ek olarak ekliyoruz:
        contactsCard += contactCardDraft(i+1, "", data.data[keys[i]].name, "", no_scroll_name)
        
    }
    // Döngü bitikten sonra hazırladığımız değişkeni sayfamıza yazdırıyoruz:
    printCards.innerHTML += contactsCard
    // Tüm işlemler bittikten sonra birdahaki döngü için contactsCard değişkenini temizliyoruz:
    contactsCard=""

})

// Kişi kartı taslağı:
function contactCardDraft(/*Oyuncu Numarası*/ playerNumber, /*Aldığı Oy Sayısı*/ playersVote, /*Oyuncunun İsmi*/ playerName, /*Oylanan Oyuncu*/ votedPlayer, /*no-scroll*/ no_scroll_name) {
    return `
        <div class="col-6 col-sm-4 col-md-3 col-xl-2 player-card-container">
            <div class="player-card m-auto">
                <div class="player-no">${playerNumber}</div>
                <div class="player-character"><svg width="256px" height="256px" viewbox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048" style="width: 50%; height: 50%;"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9ZM15.8243 13.6235C17.1533 12.523 18 10.8604 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 10.8604 6.84668 12.523 8.17572 13.6235C4.98421 14.7459 3 17.2474 3 20C3 20.5523 3.44772 21 4 21C4.55228 21 5 20.5523 5 20C5 17.7306 7.3553 15 12 15C16.6447 15 19 17.7306 19 20C19 20.5523 19.4477 21 20 21C20.5523 21 21 20.5523 21 20C21 17.2474 19.0158 14.7459 15.8243 13.6235Z" fill="#000000"> </path></g></svg>
                <div class="players-vote d-none">${playersVote}</div>
            </div>
            <div class="player-info">
                <div class="player-name-div">
                    <div class="player-name ${no_scroll_name}">${playerName}</div>
                </div>
                <div class="voted-player-div d-none"><span>Oy:</span>
                    <div class="voted-player no-scroll">${votedPlayer}</div>
                </div>
                <div class="player-role d-none"></div>
            </div>
        </div>
        </div>
    `
}

// Rol dağıtımı isteği:
function roleDistribution() {
    if (adminControl == true) {
        socket.emit("roleDistribution", {
            enteredRoomKey: roomKey
        })
    }
}