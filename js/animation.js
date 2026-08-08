/*
======================================================
CLARA AROUND THE WORLD
Animation Engine
Versione 3.0
======================================================
*/

const Animation = (() => {

    // Velocità standard del globo
    const DEFAULT_ROTATION_SPEED = 0.25;

    // Timer interno
    let resumeTimer = null;

    //--------------------------------------------------
    // Avvia la rotazione
    //--------------------------------------------------

    function startRotation(world, speed = DEFAULT_ROTATION_SPEED) {

        if (!world) return;

        world.controls().autoRotate = true;
        world.controls().autoRotateSpeed = speed;

    }

    //--------------------------------------------------
    // Ferma immediatamente la rotazione
    //--------------------------------------------------

    function stopRotation(world) {

        if (!world) return;

        clearTimeout(resumeTimer);

        world.controls().autoRotate = false;

    }

    //--------------------------------------------------
    // Riprende la rotazione dopo un tempo
    //--------------------------------------------------

    function resumeRotation(world, delay = 2000) {

        if (!world) return;

        clearTimeout(resumeTimer);

        resumeTimer = setTimeout(() => {

            startRotation(world);

        }, delay);

    }

    //--------------------------------------------------
    // Focus su una città
    //--------------------------------------------------

    function focus(world, point, duration = 1500) {

        if (!world || !point) return;

        world.pointOfView(
            {
                lat: point.lat,
                lng: point.lng,
                altitude: 2
            },
            duration
        );

    }

    //--------------------------------------------------
    // API pubblica
    //--------------------------------------------------

    return {

        startRotation,
        stopRotation,
        resumeRotation,
        focus,

        DEFAULT_ROTATION_SPEED

    };

})();
