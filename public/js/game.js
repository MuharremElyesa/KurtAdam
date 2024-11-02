// DEĞİŞKENLER:

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
// Menu, rol bilgisi:
const menuRoleInformation = document.getElementById("menu-role-information")
// Munu, oyundan ayrıl butonu:
const menuLeaveTheGame = document.getElementById("menu-leave-the-game")
// Menu, oyun sonu ekranını göster butonu:
const menuShowEndGameScreen = document.getElementById("menu-show-end-game-screen")
// Gün sayacı divi:
const dayCounterDiv = document.getElementById("day-counter")
// Serverdan gelen kişi bilgilerinin tutulduğu değişken:
var contactsCard = ""
// Adminlik kontrolu
var adminControl = false
// Oyuncunun rolu:
var playerRole
// Oyuncu oyunda ne konumda bulunuyor? (Oyuncu, Ölü, İzleyici gibi):
var playersStatus = 2 /*0:Ölü, 1:Oyunda, 2:İzleyici, 3:Çıktı*/
// Oyun konteynırı arka plan rengi:
const gameContainerTheme = "rgb(234, 234, 255)"
// Oyun konteynırı "gece" arka plan rengi:
const gameContainerNightTheme = "rgb(58 58 82)"
// Yükselen bilgi kutusu - Dış çerçeve:
const risingInfobox_outerFrame = document.getElementById("risingInfobox_outerFrame")
// Yükselen bilgi kutusu - İç çerçeve:
const risingInfobox_innerFrame = document.getElementById("risingInfobox_innerFrame")
// Yükselen bilgi kutusu - Span metni:
const risingInfobox_spanText = document.getElementById("risingInfobox_spanText")
// Yükselen bilgi kutusu - Butonlar kutusu:
const risingInfobox_divbox = document.getElementById("risingInfobox_divbox")
// Ölüm efekti (KeyframeEffect):
const dyingEffect_KeyframeEffect = new KeyframeEffect(risingInfobox_outerFrame, [
    { opacity: 0 }, // Başlangıçta opacity (0).
    { opacity: 1 }, // Sonra (1)'e çıkıyor.
    { opacity: 0 }, // Bitiş (0).
],
    { duration: 3000 } // Animasyon süresi.
)
// Ölüm efekti (Animation)
const dyingEffect_Animation = new Animation(dyingEffect_KeyframeEffect)
// Oyun sonu kazanan ekranı efekti (KeyframeEffect):
const gameOverScreen_KeyframeEffect = new KeyframeEffect(risingInfobox_outerFrame, [
    { opacity: 0 }, // Başlangıçta opacity (0).
    { opacity: 1 } // Sonra ise (1)
],
    {
        duration: 3000, // Animasyon süresi
        fill: "forwards" // Animasyonun bittiği yerde kalmasını sağlıyor
    }
)
// Oyun sonu ekranı (Animation):
const gameOverScreen_Animation = new Animation(gameOverScreen_KeyframeEffect)
// Bir oyuncunun öldüğü bilgisi (KeyframeEffect):
const deceasedPlayerInformation_KeyframeEffect = new KeyframeEffect(risingInfobox_outerFrame, [
    { opacity: 0 }, // Başlangıçta opacity (0).
    { opacity: 1 }, // Sonra (1)'e çıkıyor.
],
    {
        duration: 3000, // Animasyon süresi
        easing: "ease-out"
    }
)
// Bir oyuncunun öldüğü bilgisi (Animation):
const deceasedPlayerInformation_Animation = new Animation(deceasedPlayerInformation_KeyframeEffect)
// Köylü rolü açıklaması:
const villagerRoleInformation = "Sen bir Köylü'sün! Ve bir köylü olarak takımcak göreviniz kurtların kimler olduğunu tartışma anında tespit edip oy birliği ile kurtları asmanız. Ancak dikkatli olun. Kurt olmadığı halde kurt zannedip birbirinizi de asmanız mümkün. Aranızda hiç bir kurt kalmadığında oyunu kazanırsınız."
// Kurt rolü açıklaması:
const wolfRoleInformation = "Sen bir Kurt'sun! Kurt olduğun için rolün gereği diğer kurtların da kim olduklarını görebilirsiniz. Göreviniz tüm Köylü'leri eleyip sadece Kurt'lar olarak kalmanız. Kurt rolünün başka bir özelliği gereği gece olduğunda (ilk gece hariç) sadece Kurt'lar olarak kendi aranızda oylama yapabilirsiniz. Gün içinde de köylü oylamasına katılabiliyorsunuz. Orda da köylüleri kendinizi onlardan olduğunuza inandırıp kurtulabilirsiniz. Sadece Kurt'lar olarak kalırsanız kazanırsınız."



