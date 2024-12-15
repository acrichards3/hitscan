import type { Group, Vector3, Clock } from "three";

interface ApplyWalk {
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
    walkingSpeed: number;
}

/**
 * Applies the walking animation
 * @param props - The group, idle offset, idle rotation, and walking speed to apply to the weapon
 */
export const walk = (props: ApplyWalk) => {
    const { clock, group, idleOffset, idleRotation, walkingSpeed } = props;
    const walkingAmplitude = 0.01;

    group.rotateX(idleRotation.x);
    group.rotateY(idleRotation.y);
    group.rotateZ(idleRotation.z);
    group.translateX(idleOffset.x + walkCoordinates(walkingAmplitude, clock, walkingSpeed).x);
    group.translateY(idleOffset.y + walkCoordinates(walkingAmplitude, clock, walkingSpeed).y);
    group.translateZ(idleOffset.z);
};

/**
 * Generates a movement pattern for the walking animation
 */
export const walkCoordinates = (() => {
    let previousElapsedTime = 0;
    let currentFrequency = 0;
    let phase = 0;

    return (amplitude: number, clock: Clock, walkingSpeed: number): { x: number; y: number } => {
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

        return { x, y };
    };
})();
