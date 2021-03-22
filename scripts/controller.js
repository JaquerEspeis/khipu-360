AFRAME.registerComponent("instructions", {
  init: function () {
    let scene = this.el.sceneEl;
    let instructions = scene.querySelector("#instructions");
    instructions.addEventListener("animationtimelinecomplete", function() {
      instructions.setAttribute("visible", false);
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
    });
  }
});


var start = function() {
  // Hide the play button.
  var rootPlay = document.getElementById("root");
  rootPlay.style.display = "none";

  //  instructionsHeadset = document.getElementById("instructions-headset");
  //  instructionsHeadset.emit("startInstructions");

  // For debugging.
  // Start intro Scene.
  let intro = document.getElementById("intro");
  intro.setAttribute("visible", true);
  intro.emit("startIntro");
};
