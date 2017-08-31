var teleport = document.getElementById("teleport");

teleport.addEventListener("click", function() {
    console.log("click on teleport!");
    var image_360_1 = document.getElementById("image-360-1");
    image_360_1.setAttribute("opacity", "0");
    var image_360_2 = document.getElementById("image-360-2");
    image_360_2.setAttribute("opacity", "1");
});

var khipukamayuqAnimation = document.getElementById("khipukamayuq-animation");

khipukamayuqAnimation.addEventListener("animationend", function () {
    document.querySelector('#amulet').emit("khipukamayuqVisible");
});
