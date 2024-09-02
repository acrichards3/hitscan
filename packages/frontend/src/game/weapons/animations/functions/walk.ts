import type { Clock } from "three";

export const walk = (() => {
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
