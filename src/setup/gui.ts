import GUI from "lil-gui";
import {
  Vector3,
  Quaternion,
  MeshStandardMaterial,
} from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { SceneObjects, PhysicsObjects } from "../types";

export function setupGUI(
  sceneObjects: SceneObjects,
  physicsObjects: PhysicsObjects
) {
  const gui = new GUI({
    title: "🐞 Debug GUI",
    width: 300,
  });

  // Physics folder
  const physicsFolder = gui.addFolder("Physics");
  physicsFolder
    .add({ gravity: -9.81 }, "gravity", -20, 0, 0.1)
    .name("gravity")
    .onChange((value: number) => {
      physicsObjects.world.gravity = new RAPIER.Vector3(
        0,
        value,
        0
      );
    });

  const resetPhysics = () => {
    physicsObjects.physicsCubeBody.setTranslation(
      new RAPIER.Vector3(0, 8, 0),
      true
    );
    physicsObjects.physicsCubeBody.setLinvel(
      new RAPIER.Vector3(0, 0, 0),
      true
    );
    physicsObjects.physicsCubeBody.setAngvel(
      new RAPIER.Vector3(0, 0, 0),
      true
    );
  };
  physicsFolder
    .add({ resetPhysics }, "resetPhysics")
    .name("Reset Physics Cube");

  // Physics cube folder
  const physicsCubeFolder = gui.addFolder("Physics Cube");
  physicsCubeFolder.add(
    sceneObjects.physicsCube
      .material as MeshStandardMaterial,
    "wireframe"
  );
  physicsCubeFolder.addColor(
    sceneObjects.physicsCube
      .material as MeshStandardMaterial,
    "color"
  );
  physicsCubeFolder.add(
    sceneObjects.physicsCube
      .material as MeshStandardMaterial,
    "metalness",
    0,
    1,
    0.1
  );
  physicsCubeFolder.add(
    sceneObjects.physicsCube
      .material as MeshStandardMaterial,
    "roughness",
    0,
    1,
    0.1
  );

  // Slope folder
  const slopeFolder = gui.addFolder("Slope");
  slopeFolder
    .add(
      sceneObjects.slope.rotation,
      "z",
      -Math.PI / 2,
      Math.PI / 2,
      0.1
    )
    .name("angle")
    .onChange((value: number) => {
      const quaternion = new Quaternion().setFromAxisAngle(
        new Vector3(0, 0, 1),
        value
      );
      physicsObjects.slopeBody.setRotation(
        quaternion,
        true
      );
    });

  const resetSlope = () => {
    sceneObjects.slope.rotation.z = Math.PI / 6;
    const quaternion = new Quaternion().setFromAxisAngle(
      new Vector3(0, 0, 1),
      Math.PI / 6
    );
    physicsObjects.slopeBody.setRotation(quaternion, true);
  };
  slopeFolder
    .add({ resetSlope }, "resetSlope")
    .name("Reset Slope");

  // Lights folder
  const lightsFolder = gui.addFolder("Lights");
  lightsFolder
    .add(sceneObjects.pointLight, "visible")
    .name("point light");
  lightsFolder
    .add(sceneObjects.ambientLight, "visible")
    .name("ambient light");

  // Helpers folder
  const helpersFolder = gui.addFolder("Helpers");
  helpersFolder
    .add(sceneObjects.axesHelper, "visible")
    .name("axes");
  helpersFolder
    .add(sceneObjects.pointLightHelper, "visible")
    .name("pointLight");

  // Camera folder
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(
    sceneObjects.cameraControls,
    "autoRotate"
  );

  // Persistence
  gui.onFinishChange(() => {
    const guiState = gui.save();
    localStorage.setItem(
      "guiState",
      JSON.stringify(guiState)
    );
  });

  const guiState = localStorage.getItem("guiState");
  if (guiState) gui.load(JSON.parse(guiState));

  const resetGui = () => {
    localStorage.removeItem("guiState");
    gui.reset();
  };
  gui.add({ resetGui }, "resetGui").name("RESET");

  gui.close();
  return gui;
}
