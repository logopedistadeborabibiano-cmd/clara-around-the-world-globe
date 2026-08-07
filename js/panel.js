/*
======================================================
CLARA AROUND THE WORLD
Panel Manager
Versione 4.0 - Link multilingua con fallback su IT
======================================================
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
    // Rileva la lingua della pagina che ospita il globo
    // (guarda il path della finestra "top", non quello
    // dell'iframe, che è sempre lo stesso dominio GitHub Pages)
    //--------------------------------------------------

    function detectLang() {

        let path = "";

        try {

            path = window.top.location.pathname;

        } catch (e) {

            path = window.location.pathname;

        }

        if (path.startsWith("/en/")) return "en";

        if (path.startsWith("/pt/")) return "pt";

        return "it";

    }

    //--------------------------------------------------
    // Scelta dello slug in base alla lingua, con fallback
    // automatico sull'italiano se quella lingua non è
    // ancora stata compilata (valore null).
    //
    // Versione 4.1
    // Restituisce anche il prefisso di lingua corretto da
    // usare nell'URL: l'italiano non ha prefisso, inglese
    // e portoghese lo richiedono (/en/ e /pt/). Se si fa
    // fallback sull'italiano, va usato anche il prefisso
    // italiano (nessuno), non quello della lingua richiesta.
    //--------------------------------------------------

    function resolveLangAndSlug(initiative) {

        const lang = detectLang();

        const slugObj = initiative.slug;

        if (slugObj[lang]) {

            return { lang: lang, slug: slugObj[lang] };

        }

        return { lang: "it", slug: slugObj.it };

    }

    function langPrefix(lang) {

        if (lang === "it") return "";

        return lang + "/";

    }

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
            // Link vero con target="_top", per bypassare i
            // blocchi dei browser sulla navigazione
            // cross-domain iframe -> pagina padre
            //--------------------------------------------------

            const card = document.createElement("a");

            card.className = "initiative-card";

            card.textContent = initiative.title;

            const resolved = resolveLangAndSlug(initiative);

            card.href =
                SITE_URL + langPrefix(resolved.lang) + resolved.slug + "/";

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

