// Başlangıç kutusu
const starterDiv = document.getElementById("starter-div");
// İsim input
const nameInput = document.getElementById("logInInputText");
// Login div
const loginDiv = document.getElementById("login-div");
// Ana menü
const mainMenu = document.getElementById("main-menu");
// Main menu isim
const mainMenuName = document.getElementById("main-menu-name");
// Ana menü oda buton div
const mainMenuRoomButtonDiv = document.getElementById("main-menu-room-button-div");
// Yeni oda oluşturma div
const newCreateRoomDiv =  document.getElementById("newCreateRoomDiv");
// Oda kodu başlığı
const roomIdText = document.getElementById("roomIdText");

// Kullanıcı bilgileri
var User;
// Oda kodu yazıp katılma alanı
var roomKeyInputText = document.getElementById("room-key-input-text");
// html anlık yazıcı
var html="";
// Oyun öncesi oyuncu listesi
var gamerList = document.getElementById("gamers-list");
//  Oda kontrol butonları
var roomControlButtons = document.getElementById("room-control-buttons");

// Yeni katılan oyuncu butonları divi
var playerButtonsDiv = document.getElementById("player-buttons-div");
// Oyun kutusu
var gameDiv = document.getElementById("game");
// Oyuncu çerçevesi
var gamePlayerFrame = document.getElementById("game-player-frame");
// Geri sayım kutusu
var countdown = document.getElementById("countdown");
// Geri sayım yazdırma kutusu
var countdownPriting = document.getElementById("countdown-printing");
// Rol seçme divi
var roleSelectionDiv = document.getElementById("role-selection-div");
// Oyuncu rolu
var playerRole;
// Üst bar
var topBar = document.getElementById("top-bar");
// Üst bar rol kutusu
var roleShowTopDiv = document.getElementById("role-show-top-div");
// Üst bar süre kutusu
var durationTopBar = document.getElementById("duration-top-bar");
// Body etiketi
var bodyTag = document.getElementById("body");
// Rol aksiyon divi
var roleActionDiv = document.getElementById("role-action-div");
// Rol aksiyon divi yazdırma alanı
var roleActionDivWrite = document.getElementById("role-action-div-write");
// Rol aksiyon divi kurtlar
var roleActionDivWolfs = document.getElementById("role-action-div-wolfs");
// Oyun sonu divi
var gameOverDiv = document.getElementById("game-over-div");
// Rol ekranı canlı oy izleme ekranı
var roleActionDivLiveVoteScreen = document.getElementById("role-action-div-live-vote-screen");
// Ölme efekti divi
var dyingEffectDiv = document.getElementById("dying-effect");
// Gün divi
var dayStationDiv = document.getElementById("day-station-div");
// Oyuncuya gözükecek gün
var writingDay = 0;

var oy_verdigi_kisi="";
var oy_veren_kisi="";
var kurt_oylaması_yapıldı_mı=0;
var oldun_mu=0;




function startGame() {
    var upd = {
        situation: 1
    }
    firebase.database().ref("roomKeys").child(randomRoomKey).update(upd);

    firebase.database().ref("roomKeys/"+randomRoomKey).once('value', (snapshot)=>{
        var sss=0;
        var player = [];
        for (const key in snapshot.val()) {
            var data = Object.values(snapshot.val());
            if (key!="situation") {
                player.push(key);
            }
        }
        //player.forEach((keyyy, index)=>{console.log(keyyy + " " + index)})
        var rolesss = roleSelection(player.length);

        // Dizileri karıştır
        shuffleArray(player);
        shuffleArray(rolesss);
        
        // Eşleştirmeyi oluştur
        var role_assignment = {};

        for (var i = 0; i < player.length; i++) {
            role_assignment[player[i]] = {role: rolesss[i]};
        }

        firebase.database().ref("roomKeys/"+randomRoomKey).once('value',(snapshot)=>{
            var sss=0;
            for (const key in snapshot.val()) {
                for (const keyt in role_assignment) {
                    if (keyt==key) {
                        firebase.database().ref("roomKeys/"+randomRoomKey+"/"+key).update(role_assignment[keyt]);
                    }
                }
                sss++;
            }
        })

        

        randomPlayerKey="admin";
    })
}

