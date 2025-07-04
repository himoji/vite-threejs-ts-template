import {
  BoxGeometry,
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  MeshLambertMaterial,
  Scene,
} from "three";

export function createObjects(scene: Scene) {
  const sideLength = 1;
  const cubeGeometry = new BoxGeometry(
    sideLength,
    sideLength,
    sideLength
  );

  // Create physics cube
  const physicsCube = new Mesh(
    cubeGeometry,
    new MeshStandardMaterial({
      color: "#ff3030",
      metalness: 0.5,
      roughness: 0.7,
    })
  );
  physicsCube.castShadow = true;
  physicsCube.position.set(0, 8, 0);

  // Create slope
  const slopeGeometry = new BoxGeometry(4, 0.5, 6);
  const slopeMaterial = new MeshStandardMaterial({
    color: "#606060",
    metalness: 0.2,
    roughness: 0.8,
  });
  const slope = new Mesh(slopeGeometry, slopeMaterial);
  slope.position.set(0, 2, 0);
  slope.rotation.z = Math.PI / 6;
  slope.castShadow = true;
  slope.receiveShadow = true;

  // Create ground plane
  const planeGeometry = new PlaneGeometry(10, 10);
  const planeMaterial = new MeshLambertMaterial({
    color: "gray",
    emissive: "teal",
    emissiveIntensity: 0.2,
    side: 2,
    transparent: true,
    opacity: 0.4,
  });
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.rotateX(Math.PI / 2);
  plane.receiveShadow = true;

  scene.add(physicsCube);
  scene.add(slope);
  scene.add(plane);

  return { physicsCube, slope, plane };
}
