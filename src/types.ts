import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  AmbientLight,
  PointLight,
  DirectionalLight,
  Clock,
  AxesHelper,
  PointLightHelper,
  DirectionalLightHelper,
  LoadingManager,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "stats.js";
import GUI from "lil-gui";
import RAPIER from "@dimforge/rapier3d-compat";

export interface SceneObjects {
  canvas: HTMLElement;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  cameraControls: OrbitControls;
  physicsCube: Mesh;
  slope: Mesh;
  ambientLight: AmbientLight;
  pointLight: PointLight;
  sunLight: DirectionalLight; // Added this property
  clock: Clock;
  stats: Stats;
  gui: GUI;
  axesHelper: AxesHelper;
  pointLightHelper: PointLightHelper;
  sunLightHelper: DirectionalLightHelper; // Added this property
  loadingManager: LoadingManager;
  cameraSettings?: {
    followCube: boolean;
    verticalAngle: number;
  };
}

export interface PhysicsObjects {
  world: RAPIER.World;
  physicsCubeBody: RAPIER.RigidBody;
  slopeBody: RAPIER.RigidBody;
  groundBody: RAPIER.RigidBody;
}
