import { walkCoordinates } from "./walk";
import { lerpAnimation } from "./lerpAnimation";
import type { AnimationPosition } from "./hooks/useWeaponAnimations";
import type { Group, Vector3, Clock, Camera, Quaternion } from "three";

interface ApplyADSProps {
    adsOffset: Vector3;
    adsRotation: Vector3;
    animationTransition: AnimationPosition;
    camera: Camera;
    cameraQuaternion: Quaternion;
    clock: Clock;
    group: Group;
    playerIsCrouching: boolean;
    playerIsWalking: boolean;
    swayOffset: Vector3;
    walkingSpeed: number;
}

/**
 * Applies the aim down sights (ADS) animation
 * @param props - The group, idle offset, idle rotation, and walking speed to apply to the weapon
 */
export const ads = (props: ApplyADSProps) => {
    const targetPosition = {
        rotateX: props.adsRotation.x,
        rotateY: props.adsRotation.y,
        rotateZ: props.adsRotation.z,
        translateX: props.adsOffset.x,
        translateY: props.adsOffset.y,
        translateZ: props.adsOffset.z,
    };

    const lerp = lerpAnimation({
        animationTransition: props.animationTransition,
        speed: 0.3,
        target: targetPosition,
    });

    props.group.rotateX(lerp.rotateX);
    props.group.rotateY(lerp.rotateY);
    props.group.rotateZ(lerp.rotateZ);
    props.group.translateX(lerp.translateX);
    props.group.translateY(lerp.translateY);
    props.group.translateZ(lerp.translateZ);

    // If the player is walking while aiming, apply a sway effect
    if (props.playerIsWalking && props.walkingSpeed > 0) {
        const adsWalkingAmplitude = 0.003; // Adjust the amplitude to control sway intensity
        const { x, y } = walkCoordinates({
            amplitude: adsWalkingAmplitude,
            clock: props.clock,
            isCrouching: props.playerIsCrouching,
            walkingSpeed: props.walkingSpeed,
        }); // Get sway offset based on walking speed

        props.swayOffset.set(x, y, 0); // Set sway offset
        props.camera.getWorldQuaternion(props.cameraQuaternion); // Get camera's world quaternion
        props.swayOffset.applyQuaternion(props.cameraQuaternion); // Apply the camera's rotation to the sway offset
        props.camera.position.add(props.swayOffset); // Apply sway offset to the camera position
    }
};
