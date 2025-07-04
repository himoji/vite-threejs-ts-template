import { 
  AxesHelper, 
  PointLightHelper, 
  GridHelper, 
  Scene, 
  PointLight,
  LoadingManager 
} from 'three';

export function setupHelpers(scene: Scene, pointLight: PointLight) {
  const axesHelper = new AxesHelper(4);
  axesHelper.visible = false;
  scene.add(axesHelper);

  const pointLightHelper = new PointLightHelper(pointLight, undefined, "orange");
  pointLightHelper.visible = false;
  scene.add(pointLightHelper);

  const gridHelper = new GridHelper(20, 20, "teal", "darkgray");
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  return { axesHelper, pointLightHelper, gridHelper };
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