// Ana sayaç:
const counterBox = document.getElementById("counter-box")
// Kişilerin kartlarını yazdıracağımız element:
const printCards = document.getElementById("contacts-card-div").querySelector(".row")
// Ana oyun container'ı:
const mainGameContainer = document.getElementById("contacts-card-div")
// Container:
const container = document.getElementById("gameContainer")
// Rol gösterim divi:
const roleShowingDiv = document.getElementById("role-showing-div")
// Rol divi:
const roleDiv = document.getElementById("role-div")
// İstemcide (yani tarayıcıda) bulunan id değeri:
const browserID = sessionStorage.getItem("playerID")
// Menu:
const menu = document.getElementById("menu")
// Menu, rol etiketi:
const menuRoleText = document.getElementById("menu-role-text")
// Menu, rol resmi:
const menuRoleImg = document.getElementById("menu-role-img")
// Munu, oyundan ayrıl butonu:
const menuLeaveTheGame = document.getElementById("menu-leave-the-game")
// Gün sayacı divi:
const dayCounterDiv = document.getElementById("day-counter")
// Serverdan gelen kişi bilgilerinin tutulduğu değişken:
var contactsCard = ""
// Adminlik kontrolu
var adminControl = false
// Oyuncunun rolu:
var playerRole
// Oyun konteynırı arka plan rengi:
const gameContainerTheme = "rgb(234, 234, 255)"
// Oyun konteynırı "gece" arka plan rengi:
const gameContainerNightTheme = "rgb(58 58 82)"

// Oyunun başlaması için kalan süre sorgusu:
socket.emit("timeQuery", {
    timeQuery: "forTheGameToStart",
    enteredRoomKey: roomKey
})

// Açılır menu:
function menuOpenner() {
    if (menu.classList.contains("d-none")) {
        menu.classList.remove("d-none")
    } else {
        menu.classList.add("d-none")
    }
}

// Her hangi bir süre isteği sonucunda gönderilen süre:
socket.on("sendingTime", (data) => {

    // Gelen süre ne ise ilgili alana yönlendiriyoruz:
    switch (data.emit) {

        // Oyunun başlamasına kalan süre:
        case "toTheBeginningOfTheGame":
            if (data.control == false) {
                // Oyunun başlamasına kalan süre sayacı:
                timerFunction(data.time, "toTheBeginningOfTheGame")
                break;
            }

        // Rollerin gösterilmesinin bitmesine kalan süre:
        case "showingRoles":
            if (data.control == false) {
                // Rollerin gösterilmesi için süre:
                timerFunction(data.time, "showingRoles")
                break;
            }

        // Gecenin bitmesine kalan süre:
        case "night":
            if (data.control == false) {
                // Gecenin bitmesine kalan süre:
                timerFunction(data.time, "night")
                break;
            }

        // Gündüzün bitmesine kalan süre:
        case "day":
            if (data.control == false) {
                // Gündüzün bitmesine kalan süre:
                timerFunction(data.time, "day")
                break;
            }

        // Oylamanın bitmesine kalan süre:
        case "vote":
            if (data.control == false) {
                // Oylamanın bitmesine kalan süre:
                timerFunction(data.time, "vote")
                break;
            }

        default:
            break;
    }

})