// Dizileri karıştırma işlevi
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function game() {
    starterDiv.style.display="none";
    gameDiv.classList.remove("d-none");
    var keyy;
    if (randomRoomKey!="") {
        keyy = randomRoomKey;
    }else if(roomKeyInputText.value!=""){
        keyy = roomKeyInputText.value;
    }

    // Şu anki zamanı alın
    var now = new Date();

    // 15 saniye ekleyin
    var futureTime = new Date(now.getTime() + 15000); // 15 saniye = 15000 milisaniye

    // 2023-09-09T21:38:18.305Z

    var upd = {
        time: futureTime
    }

    firebase.database().ref("roomKeys").child(keyy).update(upd);

    var sure = setInterval(()=>{
        now = new Date();
        var thisSecond = futureTime - now;
        var thisSecond = String(thisSecond).slice(0,-3);
        countdownPriting.innerHTML=thisSecond;
        if (now >= futureTime) {
            countdown.style.display="none";
            futureTime = new Date(now.getTime() + 10000);
            var upd = {
                time: futureTime
            }
            firebase.database().ref("roomKeys").child(keyy).update(upd);
            showRole(futureTime);
            clearInterval(sure);   
        }
    }, 1000);

    firebase.database().ref("roomKeys").child(keyy).on('value', (snapshot) => {
        var sss=0;
        gamePlayerFrame.innerHTML="";
        for (const key in snapshot.val()) {
            var data = Object.values(snapshot.val());
            if (key!="situation" && key!="time") {

                firebase.database().ref("roomKeys/"+keyy+"/"+key).once('value',(snapshot)=>{
                    var ddd=0;
                    for (const keyt in snapshot.val()) {
                        var dataa = Object.values(snapshot.val())
                        if (keyt=="name") {
                            if (data[sss].situation==0) {
                                html="<div class='col-3 p-1'> <div class='text-center' style='background-color: #d6feff; border-radius: 15px;'> <img class='card-img-top' src='images/grave.png'>" + dataa[ddd] +"</div> </div>";
                            }else{
                                html="<div class='col-3 p-1'> <div class='text-center' style='background-color: #d6feff; border-radius: 15px;'> <img class='card-img-top' src='images/player.png'>" + dataa[ddd] +"</div> </div>"; 
                            }
                            
                        }
                        ddd++;
                    }
                })

                gamePlayerFrame.innerHTML+=html;
                html="";

                if (oldun_mu==0) {
                   if (key==randomPlayerKey) {
                        if (data[sss].situation==0) {
                            oldun_mu=1;
                            // Ölme efekti:
                            dyingEffectDiv.classList.remove("d-none");
                        }
                    } 
                }
                
                sss++;
            }
        }
    })
}



// Rolü kullanıcıya göster
function showRole(futureTime) {
    roleSelectionDiv.classList.remove("d-none");
    countdown.classList.add("d-none");
    var keyy;
    if (randomRoomKey!="") {
        keyy = randomRoomKey;
    }else if(roomKeyInputText.value!=""){
        keyy = roomKeyInputText.value;
    }

    firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
        var sss=0;
        for (const key in snapshot.val()) {
            //var data = Object.values(snapshot.val())
            firebase.database().ref("roomKeys/"+keyy+"/"+key).once('value',(snapshot)=>{
                var ddd=0;
                for (const keyt in snapshot.val()){
                    var dataa = Object.values(snapshot.val())
                    if (keyt=="role") {
                        if (key==randomPlayerKey) {
                            playerRole=dataa[ddd];
                        }
                    }
                    ddd++;
                }
            })
            sss++;
        }
    })

    if (playerRole=="wolf") {
        var suree= setInterval(()=>{
            now = new Date();
            var thisSecond = futureTime - now;
            var thisSecond = String(thisSecond).slice(0,-3);
            roleSelectionDiv.innerHTML="<img style='height: 500px; margin:auto; display:block;' src='images/wolf.png'> <br> <h1 style='color:red'>Kurt "+thisSecond+"</h1>";
            if (now  >= futureTime) {
                roleSelectionDiv.classList.add("d-none");
                topBar.classList.remove("d-none");
                roleShowTopDiv.innerHTML="Rol: Kurt";
                gameLoop();
                clearInterval(suree);
            }
        }, 1000);
    }else if (playerRole=="villager") {
        var suree= setInterval(()=>{
            now = new Date();
            var thisSecond = futureTime - now;
            var thisSecond = String(thisSecond).slice(0,-3);
            roleSelectionDiv.innerHTML="<img style='height: 500px; margin:auto; display:block;' src='images/villager.png'> <br> <h1 style='color:skyblue'>Köylü "+thisSecond+"</h1>";
            if (now  >= futureTime) {
                roleSelectionDiv.classList.add("d-none");
                topBar.classList.remove("d-none");
                roleShowTopDiv.innerHTML="Rol: Köylü";
                gameLoop();
                clearInterval(suree);
            }
        }, 1000);
    }
}

