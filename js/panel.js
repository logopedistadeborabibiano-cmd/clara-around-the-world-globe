/*
======================================================
CLARA AROUND THE WORLD
Panel Manager
Versione 4.1 - Link multilingua con fallback su IT,
                testo "iniziativa/e" tradotto
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
    // Rileva la lingua del globo.
    //
    // Versione 4.2
    // Un iframe cross-domain NON può leggere l'URL della
    // pagina che lo contiene (window.top.location è
    // bloccato dal browser per sicurezza) - può solo
    // scriverci sopra per navigare. Quindi la lingua non
    // si "indovina" più: viene passata esplicitamente
    // nell'URL dell'iframe stesso, come parametro
    // ?lang=en oppure ?lang=pt (nessun parametro = it).
    //--------------------------------------------------

    function detectLang() {

        const params = new URLSearchParams(window.location.search);

        const lang = params.get("lang");

        if (lang === "en" || lang === "pt") return lang;

        return "it";

    }

    //--------------------------------------------------
    // Etichetta "iniziativa/iniziative" tradotta
    //--------------------------------------------------

    const initiativeLabels = {
        it: { one: "iniziativa", other: "iniziative" },
        en: { one: "initiative", other: "initiatives" },
        pt: { one: "iniciativa", other: "iniciativas" }
    };

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

        const lang = detectLang();
        const label = initiativeLabels[lang][total === 1 ? "one" : "other"];

        cityInfo.textContent = total + " " + label;

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
