/*
*/

const Panel = (() => {

    //--------------------------------------------------
    // Elementi HTML
    //--------------------------------------------------

    const panel = document.getElementById("infoPanel");
    const cityName = document.getElementById("cityName");
    const cityCountry = document.getElementById("cityCountry");
    const cityInfo = document.getElementById("cityInfo");
    const initiativeList = document.getElementById("initiativeList");
    const closeButton = document.getElementById("closePanel");

    //--------------------------------------------------
    // Callback eseguita alla chiusura
    //--------------------------------------------------

    let closeCallback = null;

    //--------------------------------------------------
    // Mostra pannello
    //--------------------------------------------------

    function open(city) {

        cityName.textContent = city.city;
        cityCountry.textContent = city.country;

        const total = city.initiatives.length;

        cityInfo.textContent =
            total + (total === 1 ? " iniziativa" : " iniziative");

        initiativeList.innerHTML = "";

        city.initiatives.forEach(initiative => {

            //--------------------------------------------------
            // Versione 3.1
            // Link vero con target="_top" invece di div + JS,
            // per bypassare i blocchi dei browser sulla
            // navigazione cross-domain iframe -> pagina padre
            //--------------------------------------------------

            const card = document.createElement("a");

            card.className = "initiative-card";

            card.textContent = initiative.title;

            card.href = SITE_URL + initiative.slug + "/";

            card.target = "_top";

            initiativeList.appendChild(card);

        });

        panel.style.display = "block";

    }

    //--------------------------------------------------
    // Nasconde pannello
    //--------------------------------------------------

    function close() {

        panel.style.display = "none";

        //--------------------------------------------------
        // Versione 9.0b
        // Rimuove l'arco attivo
        //--------------------------------------------------

        if (typeof GlobeManager !== "undefined") {
            GlobeManager.clearConnections();
        }

        if (typeof closeCallback === "function") {
            closeCallback();
        }

    }

    //--------------------------------------------------
    // Registrazione callback
    //--------------------------------------------------

    function onClose(callback) {
        closeCallback = callback;
    }

    //--------------------------------------------------
    // Chiusura con pulsante
    //--------------------------------------------------

    closeButton.addEventListener("click", close);

    //--------------------------------------------------
    // API pubblica
    //--------------------------------------------------

    return {
        open,
        close,
        onClose
    };

})();
