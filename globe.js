/*
======================================================
CLARA AROUND THE WORLD
Globe Manager
Versione 9.3
======================================================
*/

const GlobeManager = (() => {

    //--------------------------------------------------
    // Globo
    //--------------------------------------------------

    let world = null;

    //--------------------------------------------------
    // Versione 9.3
    // Glow pulsante caldo
    //--------------------------------------------------

    let pulsePhase = 0;
    let pulseInterval = null;

    function warmColor(intensity) {

        const from = [244, 180, 0];    // #F4B400 - ambra
        const to   = [255, 248, 168];  // #FFF8A8 - dorato chiaro

        const r = Math.round(from[0] + (to[0] - from[0]) * intensity);
        const g = Math.round(from[1] + (to[1] - from[1]) * intensity);
        const b = Math.round(from[2] + (to[2] - from[2]) * intensity);

        return `rgb(${r},${g},${b})`;

    }

    function startGlowPulse() {

        if (pulseInterval) return;

        pulseInterval = setInterval(() => {

            pulsePhase += 0.09;

            const intensity = (Math.sin(pulsePhase) + 1) / 2; // oscilla 0 -> 1

            world
                .pointColor(city => {

                    if (city.arrived) return "#FFF8A8";

                    const base = city.active ? 0.5 : 0.1;

                    return warmColor(base + intensity * 0.5);

                })
                .pointRadius(city => {

                    const baseR = city.active ? 1.30 : 0.55;

                    return baseR + intensity * (city.active ? 0.22 : 0.12);

                });

        }, 60);

    }

    function stopGlowPulse() {

        clearInterval(pulseInterval);

        pulseInterval = null;

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
            .pointsData(initiatives)

            .pointAltitude(0.012)

            .pointRadius(city => city.active ? 1.30 : 0.55)

            .pointResolution(64)

            .pointColor(city =>
                city.active
                    ? "#FFD84D"
                    : "#F4B400"
            )

            .pointLabel(city => city.city)

//--------------------------------------------------
// Versione 9.1
// The Light of Clara
//--------------------------------------------------

.arcColor(() => "#FFF176")

.arcStroke(0.28)

.arcDashLength(0.012)

.arcDashGap(2.5)

.arcDashAnimateTime(1200)

.arcsData([])

//--------------------------------------------------
// Versione 9.2
// Rings - bagliore che si espande
//--------------------------------------------------

.ringsData(initiatives)

.ringColor(() => "#FFD98A")

.ringMaxRadius(1.4)

.ringPropagationSpeed(1.1)

.ringRepeatPeriod(2200);

        world.width(window.innerWidth);
world.height(window.innerHeight);
   

        Animation.startRotation(world);

        initiatives.forEach(city => {

            city.active = false;

        });

        startGlowPulse();

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
city.arrived = false;

    world
        .pointsData(initiatives)
        .pointAltitude(0.012)
        .pointRadius(item => item.active ? 1.30 : 0.55)
        .pointResolution(64)
        .pointColor(item => {

    if(item.arrived){

        return "#FFF8A8";

    }

    if(item.active){

        return "#FFD84D";

    }

    return "#F4B400";

})

    //--------------------------------------------------
    // Collegamento Milano -> città selezionata
    //--------------------------------------------------

    const milano = initiatives.find(item => item.city === "Milano");

    if (!milano || city.city === "Milano") {

        clearConnections();

        return;

    }

    showConnection([
        {
            startLat: milano.lat,
            startLng: milano.lng,
            endLat: city.lat,
            endLng: city.lng
        }
    ]);

    //--------------------------------------------------
    // Piccola pulsazione del punto
    //--------------------------------------------------

    setTimeout(() => {

        world.pointRadius(item => {

            if (item === city) return 1.75;

            return item.active ? 1.30 : 0.55;

        });

        setTimeout(() => {

            world.pointRadius(item =>
                item.active ? 1.30 : 0.55
            );

        }, 280);

    }, 1150);

    //--------------------------------------------------
    // Effetto "luce arrivata"
    //--------------------------------------------------

    setTimeout(() => {

        city.arrived = true;

        world.pointsData([...initiatives]);

        setTimeout(() => {

            city.arrived = false;

            world.pointsData([...initiatives]);

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
    // Versione 8.5 - Gestione connessioni
    //--------------------------------------------------

    function showConnection(arcs){
        if(!world) return;
        world.arcsData(arcs || []);
    }

    function clearConnections(){
        if(!world) return;
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
        clearConnections,

        startGlowPulse,
        stopGlowPulse

    };

})();
