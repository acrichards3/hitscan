import { Vector3 } from "three";
import type { Clock, Group } from "three";

interface ApplySprint {
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
}

export const sprint = (props: ApplySprint) => {
    const { group, idleOffset, idleRotation } = props;

    group.rotateX(idleRotation.x + sprintCoordinates(props.clock).rotate.x);
    group.rotateY(idleRotation.y + sprintCoordinates(props.clock).rotate.y);
    group.rotateZ(idleRotation.z + sprintCoordinates(props.clock).rotate.z);
    group.translateX(idleOffset.x + sprintCoordinates(props.clock).translate.x);
    group.translateY(idleOffset.y + sprintCoordinates(props.clock).translate.y);
    group.translateZ(idleOffset.z + sprintCoordinates(props.clock).translate.z);
};

// TODO: Define Vector3's outside of useFrame loop for better performance
const sprintCoordinates = (clock: Clock): { rotate: Vector3; translate: Vector3 } => {
    const amplitude = 0.01; // Base amplitude for subtle movements
    const frequency = 4.4; // Frequency adjusted for realistic bobs and strides
    const time = clock.getElapsedTime();

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
