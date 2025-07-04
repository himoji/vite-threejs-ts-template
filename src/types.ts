import { WebGLRenderer, Scene, PerspectiveCamera, Mesh, AmbientLight, PointLight, Clock, AxesHelper, PointLightHelper, LoadingManager } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'stats.js';
import GUI from 'lil-gui';
import RAPIER from '@dimforge/rapier3d-compat';

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
  clock: Clock;
  stats: Stats;
  gui: GUI;
  axesHelper: AxesHelper;
  pointLightHelper: PointLightHelper;
  loadingManager: LoadingManager;
}

export interface PhysicsObjects {
  world: RAPIER.World;
  physicsCubeBody: RAPIER.RigidBody;
  slopeBody: RAPIER.RigidBody;
  groundBody: RAPIER.RigidBody;
}