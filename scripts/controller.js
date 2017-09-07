var camera = document.getElementById("camera");

// Scene 2.
var teleportScene2 = document.getElementById("teleport-scene2");
var soundBackgroundScene2 = document.getElementById("sound-background-scene2");
var animationDoor = document.getElementById("animation-door");
var animationDoorDelay = document.getElementById("animation-door-delay");
var soundEffectScene2 = document.getElementById("sound-effect-scene2");

// Scene 3.
var animationKhipukamayuqDelay = document.getElementById("animation-khipukamayuq-delay");
var soundKhipukamayuq = document.getElementById("sound-khipukamayuq");
var soundBackgroundScene3 = document.getElementById("sound-background-scene3");
var amulet = document.getElementById("amulet");
var animationAmuletDelay = document.getElementById("amulet-delay");
var animationAmuletAppears = document.getElementById("amulet-appears");
var animationAmuletDecends = document.getElementById("amulet-decends");
var soundNarrativeScene3 = document.getElementById("sound-narrative-scene3");

teleportScene2.addEventListener("click", function() {
    console.log("click on teleport!");
    var skyMedialab = document.getElementById("sky-medialab");
    skyMedialab.setAttribute("visible", "false");
    teleportScene2.setAttribute("visible", "false");

    var imageAnaoScene2 = document.getElementById("image-anao-scene2");
    imageAnaoScene2.setAttribute("visible", "false");    
    var imageAnapScene2 = document.getElementById("image-anap-scene2");
    imageAnapScene2.setAttribute("visible", "false");    
    var imageConiScene2 = document.getElementById("image-coni-scene2");
    imageConiScene2.setAttribute("visible", "false");    
    var imageDanieScene2 = document.getElementById("image-danie-scene2");
    imageDanieScene2.setAttribute("visible", "false");

    soundBackgroundScene2.components.sound.stopSound();
    soundEffectScene2.components.sound.stopSound();

    soundBackgroundScene3.components.sound.playSound();
    soundBackgroundScene3.emit("start");

    camera.setAttribute("position", "0 2 1");
    
    var skyRooftop = document.getElementById("sky-rooftop");
    skyRooftop.setAttribute("visible", "true");

    var imageAnaoScene3 = document.getElementById("image-anao-scene3");
    imageAnaoScene3.setAttribute("visible", "true");
    var imageAnapScene3 = document.getElementById("image-anap-scene3");
    imageAnapScene3.setAttribute("visible", "true");    
    var imageConiScene3 = document.getElementById("image-coni-scene3");
    imageConiScene3.setAttribute("visible", "true");    
    var imageDanieScene3 = document.getElementById("image-danie-scene3");
    imageDanieScene3.setAttribute("visible", "true");

    var khipukamayuq = document.getElementById("khipukamayuq");
    khipukamayuq.emit("start");
});

// Scene 2 actions.

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
    var imageAnaoScene2 = document.getElementById("image-anao-scene2");
    imageAnaoScene2.emit("walk");

    var imageAnapScene2 = document.getElementById("image-anap-scene2");
    imageAnapScene2.emit("walk");

    var imageConiScene2 = document.getElementById("image-coni-scene2");
    imageConiScene2.emit("walk");

    var imageDanieScene2 = document.getElementById("image-danie-scene2");
    imageDanieScene2.emit("walk");    
    
    //var gifAnaoWalk = document.getElementById("gif-anao-walk");
    //gifAnaoWalk.setAttribute("visible", "true");
    //gifAnaoWalk.emit("walk")
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
});
