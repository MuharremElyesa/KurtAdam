// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBxw7C-h3jhVZPhb5TaqvimWHbMX_s1MLE",
    authDomain: "kurtadam-2d0d9.firebaseapp.com",
    projectId: "kurtadam-2d0d9",
    storageBucket: "kurtadam-2d0d9.appspot.com",
    messagingSenderId: "904218030245",
    appId: "1:904218030245:web:1f035aef3c01ed69381d4c",
    measurementId: "G-YQHBWR85L9"
};
firebase.initializeApp(firebaseConfig);

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
// Rastgele oda kimliği
var randomRoomKey="";
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
// Rastgele oyuncu kimliği
var randomPlayerKey;
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

// Başlangıç kutusunu sayfa yüksekliğine eşitliyoruz
starterDiv.style.height=window.innerHeight+"px";

// Body etiketi yeniden boyutlanınca yapılacak işlemler
function windowResize() {
    if(starterDiv.style.display!="none"){
        starterDiv.style.height=window.innerHeight+"px";
    }
    if (mainMenu.style.display!="none") {
        mainMenu.style.marginLeft="-"+mainMenu.clientWidth/2+"px";
        mainMenu.style.marginTop="-"+mainMenu.clientHeight/2+"px";
    }
}

// Google ile oturum açma işlemini gerçekleştiren fonksiyon
function googleSignIn() {
    // Google ile oturum açma işlemini başlatın
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        // Başarılı oturum açma durumunda yapılacak işlemler
        const user = result.user;
        console.log("Google ile oturum açıldı:", user.displayName);
        loginDiv.classList.remove("d-flex");
        loginDiv.style.display="none";
        mainMenu.style.display="block";
        mainMenu.style.marginLeft="-"+mainMenu.clientWidth/2+"px";
        mainMenu.style.marginTop="-"+mainMenu.clientHeight/2+"px";
        mainMenuName.innerHTML=result.displayName;
      })
      .catch((error) => {
        // Hata durumunda yapılacak işlemler
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Hata:", errorMessage);
      });
}

// Firebase kimlik doğrulama durumunu dinleme
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Kullanıcı oturum açmış durumda, başarılı oturum açma durumunda yapılacak işlemler
        User = user;
        console.log("Kullanıcı oturum açtı:", user.email);
        // Diğer işlemleri burada gerçekleştirin
        loginDiv.classList.remove("d-flex");
        loginDiv.style.display="none";
        mainMenu.style.display="block";
        mainMenu.style.marginLeft="-"+mainMenu.clientWidth/2+"px";
        mainMenu.style.marginTop="-"+mainMenu.clientHeight/2+"px";
        mainMenuName.innerHTML=user.displayName;
    } else {
      // Kullanıcı oturum açmamış durumda veya çıkış yaptı, çıkış durumunda yapılacak işlemler
      console.log("Kullanıcı oturum açmamış veya çıkış yaptı.");
      // Giriş sayfasına yönlendirebilir veya diğer uygun işlemleri gerçekleştirebilirsiniz
    }
});

function signOut() {
    firebase.auth().signOut()
    .then(() => {
      // Kullanıcı oturumdan çıkış yaptı
      console.log("Kullanıcı oturumdan çıkış yaptı.");
      loginDiv.classList.add("d-flex");
      loginDiv.style.display="block";
      mainMenu.style.display="none";
    })
    .catch((error) => {
      // Hata durumunda yapılacak işlemler
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Hata:", errorMessage);
    });  
}

