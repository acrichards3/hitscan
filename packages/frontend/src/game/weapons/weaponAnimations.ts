import { Vector3 } from "three";

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

export const walk = (): { x: number; y: number } => {
    const amplitude = 0.01;
    const frequency = 7.2;
    const time = Date.now() / 1000;

    // Increase the amplitude specifically for the horizontal movement
    const horizontalAmplitude = amplitude * 1; // Increase this factor to widen the U shape

    // Horizontal movement with an increased amplitude and an additional sinusoidal component for slight left-right motion
    const x =
        horizontalAmplitude * Math.sin(frequency * time) +
        horizontalAmplitude * 0.5 * Math.sin((frequency * time) / 2);
    // Vertical movement (quadratic)
    const y = amplitude * Math.sin(frequency * time) ** 2;

    return { x, y };
};
