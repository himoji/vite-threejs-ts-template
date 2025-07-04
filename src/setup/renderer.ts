import {
  WebGLRenderer,
  Scene,
  PCFSoftShadowMap,
} from "three";

export function setupRenderer(canvas: HTMLElement) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  return renderer;
}

export function createScene() {
  return new Scene();
}
