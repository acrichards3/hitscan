import { walk } from "../../functions/weaponAnimations";
import type { Group, Vector3, Clock, Camera, Quaternion } from "three";

interface ApplyADS {
    adsOffset: Vector3;
    adsRotation: Vector3;
    camera: Camera;
    cameraQuaternion: Quaternion;
    clock: Clock;
    group: Group;
    playerIsWalking: boolean;
    swayOffset: Vector3;
    walkingSpeed: number;
}

export const applyADS = (props: ApplyADS) => {
    const {
        adsOffset,
        adsRotation,
        camera,
        cameraQuaternion,
        clock,
        group,
        playerIsWalking,
        swayOffset,
        walkingSpeed,
    } = props;
    // Apply ADS rotation and translation
    group.rotateX(adsRotation.x);
    group.rotateY(adsRotation.y);
    group.rotateZ(adsRotation.z);
    group.translateX(adsOffset.x);
    group.translateY(adsOffset.y);
    group.translateZ(adsOffset.z);

    // If the player is walking while aiming, apply a sway effect
    if (playerIsWalking) {
        const adsWalkingAmplitude = 0.003; // Adjust the amplitude to control sway intensity
        const { x, y } = walk(adsWalkingAmplitude, clock, walkingSpeed); // Get sway offset based on walking speed
        swayOffset.set(x, y, 0); // Set sway offset
        camera.getWorldQuaternion(cameraQuaternion); // Get camera's world quaternion
        swayOffset.applyQuaternion(cameraQuaternion); // Apply the camera's rotation to the sway offset
        camera.position.add(swayOffset); // Apply sway offset to the camera position
    }
};
