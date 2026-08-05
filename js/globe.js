/*
======================================================
CLARA AROUND THE WORLD
Globe Manager
Versione 10.1 - Marker "Fiammella" (HTML overlay)
======================================================
*/

const GlobeManager = (() => {

    //--------------------------------------------------
    // Globo
    //--------------------------------------------------

    let world = null;

    //--------------------------------------------------
    // Callback registrata da script.js
    //--------------------------------------------------

    let clickCallback = null;

    // Timer per l'animazione iniziale (arco verso tutte le città)
    let introTimer = null;

    //--------------------------------------------------
    // Versione 10.1
    // Crea il marker "fiammella" (elemento HTML reale)
    //--------------------------------------------------

    function createFlameMarker(city) {

        const marker = document.createElement("div");

        marker.className = "clara-light";

        marker.innerHTML = `
            <svg class="clara-flame" viewBox="0 0 40 40">
                <path
                    d="M20 8
                       C26 14 28 20 25 27
                       C23 31 20 33 20 33
                       C20 33 17 31 15 27
                       C12 20 14 14 20 8Z"
                    fill="#FFC533"/>
                <path
                    d="M20 15
                       C22 18 22 22 20 25
                       C18 22 18 18 20 15Z"
                    fill="#FFFDF8"/>
            </svg>
        `;

        // Tooltip col nome della città (stile personalizzato,
        // al passaggio del mouse - non il tooltip nativo del browser)

        const tooltip = document.createElement("span");

        tooltip.className = "clara-tooltip";
        tooltip.textContent = city.city;

        marker.appendChild(tooltip);

        marker.setAttribute("aria-label", city.city);

        marker.addEventListener("click", (e) => {

            e.stopPropagation();

            handleCityClick(city);

        });

        // Salviamo il riferimento al nodo DOM sulla città stessa,
        // così possiamo aggiornarne lo stato (active / arrived)
        // senza dover ridisegnare tutti i marker.

        city.el = marker;

        return marker;

    }

    //--------------------------------------------------
    // Gestione click centralizzata
    //--------------------------------------------------

    function handleCityClick(city) {

        selectCity(city);

        Animation.stopRotation(world);

        focus(city);

        if (typeof clickCallback === "function") {

            clickCallback(city);

        }

    }

    //--------------------------------------------------
    // Inizializzazione
    //--------------------------------------------------

    function init(containerId) {

        world = Globe()(document.getElementById(containerId))

            .globeImageUrl("//unpkg.com/three-globe/example/img/earth-blue-marble.jpg")

            .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")

            .backgroundImageUrl("//unpkg.com/three-globe/example/img/night-sky.png")

            .backgroundColor("#020611")

            .showAtmosphere(true)

            .atmosphereColor("#8FD3FF")

            .atmosphereAltitude(0.14)

            //--------------------------------------------------
            // Versione 10.1 - Marker come overlay HTML
            //--------------------------------------------------

            .htmlElementsData(initiatives)

            .htmlLat(d => d.lat)

            .htmlLng(d => d.lng)

            .htmlAltitude(0.01)

            .htmlElement(createFlameMarker)

//--------------------------------------------------
// Clara Light Trail 10.2
//--------------------------------------------------

.arcColor(() => "rgba(255,236,170,0.35)")

.arcStroke(0.18)

.arcDashLength(0.10)

.arcDashGap(2.0)

.arcDashAnimateTime(1200)

.arcsData([]);

        world.width(window.innerWidth);
        world.height(window.innerHeight);

        Animation.startRotation(world);

        initiatives.forEach(city => {

            city.active = false;

        });

        // Animazione introduttiva: mostra per un breve momento
        // un arco da Milano verso tutte le città, poi si spegne

        setTimeout(() => {

            playIntroArcs();

        }, 1200);

        return world;

    }

    //--------------------------------------------------
    // Animazione introduttiva - arco verso tutte le città
    //--------------------------------------------------

    function playIntroArcs() {

        const milano = initiatives.find(item => item.city === "Milano");

        if (!milano) return;

        const introArcs = initiatives

            .filter(item => item.city !== "Milano")

            .map(item => ({

                startLat: milano.lat,
                startLng: milano.lng,
                endLat: item.lat,
                endLng: item.lng

            }));

        world.arcsData(introArcs);

        introTimer = setTimeout(() => {

            // Non spegnere se nel frattempo l'utente ha già
            // selezionato una città (l'arco singolo prende priorità)

            const alreadySelected = initiatives.some(item => item.active);

            if (!alreadySelected) {

                world.arcsData([]);

            }

        }, 3200);

    }

    //--------------------------------------------------
    // Restituisce il globo
    //--------------------------------------------------

    function getWorld() {

        return world;

    }

    //--------------------------------------------------
    // Evidenzia una città
    //--------------------------------------------------

    function selectCity(city) {

        initiatives.forEach(item => {

            item.active = false;

            if (item.el) {

                item.el.classList.remove("active", "arrived");

            }

        });

        city.active = true;

        if (city.el) {

            city.el.classList.add("active");

        }

        //--------------------------------------------------
        // Collegamento Milano -> città selezionata
        //--------------------------------------------------

        const milano = initiatives.find(item => item.city === "Milano");

        if (!milano || city.city === "Milano") {

            clearTimeout(introTimer);

            clearConnections();

        } else {

            // Se l'utente clicca durante l'animazione introduttiva,
            // questa non deve più spegnere l'arco appena impostato

            clearTimeout(introTimer);

            showConnection([
                {
                    startLat: milano.lat,
                    startLng: milano.lng,
                    endLat: city.lat,
                    endLng: city.lng
                }
            ]);

        }

        //--------------------------------------------------
        // Effetto "luce arrivata" - breve lampo più intenso
        //--------------------------------------------------

        setTimeout(() => {

            if (city.el) {

                city.el.classList.add("arrived");

            }

            setTimeout(() => {

                if (city.el) {

                    city.el.classList.remove("arrived");

                }

            }, 500);

        }, 1200);

    }

    //--------------------------------------------------
    // Focus
    //--------------------------------------------------

    function focus(city) {

        Animation.focus(world, city);

    }

    //--------------------------------------------------
    // Registrazione callback esterna (usata da script.js)
    //--------------------------------------------------

    function onCityClick(callback) {

        clickCallback = callback;

    }

    //--------------------------------------------------
    // Versione 8.5 - Gestione connessioni
    //--------------------------------------------------

    function showConnection(arcs) {

        if (!world) return;

        world.arcsData(arcs || []);

    }

    function clearConnections() {

        if (!world) return;

        world.arcsData([]);

    }

    //--------------------------------------------------
    // Ridimensionamento
    //--------------------------------------------------

    function resize() {

        world.width(window.innerWidth);

        world.height(window.innerHeight);

    }

    //--------------------------------------------------
    // API pubblica
    //--------------------------------------------------

    return {

        init,

        getWorld,

        onCityClick,

        resize,

        showConnection,
        clearConnections

    };

})();