// --------------------------------------------------------------------------------

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
                timerFunction(data.time, "toTheBeginningOfTheGame", data.day)
                break;
            }

        // Rollerin gösterilmesinin bitmesine kalan süre:
        case "showingRoles":
            if (data.control == false) {
                // Rollerin gösterilmesi için süre:
                timerFunction(data.time, "showingRoles", data.day)
                break;
            }

        // Gecenin bitmesine kalan süre:
        case "night":
            if (data.control == false) {
                // Gecenin bitmesine kalan süre:
                timerFunction(data.time, "night", data.day)
                break;
            }

        // Gündüzün bitmesine kalan süre:
        case "day":
            if (data.control == false) {
                // Gündüzün bitmesine kalan süre:
                timerFunction(data.time, "day", data.day)
                break;
            }

        // Oylamanın bitmesine kalan süre:
        case "vote":
            if (data.control == false) {
                // Oylamanın bitmesine kalan süre:
                timerFunction(data.time, "vote", data.day)
                break;
            }

        default:
            break;
    }

})

// Süre fonksiyonu:
function timerFunction(/*Süre değeri*/ time,/*Sayılan zaman ne?*/ whatTime, /*Gün*/ whatDay) {

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

                if (playerRole == "wolf" && whatDay > 0) {
                    counterBox.innerHTML = "Kurt oylaması: " + sure + " Saniye!"
                } else {
                    counterBox.innerHTML = "Gecenin bitmesine: " + sure + " Saniye!"
                }


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
    var isItTimeToVote = [false]
    var voteClickFunction = ""
    var mine
    var votedata
    var votedPlayer = ""
    var playersVoteNumber = ""
    var didHeVoteForMe
    var isTheRoleOpenToEveryone = false

    playerRole = data.data[browserID].role

    // İşlemlere başlamadan sayfayı temizliyoruz:
    printCards.innerHTML = ""

    // Gelen verilerinin anahtarları alındı:
    var keys = Object.keys(data.data)

    // Oy sayıları, kimin kime verdiği gibi bilgileri ayarlayan fonksiyon:
    votedata = votingInformationEditor(data)

    // Oylama zamanında mıyız?:
    if (playerRole == "wolf" && data.data.gameConfig.nightControl == false && data.data.gameConfig.whichDay > 0) {
        isItTimeToVote[0] = true
        isItTimeToVote[1] = "wolfVote"
    } else if (data.data.gameConfig.voteControl == false) {
        isItTimeToVote[0] = true
        isItTimeToVote[1] = "peasantVote"
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


            switch (data.data[keys[i]].role) {
                case "villager":
                    if (data.data[keys[i]].situation == 0) {
                        menuRoleText.innerHTML = "Köylü (Elendiniz)"
                    } else (
                        menuRoleText.innerHTML = "Köylü"
                    )
                    menuRoleInformation.innerHTML = villagerRoleInformation
                    menuRoleImg.src = "img/villager.png"
                    break;

                case "wolf":
                    if (data.data[keys[i]].situation == 0) {
                        menuRoleText.innerHTML = "Kurt (Elendiniz)"
                    } else (
                        menuRoleText.innerHTML = "Kurt"
                    )
                    menuRoleInformation.innerHTML = wolfRoleInformation
                    menuRoleImg.src = "img/wolf.png"
                    break;

                default:
                    break;
            }

            /*
            0: Kendimizi belli eden kart gölgesi.
            1: Kendimizin rölünü gösteren kod.
            */
            mine = [" style='box-shadow: 0px 0px 10px rgb(0, 0, 255);'", playerRole]

            // Kişi şu anda öldüyse:
            if (data.data[keys[i]].situation == 0 && playersStatus == 1) {
                dyingEffect()
            }

            // Kişinin durumunun son halini tarayıcımıza da kayıt ediyoruz:
            playersStatus = data.data[keys[i]].situation
            playerRole = data.data[keys[i]].role

        } else {
            mine = ""
        }

        // Gelen değer oyuncu değilse (yani "gameConfig"e eşitse) yapılacak işlemler:
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

        // Oylama esnasında mıyız?:
        if (isItTimeToVote[0] == true) {

            // Kendimiz isek her türlü onclick dolu geliyor. Sebebi oy gösteriminden kaynaklanıyor:
            if (keys[i] == browserID) {
                voteClickFunction = ` onclick="toVote('${keys[i]}',browserID,'${isItTimeToVote[1]}')"`
            // Oylama kurt oyu ise kurtlar birbirine oy vermesin diye diğer kurtlara oylama fonksiyonu koymuyoruz:
            }else if (isItTimeToVote[1] == "wolfVote" && data.data[keys[i]].role == "wolf") {
                voteClickFunction = ""
            }else{
                voteClickFunction = ` onclick="toVote('${keys[i]}',browserID,'${isItTimeToVote[1]}')"`
            }
            
        } else {
            voteClickFunction = ""
        }

        // Oy bilgileri varsa onları da tespit edip karta gönderiyoruz:
        for (let ii = 0; ii < votedata.length; ii++) {
            if (Object.keys(votedata[ii]) == keys[i]) {

                // Oylanan oyuncu:
                votedPlayer = votedata[ii][Object.keys(votedata[ii])[0]].votedPersonName

                // Kişinin aldığı oy sayısı:
                playersVoteNumber = votedata[ii][Object.keys(votedata[ii])[0]].theNumberOfVotesThePlayerReceived

                // Oyuncu bize mi oy verdi?:
                didHeVoteForMe = votedata[ii][Object.keys(votedata[ii])[0]].didHeVoteForMe

                break;
            }
        }

        // Özel rollerin birbirlerinin rolünü görmesi:
        if (playerRole == "wolf" && data.data[keys[i]].role == "wolf") {
            isTheRoleOpenToEveryone = true
        } else {
            isTheRoleOpenToEveryone = data.data[keys[i]].isTheRoleOpenToEveryone
        }

        // Burada da aşağıda hazırlanmış olan contactCardDraft fonksiyonuna kontrollerden geçirdiğimiz değişkenleri göndererek contactsCard isimli değişkene ek olarak ekliyoruz:
        contactsCard += contactCardDraft(i + 1, playersVoteNumber, data.data[keys[i]].name, votedPlayer, keys[i], voteClickFunction, mine, isTheRoleOpenToEveryone, data.data[keys[i]].role, didHeVoteForMe, data.data[keys[i]].situation)

    }
    // Döngü bitikten sonra hazırladığımız değişkeni sayfamıza yazdırıyoruz:
    printCards.innerHTML += contactsCard
    // Tüm işlemler bittikten sonra birdahaki döngü için contactsCard değişkenini temizliyoruz:
    contactsCard = ""
    // Döngü sonu marquee kontrolleri:
    playerNameLengthCheck_marquee(document.querySelectorAll(".player-name-div"), document.querySelectorAll(".player-name"))
    playerNameLengthCheck_marquee(document.querySelectorAll(".voted-player-div"), document.querySelectorAll(".voted-player"))

    // Oyun bitti mi kontrolü (oyun bittiyse on fonksiyonunu kapatıp, oyun bitti ekranını çıkartıyoruz):
    if (data.data.gameConfig.situation == 2) {
        gameOver(data.data.gameConfig.winningRole)
    }

})

