// Geri dön butonu:
document.getElementById("returnButton").addEventListener("click", function() {
    window.location.href="/takmaIsimIleGiris?&nickName=" + sessionStorage.getItem("playerName")
})