// Oyun döngüsü
function gameLoop() {
    var day=0;
    var situation="";

    if (randomRoomKey!="") {
        keyy = randomRoomKey;
    }else if(roomKeyInputText.value!=""){
        keyy = roomKeyInputText.value;
    }

    var sss=0;
    firebase.database().ref("roomKeys/"+keyy).on('value',(snapshot)=>{
        for (const key in snapshot.val()) {
            var data = Object.values(snapshot.val());
            if (key=="situation") {
                situation = data[sss];
            }
            sss++;
        }
    });
    var xxx = situation;
    var now = new Date();
    var futureTime = new Date(now.getTime() + 30000);
    var upd = {
        time: futureTime
    }
    firebase.database().ref("roomKeys").child(keyy).update(upd);
    gameLoop1(day, xxx, futureTime);
}

function gameLoop1(day, situation, futureTime) {
    var keyy;
    if (randomRoomKey!="") {
        keyy = randomRoomKey;
    }else if(roomKeyInputText.value!=""){
        keyy = roomKeyInputText.value;
    }

    if (day%2==0) {

        // Gece:
        roleActionDivWrite.innerHTML=""
        roleActionDivLiveVoteScreen.innerHTML=""
        roleActionDiv.classList.add("d-none");
        bodyTag.style.backgroundColor="#036";
        dayStationDiv.innerHTML="Gün: "+writingDay;
        if (playerRole=="wolf") {
            wolfAction(day);
        }
        
        var gece = setInterval(()=>{
            now = new Date();
            var thisSecond = futureTime - now;
            var thisSecond = String(thisSecond).slice(0,-3);
            durationTopBar.innerHTML="Gün doğumuna: "+thisSecond+" saniye!";
            if (now >= futureTime) {
                futureTime = new Date(now.getTime() + 120000);
                var upd = {
                    time: futureTime
                }
                firebase.database().ref("roomKeys").child(keyy).update(upd);
                day++;
                // d!=0 (d: kurt oylaması yapıldı ise) en çok oyu alanı öldür.
                if (kurt_oylaması_yapıldı_mı!=0) {
                    firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
                        var sss=0;
                        for (const key in snapshot.val()) {
                            var data = Object.values(snapshot.val())
                            if (key=="vote") {
                                var ddd=0;
                                var en_buyuk="";
                                var en_buyuk2="";
                                for (var anahtar in data[sss]) {
                                    var dataa = Object.values(data[sss]);

                                    if (en_buyuk=="") {
                                        en_buyuk=dataa[ddd];
                                    }else{
                                        if (en_buyuk<dataa[ddd]) {
                                            en_buyuk=dataa[ddd];
                                        }else if (en_buyuk==dataa[ddd]) {
                                            en_buyuk2=dataa[ddd];
                                        }
                                    }

                                    //console.log(anahtar+" --> "+ dataa[ddd]);
                                    ddd++;
                                }
                                var kontrol=0;
                                if (en_buyuk!="") {
                                    
                                    if (en_buyuk2!="" && en_buyuk2==en_buyuk) {
                                        roleActionDivWrite.innerHTML="Eşit Oy";
                                        console.log("Eşit oy");
                                        kontrol=1;
                                    }
                                    if (kontrol==0) {
                                        firebase.database().ref("roomKeys/"+keyy+"/vote").once('value',(snapshot)=>{
                                            var sss=0;
                                            for (const key in snapshot.val()) {
                                                var data = Object.values(snapshot.val())
                                                    if (data[sss]==en_buyuk) {
                                                        // key->oyuncu-id 
                                                        firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
                                                            var ddd=0;
                                                            for (const keyt in snapshot.val()) {
                                                                var dataa = Object.values(snapshot.val())
                                                                    if (key==keyt) {
                                                                        var upd = {
                                                                            situation: 0
                                                                        }
                                                                        firebase.database().ref("roomKeys/"+keyy+"/"+keyt).update(upd);
                                                                    }
                                                                ddd++;
                                                            }
                                                        })
                                                    }
                                                sss++;
                                            }
                                        })
                                    }
                                    
                                }

                            }
                            sss++;
                        }
                    })
                    firebase.database().ref("roomKeys/"+keyy).child("vote").remove();
                }
                // Kalanların hepsi aynı takımdan mı? Aynı ise situation=0 yap ve oyun sonu fonksiyonunu çağır

                var sss=0;
                var kontrol="";
                var oyun_devam_mı=0;

                firebase.database().ref("roomKeys/"+keyy).on('value',(snapshot)=>{
                    sss=0;
                    kontrol="";
                    oyun_devam_mı=0;
                    for (const key in snapshot.val()) {
                        var data = Object.values(snapshot.val())
                            if (key!="vote" && key!="situation" && key!="time") {
                                if (data[sss].situation==1) {
                                    if (kontrol=="") {
                                        kontrol = data[sss].role;
                                    }
                                    if (kontrol != data[sss].role) {
                                        // Oyun devam...
                                        oyun_devam_mı=1;
                                    }
                                }
                            }
                        sss++;
                    }
                    if (oyun_devam_mı==0) {
                        gameOver(kontrol);
                    }
                });
                writingDay++;
                if (oyun_devam_mı==0) {
                    gameOver(kontrol);
                }else{
                    gameLoop1(day, situation, futureTime);
                }
                
                clearInterval(gece);
            }
        }, 1000);
        setTimeout(gece, 2000);
    }else{

        // Kalanların hepsi aynı takımdan mı? Aynı ise situation=0 yap ve oyun sonu fonksiyonunu çağır

        var sss=0;
        var kontrol="";
        var oyun_devam_mı=0;

        firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val())
                    if (key!="vote" && key!="situation" && key!="time") {
                        if (data[sss].situation==1) {
                            if (kontrol=="") {
                                kontrol = data[sss].role;
                            }
                            if (kontrol != data[sss].role) {
                                // Oyun devam...
                                oyun_devam_mı=1;
                            }
                        }
                    }
                sss++;
            }
        });

        if (oyun_devam_mı==0) {
            gameOver(kontrol);
        }

        // Gündüz:
        roleActionDivWrite.innerHTML=""
        roleActionDivLiveVoteScreen.innerHTML=""
        roleActionDiv.classList.add("d-none");
        bodyTag.style.backgroundColor="#fff4b6";
        dayStationDiv.innerHTML="Gün: "+writingDay;
        // tartışma
        var tartisma = setInterval(()=>{
            now = new Date();
            var thisSecond = futureTime - now;
            var thisSecond = String(thisSecond).slice(0,-3);
            durationTopBar.innerHTML="Tartışmanın bitmesine: "+thisSecond+" saniye!";
            if (now >= futureTime) {
                futureTime = new Date(now.getTime() + 30000);
                var upd = {
                    time: futureTime
                }
                firebase.database().ref("roomKeys").child(keyy).update(upd);
                clearInterval(tartisma);
                gunduz(day, situation, futureTime);
            }
        }, 1000);
        // oylama
        function gunduz(day, situation, futureTime) {
            roleActionDiv.classList.remove("d-none");
            roleActionDivWrite.innerHTML="Oylama zamanı!";

            villageAction();

            var oylama = setInterval(()=>{
                now = new Date();
                var thisSecond = futureTime - now;
                var thisSecond = String(thisSecond).slice(0,-3);
                durationTopBar.innerHTML="Oylamanın bitmesine: "+thisSecond+" saniye!";
                if (now >= futureTime) {
                    firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
                        var sss=0;
                        for (const key in snapshot.val()) {
                            var data = Object.values(snapshot.val())
                            if (key=="vote") {
                                var ddd=0;
                                var en_buyuk="";
                                var en_buyuk2="";
                                for (var anahtar in data[sss]) {
                                    var dataa = Object.values(data[sss]);

                                    if (en_buyuk=="") {
                                        en_buyuk=dataa[ddd];
                                    }else{
                                        if (en_buyuk<dataa[ddd]) {
                                            en_buyuk=dataa[ddd];
                                        }else if (en_buyuk==dataa[ddd]) {
                                            en_buyuk2=dataa[ddd];
                                        }
                                    }

                                    //console.log(anahtar+" --> "+ dataa[ddd]);
                                    ddd++;
                                }
                                var kontrol=0;
                                if (en_buyuk!="") {
                                    
                                    if (en_buyuk2!="" && en_buyuk2==en_buyuk) {
                                        roleActionDivWrite.innerHTML="Eşit Oy";
                                        console.log("Eşit oy");
                                        kontrol=1;
                                    }
                                    if (kontrol==0) {
                                        firebase.database().ref("roomKeys/"+keyy+"/vote").once('value',(snapshot)=>{
                                            var sss=0;
                                            for (const key in snapshot.val()) {
                                                var data = Object.values(snapshot.val())
                                                    if (data[sss]==en_buyuk) {
                                                        // key->oyuncu-id 
                                                        firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
                                                            var ddd=0;
                                                            for (const keyt in snapshot.val()) {
                                                                var dataa = Object.values(snapshot.val())
                                                                    if (key==keyt) {
                                                                        var upd = {
                                                                            situation: 0
                                                                        }
                                                                        firebase.database().ref("roomKeys/"+keyy+"/"+keyt).update(upd);
                                                                    }
                                                                ddd++;
                                                            }
                                                        })
                                                    }
                                                sss++;
                                            }
                                        })
                                    }
                                    
                                }

                            }
                            sss++;
                        }
                    })
                    firebase.database().ref("roomKeys/"+keyy).child("vote").remove();
                    futureTime = new Date(now.getTime() + 30000);
                    var upd = {
                        time: futureTime
                    }
                    firebase.database().ref("roomKeys").child(keyy).update(upd);
                    day++;
                    // Kalanların hepsi aynı takımdan mı? Aynı ise situation=0 yap ve oyun sonu fonksiyonunu çağır

                    var sss=0;
                    var kontrol="";
                    var oyun_devam_mı=0;

                    firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
                        for (const key in snapshot.val()) {
                            var data = Object.values(snapshot.val())
                                if (key!="vote" && key!="situation" && key!="time") {
                                    if (data[sss].situation==1) {
                                        if (kontrol=="") {
                                            kontrol = data[sss].role;
                                        }
                                        if (kontrol != data[sss].role) {
                                            // Oyun devam...
                                            oyun_devam_mı=1;
                                        }
                                    }
                                }
                            sss++;
                        }
                    });

                    if (oyun_devam_mı==0) {
                        gameOver(kontrol);
                    }else{
                        gameLoop1(day, situation, futureTime);
                    }



                    clearInterval(oylama);
                }
            }, 1000);
        }

        
    }

}

