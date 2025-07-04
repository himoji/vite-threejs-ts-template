import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function setupCamera(canvas: HTMLElement) {
  const camera = new PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(8, 6, 8);

  return camera;
}

export function setupControls(
  camera: PerspectiveCamera,
  canvas: HTMLElement
) {
  const cameraControls = new OrbitControls(camera, canvas);
  cameraControls.target.set(0, 2, 0);
  cameraControls.enableDamping = true;
  cameraControls.autoRotate = false;
  cameraControls.update();

  return cameraControls;
}
