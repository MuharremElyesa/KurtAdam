// Oyun
    // Oyun Adı:
    exports.gameName = "KurtAdam"
    // Rastgele oda kimliği:
    exports.randomRoomKey
    // open-login.pug sayfasındaki takma isim kısmındaki yasaklı karakterler:
    exports.bannedCharacters1 = "< > / \\ - + = ."
    // Rastgele oyuncu id'si oluşturma alt ve üst değeri:
    exports.r_id_min = 1000000
    exports.r_id_max = 9999999
    // exports.r_id_length = this.r_id_max.toString().length
    // Rastgele oda kimliği alt ve üst değerleri:
    exports.r_room_min = 100000
    exports.r_room_max = 999999
    // Oyunun başlamasına kalan süre:
    exports.time_left_until_the_game_starts = 10
    

// Fonksiyonlar
    // game-creating.js:
        exports.preGamePlayerListRefresh
        exports.joinTheRoom
    // game.js:
        exports.timeQueryFunction
        exports.listContats
        exports.roleDistribution
    // auth.js:
        // exports.isLoggedIn