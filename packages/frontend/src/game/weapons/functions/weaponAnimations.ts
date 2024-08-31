import { Vector3, Clock } from "three";

export const idle = (): { x: number; y: number } => {
    const amplitude = 0.005;
    const frequency = 1.3;
    const time = Date.now() / 1000;

    const x = amplitude * Math.sin(frequency * time); // Horizontal movement
    const y = amplitude * Math.sin(2 * frequency * time) * Math.cos(frequency * time); // Vertical movement combining sine and cosine for figure-eight

    return { x, y };
};

export const sprint = (): { rotate: Vector3; translate: Vector3 } => {
    const amplitude = 0.01; // Base amplitude for subtle movements
    const frequency = 4.4; // Frequency adjusted for realistic bobs and strides
    const time = Date.now() / 1000;

    // Rotation simulates looking direction or head bob slightly
    const rotate = new Vector3(
        -0.55 + amplitude * 1.5 * Math.sin(frequency * time), // X: Slight forward tilt
        0.9 + amplitude * 0.5 * Math.cos(frequency * time), // Y: Slight rotation, maybe due to strafing
        0.5 + amplitude * 1.5 * Math.sin(frequency * time), // Z: Slight tilt from side to side
    );

    const initialX = 0.1;
    const initialY = -0.05;
    const initialZ = 0.1;
    const ZFrequency = 8.8; // Frequency adjusted for realistic bobs and strides
    // Translate mimics actual movement, with pronounced vertical bobbing and in-and-out motion
    const translate = new Vector3(
        initialX + amplitude * 0.05 * Math.sin(frequency * time), // X: Slight side-to-side motion
        initialY + 0.04 * Math.abs(Math.sin(frequency * time * 2)), // Y: Vertical bobbing, doubled frequency for footfalls
        initialZ + (-0.033 * Math.cos(ZFrequency * time) + 0.01 * Math.sin(frequency * time)), // Z: Enhanced forward movement with in-and-out variation
    );

    return { rotate, translate };
};

export const walk = (() => {
    let previousElapsedTime = 0;
    let currentFrequency = 0;
    let phase = 0;

    return (amplitude: number, clock: Clock, walkingSpeed: number): { x: number; y: number } => {
        const minFrequency = 3; // min animation speed
        const maxFrequency = 7.2; // max animation speed

        // Match walking speed between min and max frequencies
        const targetFrequency = minFrequency + (maxFrequency - minFrequency) * walkingSpeed;

        // Smooth frequency changes to avoid sudden jumps
        const frequencySmoothingFactor = 0.1; // Adjust this factor to control the frequency smoothing level (0 < frequencySmoothingFactor < 1)
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
