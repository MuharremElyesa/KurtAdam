// open-login değişkenleri:
const cerceve = document.querySelectorAll(".cerceve");


// Genişlik ayarları:
function ekranGenisligiAyarlamasi() {

    cerceve.forEach(element => {
        // Çerçeve Style:
        const cs = element.style

        // Oturum çerçevesini yukarıdan ortalar:
        cs.marginTop = -(element.clientHeight / 2) + "px"
    });
}


// Başlangıç:
ekranGenisligiAyarlamasi()