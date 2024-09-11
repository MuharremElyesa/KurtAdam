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
    // Roller (Bu kısımda sol tarafta roller, sağ tarafta o rölün hangi takımdan olacağı yer alıyor.):
        exports.roles = {
            villager: "village",
            wolf: "wolf"
        }
    // Kaç kişide bir kurt rolü atanacağını belirliyoruz:
        exports.how_many_people_have_a_wolf = 5
    // Oyundaki süre değerleri:
        // Oyunun başlamasına kalan süre:
            exports.time_left_until_the_game_starts = 5 /*10*/
        // Rollerin gösterilme süresi
            exports.showing_roles = 5 /*8*/
        // Gündüz süresi:
            exports.dayTime = 5 /*30*/
        // Gece süresi:
            exports.nightTime = 5 /*30*/
        // Oylama süresi:
            exports.voteTime = 15 /*30*/
    

// Fonksiyonlar
    // game-creating.js:
        exports.preGamePlayerListRefresh
        exports.joinTheRoom
    // game.js:
        exports.timeQueryFunction
        exports.listContats
        exports.roleDistribution
        exports.night
        exports.day
        exports.vote
        exports.escapeFromTheRoom
        exports.voting
    // auth.js:
        // exports.isLoggedIn