// Serverden gelen son değişiklikler bilgisi:
socket.on("latestChanges", (data) => {

    // Değişen değerdeki situation 0'sa ve bu bildirim daha önceden gösterilmediyse ve bu olay biz değilsek risingInfobox'da ölen kişinin verisini gösteriyoruz:
    if(data.data.situation == 0 && data.data.statusInformation == false && data.changingData != browserID){

        risingInfobox_outerFrame.style.backgroundColor = "transparent"
        risingInfobox_innerFrame.style.backgroundColor = "red"
        risingInfobox_spanText.style.backgroundColor = "transparent"
        risingInfobox_spanText.innerHTML = data.data.name + " Öldü"

        deceasedPlayerInformation_Animation.play()

        if (adminControl) {
            socket.emit("deathInformationComplement", {
                enteredRoomKey: roomKey,
                playerID: data.changingData
            })
        }

    }

})

// Kişi kartı taslağı:
function contactCardDraft(/*Oyuncu Numarası*/ playerNumber, /*Aldığı Oy Sayısı*/ numberOfVotesReceived, /*Oyuncunun İsmi*/ playerName, /*Oylanan Oyuncu*/ votedPlayer, /*Oyuncunun benzersiz numarası*/ playerID, /*Oylama zamanında isek eklenen oylama fonksiyonu*/ voteClickFunction, /*Ben miyim?*/ IsItMe, /*Rol herkese açık mı?*/ isTheRoleOpenToEveryone, /*Oyuncunun rolu*/ playerRole, /*Oyuncu bize mi oy vermiş?*/ didHeVoteForMe, /*Oyuncunun durumu (Ölü, canlı, izleyici gibi)*/ pStatus) {

    // Fonksiyon içi değişkenler:
    var roleIMG = ""
    var roleDivHider = ""
    var votedPersonShowing = " d-none"
    var playersVoteHider = " d-none"
    var frameOfPlayersWhoVotedForUs = ""
    const playerPhoto_player = `<svg width="256px" height="256px" viewbox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048" style="width: 50%; height: 50%;"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9ZM15.8243 13.6235C17.1533 12.523 18 10.8604 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 10.8604 6.84668 12.523 8.17572 13.6235C4.98421 14.7459 3 17.2474 3 20C3 20.5523 3.44772 21 4 21C4.55228 21 5 20.5523 5 20C5 17.7306 7.3553 15 12 15C16.6447 15 19 17.7306 19 20C19 20.5523 19.4477 21 20 21C20.5523 21 21 20.5523 21 20C21 17.2474 19.0158 14.7459 15.8243 13.6235Z" fill="#000000"> </path></g></svg>`
    const playerPhoto_tombstone = `<svg width="256px" height="256px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 21V10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10V21M3 21H21" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    const playerPhoto_cameOut = `<svg width="256px" height="256px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 21.0001L14 21V5.98924C14 4.6252 14 3.94318 13.7187 3.47045C13.472 3.05596 13.0838 2.74457 12.6257 2.59368C12.1032 2.42159 11.4374 2.56954 10.1058 2.86544L7.50582 3.44322C6.6117 3.64191 6.16464 3.74126 5.83093 3.98167C5.53658 4.19373 5.30545 4.48186 5.1623 4.8152C5 5.19312 5 5.65108 5 6.56702V21.0001M13.994 5.00007H15.8C16.9201 5.00007 17.4802 5.00007 17.908 5.21805C18.2843 5.4098 18.5903 5.71576 18.782 6.09209C19 6.51991 19 7.07996 19 8.20007V21.0001H21M11 12.0001H11.01" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    var playerPhoto
    var playerCardOpacity = ""

    // Kendimiz isek oyuncu kartındaki rolumuzu kendimize açıyoruz:
    if (roleImageFinder(IsItMe[1]) != null) {
        roleIMG = roleImageFinder(IsItMe[1])
    } else {
        if (isTheRoleOpenToEveryone == false) {
            roleDivHider = " d-none"
        } else {
            if (roleImageFinder(playerRole) != null) {
                roleIMG = roleImageFinder(playerRole)
            }
        }
    }

    // Oylama bizi de kapsıyorsa gösterilecek bilgiler gözüküyor:
    if (voteClickFunction != "") {

        // Oylanan oyuncu varsa göster:
        if (votedPlayer != "") {
            votedPersonShowing = ""
        }

        // Kişide oy sayısı bilgisi varsa yazdırıyoruz:
        if (numberOfVotesReceived > 0) {
            playersVoteHider = ""
        }

        // Kişi bize mi oy vermiş?:
        if (didHeVoteForMe == true) {
            frameOfPlayersWhoVotedForUs = " style='box-shadow: 0px 0px 10px rgb(255, 0, 0);'"
        }
        
    }

    // Biz oyunda değilsek bazı işlemleri yapamamamız gerekiyor. Bunu engelleyen sorgu:
    if (playersStatus != 1) {
        voteClickFunction = ""
    }

    // Kontrolden geçen kişi oyunda konumunda değilse bazı işlemleri yapamamamız gerekiyor. Bunu engelleyen sorgu:
    if (pStatus == 0) {
        voteClickFunction = ""
        playerPhoto = playerPhoto_tombstone
        playerCardOpacity = " style='opacity:0.5;'"
    } else if (pStatus == 3) {
        voteClickFunction = ""
        playerPhoto = playerPhoto_cameOut
        playerCardOpacity = " style='opacity:0.5;'"
    } else {
        playerPhoto = playerPhoto_player
    }

    // Fonksiyon sonu return:
    return `
        <div class="col-6 col-sm-4 col-md-3 col-xl-2 player-card-container" id="${playerID}" ${voteClickFunction} ${playerCardOpacity}>
            <div class="player-card m-auto" ${IsItMe[0]} ${frameOfPlayersWhoVotedForUs}>
                <div class="player-no">${playerNumber}</div>
                <div class="player-character">
                ${playerPhoto}
                <div class="players-vote ${playersVoteHider}">${numberOfVotesReceived}</div>
            </div>
            <div class="player-info">
                <div class="player-name-div">
                    <div class="player-name">${playerName}</div>
                </div>
                <div class="voted-player-div ${votedPersonShowing}"><span>Oy:</span>
                    <div class="voted-player">${votedPlayer}</div>
                </div>
                <div class="player-role ${roleDivHider}"><img class="player-role-IMG" src="${roleIMG}"></div>
            </div>
        </div>
        </div>
    `
}

