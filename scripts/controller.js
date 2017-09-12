var camera = document.getElementById("camera");

// Intro.

var skyIntro = document.getElementById("sky-intro");
var imageHeadphones = document.getElementById("image-headphones");
var animationHeadphonesStart = document.getElementById("animation-headphones-start");
var animationHeadphonesStop = document.getElementById("animation-headphones-stop");
var textHeadphones = document.getElementById("text-headphones");
var imageCardboard = document.getElementById("image-cardboard");
var animationCardboardStart = document.getElementById("animation-cardboard-start");
var animationCardboardStop = document.getElementById("animation-cardboard-stop");
var textCardboard = document.getElementById("text-cardboard");
var imageRotation = document.getElementById("image-rotation");
var animationRotationStart = document.getElementById("animation-rotation-start");
var animationRotationStop = document.getElementById("animation-rotation-stop");
var textRotation = document.getElementById("text-rotation");
var planeIntro1 = document.getElementById("plane-intro1");
var animationIntro1Start = document.getElementById("animation-intro1-start");
var animationIntro1Stop = document.getElementById("animation-intro1-stop");
var planeIntro2 = document.getElementById("plane-intro2");
var animationIntro2Start = document.getElementById("animation-intro2-start");
var animationIntro2Stop = document.getElementById("animation-intro2-stop");
var planeIntro3 = document.getElementById("plane-intro3");
var animationIntro3Start = document.getElementById("animation-intro3-start");
var animationIntro3Stop = document.getElementById("animation-intro3-stop");
var animationLastIntro = document.getElementById("animation-last-intro");

// Scene 1.
var videoScene1 = document.getElementById("video-scene1");
var aVideoScene1 = document.getElementById("a-video-scene1");

// Scene 2.
var skyMedialab = document.getElementById("sky-medialab");

var imageAnaoScene2 = document.getElementById("image-anao-scene2");
var entityGifAnaoWalk = document.getElementById("entity-gif-anao-walk");
var imageAnapScene2 = document.getElementById("image-anap-scene2");
var entityGifAnapWalk = document.getElementById("entity-gif-anap-walk");
var imageConiScene2 = document.getElementById("image-coni-scene2");
var entityGifConiWalk = document.getElementById("entity-gif-coni-walk");
var imageDanieScene2 = document.getElementById("image-danie-scene2");
var entityGifDanieWalk = document.getElementById("entity-gif-danie-walk");
var teleportScene2 = document.getElementById("teleport-scene2");
var imageTeleportScene2 = document.getElementById("image-teleport-scene2");
var soundBackgroundScene2 = document.getElementById("sound-background-scene2");
var animationDoor = document.getElementById("animation-door");
var animationDoorDelay = document.getElementById("animation-door-delay");
var soundEffectScene2 = document.getElementById("sound-effect-scene2");
var animationWalk = document.getElementById("animation-walk");

// Scene 3.
var skyRooftop = document.getElementById("sky-rooftop");

var imageAnaoScene3 = document.getElementById("image-anao-scene3");
var imageAnapScene3 = document.getElementById("image-anap-scene3");
var imageConiScene3 = document.getElementById("image-coni-scene3");
var imageDanieScene3 = document.getElementById("image-danie-scene3");
var khipukamayuq = document.getElementById("khipukamayuq");

var animationKhipukamayuqDelay = document.getElementById("animation-khipukamayuq-delay");
var soundKhipukamayuq = document.getElementById("sound-khipukamayuq");
var soundBackgroundScene3 = document.getElementById("sound-background-scene3");
var amulet = document.getElementById("amulet");
var animationAmuletDelay = document.getElementById("amulet-delay");
var animationAmuletAppears = document.getElementById("amulet-appears");
var animationAmuletDecends = document.getElementById("amulet-decends");
var soundNarrativeScene3 = document.getElementById("sound-narrative-scene3");

// Scene 4.
var skyInventoriaScene4 = document.getElementById("sky-inventoria-scene4");

var soundBackgroundScene4 = document.getElementById("sound-background-scene4");

