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
    let video = scene.querySelector("#video-intro");
    intro.addEventListener("animationtimelinecomplete", function() {
      video.play();
    });

    video.addEventListener("ended", function() {
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

AFRAME.registerComponent("scene3", {
  init: function () {
    let scene = this.el.sceneEl;

    // After the background sound volume is reduced, play the narrative.
    let scene3SoundNarrative = scene.querySelector("#scene3-sound-narrative");
    let scene3SoundBackground = scene.querySelector("#scene3-sound-background");
    scene3SoundBackground.addEventListener("animationcomplete__volume_reduce", function() {
      scene3SoundNarrative.components.sound.playSound();
    });

    // After the move animation is complete.
    let scene3 = scene.querySelector("#scene3");
    scene3.addEventListener("animationtimelinecomplete", function() {
      // Hide the amulet.
      let scene3Amulet = scene.querySelector("#scene3-amulet");
      scene3Amulet.setAttribute("visible", "false");

    });

    // After the narrative ended.
    let teleport = scene.querySelector("#scene3-teleport");
    scene3SoundNarrative.addEventListener("sound-ended", function() {
      scene3SoundBackground.emit("scene3-volume-raise");

      teleportEnabled = true;

      // Mark the teleport as the target.
      let camera = scene.querySelector("#camera");
      camera.setAttribute("target-indicator", "target: #scene3-teleport");

      teleport.setAttribute("class", "clickable");
    });

    teleport.addEventListener("click", function() {
      console.log("click on teleport!");
      if (teleportEnabled == true) {
        teleportEnabled = false;

        scene3.setAttribute("visible", false);
        scene3SoundBackground.components.sound.stopSound();
        let soundEffectDrill = scene.querySelector("#sound-effect-drill");
        soundEffectDrill.components.sound.stopSound();

        let scene3SoundDanie = scene.querySelector("#scene3-sound-danie");
        scene3SoundDanie.components.sound.stopSound();

        let camera = scene.querySelector("#camera");
        camera.removeAttribute("target-indicator");

        startScene4();
      }
    });

  }
});

AFRAME.registerComponent("scene4", {
  init: function () {
    let scene = this.el.sceneEl;

    // After the background sound volume is reduced, play the narrative.
    let scene4SoundNarrative = scene.querySelector("#scene4-sound-narrative");
    let scene4SoundBackground = scene.querySelector("#scene4-sound-background");
    scene4SoundBackground.addEventListener("animationcomplete__volume_reduce", function() {
      scene4SoundNarrative.components.sound.playSound();
    });

    // After the move animation is complete.
    let scene4 = scene.querySelector("#scene4");
    scene4.addEventListener("animationtimelinecomplete", function() {
      //  Pause the gifs
      let gifAnaoWalk = scene.querySelector("#scene4-gif-anao-walk");
      let gifAnapWalk = scene.querySelector("#scene4-gif-anap-walk");
      let gifConiWalk = scene.querySelector("#scene4-gif-coni-walk");
      let gifDanieWalk = scene.querySelector("#scene4-gif-danie-walk");
      gifAnaoWalk.pause();
      gifAnapWalk.pause();
      gifConiWalk.pause();
      gifDanieWalk.pause();

      let scene4SoundKhipukamayuq = scene.querySelector("#scene4-sound-khipukamayuq");
      scene4SoundKhipukamayuq.components.sound.playSound();
    });

    // After the narrative ended.
    let teleport = scene.querySelector("#scene4-amulet");
    scene4SoundNarrative.addEventListener("sound-ended", function() {
      scene4SoundBackground.emit("scene4-volume-raise");
      teleport.emit("scene4-amulet-rotate");

      teleportEnabled = true;

      // Mark the teleport as the target.
      let camera = scene.querySelector("#camera");
      camera.setAttribute("target-indicator", "target: #scene4-amulet");

      teleport.setAttribute("class", "clickable");
    });

    teleport.addEventListener("click", function() {
      console.log("click on teleport!");
      if (teleportEnabled == true) {
        teleportEnabled = false;

        scene4.setAttribute("visible", false);
        scene4SoundBackground.components.sound.stopSound();

        let scene4SoundKhipukamayuq = scene.querySelector("#scene4-sound-khipukamayuq");
        scene4SoundKhipukamayuq.components.sound.stopSound();

        let camera = scene.querySelector("#camera");
        camera.removeAttribute("target-indicator");

        startScene5();
      }
    });

  }
});

AFRAME.registerComponent("scene5", {
  init: function () {
    let scene = this.el.sceneEl;
    // After the move animation is complete.
    let scene5 = scene.querySelector("#scene5");
    let scene5SoundNarrative = scene.querySelector("#scene5-sound-narrative");
    scene5.addEventListener("animationtimelinecomplete", function() {
      scene5SoundNarrative.components.sound.playSound();
    });

    scene5SoundNarrative.addEventListener("sound-ended", function() {
      let scene5SoundBackground = scene.querySelector("#scene5-sound-background");
      scene5SoundBackground.emit("scene5-volume-raise");
    });
  }
});


document.addEventListener('DOMContentLoaded', function() {
  var scene = document.querySelector('a-scene');
  scene.addEventListener('loaded', function (e) {
    var rootPlay = document.getElementById("root");
    rootPlay.style.display = "flex";
  });
});

var start = function() {
  // Hide the play button.
  var rootPlay = document.getElementById("root");
  rootPlay.style.display = "none";

  const params = new URLSearchParams(location.search);

  switch(params.get("scene")) {
  case "1":
    startScene1();
    break;
  case "2":
    startScene2();
    break;
  case "3":
    startScene3();
    break;
  case "4":
    startScene4();
    break;
  case "5":
    startScene5();
    break;
  default:
    startInstructions();
  }
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
  let camera = document.getElementById("camera");
  camera.setAttribute("position", "0 1 0");

  let scene3 = document.getElementById("scene3");
  scene3.setAttribute("visible", true);
  scene3.emit("startScene3");

  let scene3SoundBackground = document.getElementById("scene3-sound-background");
  scene3SoundBackground.components.sound.playSound();

  let soundEffectDrill = document.getElementById("sound-effect-drill");
  soundEffectDrill.components.sound.playSound();

  let scene3SoundDanie = document.getElementById("scene3-sound-danie");
  scene3SoundDanie.components.sound.playSound();
};

var startScene4 = function() {
  let camera = document.getElementById("camera");
  camera.setAttribute("position", "0 0.5 0");

  let scene4SoundBackground = document.getElementById("scene4-sound-background");
  scene4SoundBackground.components.sound.playSound();

  let scene4 = document.getElementById("scene4");
  scene4.setAttribute("visible", true);
  scene4.emit("startScene4");
};

var startScene5 = function() {
  let scene5SoundBackground = document.getElementById("scene5-sound-background");
  scene5SoundBackground.components.sound.playSound();

  let scene5 = document.getElementById("scene5");
  scene5.setAttribute("visible", true);
  scene5.emit("startScene5");
};