// Rol dağıtımı isteği:
function roleDistribution() {
    // Bu tarz isteklerde oynanan oda için sadece tek bir istek gitmesi için adminden sorguyu gönderiyoruz. Oyun esnasında admin oyundan çıkarsa adminlik başkasına verileceği için bu kontrol hep yapılıyor:
    if (adminControl) {
        socket.emit("roleDistribution", {
            enteredRoomKey: roomKey
        })
    }
}

// Gece isteği:
function night() {
    // Bu tarz isteklerde oynanan oda için sadece tek bir istek gitmesi için adminden sorguyu gönderiyoruz. Oyun esnasında admin oyundan çıkarsa adminlik başkasına verileceği için bu kontrol hep yapılıyor:
    if (adminControl) {
        // Gece için emit:
        socket.emit("night", {
            enteredRoomKey: roomKey
        })
    }
}

// Gündüz isteği:
function day() {
    // Bu tarz isteklerde oynanan oda için sadece tek bir istek gitmesi için adminden sorguyu gönderiyoruz. Oyun esnasında admin oyundan çıkarsa adminlik başkasına verileceği için bu kontrol hep yapılıyor:
    if (adminControl) {
        // Gece için emit:
        socket.emit("day", {
            enteredRoomKey: roomKey
        })
    }
}

