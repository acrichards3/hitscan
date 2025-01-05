import { Clock, Group } from "three";
import { lerpAnimation } from "./lerpAnimation";
import type { Vector3 } from "three";
import type { AnimationPosition } from "./hooks/useWeaponAnimations";

interface ApplySprint {
    animationTransition: AnimationPosition;
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
}

type Coordinate = { x: number; y: number; z: number };

export const sprint = (props: ApplySprint) => {
    const { animationTransition, clock, group, idleOffset, idleRotation } = props;

    const target = {
        rotateX: idleRotation.x + sprintCoordinates(clock).rotate.x,
        rotateY: idleRotation.y + sprintCoordinates(clock).rotate.y,
        rotateZ: idleRotation.z + sprintCoordinates(clock).rotate.z,
        translateX: idleOffset.x + sprintCoordinates(clock).translate.x,
        translateY: idleOffset.y + sprintCoordinates(clock).translate.y,
        translateZ: idleOffset.z + sprintCoordinates(clock).translate.z,
    };

    const lerp = lerpAnimation({ animationTransition, speed: 0.12, target });

    group.rotateX(lerp.rotateX);
    group.rotateY(lerp.rotateY);
    group.rotateZ(lerp.rotateZ);
    group.translateX(lerp.translateX);
    group.translateY(lerp.translateY);
    group.translateZ(lerp.translateZ);
};

const sprintCoordinates = (clock: Clock): { rotate: Coordinate; translate: Coordinate } => {
    const amplitude = 0.01; // Base amplitude for subtle movements
    const frequency = 4.4; // Frequency adjusted for realistic bobs and strides
    const time = clock.getElapsedTime();

    // Rotation simulates looking direction or head bob slightly
    const rotate = {
        x: -0.55 + amplitude * 1.5 * Math.sin(frequency * time), // X: Slight forward tilt
        y: 0.9 + amplitude * 0.5 * Math.cos(frequency * time), // Y: Slight rotation, maybe due to strafing
        z: 0.5 + amplitude * 1.5 * Math.sin(frequency * time), // Z: Slight tilt from side to side
    };

    const initialX = 0.1;
    const initialY = -0.05;
    const initialZ = 0.1;
    const ZFrequency = 8.8; // Frequency adjusted for realistic bobs and strides
    // Translate mimics actual movement, with pronounced vertical bobbing and in-and-out motion
    const translate = {
        x: initialX + amplitude * 0.05 * Math.sin(frequency * time), // X: Slight side-to-side motion
        y: initialY + 0.04 * Math.abs(Math.sin(frequency * time * 2)), // Y: Vertical bobbing, doubled frequency for footfalls
        z: initialZ + (-0.033 * Math.cos(ZFrequency * time) + 0.01 * Math.sin(frequency * time)), // Z: Enhanced forward movement with in-and-out variation
    };

    return { rotate, translate };
};
