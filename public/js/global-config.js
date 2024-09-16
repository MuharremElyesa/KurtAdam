// open-login değişkenleri:
const cerceve = document.querySelectorAll(".cerceve");

// Genişlik ayarları:
function ekranGenisligiAyarlamasi() {
    cerceve.forEach(element => {
        // Çerçeve Style:
        const cs = element.style;

        // Oturum çerçevesini yukarıdan ortalar:
        cs.marginTop = -(element.clientHeight / 2) + "px";
    });
}

// Başlangıç:
ekranGenisligiAyarlamasi();

// ResizeObserver ile elementin boyutları değiştiğinde fonksiyonu tetikleyelim
cerceve.forEach(element => {
    const resizeObserver = new ResizeObserver(() => {
        ekranGenisligiAyarlamasi(); // Boyut değiştiğinde yeniden ortala
    });

    // Gözlem başlatılıyor
    resizeObserver.observe(element);
});

// Pencere yeniden boyutlandırıldığında da yeniden ortalar
window.addEventListener('resize', ekranGenisligiAyarlamasi);