// Süre fonksiyonu:
function timerFunction(/*Süre değeri*/ time,/*Sayılan zaman ne?*/ whatTime) {

    // Döngü değişkenleri:
    var completed1 = false
    var completed2 = false
    var completed3 = false

    // Fonksiyonu süre bitene kadar her saniye çalıştırıyoruz:
    var timerVariable = setInterval(() => {
        // Kalan süreyi saniye cinsinden değişkene atıyoruz:
        var sure = (time - (Math.floor(Date.now() / 1000)))
        // Süreyi sayaca yazdırıyoruz:
        switch (whatTime) {

            // Oyunun başlamasına kalan süre:
            case "toTheBeginningOfTheGame":
                counterBox.innerHTML = "Oyunun Başlamasına: " + sure + " Saniye!"
                // Süre bitti mi diye kontrol ediyoruz:
                if (sure <= 0) {
                    clearInterval(timerVariable)
                    roleDistribution()
                }
                break;

            // Rollerin gösterilme süresi:
            case "showingRoles":
                counterBox.innerHTML = "Roller Gösteriliyor: " + sure
                // Döngüde tek seferlik çalıştırmak istediğimiz kodlar:
                if (completed1 == false) {

                    // Buraya rol gösterim anını yazıyoruz:
                    mainGameContainer.classList.add("d-none")
                    roleShowingDiv.classList.remove("d-none")

                    switch (playerRole) {
                        // Köylü isek rol gösteriminde gözükecekler:
                        case "villager":
                            roleShowingDiv.querySelector("img").src = "img/villager.png"
                            roleShowingDiv.querySelector("i").innerHTML = "Köy Takımındansın!"
                            roleShowingDiv.querySelector("p").innerHTML = "Köylü"
                            break;

                        // Kurt isek rol gösteriminde gözükecekler:
                        case "wolf":
                            roleShowingDiv.querySelector("img").src = "img/wolf.png"
                            roleShowingDiv.querySelector("i").innerHTML = "Kurt Takımındansın!"
                            roleShowingDiv.querySelector("p").innerHTML = "Kurt"
                            break;

                        default:
                            break;
                    }

                    completed1 = true
                }

                // Süre bitti mi diye kontrol ediyoruz:
                if (sure <= 0) {
                    mainGameContainer.classList.remove("d-none")
                    roleShowingDiv.classList.add("d-none")
                    clearInterval(timerVariable)
                    night()
                }
                break;

            // Gecenin bitmesine kalan süre:
            case "night":
                counterBox.innerHTML = "Gecenin bitmesine: " + sure + " Saniye!"

                // Döngüde tek seferlik çalıştırmak istediğimiz kodlar:
                if (completed2 == false) {

                    container.style.backgroundColor = gameContainerNightTheme

                    completed2 = true
                }

                // Süre bitti mi diye kontrol ediyoruz:
                if (sure <= 0) {

                    container.style.backgroundColor = gameContainerTheme

                    clearInterval(timerVariable)
                    day()
                }
                break;

            // Gündüzün bitmesine kalan süre:
            case "day":

                counterBox.innerHTML = "Oylamaya: " + sure + " Saniye!"

                // Döngüde tek seferlik çalıştırmak istediğimiz kodlar:
                if (completed3 == false) {

                    // ...

                    completed3 = true
                }

                // Süre bitti mi diye kontrol ediyoruz:
                if (sure <= 0) {

                    // ...

                    clearInterval(timerVariable)
                    vote()
                }

                break;

            // Oylamanın bitmesine kalan süre:
            case "vote":

                counterBox.innerHTML = "Oylama Zamanı!: " + sure

                // Döngüde tek seferlik çalıştırmak istediğimiz kodlar:
                // if (completed3==false) { comp 4 yap

                //     // ...

                //     completed3=true
                // }

                // Süre bitti mi diye kontrol ediyoruz:
                if (sure <= 0) {

                    // ...

                    clearInterval(timerVariable)
                    night()
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
    var isItTimeToVote = false
    var voteClickFunction

    // İşlemlere başlamadan sayfayı temizliyoruz:
    printCards.innerHTML = ""

    // Gelen verilerinin anahtarları alındı:
    var keys = Object.keys(data.data)

    // Oylama zamanında mıyız?:
    if (data.data.gameConfig.voteControl == false) {
        isItTimeToVote = true
    }

    // Gelen anahtarlar kadar döngüyü döndürüyoruz:
    for (let i = 0; i < keys.length; i++) {

        // Gelen değer bizsek yapılacak işlemler:
        if (keys[i] == browserID) {

            // Burda oyuncunun admin olup olmadığını tespit ediyoruz. Adminse dönecek bütün süre gibi ayarlar burdan giden isteklerle değiştirilir:
            if (data.data[keys[i]].admin == true) {
                adminControl = true
            } else {
                adminControl = false
            }

            playerRole = data.data[keys[i]].role
            switch (playerRole) {
                case "villager":
                    menuRoleText.innerHTML = "Köylü"
                    menuRoleImg.src = "img/villager.png"
                    break;

                case "wolf":
                    menuRoleText.innerHTML = "Kurt"
                    menuRoleImg.src = "img/wolf.png"
                    break;

                default:
                    break;
            }

        }

        // Gelen değer oyuncu değilse (yani "gameConfig"e eşitse) döngüyü atla:
        if (keys[i] == "gameConfig") {

            // Hangi zaman diliminde olduğumuzu tespit ediyoruz:
            // Rol gösterme süresinin geçip geçmediğine bakıyoruz:
            if (data.data[keys[i]].showingRolesControl == false) {

                socket.emit("timeQuery", {
                    timeQuery: "showingRoles",
                    enteredRoomKey: roomKey
                })

            } else if (data.data[keys[i]].nightControl == false) {

                socket.emit("timeQuery", {
                    timeQuery: "night",
                    enteredRoomKey: roomKey
                })
            } else if (data.data[keys[i]].dayControl == false) {

                socket.emit("timeQuery", {
                    timeQuery: "day",
                    enteredRoomKey: roomKey
                })
            } else if (data.data[keys[i]].voteControl == false) {
                socket.emit("timeQuery", {
                    timeQuery: "vote",
                    enteredRoomKey: roomKey
                })
            }

            dayCounterDiv.innerHTML = "Gün: " + data.data[keys[i]].whichDay

            // Diğer işlemlere devam edilmemesi için döngüyü burdan başa sarıyoruz:
            continue
        }

        // Gelen isimin karakter sayısı 9'dan büyükse kayırmalı yazıyı etkinleştiren sınıfı çağırarak getir:
        if (data.data[keys[i]].name.length > 9) {
            // console.log("büyük")
            no_scroll_name = ""
        } else {
            // console.log("küçük ya da eşit")
            no_scroll_name = "no-scroll"
        }

        // Oylama esnasında mıyız?:
        if (isItTimeToVote == true) {
            voteClickFunction = ` onclick="toVote('${keys[i]}',browserID,'peasantVote')"`
        } else {
            voteClickFunction = ""
        }

        // Burada da aşağıda hazırlanmış olan contactCardDraft fonksiyonuna kontrollerden geçirdiğimiz değişkenleri göndererek contactsCard isimli değişkene ek olarak ekliyoruz:
        contactsCard += contactCardDraft(i + 1, "", data.data[keys[i]].name, "", no_scroll_name, keys[i], voteClickFunction)

    }
    // Döngü bitikten sonra hazırladığımız değişkeni sayfamıza yazdırıyoruz:
    printCards.innerHTML += contactsCard
    // Tüm işlemler bittikten sonra birdahaki döngü için contactsCard değişkenini temizliyoruz:
    contactsCard = ""

})

// Kişi kartı taslağı:
function contactCardDraft(/*Oyuncu Numarası*/ playerNumber, /*Aldığı Oy Sayısı*/ playersVote, /*Oyuncunun İsmi*/ playerName, /*Oylanan Oyuncu*/ votedPlayer, /*no-scroll*/ no_scroll_name, /*Oyuncunun benzersiz numarası*/ playerID, /*Oylama zamanında isek eklenen oylama fonksiyonu*/ voteClickFunction) {
    return `
        <div class="col-6 col-sm-4 col-md-3 col-xl-2 player-card-container" id="${playerID}" ${voteClickFunction}>
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
    // Bu tarz isteklerde oynanan oda için sadece tek bir istek gitmesi için adminden sorguyu gönderiyoruz. Oyun esnasında admin oyundan çıkarsa adminlik başkasına verileceği için bu kontrol hep yapılıyor:
    if (adminControl == true) {
        socket.emit("roleDistribution", {
            enteredRoomKey: roomKey
        })
    }
}

// Gece isteği:
function night() {
    // Bu tarz isteklerde oynanan oda için sadece tek bir istek gitmesi için adminden sorguyu gönderiyoruz. Oyun esnasında admin oyundan çıkarsa adminlik başkasına verileceği için bu kontrol hep yapılıyor:
    if (adminControl == true) {
        // Gece için emit:
        socket.emit("night", {
            enteredRoomKey: roomKey
        })
    }
}

// Gündüz isteği:
function day() {
    // Bu tarz isteklerde oynanan oda için sadece tek bir istek gitmesi için adminden sorguyu gönderiyoruz. Oyun esnasında admin oyundan çıkarsa adminlik başkasına verileceği için bu kontrol hep yapılıyor:
    if (adminControl == true) {
        // Gece için emit:
        socket.emit("day", {
            enteredRoomKey: roomKey
        })
    }
}

// Oylama isteği:
function vote() {
    // Bu tarz isteklerde oynanan oda için sadece tek bir istek gitmesi için adminden sorguyu gönderiyoruz. Oyun esnasında admin oyundan çıkarsa adminlik başkasına verileceği için bu kontrol hep yapılıyor:
    if (adminControl == true) {
        // Gece için emit:
        socket.emit("vote", {
            enteredRoomKey: roomKey
        })
    }
}

// Oyunda iken oyundan ayrılma iseği:
menuLeaveTheGame.addEventListener("click", () => {
    socket.emit("escapeFromTheRoom", {
        enteredRoomKey: roomKey,
        playerID: browserID
    })
})

// Oyunda iken oyundan ayrılma iseğine gelen cevap:
socket.on("escapeFromTheRoom", () => {
    window.location.href = "/"
    socket.emit("listContats", {
        enteredRoomKey: roomKey,
        leave: "leave"
    })
})

// Oy verme fonksiyonu:
function toVote(/*Oy verilen kişi*/ votedPerson, /*Oy veren kişi*/ personVoting, /*Bu ne oylaması?*/ whichVoteIsThis) {

    // Kendine oy veremezsin :):
    if (/*votedPerson != personVoting*/true) {

        // Hangi oylama?:
        switch (whichVoteIsThis) {
            // Köy oylaması:
            case "peasantVote":
                socket.emit("voting",{
                    enteredRoomKey: roomKey, /*Hangi oda?*/
                    whichVoteIsThis: whichVoteIsThis, /*Hangi oylama? (kurt oylaması, köylü oylaması gibi)*/
                    votedPerson: votedPerson, /*Oylanan kişi*/
                    personVoting: personVoting, /*Oylayan kişi*/
                    whoDoesItCover: "all" /*Kimler oylayabilir ve görebilir?*/
                })
                break;
        
            default:
                break;
        }

    }

}