// Oylama isteği:
function vote() {
    // Bu tarz isteklerde oynanan oda için sadece tek bir istek gitmesi için adminden sorguyu gönderiyoruz. Oyun esnasında admin oyundan çıkarsa adminlik başkasına verileceği için bu kontrol hep yapılıyor:
    if (adminControl) {
        // Gece için emit:
        socket.emit("vote", {
            enteredRoomKey: roomKey
        })
    }
}

// Oyunda iken oyundan ayrılma iseği:
menuLeaveTheGame.addEventListener("click", () => {
    leaveGame()
})

// Oyundan ayrılma fonksiyonu:
function leaveGame() {
    socket.emit("escapeFromTheRoom", {
        enteredRoomKey: roomKey,
        playerID: browserID,
        isItAdmin: adminControl
    })
}

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
    if (votedPerson != personVoting) {

        // Hangi oylama?:
        switch (whichVoteIsThis) {
            // Köy oylaması:
            case "peasantVote":
                socket.emit("voting", {
                    enteredRoomKey: roomKey, /*Hangi oda?*/
                    whichVoteIsThis: whichVoteIsThis, /*Hangi oylama? (kurt oylaması, köylü oylaması gibi)*/
                    votedPerson: votedPerson, /*Oylanan kişi*/
                    personVoting: personVoting, /*Oylayan kişi*/
                    whoDoesItCover: "all" /*Kimler oylayabilir ve görebilir?*/
                })
                break;

            // Kurt oylaması:
            case "wolfVote":
                socket.emit("voting", {
                    enteredRoomKey: roomKey, /*Hangi oda?*/
                    whichVoteIsThis: whichVoteIsThis, /*Hangi oylama? (kurt oylaması, köylü oylaması gibi)*/
                    votedPerson: votedPerson, /*Oylanan kişi*/
                    personVoting: personVoting, /*Oylayan kişi*/
                    whoDoesItCover: "wolf" /*Kimler oylayabilir ve görebilir?*/
                })
                break;

            default:
                break;
        }

    }

}

