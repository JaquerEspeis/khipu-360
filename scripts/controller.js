var teleportEnabled = false;


AFRAME.registerComponent("instructions", {
  init: function () {
    let scene = this.el.sceneEl;
    let instructions = scene.querySelector("#instructions");
    instructions.addEventListener("animationtimelinecomplete", function() {
      instructions.setAttribute("visible", false);
      startIntro();
    });
  }
});

AFRAME.registerComponent("intro", {
  init: function () {
    let scene = this.el.sceneEl;
    let intro = scene.querySelector("#intro");
    intro.addEventListener("animationtimelinecomplete", function() {
      intro.setAttribute("visible", false);
      startScene1();
    });
  }
});

AFRAME.registerComponent("scene1", {
  init: function () {
    let scene = this.el.sceneEl;

    // After the background sound volume is reduced, play the sound effect.
    let scene1SoundEffect = scene.querySelector("#scene1-sound-effect");
    let scene1SoundBackground = scene.querySelector("#scene1-sound-background");
    scene1SoundBackground.addEventListener("animationcomplete__volume_reduce", function() {
      scene1SoundEffect.components.sound.playSound();
    });

    // After the sound effect ends, raise the background sound volume.
    scene1SoundEffect.addEventListener("sound-ended", function() {
      scene1SoundBackground.emit("scene1_volume_raise");
    });

    // After the move animation is complete.
    let scene1 = scene.querySelector("#scene1");
    scene1.addEventListener("animationtimelinecomplete", function() {
      //  Pause the gifs
      let gifAnaoWalk = scene.querySelector("#scene1-gif-anao-walk");
      let gifAnapWalk = scene.querySelector("#scene1-gif-anap-walk");
      let gifConiWalk = scene.querySelector("#scene1-gif-coni-walk");
      let gifDanieWalk = scene.querySelector("#scene1-gif-danie-walk");
      gifAnaoWalk.pause();
      gifAnapWalk.pause();
      gifConiWalk.pause();
      gifDanieWalk.pause();

      teleportEnabled = true;

      // Mark the teleport as the target.
      let camera = scene.querySelector("#camera");
      camera.setAttribute("target-indicator", "target: #scene1-teleport");

      let teleport = scene.querySelector("#scene1-teleport");
      teleport.setAttribute("class", "clickable");
    });

    let teleport = scene.querySelector("#scene1-teleport");
    teleport.addEventListener("click", function() {
      console.log("click on teleport!");
      if (teleportEnabled == true) {
        teleportEnabled = false;

        scene1.setAttribute("visible", false);
        scene1SoundBackground.components.sound.stopSound();
        scene1SoundEffect.components.sound.stopSound();

        let camera = scene.querySelector("#camera");
        camera.removeAttribute("target-indicator");

        startScene2();
      }
    });

  }
});

AFRAME.registerComponent("scene2", {
  init: function () {
    let scene = this.el.sceneEl;

    // After the background sound volume is reduced, play the khipukamayuq sound effect.
    let scene2SoundKhipukamayuq = scene.querySelector("#scene2-sound-khipukamayuq");
    let scene2SoundBackground = scene.querySelector("#scene2-sound-background");
    scene2SoundBackground.addEventListener("animationcomplete__volume_reduce", function() {
      scene2SoundKhipukamayuq.components.sound.playSound();
    });

    // After the move animation is complete.
    let scene2SoundNarrative = scene.querySelector("#scene2-sound-narrative");

    let scene2 = scene.querySelector("#scene2");
    scene2.addEventListener("animationtimelinecomplete", function() {
      // Rotate the amulet.
      let scene2Amulet = scene.querySelector("#scene2-amulet");
      scene2Amulet.emit("scene2-amulet-rotate");

      // Play the narrative.
      scene2SoundNarrative.components.sound.playSound();
    });

    // After the narrative ended.
    scene2SoundNarrative.addEventListener("sound-ended", function() {
      scene2SoundBackground.emit("scene2-volume-raise");

      teleportEnabled = true;

      // Mark the teleport as the target.
      let camera = scene.querySelector("#camera");
      camera.setAttribute("target-indicator", "target: #scene2-amulet");

      let teleport = scene.querySelector("#scene2-amulet");
      teleport.setAttribute("class", "clickable");
    });

    let amulet = scene.querySelector("#scene2-amulet");
    amulet.addEventListener("click", function() {
      console.log("click on teleport!");
      if (teleportEnabled == true) {
        teleportEnabled = false;

        scene2.setAttribute("visible", false);
        scene2SoundBackground.components.sound.stopSound();
        scene2SoundKhipukamayuq.components.sound.stopSound();

        let camera = scene.querySelector("#camera");
        camera.removeAttribute("target-indicator");

        startScene3();
      }
    });

  }
});

var start = function() {
  // Hide the play button.
  var rootPlay = document.getElementById("root");
  rootPlay.style.display = "none";

  //startInstructions();
  // For debugging.
  //startScene1();
  startScene2();
};

var startInstructions = function() {
  let instructionsHeadset = document.getElementById("instructions-headset");
  instructionsHeadset.emit("startInstructions");
};

var startIntro = function() {
  let intro = document.getElementById("intro");
  intro.setAttribute("visible", true);
  intro.emit("startIntro");
};

var startScene1 = function() {
  let scene1 = document.getElementById("scene1");
  scene1.setAttribute("visible", true);
  scene1.emit("startScene1");
  let scene1SoundBackground = document.getElementById("scene1-sound-background");
  scene1SoundBackground.components.sound.playSound();
};

var startScene2 = function() {
  let camera = document.getElementById("camera");
  camera.setAttribute("position", "0 0.5 0");
  camera.setAttribute("rotation", "0 90 0");

  let scene2 = document.getElementById("scene2");
  scene2.setAttribute("visible", true);
  scene2.emit("startScene2");
  let scene2SoundBackground = document.getElementById("scene2-sound-background");
  scene2SoundBackground.components.sound.playSound();
};

var startScene3 = function() {

};
