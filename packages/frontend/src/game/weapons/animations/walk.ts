import { MathUtils } from "three";
import { lerpAnimation } from "./lerpAnimation";
import type { AnimationPosition } from "./hooks/useWeaponAnimations";
import type { PlayerState } from "@fps/lib";
import type { Group, Vector3, Clock } from "three";

interface ApplyWalk {
    animationTransition: AnimationPosition;
    clock: Clock;
    crouchOffset: { x: number; y: number };
    currentOffset: { x: number; y: number };
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
    playerState: PlayerState;
    walkingSpeed: number;
}

/**
 * Applies the walking animation
 * @param props - The crouch offset, group, idle offset, idle rotation, player state, and walking speed to apply to the weapon
 */
export const walk = (props: ApplyWalk) => {
    const walkingAmplitude = 0.01;

    const [targetOffsetX, targetOffsetY] = [
        props.playerState.isCrouching ? props.crouchOffset.x : 0,
        props.playerState.isCrouching ? props.crouchOffset.y : 0,
    ];

    // Smoothly transition between the current and target offsets
    props.currentOffset.x = MathUtils.lerp(props.currentOffset.x, targetOffsetX, 0.1);
    props.currentOffset.y = MathUtils.lerp(props.currentOffset.y, targetOffsetY, 0.1);

    const targetPosition = {
        rotateX: props.idleRotation.x,
        rotateY: props.idleRotation.y,
        rotateZ: props.idleRotation.z,
        translateX:
            props.currentOffset.x +
            props.idleOffset.x +
            walkCoordinates({
                amplitude: walkingAmplitude,
                clock: props.clock,
                isCrouching: props.playerState.isCrouching,
                walkingSpeed: props.walkingSpeed,
            }).x,
        translateY:
            props.currentOffset.y +
            props.idleOffset.y +
            walkCoordinates({
                amplitude: walkingAmplitude,
                clock: props.clock,
                isCrouching: props.playerState.isCrouching,
                walkingSpeed: props.walkingSpeed,
            }).y,
        translateZ: props.idleOffset.z,
    };

    const lerp = lerpAnimation({
        animationTransition: props.animationTransition,
        target: targetPosition,
    });

    props.group.rotateX(lerp.rotateX);
    props.group.rotateY(lerp.rotateY);
    props.group.rotateZ(lerp.rotateZ);
    props.group.translateX(lerp.translateX);
    props.group.translateY(lerp.translateY);
    props.group.translateZ(lerp.translateZ);
};

interface WalkCoordinatesProps {
    amplitude: number;
    clock: Clock;
    isCrouching: boolean;
    walkingSpeed: number;
}

/**
 * Generates a movement pattern for the walking animation
 */
export const walkCoordinates = (() => {
    let previousElapsedTime = 0;
    let currentFrequency = 0;
    let phase = 0;

    return (props: WalkCoordinatesProps): { x: number; y: number } => {
        const { amplitude, clock, isCrouching, walkingSpeed } = props;

        const minFrequency = 3; // min animation speed
        const maxFrequency = 7.2; // max animation speed

        // Match walking speed between min and max frequencies
        const targetFrequency = minFrequency + (maxFrequency - minFrequency) * walkingSpeed;

        // Smooth frequency changes to avoid sudden jumps when applying walking speed
        const frequencySmoothingFactor = 0.1;
        currentFrequency += (targetFrequency - currentFrequency) * frequencySmoothingFactor;

        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousElapsedTime;
        previousElapsedTime = elapsedTime;

        phase += currentFrequency * deltaTime;

        // Horizontal movement with an increased amplitude and an additional sinusoidal component for slight left-right motion
        const x = amplitude * Math.sin(phase) + amplitude * 0.5 * Math.sin(phase / 2);

        // Vertical movement (quadratic)
        const y = amplitude * Math.sin(phase) ** 2;

        // Reduce movement amplitude when crouching
        return { x: isCrouching ? x * 0.65 : x, y: isCrouching ? y * 0.65 : y };
    };
})();