// Rol tespit etme yardımcı fonksiyonu:
function roleImageFinder(unknownRole) {

    switch (unknownRole) {
        case "villager":
            return "img/villager.png"

        case "wolf":
            return "img/wolf.png"

        default:
            return null

    }

}

// Oy bilglerini düzenleyen yardımcı fonksiyon:
function votingInformationEditor(voteData) {

    // Foknsiyon içi değişkenler:
    var keys = Object.keys(voteData.data)
    var playerID = ""
    var votedPersonID = ""
    var votedPersonName = ""
    var theNumberOfVotesThePlayerReceived = ""
    var didHeVoteForMe = false
    var dataToBeSent = []

    // Kaç kişi varsa döngüyü o kadar çeviriyoruz:
    for (let i = 0; i < keys.length; i++) {

        // gameConfig atlanıyor:
        if (keys[i] == "gameConfig") {
            continue;
        }

        // Oyuncunun ID'si:
        playerID = keys[i]
        // Oylanan kişinin ID'si:
        votedPersonID = voteData.data[keys[i]].votedPerson
        // Oylanan kişinin İsmi:
        votedPersonName = ""
        if (voteData.data[votedPersonID]) {
            votedPersonName = voteData.data[votedPersonID].name
        } else {
            votedPersonName = ""
        }

        // Döngüye girmeden 0'lamalar:
        theNumberOfVotesThePlayerReceived = 0
        // Oyuncunun aldığı oy sayısı:
        for (let ii = 0; ii < keys.length; ii++) {

            // gameConfig atlanıyor:
            if (keys[ii] == "gameConfig") {
                continue;
            }

            // Kontrol edilen oyuncu, diğer kontrol edilen oyuncuya oy vermişse, oyu 1 artıyor:
            if (voteData.data[keys[ii]].votedPerson == keys[i]) {
                theNumberOfVotesThePlayerReceived++
            }

        }

        if (votedPersonID == browserID) {
            didHeVoteForMe = true
        } else {
            didHeVoteForMe = false
        }

        dataToBeSent.push({
            [playerID]: {
                votedPersonID: votedPersonID,
                votedPersonName: votedPersonName,
                theNumberOfVotesThePlayerReceived: theNumberOfVotesThePlayerReceived,
                didHeVoteForMe: didHeVoteForMe
            }
        })

    }

    return dataToBeSent
    // console.log(playerID)
    // console.log(votedPersonID)
    // console.log(votedPersonName)
    // console.log(theNumberOfVotesThePlayerReceived)
    // console.log(didHeVoteForMe)

}

// Ölme efekti yardımcı fonksiyonu:
function dyingEffect() {
    risingInfobox_outerFrame.style.backgroundColor = "red"
    risingInfobox_innerFrame.style.backgroundColor = "transparent"
    risingInfobox_spanText.style.backgroundColor = "transparent"
    risingInfobox_spanText.innerHTML = "Öldünüz"

    dyingEffect_Animation.play()
}

