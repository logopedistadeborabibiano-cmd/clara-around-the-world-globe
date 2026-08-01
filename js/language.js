// =====================================
// CLARA AROUND THE WORLD
// Versione 6.0 - Gestione Lingue
// =====================================

// Lingua corrente
let LANG = localStorage.getItem("lang") || "it";

// Traduzioni dell'interfaccia
const translations = {

    it: {
        close: "Chiudi"
    },

    en: {
        close: "Close"
    },

    pt: {
        close: "Fechar"
    }

};


// Aggiorna i testi dell'interfaccia
function updateInterfaceLanguage() {

    const closeButton = document.getElementById("closePanel");

    if (closeButton) {

        closeButton.textContent = translations[LANG].close;

    }

}


// Aggiorna lo stato dei pulsanti
function updateLanguageButtons() {

    document.querySelectorAll(".lang").forEach(button => {

        button.classList.remove("active");

        if (button.dataset.lang === LANG) {

            button.classList.add("active");

        }

    });

}


// Cambia lingua
function setLanguage(language) {

    LANG = language;

    localStorage.setItem("lang", LANG);

    updateLanguageButtons();

    updateInterfaceLanguage();

}


// Inizializzazione
document.addEventListener("DOMContentLoaded", () => {

    updateLanguageButtons();

    updateInterfaceLanguage();

    document.querySelectorAll(".lang").forEach(button => {

        button.addEventListener("click", () => {

            setLanguage(button.dataset.lang);

        });

    });

});