// Kurt aksiyonları
function wolfAction(day) {
    if(day==0){
        if (randomRoomKey!="") {
            keyy = randomRoomKey;
        }else if(roomKeyInputText.value!=""){
            keyy = roomKeyInputText.value;
        }
        var kurtlar=[];

        roleActionDiv.classList.remove("d-none");
        roleActionDivWrite.innerHTML="Bu gece yapacak bir şey yok. Yatağına geri dön!";

        firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
            var sss=0;
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val());

                if (key!="time" && key!="situation" && key!="vote") {
                    if (data[sss].role=="wolf") {
                        kurtlar[data[sss].name] = data[sss].role;
                    }
                }

                sss++;
            }
        })

        roleActionDivWolfs.innerHTML+="<div class='col-12 bg-danger'>Diğer Kurtlar:</div>";

        var anahtarlar = Object.keys(kurtlar);
        //var degerler = Object.values(kurtlar);

        for (var i = 0; i < anahtarlar.length; i++) {
            var anahtar = anahtarlar[i];
            //var deger = degerler[i];
            //console.log("Anahtar:", anahtar, "Değer:", deger);
            roleActionDivWolfs.innerHTML+="<div class='col-12 bg-danger'>"+anahtar+"</div>";
        }

        return kurtlar;
            

    }else{
        var keyy;
        if (randomRoomKey!="") {
            keyy = randomRoomKey;
        }else if(roomKeyInputText.value!=""){
            keyy = roomKeyInputText.value;
        }

        roleActionDiv.classList.remove("d-none");

        firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
            var sss=0;
            roleActionDivWrite.innerHTML="";
            html="";
            html="<div class='row'>"
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val());

                if (key!="vote" && key!="time" && key!="situation") {
                    if (data[sss].role!="wolf") {
                        if (key!=randomPlayerKey) {
                            if (data[sss].situation==1) {
                                if (oldun_mu==0) {
                                    html+="<input type='radio' name='vote' class='col-1' onclick='kurtVote("+"\""+key+"\""+")' value='"+key+"'> <span class='col-11'>"+data[sss].name+"</span>";
                                }
                            }
                            
                        }
                    }
                }

                
                sss++;
            }
            if (oldun_mu==0) {
                html+="<input type='radio' name='vote' class='col-1' onclick='kurtVote(\"empty\")' value='empty'> <span class='col-11'>Boş oy</span></div>";
            }
            roleActionDivWrite.innerHTML=html;
            html="";
        })

        // Canlı oy ekranı:
        firebase.database().ref("roomKeys/"+keyy).child("vote").on('value',(snapshot)=>{
            var htmll="";
            var sss=0;
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val())
                firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
                    var ddd=0;
                    for (const keyt in snapshot.val()) {
                        var dataa = Object.values(snapshot.val())
                            if (key==keyt) {
                                if (data[sss]!=0) {
                                    htmll+="<div class='col-12 bg-success'>"+dataa[ddd].name+" "+data[sss]+"</div>";
                                }
                                
                            }
                        ddd++;
                    }
                })
                sss++;
            }
            roleActionDivLiveVoteScreen.innerHTML=htmll;
            htmll="";
        })

    }
}

