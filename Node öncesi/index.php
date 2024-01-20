<!DOCTYPE html>
<html lang="tr">
<body id="body" onresize="windowResize()">

    <!-- Ölme efekti kutusu -->
    <div id="dying-effect" class="d-none"></div>

    <!-- Başlangıç kutusu -->
    <div id="starter-div">

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
        <div id="top-bar" class="d-none"><span id="role-show-top-div" class="float-start"></span><span id="day-station-div" class="position-absolute m-auto d-block"></span><div id="role-action-div-control-button" onclick="roleActionDivControlButton()"></div> <div id="duration-top-bar" class="m-auto text-center"></div></div>
        <!-- Aksiyon menüsü -->
        <div id="role-action-div" class="d-none"><div id="role-action-div-write"></div><div id="role-action-div-wolfs"></div><div id="role-action-div-live-vote-screen"></div></div>
        <!-- Oyun sonu ekranı -->
        <div id="game-over-div" class="d-none"></div>
        <!-- Oyuncuların listelenmesi -->
        <div id="game-player-frame" class="row"></div>
    </div>

    <!-- style.css -->
    <link rel="stylesheet" href="style.css">
    <!-- script.js -->
    <script src="script.js"></script>
</body>
</html>