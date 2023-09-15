<?php
// Ayarlar php dosyası
include 'settings.php';
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?=$settings->title?></title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <!-- Firebase servisini kullanmak için gerekli temel bağlantı -->
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <!-- Firebase realtime database (gerçek zamanlı veritabanı)nı kullanmak için gerekli bağlantı -->
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>
    <!-- Firebase auth (kimlik doğrulama) işlemi için gerekli bağlantı -->
    <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js"></script>
</head>
<body id="body" onresize="windowResize()">
    <!-- Başlangıç kutusu -->
    <div id="starter-div">
        <!-- İsim giriş kutusu -->
        <div id="login-div" class="d-flex justify-content-center">
            <!-- Google ile giriş yap butonu -->
            <button class="google-login-button col-6 m-auto" onclick="googleSignIn()" style="height: 50px;">
                <img src="images/google-icon-2048x2048-czn3g8x8.png" alt="Google Logo" style="width: 30px;">
            Google ile Giriş Yap
            </button>
        </div>
        <!-- Ana menü -->
        <div id="main-menu" class="container">
            <div class="row">
                <div id="main-menu-name" class="p-2 col-12"></div>
                <!-- Ana menü butonlar ve kod girme alanı -->
                <div id="main-menu-room-button-div" class="col-12">
                    <input type="text" class="form-control col-12 mt-3 text-center" placeholder="Oda kodunu yazınız" id="room-key-input-text">
                    <button class="btn btn-primary col-12 mt-3" onclick="joinRoom()">Odaya Katıl</button>
                    <button class="btn btn-primary col-12 mt-2" onclick="newCreateRoom()">Yeni Oda Oluştur</button>
                    <button class="btn btn-danger col-12 mt-2" onclick="signOut()">Oturumu Kapat!</button>
                </div>
                <!-- Yeni oda oluşturma -->
                <div id="newCreateRoomDiv" class="d-none col-12 text-center">
                    <span>Oda kodunuz: </span><span id="roomIdText"></span><br>
                    <div id="gamers-list" class="col-12 mt-3"></div>
                </div>
                <div id="room-control-buttons" class="col-12 d-none">
                    <button class="btn btn-success col-12 mt-3" onclick="startGame()">Oyunu Başlat!</button>
                    <button class="btn btn-danger col-12 mt-2" onclick="roomClose()">Odayı kapat!</button>
                </div>
                <div id="player-buttons-div" class="col-12 d-none">
                <button class="btn btn-danger col-12 mt-2" onclick="leftRoom()">Odadan ayrıl!</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Game -->
    <div id="game" class="d-none container-fluid">
        <!-- Rol gösterimi (olması lazım) -->
        <div id="role-selection-div" class="d-none"></div>
        <!-- Oyuna başlangıç geri sayımı -->
        <div id="countdown"> Oyunun Başlamasına Son <span id="countdown-printing"></span> Saniye!</div>
        <!-- Üst bar -->
        <div id="top-bar" class="d-none"><span id="role-show-top-div" class="float-start"></span><div id="role-action-div-control-button" onclick="roleActionDivControlButton()"></div> <div id="duration-top-bar" class="m-auto text-center"></div></div>
        <!-- Aksiyon menüsü -->
        <div id="role-action-div" class="d-none"><div id="role-action-div-write"></div><div id="role-action-div-wolfs"></div><div id="role-action-div-live-vote-screen"></div></div>
        <!-- Oyun sonu ekranı -->
        <div id="game-over-div" class="d-none"></div>
        <!-- Oyuncuların listelenmesi -->
        <div id="game-player-frame" class="row"></div>
    </div>

    <!-- Bootstrap JS ve Popper.js -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <!-- style.css -->
    <link rel="stylesheet" href="style.css">
    <!-- script.js -->
    <script src="script.js"></script>
</body>
</html>