// Rol özellikleri kontrol
function roleActionDivControlButton(){
    if (roleActionDiv.classList.contains("d-none")) {
        roleActionDiv.classList.remove("d-none");
    }else{
        roleActionDiv.classList.add("d-none");
    }
}

// kurt oyları
function kurtVote(playerId) {
    kurt_oylaması_yapıldı_mı=1;
    if (randomRoomKey!="") {
        keyy = randomRoomKey;
    }else if(roomKeyInputText.value!=""){
        keyy = roomKeyInputText.value;
    }

    if (oy_veren_kisi=="") {
        if (playerId=="empty") {
            console.log("vermedim1")
            return 0;
        }
        oy_veren_kisi = randomPlayerKey;
        firebase.database().ref("roomKeys/"+keyy).child("vote").once('value',(snapshot)=>{
            var sss=0;
            var ddd=0;
            var vote;
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val())
                    if (key==playerId) {
                        vote = data[sss];
                        ddd=1;
                    }
                sss++;
            }

            if (ddd==1) {
                // Önceden oy almışsa:
                vote=vote+1;
                var upd = {}
                upd[playerId] = vote;
                firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd);
            }else{
                // İlk defa oy alacaksa:
                var upd = {}
                upd[playerId] = 1;
                firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd);
            }

            oy_verdigi_kisi = playerId;

        })
    }else{

        firebase.database().ref("roomKeys/"+keyy).child("vote").once('value',(snapshot)=>{
            var sss=0;
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val())
                    if (key==oy_verdigi_kisi) {
                        var vote = data[sss];
                        vote = vote-1;
                        var upd = {}
                        upd[oy_verdigi_kisi] = vote;
                        firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd)
                    }
                sss++;
            }
        })

        if (playerId=="empty") {
            console.log("vermedim2")
            oy_veren_kisi="";
            return 0;
        }

        firebase.database().ref("roomKeys/"+keyy).child("vote").once('value',(snapshot)=>{
            var sss=0;
            var ddd=0;
            var vote;
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val())
                    if (key==playerId) {
                        vote = data[sss];
                        ddd=1;
                    }
                sss++;
            }

            if (ddd==1) {
                // Önceden oy almışsa:
                vote=vote+1;
                var upd = {}
                upd[playerId] = vote;
                firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd);
            }else{
                // İlk defa oy alacaksa:
                var upd = {}
                upd[playerId] = 1;
                firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd);
            }

            oy_verdigi_kisi = playerId;
        })


    } 
}

