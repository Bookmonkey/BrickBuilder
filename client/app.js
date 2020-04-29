var UIControl = {
  state: 'bricks',
  elements: {
    uiAdd: document.querySelectorAll(".ui-add"),
    uiColour: document.querySelector("#ui-colour"),
    brickName: document.querySelector('#brick-name')
  },
};

const API = "http://localhost:3000";

// get the canvasDOM element
var canvasElement = document.getElementById('renderCanvas');

// load the 3D engine
var engine = new BABYLON.Engine(canvasElement, true);
// Events
var canvas = engine.getRenderingCanvas();
var scene = new BABYLON.Scene(engine);

var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);
var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
groundMaterial.specularColor = BABYLON.Color3.Black();
ground.material = groundMaterial;


var startingPoint;
var currentMesh;

var gizmoManager = new BABYLON.GizmoManager(scene);
gizmoManager.positionGizmoEnabled = true;

gizmoManager.gizmos.positionGizmo.onDragEndObservable.add((evt) => {
  let selectedBrick = gizmoManager.gizmos.positionGizmo.attachedMesh;
  console.log("brick moved - send socketio packet here")
  let data = {
    name: selectedBrick.name,
    position: selectedBrick.position,
    rotation: selectedBrick.rotation,
    scaling: selectedBrick.scaling,
  }
  
  // fetch(`${API}/room/ID/update`, data)
})

var bricks = [];

UIControl.elements['uiAdd'].forEach(element => {
  element.addEventListener('click', function (brickElement) {
    var dims = brickElement.target.dataset;
    let brickIndex = bricks.length;
    let brickName = "brick" + brickIndex++;
    var box = BABYLON.MeshBuilder.CreateBox(brickName, {
      height: 5.0,
      width: dims.x * 5,
      depth: dims.y * 5
    }, scene);
    box.isPickable = true;
    box.material = getColor();

    bricks.push(box);

    getBrickList();

    gizmoManager.attachableMeshes.push(box);
  });
});
var createScene = function () {
  // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
  // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);
  // target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // attach the camera to the canvas
  camera.attachControl(canvas, false);

  // create a basic light, aiming 0,1,0 - meaning, to the sky
  var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
  scene.clearColor = new BABYLON.Color3.FromHexString("#87CEEB")

  // return the created scene
  return scene;
}

window.addEventListener('DOMContentLoaded', function () {
  // call the createScene function
  var scene = createScene();
  // run the render loop
  engine.runRenderLoop(function () {
    scene.render();
  });

  // the canvas/window resize event handler
  window.addEventListener('resize', function () {
    engine.resize();
  });

});

var getGroundPosition = function () {
  // Use a predicate to get position on the ground
  var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
    return mesh == ground;
  });
  if (pickinfo.hit) {
    return pickinfo.pickedPoint;
  }

  return null;
}

// var onPointerDown = function (evt) {
//   if (evt.button !== 0) {
//     return;
//   }

//   // check if we are under a mesh
//   var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
//     return mesh !== ground;
//   });
//   if (pickInfo.hit) {
//     currentMesh = pickInfo.pickedMesh;
//     startingPoint = getGroundPosition(evt);

//     if (startingPoint) { // we need to disconnect camera from canvas
//       setTimeout(function () {
//         camera.detachControl(canvas);
//       }, 0);
//     }
//   }
// }

// var onPointerUp = function () {
//   if (startingPoint) {
//     camera.attachControl(canvas, true);
//     startingPoint = null;
//     return;
//   }
// }

// var onPointerMove = function (evt) {
//   if (!startingPoint) {
//     return;
//   }

//   var current = getGroundPosition(evt);

//   if (!current) {
//     return;
//   }

//   var diff = current.subtract(startingPoint);
//   currentMesh.position.addInPlace(diff);

//   startingPoint = current;

//   console.log(evt);
  
// }

// canvas.addEventListener("pointerdown", onPointerDown, false);
// canvas.addEventListener("pointerup", onPointerUp, false);
// canvas.addEventListener("pointermove", onPointerMove, false);

// scene.onDispose = function () {
//   canvas.removeEventListener("pointerdown", onPointerDown);
//   canvas.removeEventListener("pointerup", onPointerUp);
//   canvas.removeEventListener("pointermove", onPointerMove);
// }

function getColor() {
  var selectedColour = UIControl.elements.uiColour.selectedOptions[0].value;
  var babylonColour;
  var material = new BABYLON.StandardMaterial("ground", scene);


  material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
  material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

  switch (selectedColour) {
    case "red":
      babylonColour = BABYLON.Color3.Red();
      break;
    case "green":
      babylonColour = BABYLON.Color3.Green();
      break;
    case "blue":
      babylonColour = BABYLON.Color3.Blue();
      break;
    case "yellow":
      babylonColour = BABYLON.Color3.Yellow();
      break;
    case "black":
      babylonColour = BABYLON.Color3.Black();
      break;
    case "purple":
      babylonColour = BABYLON.Color3.Purple();
      break;
    case "white":
      babylonColour = BABYLON.Color3.White();
      break;
  }
  material.emissiveColor = babylonColour;
  return material;
}


// use with Vue UI controls
function getBrickList() {
  bricks.forEach(brick => {
    console.log(brick.name, brick.material, brick.position);
  })
}