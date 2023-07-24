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
</head>
<body onresize="windowResize()">
    <!-- Başlangıç kutusu -->
    <div id="starter-div">
        <div id="login-div">
            <input type="text" class="form-control" id="logInInputText" placeholder="<?=$settings->logInPlaceHolder?>">
            <input type="button" value="Giriş Yap" id="logInButton">
        </div>
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