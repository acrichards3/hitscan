import { walkCoordinates } from "./walk";
import type { Group, Vector3, Clock, Camera, Quaternion } from "three";

interface ApplyADSProps {
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

/**
 * Applies the aim down sights (ADS) animation
 * @param props - The group, idle offset, idle rotation, and walking speed to apply to the weapon
 */
export const ads = (props: ApplyADSProps) => {
    props.group.rotateX(props.adsRotation.x);
    props.group.rotateY(props.adsRotation.y);
    props.group.rotateZ(props.adsRotation.z);
    props.group.translateX(props.adsOffset.x);
    props.group.translateY(props.adsOffset.y);
    props.group.translateZ(props.adsOffset.z);

    // If the player is walking while aiming, apply a sway effect
    if (props.playerIsWalking) {
        const adsWalkingAmplitude = 0.003; // Adjust the amplitude to control sway intensity
        const { x, y } = walkCoordinates(adsWalkingAmplitude, props.clock, props.walkingSpeed); // Get sway offset based on walking speed

        props.swayOffset.set(x, y, 0); // Set sway offset
        props.camera.getWorldQuaternion(props.cameraQuaternion); // Get camera's world quaternion
        props.swayOffset.applyQuaternion(props.cameraQuaternion); // Apply the camera's rotation to the sway offset
        props.camera.position.add(props.swayOffset); // Apply sway offset to the camera position
    }
};
