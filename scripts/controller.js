AFRAME.registerComponent("instructions", {
  init: function () {
    let scene = this.el.sceneEl;
    let instructions = scene.querySelector("#instructions");
    instructions.addEventListener("animationtimelinecomplete", function() {
      instructions.setAttribute("visible", false);
      let intro = scene.querySelector("#intro");
      intro.setAttribute("visible", true);
      intro.emit("startIntro");
    });
  }
});

AFRAME.registerComponent("intro", {
  init: function () {
    let scene = this.el.sceneEl;
    let intro = scene.querySelector("#intro");
    intro.addEventListener("animationtimelinecomplete", function() {
      intro.setAttribute("visible", false);
      let scene1 = scene.querySelector("#scene1");
      scene1.setAttribute("visible", true);
      scene1.emit("startScene1");
      let soundBackgroundScene1 = scene.querySelector("#sound-background-scene1");
      soundBackgroundScene1.components.sound.playSound();
      let camera = scene.querySelector("#camera");
      camera.setAttribute("target-indicator", "target: #scene1-teleport");
    });
  }
});

AFRAME.registerComponent("scene1", {
  init: function () {
    let scene = this.el.sceneEl;
    let scene1 = scene.querySelector("#scene1");
    scene1.addEventListener("animationtimelinecomplete", function() {
      let gifAnaoWalk = scene.querySelector("#scene1-gif-anao-walk");
      let gifAnapWalk = scene.querySelector("#scene1-gif-anap-walk");
      let gifConiWalk = scene.querySelector("#scene1-gif-coni-walk");
      let gifDanieWalk = scene.querySelector("#scene1-gif-danie-walk");
      gifAnaoWalk.pause();
      gifAnapWalk.pause();
      gifConiWalk.pause();
      gifDanieWalk.pause();
    });
  }
});


var start = function() {
  // Hide the play button.
  var rootPlay = document.getElementById("root");
  rootPlay.style.display = "none";

  instructionsHeadset = document.getElementById("instructions-headset");
  instructionsHeadset.emit("startInstructions");

  // For debugging.
  // Start intro scene.
  //let intro = document.getElementById("intro");
  //intro.setAttribute("visible", true);
  //intro.emit("startIntro");

  // Start scene 1, medialab.
  //let scene1 = document.getElementById("scene1");
  //scene1.setAttribute("visible", true);
  //scene1.emit("startScene1");
  //let soundBackgroundScene1 = document.getElementById("sound-background-scene1");
  //soundBackgroundScene1.components.sound.playSound();
};