// Oyun Sonu Fonksiyonu
function gameOver(kazanan_takim) {
    gameOverDiv.classList.remove("d-none");
    if (kazanan_takim=="wolf") {
        // kazanan takım kurtlarsa:
        gameOverDiv.innerHTML="<img src='images/wolf.png' style='height: 500px; margin:auto; display:block;'> <br> <h1 style='color:red'>Kurtlar Kazandı!</h1>";
    }else if (kazanan_takim=="villager") {
        // kazanan takım köyse:
        gameOverDiv.innerHTML="<img src='images/villager.png' style='height: 500px; margin:auto; display:block;'> <br> <h1 style='color:skyblue'>Köylüler Kazandı!</h1>";
    }
}

// Köy aksiyonları (genel)
function villageAction() {
    var keyy;
    if (randomRoomKey!="") {
        keyy = randomRoomKey;
    }else if(roomKeyInputText.value!=""){
        keyy = roomKeyInputText.value;
    }

    roleActionDiv.classList.remove("d-none");

    firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
        var sss=0;
        roleActionDivWrite.innerHTML="";
        html="";
        html="<div class='row'>"
        for (const key in snapshot.val()) {
            var data = Object.values(snapshot.val());

            if (key!="vote" && key!="time" && key!="situation") {
                if (key!=randomPlayerKey) {
                    if (data[sss].situation==1) {
                        if (oldun_mu==0) {
                            html+="<input type='radio' name='vote' class='col-1' onclick='villageVote("+"\""+key+"\""+")' value='"+key+"'> <span class='col-11'>"+data[sss].name+"</span>";
                        } 
                    }
                    
                }
            }

            
            sss++;
        }
        if (oldun_mu==0) {
            html+="<input type='radio' name='vote' class='col-1' onclick='villageVote(\"empty\")' value='empty'> <span class='col-11'>Boş oy</span></div>";
        }
        roleActionDivWrite.innerHTML=html;
        html="";
    })

    // Canlı oy ekranı:
    firebase.database().ref("roomKeys/"+keyy).child("vote").on('value',(snapshot)=>{
        var htmll="";
        var sss=0;
        for (const key in snapshot.val()) {
            var data = Object.values(snapshot.val())
            firebase.database().ref("roomKeys/"+keyy).once('value',(snapshot)=>{
                var ddd=0;
                for (const keyt in snapshot.val()) {
                    var dataa = Object.values(snapshot.val())
                        if (key==keyt) {
                            if (data[sss]!=0) {
                                htmll+="<div class='col-12 bg-success'>"+dataa[ddd].name+" "+data[sss]+"</div>";
                            }
                            
                        }
                    ddd++;
                }
            })
            sss++;
        }
        roleActionDivLiveVoteScreen.innerHTML=htmll;
        htmll="";
    })
}

