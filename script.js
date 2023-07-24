// Başlangıç kutusu
const starterDiv = document.getElementById("starter-div");
// Başlangıç kutusunu sayfa yüksekliğine eşitliyoruz
starterDiv.style.height=window.innerHeight+"px";
// Body etiketi yeniden boyutlanınca yapılacak işlemler
function windowResize() {
    starterDiv.style.height=window.innerHeight+"px";
}