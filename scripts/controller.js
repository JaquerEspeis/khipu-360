var animationKhipukamayuqDelay = document.getElementById("animation-khipukamayuq-delay");
var soundKhipukamayuq = document.getElementById("sound-khipukamayuq");
var soundBackgroundScene3 = document.getElementById("sound-background-scene3");
var amulet = document.getElementById("amulet");
var animationAmuletDelay = document.getElementById("amulet-delay");
var animationAmuletAppears = document.getElementById("amulet-appears");
var animationAmuletDecends = document.getElementById("amulet-decends");
var soundNarrativeScene3 = document.getElementById("sound-narrative-scene3");

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

var teleport = document.getElementById("amulet");

teleport.addEventListener("click", function() {
    console.log("click on teleport!");
    var image_360_1 = document.getElementById("image-360-1");
    image_360_1.setAttribute("opacity", "0");
    var image_360_2 = document.getElementById("image-360-2");
    image_360_2.setAttribute("opacity", "1");
});

