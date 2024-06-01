const nickNameInput = document.getElementById("nick-name-input")
const enterGameButton = document.getElementById("enter-game-button")
const nickNameErrorSpan = document.getElementById("nick-name-error-span")

bannedCharacters = bannedCharacters.split(" ")

enterGameButton.addEventListener("click", function() {
    window.location.href="/takmaIsimIleGiris?nickName="+nickNameInput.value
})

nickNameInput.addEventListener("keyup", function() {
    enterTheGame()
})

function enterTheGame() {
    var wordControl = nickNameInput.value
    var wordControl = wordControl.split("")
    var count = false
    wordControl.forEach(element => {
        bannedCharacters.forEach(element1 => {
            switch (element1) {

                case "&lt;":
                    element1 = "<"
                    break;

                case "&gt;":
                    element1 = ">"
                    break;

            }

            if (element == element1) {
                enterGameButton.disabled = true
                nickNameErrorSpan.style.display="block"
                nickNameInput.style.border="2px solid #f00"
                enterGameButton.classList.remove("mt-3")
                count = true
            }
        })
    })
    if (count == false) {
        nickNameErrorSpan.style.display="none"
        nickNameInput.style.border="none"
        nickNameInput.style.borderBottom="2px solid #007bff"
        enterGameButton.classList.add("mt-3")
        enterGameButton.disabled = false
    }
}