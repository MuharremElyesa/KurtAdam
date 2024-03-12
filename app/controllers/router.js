/* Moduller */
// Express.js'i tanımladık:
const express = require("express")
// express'in Router metodunu tanımladık:
const router = express.Router()
// express app:
const app = express()
// Oturum açmak:
const auth = require("../models/auth")
// Global Değişkenler:
const globalVariables = require("./../../config/global-variables")
// Oyun oluşturma ve katılmadan sorumlu .js:
const gameCreating = require("./../models/game-creating")


/* Program Akışı */
// auth:
router.use(auth)
// gameCreating:
router.use(gameCreating)

// Ana dizin middleware:
router.use("/", (req, res) => {
    res.render("open-login", {gameName: globalVariables.gameName})
})


/* Export */
// router'i dış kullanıma açıyoruz:
module.exports = router