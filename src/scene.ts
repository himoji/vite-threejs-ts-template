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
  const { ambientLight, pointLight, sunLight } = setupLights(scene);

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
  const { axesHelper, pointLightHelper, sunLightHelper } = setupHelpers(
    scene,
    pointLight,
    sunLight
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
    sunLight,
    clock,
    stats,
    gui: null as any, // Will be set below
    axesHelper,
    pointLightHelper,
    sunLightHelper,
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

  // Third-person camera follow
  if (sceneObjects.cameraSettings?.followCube) {
    // Get cube's velocity to determine direction
    const velocity =
      physicsObjects.physicsCubeBody.linvel();

    // Get vertical angle from settings (default to 30 if not set)
    const verticalAngle =
      sceneObjects.cameraSettings.verticalAngle || 30;
    const verticalRadians = (verticalAngle * Math.PI) / 180;

    // Calculate camera height and horizontal distance based on angle
    const totalDistance = 5; // Total follow distance
    const horizontalDistance =
      totalDistance * Math.cos(verticalRadians);
    const height =
      totalDistance * Math.sin(verticalRadians) +
      physicsCubePosition.y;

    // Only update direction if moving with significant speed
    if (
      Math.abs(velocity.x) > 0.1 ||
      Math.abs(velocity.z) > 0.1
    ) {
      // Calculate direction of movement on XZ plane
      const direction = {
        x: velocity.x,
        z: velocity.z,
      };

      // Normalize direction
      const length = Math.sqrt(
        direction.x * direction.x +
          direction.z * direction.z
      );
      if (length > 0) {
        direction.x /= length;
        direction.z /= length;
      }

      // Position camera behind the cube using calculated height and distance
      sceneObjects.camera.position.set(
        physicsCubePosition.x -
          direction.x * horizontalDistance,
        height,
        physicsCubePosition.z -
          direction.z * horizontalDistance
      );
    } else {
      // If not moving, just maintain position behind the cube using current camera position
      const offset = {
        x:
          sceneObjects.camera.position.x -
          physicsCubePosition.x,
        z:
          sceneObjects.camera.position.z -
          physicsCubePosition.z,
      };

      const distance = Math.sqrt(
        offset.x * offset.x + offset.z * offset.z
      );
      if (distance > 0) {
        const normalizedOffset = {
          x: offset.x / distance,
          z: offset.z / distance,
        };

        // Use calculated horizontal distance
        sceneObjects.camera.position.set(
          physicsCubePosition.x +
            normalizedOffset.x * horizontalDistance,
          height,
          physicsCubePosition.z +
            normalizedOffset.z * horizontalDistance
        );
      }
    }

    // Keep the target at the cube
    sceneObjects.cameraControls.target.set(
      physicsCubePosition.x,
      physicsCubePosition.y,
      physicsCubePosition.z
    );

    // Update controls after manually positioning camera
    sceneObjects.cameraControls.update();
  }

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
