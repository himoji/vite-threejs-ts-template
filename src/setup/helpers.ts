import {
  AxesHelper,
  PointLightHelper,
  DirectionalLightHelper,
  GridHelper,
  Scene,
  PointLight,
  DirectionalLight,
  LoadingManager,
} from "three";

export function setupHelpers(
  scene: Scene,
  pointLight: PointLight,
  sunLight: DirectionalLight
) {
  const axesHelper = new AxesHelper(4);
  axesHelper.visible = false;
  scene.add(axesHelper);

  const pointLightHelper = new PointLightHelper(
    pointLight,
    undefined,
    "orange"
  );
  pointLightHelper.visible = false;
  scene.add(pointLightHelper);

  const sunLightHelper = new DirectionalLightHelper(sunLight, 2, "#FFD700");
  sunLightHelper.visible = false;
  scene.add(sunLightHelper);

  const gridHelper = new GridHelper(
    20,
    20,
    "teal",
    "darkgray"
  );
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  return { axesHelper, pointLightHelper, sunLightHelper, gridHelper };
}

export function setupLoadingManager() {
  const loadingManager = new LoadingManager();

  loadingManager.onStart = () => {
    console.log("loading started");
  };
  loadingManager.onProgress = (url, loaded, total) => {
    console.log("loading in progress:");
    console.log(`${url} -> ${loaded} / ${total}`);
  };
  loadingManager.onLoad = () => {
    console.log("loaded!");
  };
  loadingManager.onError = () => {
    console.log("❌ error while loading");
  };

  return loadingManager;
}
