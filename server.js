/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// Express.js'i nesne olarak tanımladık:
const app = express()
// router.js'i modul olarak tanımladık:
const router = require("./app/controllers/router")
// Node.js path modülü:
const path = require("path")
// Socket.io modülü:
const socketIo = require("socket.io")
// Global Değişkenler:
const globalVariables = require("./config/global-variables")


/* Ayarlar */
// Görüntü motorunun "pug" olduğunu belirttik:
app.set("view engine", "pug")
// views klasörünün konumunu bildirdik:
app.set("views", "./app/views")
// Bu oluşturduğumuz middleware ile express.js'in static özelliğini kullanarak ve path modulü ile de yolumuzu belirterek "public" klasörünü tarayıcıdan ulaşılabilir hale getirdik:
app.use(express.static(path.join(__dirname, "public")))


/* Program Akışı */
// router modulunu middleware olarak tanımladık:
app.use(router)
// 7777 portu üzerinden yayın yapıyoruz:
const io = socketIo(app.listen(7777))

// Socket.io Server İşlemleri:
io.on("connection", (connectedSocket) => {

    // Oyun öncesi ekranında odada olan oyuncuları listeleyen olay:
    connectedSocket.on("firstPreGamePlayerListRefresh", () => {
        globalVariables.preGamePlayerListRefresh(io)
    })

})