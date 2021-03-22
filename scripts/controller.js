AFRAME.registerComponent("instructions", {
  init: function () {
    let scene = this.el.sceneEl;
    let instructions = scene.querySelector("#instructions");
    instructions.addEventListener("animationtimelinecomplete", function() {
      let skyInstructions = instructions.querySelector("#sky-instructions");
      instructions.setAttribute("visible", false);
      let scene1 = scene.querySelector("#scene1");
      scene1.setAttribute("visible", true);
    });
  }
});



var start = function() {
  // Hide the play button.
  var rootPlay = document.getElementById("root");
  rootPlay.style.display = "none";

  introHeadset = document.getElementById("instructions-headset");
  introHeadset.emit("startInstructions");
};
