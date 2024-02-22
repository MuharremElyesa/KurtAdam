// open-login değişkenleri:
const oturumCercevesi = document.getElementById("oturumCercevesi")


// Başlangıç:
ekranGenisligiAyarlamasi()


// Genişlik ayarları:
function ekranGenisligiAyarlamasi() {

    // Oturum Çerçevesi Style:
    const ocs = oturumCercevesi.style


    // Oturum çerçevesini yukarıdan ortalar:
    ocs.marginTop=-(oturumCercevesi.clientHeight/2)+"px"
}