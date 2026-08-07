// =====================================
// CLARA AROUND THE WORLD
// Versione 6.1 - Lingua automatica dal sito
// =====================================

// Legge la lingua passata dalla pagina del sito (?lang=en / ?lang=pt),
// stesso parametro già usato da panel.js. Se assente, default italiano.
const params = new URLSearchParams(window.location.search);
const LANG = params.get("lang") || "it";

// Traduzioni dell'interfaccia
const translations = {
    it: { close: "Chiudi" },
    en: { close: "Close" },
    pt: { close: "Fechar" }
};

// Aggiorna i testi dell'interfaccia
function updateInterfaceLanguage() {
    const closeButton = document.getElementById("closePanel");
    if (closeButton) {
        closeButton.textContent = translations[LANG].close;
    }
}

// Inizializzazione
document.addEventListener("DOMContentLoaded", () => {
    updateInterfaceLanguage();
});