// Köy oyu
function villageVote(playerId) {
    if (randomRoomKey!="") {
        keyy = randomRoomKey;
    }else if(roomKeyInputText.value!=""){
        keyy = roomKeyInputText.value;
    }

    if (oy_veren_kisi=="") {
        if (playerId=="empty") {
            console.log("vermedim1")
            return 0;
        }
        oy_veren_kisi = randomPlayerKey;
        firebase.database().ref("roomKeys/"+keyy).child("vote").once('value',(snapshot)=>{
            var sss=0;
            var ddd=0;
            var vote;
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val())
                    if (key==playerId) {
                        vote = data[sss];
                        ddd=1;
                    }
                sss++;
            }

            if (ddd==1) {
                // Önceden oy almışsa:
                vote=vote+1;
                var upd = {}
                upd[playerId] = vote;
                firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd);
            }else{
                // İlk defa oy alacaksa:
                var upd = {}
                upd[playerId] = 1;
                firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd);
            }

            oy_verdigi_kisi = playerId;

        })
    }else{

        firebase.database().ref("roomKeys/"+keyy).child("vote").once('value',(snapshot)=>{
            var sss=0;
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val())
                    if (key==oy_verdigi_kisi) {
                        var vote = data[sss];
                        vote = vote-1;
                        var upd = {}
                        upd[oy_verdigi_kisi] = vote;
                        firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd)
                    }
                sss++;
            }
        })

        if (playerId=="empty") {
            console.log("vermedim2")
            oy_veren_kisi="";
            return 0;
        }

        firebase.database().ref("roomKeys/"+keyy).child("vote").once('value',(snapshot)=>{
            var sss=0;
            var ddd=0;
            var vote;
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val())
                    if (key==playerId) {
                        vote = data[sss];
                        ddd=1;
                    }
                sss++;
            }

            if (ddd==1) {
                // Önceden oy almışsa:
                vote=vote+1;
                var upd = {}
                upd[playerId] = vote;
                firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd);
            }else{
                // İlk defa oy alacaksa:
                var upd = {}
                upd[playerId] = 1;
                firebase.database().ref("roomKeys/"+keyy).child("vote").update(upd);
            }

            oy_verdigi_kisi = playerId;
        })


    } 
}