// Oyuncunun adı uzunsa marquee animasyonu uyguluyoruz:
function playerNameLengthCheck_marquee(container, text) {

    for (let i = 0; i < text.length; i++) {

        // Metin genişliği ile container genişliğini karşılaştır
        if (text[i].scrollWidth > container[i].clientWidth) {

            text[i].classList.add('pre-game-participants-list-box-padding-left')

            text[i].style.minWidth = text[i].clientWidth + "px;"

            const metinUzunlugu = text[i].scrollWidth;
            const containerGenisligi = container[i].clientWidth;

            // Animasyon süresini metnin uzunluğuna göre ayarla
            const animasyonSuresi = (metinUzunlugu + containerGenisligi) / 100; // 100, hız oranı, değiştirilebilir

            // Animasyon süresini CSS olarak ayarla
            text[i].style.animation = `marquee ${animasyonSuresi}s linear infinite`;
        } else {
            text[i].classList.remove('pre-game-participants-list-box-padding-left')
            text[i].style.animationDuration = ''; // Süreyi sıfırla
        }

    }
}

// Bitiş ekranı fonksiyonu:
function gameOver(winnerRole) {

    switch (winnerRole) {
        case "wolf":
            playerRole == "wolf" ? winnerRole = "Kurt Takımı! <br> Kazandınız!" : winnerRole = "Kurt Takımı! <br> Kaybettiniz!"
            risingInfobox_innerFrame.style.backgroundColor = "red"
            risingInfobox_outerFrame.style.backgroundColor = "rgba(255, 0, 0, 0.5)"
            break;

        case "villager":
            playerRole == "villager" ? winnerRole = "Köy Takımı! <br> Kazandınız!" : winnerRole = "Köy Takımı! <br> Kaybettiniz!"
            risingInfobox_innerFrame.style.backgroundColor = "blue"
            risingInfobox_outerFrame.style.backgroundColor = "rgba(0, 0, 255, 0.5)"
            break;
    
        default:
            break;
    }

    risingInfobox_outerFrame.style.backdropFilter = "blur(10px)"
    risingInfobox_outerFrame.style.pointerEvents = "auto"
    risingInfobox_divbox.style.backgroundColor = "transparent"
    risingInfobox_spanText.style.backgroundColor = "transparent"
    risingInfobox_spanText.style.color = "whitesmoke"
    risingInfobox_divbox.classList.remove("d-none")
    risingInfobox_spanText.innerHTML = "Kazanan: "+ winnerRole
    
    menuShowEndGameScreen.classList.remove("d-none")

    gameOverScreen_Animation.play()

    socket.emit("listContats", {
        enteredRoomKey: roomKey,
        game: "finished"
    })

}

// risingInfobox_innerFrame'i yeniden boyutlandıran fonksiyon:
function risingInfobox_heightAdjustment() {
    if (innerHeight > 463) {
        risingInfobox_innerFrame.style.height = null
    }else{
        risingInfobox_innerFrame.style.height = "100vh"
    }
}

// Başlangıçta bir kere manuel çalıştırıyoruz:
risingInfobox_heightAdjustment()

// Pencere yeniden boyutlandırıldığında risingInfobox_innerFrame'i yeniden boyutlandıran fonksiyon:
window.addEventListener('resize', risingInfobox_heightAdjustment)

// Oyun sonu ekranındaki Oyun ekranını göster butonu:
document.getElementById("risingInfobox_returnToGameScreenButton").addEventListener("click", ()=>{
    risingInfobox_outerFrame.classList.add("d-none")
})

// Oyun sonu ekranındaki Ana menüye dön butonu:
document.getElementById("risingInfobox_returnToMainMenuButton").addEventListener("click", ()=>{
    leaveGame()
})

// Oyun bitince menude beliren oyun sonu ekranını göster butonu işlevi:
menuShowEndGameScreen.addEventListener("click", ()=>{
    risingInfobox_outerFrame.classList.remove("d-none")
})