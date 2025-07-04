import RAPIER from "@dimforge/rapier3d-compat";
import { Vector3, Quaternion } from "three";

export async function initPhysics() {
  await RAPIER.init();
  const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
  return new RAPIER.World(gravity);
}

export function createPhysicsCube(world: RAPIER.World) {
  const physicsCubeBodyDesc =
    RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 8, 0);
  const physicsCubeBody = world.createRigidBody(
    physicsCubeBodyDesc
  );

  const physicsCubeColliderDesc =
    RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      .setRestitution(0.3)
      .setFriction(0.4);
  world.createCollider(
    physicsCubeColliderDesc,
    physicsCubeBody
  );

  return physicsCubeBody;
}

export function createSlopeBody(world: RAPIER.World) {
  const slopeBodyDesc = RAPIER.RigidBodyDesc.fixed()
    .setTranslation(0, 2, 0)
    .setRotation(
      new Quaternion().setFromAxisAngle(
        new Vector3(0, 0, 1),
        Math.PI / 6
      )
    );
  const slopeBody = world.createRigidBody(slopeBodyDesc);

  const slopeColliderDesc = RAPIER.ColliderDesc.cuboid(
    2,
    0.25,
    3
  )
    .setRestitution(0.3)
    .setFriction(0.4);
  world.createCollider(slopeColliderDesc, slopeBody);

  return slopeBody;
}

export function createGroundBody(world: RAPIER.World) {
  const groundBodyDesc =
    RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, 0);
  const groundBody = world.createRigidBody(groundBodyDesc);

  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(
    50,
    0.1,
    50
  )
    .setRestitution(0.3)
    .setFriction(0.4);
  world.createCollider(groundColliderDesc, groundBody);

  return groundBody;
}
