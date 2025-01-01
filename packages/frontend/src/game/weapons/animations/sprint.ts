import { Vector3 } from "three";
import type { Clock, Group } from "three";

interface ApplySprint {
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
}

type Coordinate = { x: number; y: number; z: number };

export const sprint = (props: ApplySprint) => {
    const { group, idleOffset, idleRotation } = props;

    group.rotateX(idleRotation.x + sprintCoordinates(props.clock).rotate.x);
    group.rotateY(idleRotation.y + sprintCoordinates(props.clock).rotate.y);
    group.rotateZ(idleRotation.z + sprintCoordinates(props.clock).rotate.z);
    group.translateX(idleOffset.x + sprintCoordinates(props.clock).translate.x);
    group.translateY(idleOffset.y + sprintCoordinates(props.clock).translate.y);
    group.translateZ(idleOffset.z + sprintCoordinates(props.clock).translate.z);
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