var start = function() {
    videoScene1.play();
    videoScene1.pause();
    var rootPlay = document.getElementById("root");
    rootPlay.style.display = 'none';

    runKhipu();
};


var runKhipu = function() {

    var startIntro = function() {
      imageHeadphones.emit("start");
      textHeadphones.emit("start");
    };

    var startScene1 = function() {
        aVideoScene1.setAttribute("visible", "true");
        videoScene1.play();
    };

    var startScene2 = function() {
        aVideoScene1.setAttribute("visible", "false");

        skyMedialab.setAttribute("visible", "true");

        imageAnaoScene2.setAttribute("visible", "true");
        imageAnapScene2.setAttribute("visible", "true");
        imageConiScene2.setAttribute("visible", "true");
        imageDanieScene2.setAttribute("visible", "true");

        soundBackgroundScene2.components.sound.playSound();

        teleportScene2.setAttribute("visible", "true");
        imageTeleportScene2.emit("start");

        skyIntro.setAttribute("visible", "false");
        camera.setAttribute("position", "0 0 4.5");
    };

    var startScene3 = function() {
        skyMedialab.setAttribute("visible", "false");
        teleportScene2.setAttribute("visible", "false");

        imageAnaoScene2.setAttribute("visible", "false");
        imageAnapScene2.setAttribute("visible", "false");
        imageConiScene2.setAttribute("visible", "false");
        imageDanieScene2.setAttribute("visible", "false");

        soundEffectScene2.components.sound.stopSound();
        soundBackgroundScene2.components.sound.stopSound();

        soundBackgroundScene3.components.sound.playSound();
        soundBackgroundScene3.emit("start");

        camera.setAttribute("position", "0 2 1");

        skyRooftop.setAttribute("visible", "true");

        imageAnaoScene3.setAttribute("visible", "true");
        imageAnapScene3.setAttribute("visible", "true");
        imageConiScene3.setAttribute("visible", "true");
        imageDanieScene3.setAttribute("visible", "true");

        khipukamayuq.emit("start");
    };

    var startScene4 = function() {
        skyRooftop.setAttribute("visible", "false");
        amulet.setAttribute("visible", "false");

        khipukamayuq.setAttribute("visible", "false");
        imageAnaoScene3.setAttribute("visible", "false");
        imageAnapScene3.setAttribute("visible", "false");
        imageConiScene3.setAttribute("visible", "false");
        imageDanieScene3.setAttribute("visible", "false");

        soundBackgroundScene3.components.sound.stopSound();
        soundBackgroundScene4.emit("start");

        skyInventoriaScene4.setAttribute("visible", "true");
    };

    startIntro();

    // Intro actions.

    animationHeadphonesStart.addEventListener("animationend", function() {
        imageHeadphones.emit("stop");
        textHeadphones.emit("stop");
    });

    animationHeadphonesStop.addEventListener("animationend", function() {
        imageHeadphones.emit("next");
        textHeadphones.emit("next");
        imageCardboard.emit("start");
        textCardboard.emit("start");
    });

    animationCardboardStart.addEventListener("animationend", function() {
        imageCardboard.emit("stop");
        textCardboard.emit("stop");
    });

    animationCardboardStop.addEventListener("animationend", function() {
        imageCardboard.emit("next");
        textCardboard.emit("next");
        imageRotation.emit("start");
        textRotation.emit("start");
    });


    animationRotationStart.addEventListener("animationend", function() {
        imageRotation.emit("stop");
        textRotation.emit("stop");
    });

    animationRotationStop.addEventListener("animationend", function() {
        imageRotation.emit("next");
        textRotation.emit("next");
        planeIntro1.emit("start");
    });

    animationIntro1Start.addEventListener("animationend", function() {
        planeIntro1.emit("stop");
    });

    animationIntro1Stop.addEventListener("animationend", function() {
        planeIntro1.emit("next");
        planeIntro2.emit("start");
    });

    animationIntro2Start.addEventListener("animationend", function() {
        planeIntro2.emit("stop");
    });

    animationIntro2Stop.addEventListener("animationend", function() {
        planeIntro2.emit("next");
        planeIntro3.emit("start");
    });

    animationIntro3Start.addEventListener("animationend", function() {
        planeIntro3.emit("stop");
    });

    animationIntro3Stop.addEventListener("animationend", function() {
        planeIntro3.emit("next");
    });

    animationLastIntro.addEventListener("animationend", function() {
        startScene1();
    });

    // Scene 1 actions.

    videoScene1.addEventListener("ended", function(evt) {
        startScene2();
    });

    // Scene 2 actions.

    teleportScene2.addEventListener("click", function() {
        console.log("click on teleport!");
        startScene3();
    });

    /*
     * After 3 seconds, the door starts making sounds.
     */
    animationDoorDelay.addEventListener("animationend", function() {
        soundBackgroundScene2.emit("background-sound-reduce-volume");
        soundEffectScene2.components.sound.playSound();
    });

    /*
     * When the door starts making a sound, the girls walk towards it.
     */
    animationDoor.addEventListener("animationend", function() {
        imageAnaoScene2.emit("walk");
        entityGifAnaoWalk.emit("walk");

        imageAnapScene2.emit("walk");
        entityGifAnapWalk.emit("walk");

        imageConiScene2.emit("walk");
        entityGifConiWalk.emit("walk");

        imageDanieScene2.emit("walk");
        entityGifDanieWalk.emit("walk");
    });

    /*
     * When the girls reach the door, stop walking.
     */
    animationWalk.addEventListener("animationend", function() {
        entityGifAnaoWalk.setAttribute("visible", false);
        imageAnaoScene2.setAttribute("visible", true);

        entityGifAnapWalk.setAttribute("visible", false);
        imageAnapScene2.setAttribute("visible", true);

        entityGifConiWalk.setAttribute("visible", false);
        imageConiScene2.setAttribute("visible", true);

        entityGifDanieWalk.setAttribute("visible", false);
        imageDanieScene2.setAttribute("visible", true);

        imageTeleportScene2.emit("rotate");
    });

    soundEffectScene2.addEventListener("sound-ended", function() {
        soundBackgroundScene2.emit("background-sound-raise-volume");
    });

    // Scene 3 actions.

    /*
     * When the Khipukamayuq starts appearing, play his voice, reduce the
     * background volume, and start the (delayed) amulet animation.
     */
    animationKhipukamayuqDelay.addEventListener("animationend", function() {
        soundKhipukamayuq.components.sound.playSound();
        amulet.emit("amulet-appears-started");
        soundBackgroundScene3.emit("background-sound-reduce-volume");
    });

    /*
     * When the Khipukamayuq voice ends, raise the background volume.
     */
    soundKhipukamayuq.addEventListener("sound-ended", function() {
        //soundBackgroundScene3.emit("background-sound-raise-volume");
        amulet.emit("voice-khipukamayuq-ended");
    });

    /*
     * After 20 seconds of the Khipukamayuq voice, make the amulet visible.
     */
    animationAmuletDelay.addEventListener("animationend", function() {
        amulet.emit("amulet-delay-ended");
    });

    /*
     * After the amulet appears, move it to the center of the girls.
     */
    animationAmuletAppears.addEventListener("animationend", function() {
        amulet.emit("amulet-appears-ended");
    });

    /*
     * When the amulet finishes the decend, start the narrative.
     */
    animationAmuletDecends.addEventListener("animationend", function() {
        soundNarrativeScene3.components.sound.playSound();
        //    soundBackgroundScene3.emit("background-sound-reduce-volume");
    });

    /*
     * When the narrative ends, raise the background volume.
     */
    soundNarrativeScene3.addEventListener("sound-ended", function() {
        soundBackgroundScene3.emit("background-sound-raise-volume");
        amulet.emit("rotate")
    });

    amulet.addEventListener("click", function() {
        console.log("click on teleport!");

        startScene4();
    });
}
