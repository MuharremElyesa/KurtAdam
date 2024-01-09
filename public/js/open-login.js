// open-login değişkenleri:
const oturumCercevesi = document.getElementById("oturumCercevesi")


// Başlangıç:
ekranGenisligiAyarlamasi()


// Genişlik ayarları:
function ekranGenisligiAyarlamasi() {

    // Fonksiyon değişkenleri:
    var ekranGenisligi = window.innerWidth
    // Oturum Çerçevesi Style
    const ocs = oturumCercevesi.style

    // Fonksiyon Özellikleri:
    if (ekranGenisligi<=320) {
        ocs.width="100%"
        ocs.left="auto"
        ocs.marginLeft="auto"
        oturumCercevesi.classList.remove("px-5")
    }else{
        ocs.width="auto"
        ocs.left="50%"
        oturumCercevesi.classList.add("px-5")
        ocs.marginLeft=-(oturumCercevesi.clientWidth/2)+"px"
    }

    ocs.marginTop=-(oturumCercevesi.clientHeight/2)+"px"
}