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
    randomRoomKey=Math.floor(Math.random() * 1000000 + 100000);
    roomIdText.innerHTML=randomRoomKey;
    firebase.database().ref("roomKeys").child(randomRoomKey).set({
        admin: User.displayName
    });
    firebase.database().ref("roomKeys").child(randomRoomKey).on('value', (snapshot) => {
        var data = Object.values(snapshot.val())
        html = "<div class='bg-warning col-12 mt-2'>"+ data[0] +"</div>";
        gamerList.innerHTML=html;
        html="";
    });
}

// Tarayıcı kapatıldığında veya yenilendiğinde yapılacak işlemleri tanımlayın
function onDisconnectHandler() {
    console.log('Tarayıcı kapatıldı veya yenilendi.');
    // İstediğiniz işlemleri burada gerçekleştirin
    if(randomRoomKey!=""){
        firebase.database().ref("roomKeys").child(randomRoomKey).remove();
    }
}

// Tarayıcı yenilendiğinde onDisconnectHandler işlevini çağırın
window.onbeforeunload = onDisconnectHandler;

function joinRoom() {
    firebase.database().ref("roomKeys").once('value', (snapshot)=>{
        console.log(Object.values(snapshot.val()));
        // if (roomKeyInputText.value==snapshot.val()) {
        
        // } else {
            
        // }

        //Burdan devamke
    })
}