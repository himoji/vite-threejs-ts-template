import {
  AmbientLight,
  PointLight,
  DirectionalLight,
  Scene,
} from "three";

export function setupLights(scene: Scene) {
  const ambientLight = new AmbientLight("white", 0.4);

  const pointLight = new PointLight("white", 20, 100);
  pointLight.position.set(-2, 2, 2);
  pointLight.castShadow = true;
  pointLight.shadow.radius = 4;
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 1000;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;

  // Create sunlight (directional light)
  const sunLight = new DirectionalLight("#FFF8E0", 1.5);
  sunLight.position.set(10, 15, 8);
  sunLight.castShadow = true;
  sunLight.shadow.camera.near = 0.1;
  sunLight.shadow.camera.far = 50;
  sunLight.shadow.camera.left = -10;
  sunLight.shadow.camera.right = 10;
  sunLight.shadow.camera.top = 10;
  sunLight.shadow.camera.bottom = -10;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.001;

  scene.add(ambientLight);
  scene.add(pointLight);
  scene.add(sunLight);

  return { ambientLight, pointLight, sunLight };
}
