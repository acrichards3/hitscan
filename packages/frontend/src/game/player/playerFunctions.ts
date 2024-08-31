import { Camera, Vector3 } from "three";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Octree } from "three/examples/jsm/Addons.js";

const GRAVITY = 50;

export function getForwardVector(camera: Camera, playerDirection: Vector3) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    return playerDirection;
}

export function getSideVector(camera: Camera, playerDirection: Vector3) {
    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);
    return playerDirection;
}

export function playerCollisions(capsule: Capsule, octree: Octree, playerVelocity: Vector3) {
    const result = octree.capsuleIntersect(capsule);
    if (result.normal == null) {
        return false;
    }
    const playerOnFloor = result.normal.y > 0;
    if (!playerOnFloor) {
        playerVelocity.addScaledVector(result.normal, -result.normal.dot(playerVelocity));
    }
    capsule.translate(result.normal.multiplyScalar(result.depth));
    return playerOnFloor;
}

export function teleportPlayerIfOob(camera: Camera, capsule: Capsule, playerVelocity: Vector3) {
    if (camera.position.y <= -100) {
        playerVelocity.set(0, 0, 0);
        capsule.start.set(0, 10, 0);
        capsule.end.set(0, 11, 0);
        camera.position.copy(capsule.end);
        camera.rotation.set(0, 0, 0);
    }
}

export function updatePlayer(
    camera: Camera,
    delta: number,
    octree: Octree,
    capsule: Capsule,
    playerVelocity: Vector3,
    playerOnFloor: boolean,
) {
    let damping = Math.exp(-4 * delta) - 1;
    if (!playerOnFloor) {
        playerVelocity.y -= GRAVITY * delta;
        damping *= 0.1; // small air resistance
    }
    playerVelocity.addScaledVector(playerVelocity, damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(delta);
    capsule.translate(deltaPosition);
    playerOnFloor = playerCollisions(capsule, octree, playerVelocity);
    camera.position.copy(capsule.end);
    return playerOnFloor;
}