// Yeni oda oluşturma
function newCreateRoom() {
    mainMenuRoomButtonDiv.style.display="none";
    newCreateRoomDiv.classList.remove("d-none");
    roomControlButtons.classList.remove("d-none");
    randomRoomKey=Math.floor(Math.random() * 1000000 + 100000);
    roomIdText.innerHTML=randomRoomKey;
    firebase.database().ref("roomKeys").child(randomRoomKey).set({
        admin: User.displayName,
        situation: 0
    });
    firebase.database().ref("roomKeys/"+randomRoomKey).child("situations").set({
        admin: 1
    });

    firebase.database().ref("roomKeys").child(randomRoomKey).on('value', (snapshot) => {
        gamerList.innerHTML=null;
        var sss = 0;
        for (const key in snapshot.val()) {
        var data = Object.values(snapshot.val())
        html = "<div class='before-game-players-frame col-12 mt-2 p-2 mb-2'>"+ data[sss] +"</div>";
        if (key!="situation" && key!="situations") {
            gamerList.innerHTML+=html;
        }
        html="";
        sss++;
        }
    });
    var ccc = 0;
    firebase.database().ref("roomKeys").child(randomRoomKey).on('value', (snapshot) => {
        var sss = 0;
        if (ccc==0) {
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val());
                if (key=="situation" && data[sss]=="1") {
                    game();
                    ccc++;
                }
                sss++;
            }
        }
    });
}

// Tarayıcı kapatıldığında veya yenilendiğinde yapılacak işlemleri tanımlayın
function onDisconnectHandler() {
    console.log('Tarayıcı kapatıldı veya yenilendi.');
    // İstediğiniz işlemleri burada gerçekleştirin
    if(randomRoomKey!=""){
        firebase.database().ref("roomKeys").child(randomRoomKey).remove();
    }
    if(roomKeyInputText!=""){
        firebase.database().ref("roomKeys").child(roomKeyInputText.value).once('value', (snapshot) => {
            for (const key in snapshot.val()) {
                if (randomPlayerKey==key) {
                    var upd = {
                        [key]: null
                    }
                    firebase.database().ref("roomKeys").child(roomKeyInputText.value).update(upd);
                }  
            }
        });
    }
}

// Tarayıcı yenilendiğinde onDisconnectHandler işlevini çağırın
window.onbeforeunload = onDisconnectHandler;

// Odaya katılma fonksiyonu
function joinRoom() {
    firebase.database().ref("roomKeys").once('value').then((snapshot)=>{
        for (const key in snapshot.val()) {
            if (key==roomKeyInputText.value) {
                // Odaya girme:
                randomPlayerKey = Math.floor(Math.random() * 10000);
                var roomObje = {
                    [randomPlayerKey]: User.displayName
                }
                firebase.database().ref("roomKeys").child(roomKeyInputText.value).update(roomObje);
                firebase.database().ref("roomKeys/"+roomKeyInputText.value).child("situations").update({
                    [randomPlayerKey]: 1
                })
                mainMenuRoomButtonDiv.style.display="none";
                newCreateRoomDiv.classList.remove("d-none");
                roomIdText.innerHTML = roomKeyInputText.value;
                playerButtonsDiv.classList.remove("d-none");
                firebase.database().ref("roomKeys").child(roomKeyInputText.value).on('value', (snapshot) => {
                    gamerList.innerHTML=null;
                    var sss = 0;
                    for (const key in snapshot.val()) {
                        var data = Object.values(snapshot.val())
                        html = "<div class='before-game-players-frame col-12 mt-2 p-2 mb-2'>"+ data[sss] +"</div>";
                        if (key!="situation" && key!="situations") {
                            gamerList.innerHTML+=html;
                        }
                        html="";
                        sss++;
                    }
                });
            }
        }
    });
    var ccc = 0;
    firebase.database().ref("roomKeys").child(roomKeyInputText.value).on('value', (snapshot) => {
        var sss = 0;
        if (ccc==0) {
            for (const key in snapshot.val()) {
                var data = Object.values(snapshot.val());
                if (key=="situation" && data[sss]=="1") {
                    game();
                    ccc++;
                }
                sss++;
            }
        }
    });

    // firebase.database().ref("roomKeys").on('child_removed', (snapshot) => {
    //         firebase.database().ref("roomKeys").child(roomKeyInputText.value).catch((error) => {

    //             // En son burda kaldık. Diğer kullanıcı odayı kapatınca olacaklar..

    //             mainMenuRoomButtonDiv.style.display="block";
    //             newCreateRoomDiv.classList.add("d-none");
    //             roomControlButtons.classList.add("d-none");
    //             playerButtonsDiv.classList.add("d-none");
    //             console.log("oyeeğğğğğ :D");
    //         })
    // })
}

