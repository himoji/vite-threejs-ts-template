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

  const physicsFolder = gui.addFolder("Physics");
  physicsFolder
    .add({ gravity: -9.81 }, "gravity", -100, 100, 0.1)
    .name("gravity")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      physicsObjects.world.gravity = new RAPIER.Vector3(
        0,
        clampedValue,
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

  const placeCubeOnTopEdge = () => {
    const slopeRotation = sceneObjects.slope.rotation.z;
    const slopeWidth = sceneObjects.slope.scale.x * 4;
    const slopeHeight = sceneObjects.slope.scale.y * 0.5;

    const unrotatedX = (-slopeWidth / 2) * 0.9;
    const unrotatedY = 2 + slopeHeight / 2;

    const sin = Math.sin(slopeRotation);
    const cos = Math.cos(slopeRotation);
    const rotatedX = unrotatedX * cos - unrotatedY * sin;
    const rotatedY = unrotatedX * sin + unrotatedY * cos;

    const cubeSize = sceneObjects.physicsCube.scale.x;
    const cubeElevation = cubeSize * 0.5 + 0.05;

    physicsObjects.physicsCubeBody.setTranslation(
      new RAPIER.Vector3(
        rotatedX,
        rotatedY + cubeElevation,
        0
      ),
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
    .add({ placeCubeOnTopEdge }, "placeCubeOnTopEdge")
    .name("Place Cube on Slope Edge");

  const physicsCubeFolder = gui.addFolder("Physics Cube");

  const cubeSize = { size: 1 };
  physicsCubeFolder
    .add(cubeSize, "size", -100, 100, 0.1)
    .name("size")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      sceneObjects.physicsCube.scale.set(
        clampedValue,
        clampedValue,
        clampedValue
      );

      const colliders =
        physicsObjects.physicsCubeBody.collider(0);
      if (colliders) {
        physicsObjects.world.removeCollider(
          colliders,
          true
        );
      }

      const physicsCubeColliderDesc =
        RAPIER.ColliderDesc.cuboid(
          0.5 * clampedValue,
          0.5 * clampedValue,
          0.5 * clampedValue
        )
          .setRestitution(0.3)
          .setFriction(0.4);
      physicsObjects.world.createCollider(
        physicsCubeColliderDesc,
        physicsObjects.physicsCubeBody
      );
    });

  const cubePosition = { x: 0, y: 8, z: 0 };

  physicsCubeFolder
    .add(cubePosition, "x", -100, 100, 0.1)
    .name("position x")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      const position =
        physicsObjects.physicsCubeBody.translation();
      physicsObjects.physicsCubeBody.setTranslation(
        new RAPIER.Vector3(
          clampedValue,
          position.y,
          position.z
        ),
        true
      );
    });

  physicsCubeFolder
    .add(cubePosition, "y", -100, 100, 0.1)
    .name("position y")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      const position =
        physicsObjects.physicsCubeBody.translation();
      physicsObjects.physicsCubeBody.setTranslation(
        new RAPIER.Vector3(
          position.x,
          clampedValue,
          position.z
        ),
        true
      );
    });

  physicsCubeFolder
    .add(cubePosition, "z", -100, 100, 0.1)
    .name("position z")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      const position =
        physicsObjects.physicsCubeBody.translation();
      physicsObjects.physicsCubeBody.setTranslation(
        new RAPIER.Vector3(
          position.x,
          position.y,
          clampedValue
        ),
        true
      );
    });

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

  const slopeFolder = gui.addFolder("Slope");

  const slopeSize = { width: 4, height: 0.5, depth: 6 };
  slopeFolder
    .add(slopeSize, "width", -100, 100, 0.5)
    .name("width")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      sceneObjects.slope.scale.x = clampedValue / 4;

      updateSlopeCollider(
        physicsObjects,
        clampedValue,
        slopeSize.height,
        slopeSize.depth
      );
    });

  slopeFolder
    .add(slopeSize, "height", -100, 100, 0.1)
    .name("height")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      sceneObjects.slope.scale.y = clampedValue / 0.5;

      updateSlopeCollider(
        physicsObjects,
        slopeSize.width,
        clampedValue,
        slopeSize.depth
      );
    });

  slopeFolder
    .add(slopeSize, "depth", -100, 100, 0.5)
    .name("depth")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      sceneObjects.slope.scale.z = clampedValue / 6;

      updateSlopeCollider(
        physicsObjects,
        slopeSize.width,
        slopeSize.height,
        clampedValue
      );
    });

  slopeFolder
    .add(sceneObjects.slope.rotation, "z", -100, 100, 0.1)
    .name("angle")
    .onChange((value: number) => {
      const clampedValue = Math.max(
        Math.min(value, 1000),
        -1000
      );
      sceneObjects.slope.rotation.z = clampedValue;
      const quaternion = new Quaternion().setFromAxisAngle(
        new Vector3(0, 0, 1),
        clampedValue
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

  const lightsFolder = gui.addFolder("Lights");
  lightsFolder
    .add(sceneObjects.pointLight, "visible")
    .name("point light");
  lightsFolder
    .add(sceneObjects.ambientLight, "visible")
    .name("ambient light");
  lightsFolder
    .add(sceneObjects.sunLight, "visible")
    .name("sun light");
  lightsFolder
    .add(sceneObjects.sunLight, "intensity", 0, 3, 0.1)
    .name("sun intensity");

  const helpersFolder = gui.addFolder("Helpers");
  helpersFolder
    .add(sceneObjects.axesHelper, "visible")
    .name("axes");
  helpersFolder
    .add(sceneObjects.pointLightHelper, "visible")
    .name("pointLight");
  helpersFolder
    .add(sceneObjects.sunLightHelper, "visible")
    .name("sunLight");

  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(
    sceneObjects.cameraControls,
    "autoRotate"
  );

  // Add camera follow cube toggle
  const cameraSettings = {
    followCube: false,
    verticalAngle: 30, // Default angle in degrees
  };

  cameraFolder
    .add(cameraSettings, "followCube")
    .name("Third-person Camera")
    .onChange((value: any) => {
      // When toggled off, restore orbital controls but keep current camera position
      if (!value) {
        // Just reset the target to center, but keep camera where it is
        sceneObjects.cameraControls.target.set(0, 2, 0);
      }
    });

  // Add vertical angle slider
  cameraFolder
    .add(cameraSettings, "verticalAngle", 0, 89, 1)
    .name("Camera Vertical Angle")
    .onChange((value: number) => {
      // Clamp value to valid range
      cameraSettings.verticalAngle = Math.max(
        Math.min(value, 89),
        0
      );
    });

  // Store the setting in scene objects for access in the animation loop
  sceneObjects.cameraSettings = cameraSettings;

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

function updateSlopeCollider(
  physicsObjects: PhysicsObjects,
  width: number,
  height: number,
  depth: number
) {
  const colliders = physicsObjects.slopeBody.collider(0);
  if (colliders) {
    physicsObjects.world.removeCollider(colliders, true);
  }

  const slopeColliderDesc = RAPIER.ColliderDesc.cuboid(
    width / 2,
    height / 2,
    depth / 2
  )
    .setRestitution(0.3)
    .setFriction(0.4);
  physicsObjects.world.createCollider(
    slopeColliderDesc,
    physicsObjects.slopeBody
  );
}
