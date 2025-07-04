import { Clock } from "three";
import Stats from "stats.js";
import {
  setupRenderer,
  createScene,
} from "./setup/renderer";
import {
  initPhysics,
  createPhysicsCube,
  createSlopeBody,
  createGroundBody,
} from "./setup/physics";
import { setupLights } from "./setup/lights";
import { createObjects } from "./setup/objects";
import { setupCamera, setupControls } from "./setup/camera";
import {
  setupHelpers,
  setupLoadingManager,
} from "./setup/helpers";
import { setupGUI } from "./setup/gui";
import { toggleFullScreen } from "./helpers/fullscreen";
import { resizeRendererToDisplaySize } from "./helpers/responsiveness";
import { SceneObjects, PhysicsObjects } from "./types";
import "./style.css";

const CANVAS_ID = "scene";

let sceneObjects: SceneObjects;
let physicsObjects: PhysicsObjects;

init();
animate();

async function init() {
  const canvas: HTMLElement = document.querySelector(
    `canvas#${CANVAS_ID}`
  )!;

  // Setup renderer and scene
  const renderer = setupRenderer(canvas);
  const scene = createScene();

  // Setup physics
  const world = await initPhysics();

  // Setup loading manager
  const loadingManager = setupLoadingManager();

  // Setup lights
  const { ambientLight, pointLight } = setupLights(scene);

  // Create objects
  const { physicsCube, slope } = createObjects(scene);

  // Setup physics bodies
  const physicsCubeBody = createPhysicsCube(world);
  const slopeBody = createSlopeBody(world);
  const groundBody = createGroundBody(world);

  // Setup camera and controls
  const camera = setupCamera(canvas);
  const cameraControls = setupControls(camera, canvas);

  // Setup helpers
  const { axesHelper, pointLightHelper } = setupHelpers(
    scene,
    pointLight
  );

  // Setup stats and clock
  const clock = new Clock();
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  // Store all objects
  sceneObjects = {
    canvas,
    renderer,
    scene,
    camera,
    cameraControls,
    physicsCube,
    slope,
    ambientLight,
    pointLight,
    clock,
    stats,
    gui: null as any, // Will be set below
    axesHelper,
    pointLightHelper,
    loadingManager,
  };

  physicsObjects = {
    world,
    physicsCubeBody,
    slopeBody,
    groundBody,
  };

  // Setup GUI
  const gui = setupGUI(sceneObjects, physicsObjects);
  sceneObjects.gui = gui;

  // Setup fullscreen
  window.addEventListener("dblclick", (event) => {
    if (event.target === canvas) {
      toggleFullScreen(canvas);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  sceneObjects.stats.begin();

  // Update physics world
  physicsObjects.world.step();

  // Sync Three.js objects with Rapier bodies
  const physicsCubePosition =
    physicsObjects.physicsCubeBody.translation();
  const physicsCubeRotation =
    physicsObjects.physicsCubeBody.rotation();
  sceneObjects.physicsCube.position.set(
    physicsCubePosition.x,
    physicsCubePosition.y,
    physicsCubePosition.z
  );
  sceneObjects.physicsCube.quaternion.set(
    physicsCubeRotation.x,
    physicsCubeRotation.y,
    physicsCubeRotation.z,
    physicsCubeRotation.w
  );

  // Handle responsive rendering
  if (resizeRendererToDisplaySize(sceneObjects.renderer)) {
    const canvas = sceneObjects.renderer.domElement;
    sceneObjects.camera.aspect =
      canvas.clientWidth / canvas.clientHeight;
    sceneObjects.camera.updateProjectionMatrix();
  }

  sceneObjects.cameraControls.update();
  sceneObjects.renderer.render(
    sceneObjects.scene,
    sceneObjects.camera
  );
  sceneObjects.stats.end();
}