// Odayı kapatma fonksiyonu
function roomClose() {
    firebase.database().ref("roomKeys").child(randomRoomKey).remove();
    mainMenuRoomButtonDiv.style.display="block";
    newCreateRoomDiv.classList.add("d-none");
    roomControlButtons.classList.add("d-none");
    randomRoomKey="";
}

// Odadan ayrıl
function leftRoom() {
    firebase.database().ref("roomKeys").child(roomKeyInputText.value).once('value', (snapshot) => {
        for (const key in snapshot.val()) {
            if (randomPlayerKey==key) {
                var upd = {
                    [key]: null
                }
                firebase.database().ref("roomKeys").child(roomKeyInputText.value).update(upd);
            }  
        }
    });
    mainMenuRoomButtonDiv.style.display="block";
    newCreateRoomDiv.classList.add("d-none");
    roomControlButtons.classList.add("d-none");
    playerButtonsDiv.classList.add("d-none");
}

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
            if (key!="situation" && key!="situations") {
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
            role_assignment[player[i]] = rolesss[i];
        }

        firebase.database().ref("roomKeys/"+randomRoomKey).child("roles").set(role_assignment);

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
            showRole();
            clearInterval(sure);   
        }
    }, 1000);

    firebase.database().ref("roomKeys").child(keyy).on('value', (snapshot) => {
        var sss=0;
        gamePlayerFrame.innerHTML="";
        for (const key in snapshot.val()) {
            var data = Object.values(snapshot.val());
            if (key!="situation" && key!="time" && key!="situations" && key!="roles") {
                html="<div class='col-3 p-1'> <div class='text-center' style='background-color: #d6feff; border-radius: 15px;'> <img class='card-img-top' src='images/player.png'>" + data[sss] +"</div> </div>";
                gamePlayerFrame.innerHTML+=html;
                html="";
                sss++;
            }
        }
    })
}

// Rol dağıtımı
function roleSelection(number_of_people) {
    var number_of_player = number_of_people;
    var number_of_people = number_of_people/5;
    var v1=-1, v2=0, v3=0;
    while (v3==0) {
        v1++;
        v2++;
        if (v1<number_of_people && number_of_people<=v2) {
            v3++;
        }
    }

    // alert("v1:"+v1+" "+"v2:"+v2+" "+"v3:"+v3+"\n"+"Sonuç olarak "+v2+" kurt");

    // Kurt sayısı: v2
    // Kişi sayısı: number_of_people

    var roless = [];
    var villager = number_of_player - v2;
    var wolf = v2;

    while (wolf>0) {
        roless.push("wolf");
        wolf--;
    }

    while (villager>0) {
        roless.push("villager");
        villager--;
    }

    return roless;
}

// Rolü kullanıcıya göster
function showRole() {
    roleSelectionDiv.classList.remove("d-none");
    countdown.classList.add("d-none");
    if (randomRoomKey!="") {
        keyy = randomRoomKey;
    }else if(roomKeyInputText.value!=""){
        keyy = roomKeyInputText.value;
    }

    firebase.database().ref("roomKeys/"+keyy+"/roles").once('value',(snapshot)=>{
        var sss=0;
        for (const key in snapshot.val()) {
            var data = Object.values(snapshot.val())
            if (key==randomPlayerKey) {
                playerRole=data[sss];
            }
            sss++;
        }
    })

    if (playerRole=="wolf") {
        roleSelectionDiv.innerHTML="<img style='height: 500px; margin:auto;' src='images/wolf.png'> <br> <h1 style='color:red'>Kurt</h1>";
    }else if (playerRole=="villager") {
        roleSelectionDiv.innerHTML="<img style='height: 500px; margin:auto;' src='images/villager.png'> <br> <h1 style='color:skyblue'>Köylü</h1>";
    }
}