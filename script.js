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
var randomRoomKey;

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

// İsim girildikten sonra
function logIn() {
    if(nameInput.value!=""){
        loginDiv.style.display="none";
        mainMenu.style.display="block";
        mainMenu.style.marginLeft="-"+mainMenu.clientWidth/2+"px";
        mainMenu.style.marginTop="-"+mainMenu.clientHeight/2+"px";
        mainMenuName.innerHTML=nameInput.value;
    }else{
        alert("Lütfen bir isim ya da kullanıcı adı giriniz");
    }
}

// Yeni oda oluşturma
function newCreateRoom() {
    mainMenuRoomButtonDiv.style.display="none";
    newCreateRoomDiv.classList.remove("d-none");
    randomRoomKey=Math.floor(Math.random() * 100000 + 100000);
    roomIdText.innerHTML=randomRoomKey;
    firebase.database().ref("roomKeys").push().set(randomRoomKey);
}