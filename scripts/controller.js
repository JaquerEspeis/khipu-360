var animationKhipukamayuqDelay = document.getElementById("animation-khipukamayuq-delay");
var soundKhipukamayuq = document.getElementById("sound-khipukamayuq");
var soundBackgroundScene3 = document.getElementById("sound-background-scene3");
var amulet = document.getElementById("amulet");
var animationAmuletAppears = document.getElementById("amulet-appears");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 * When the Khipukamayuq starts appearing, play his voice and reduce the
 * background volume.
 */
animationKhipukamayuqDelay.addEventListener("animationend", function() {
    soundKhipukamayuq.components.sound.playSound();
    soundBackgroundScene3.emit("background-sound-reduce-volume");
});

/*
 * When the Khipukamayuq voice ends, raise the background volume.
 */
soundKhipukamayuq.addEventListener("sound-ended", function() {
    soundBackgroundScene3.emit("background-sound-raise-volume");
    amulet.emit("voice-khipukamayuq-ended");
});

/*
 * When the amulet appears, move it to the center of the girls.
 */
animationAmuletAppears.addEventListener("animationend", function() {
    amulet.emit("amulet-appears-ended");
});


var teleport = document.getElementById("amulet");

teleport.addEventListener("click", function() {
    console.log("click on teleport!");
    var image_360_1 = document.getElementById("image-360-1");
    image_360_1.setAttribute("opacity", "0");
    var image_360_2 = document.getElementById("image-360-2");
    image_360_2.setAttribute("opacity", "1");
});

