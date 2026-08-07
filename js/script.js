/*
======================================================
CLARA AROUND THE WORLD
Application
Versione 3.0
======================================================
*/

const SITE_URL = "https://www.claraaroundtheworld.com/";

//--------------------------------------------------
// Avvio applicazione
//--------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    // Inizializza il globo
    GlobeManager.init("globeViz");

    // Gestione click sulle città
    GlobeManager.onCityClick(city => {

        setTimeout(() => {

            Panel.open(city);

        }, 1500);

    });

    // Quando il pannello viene chiuso
    Panel.onClose(() => {

        Animation.resumeRotation(
            GlobeManager.getWorld(),
            2000
        );

    });

    // Ridimensionamento finestra
    window.addEventListener("resize", () => {

        GlobeManager.resize();

    });

});
