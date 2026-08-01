/*
======================================================
CLARA AROUND THE WORLD
Globe Manager
Versione 4.1
======================================================
*/

const GlobeManager = (() => {

    //--------------------------------------------------
    // Globo
    //--------------------------------------------------

    let world = null;

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
            .pointsData(initiatives)

            .pointAltitude(0.012)

            .pointRadius(city => city.active ? 1.30 : 0.55)

            .pointResolution(64)

            .pointColor(city =>
                city.active
                    ? "#FFD84D"
                    : "#F4B400"
            )

            .pointLabel(city => city.city);

        world.width(window.innerWidth);
world.height(window.innerHeight);
   

        Animation.startRotation(world);

        initiatives.forEach(city => {

            city.active = false;

        });

        return world;

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

        });

        city.active = true;

        world
            .pointsData(initiatives)
            .pointAltitude(0.012)
            .pointRadius(item => item.active ? 1.30 : 0.55)
            .pointResolution(64)
            .pointColor(item =>
                item.active
                    ? "#FFD84D"
                    : "#F4B400"
            );

    }

    //--------------------------------------------------
    // Focus
    //--------------------------------------------------

    function focus(city) {

        Animation.focus(world, city);

    }

    //--------------------------------------------------
    // Evento click
    //--------------------------------------------------

    function onCityClick(callback) {

        world.onPointClick(city => {

            selectCity(city);

            Animation.stopRotation(world);

            focus(city);

            if (typeof callback === "function") {

                callback(city);

            }

        });

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

        resize

    };

})();