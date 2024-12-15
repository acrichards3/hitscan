import type { Clock } from "three";
import type { Group, Vector3 } from "three";

interface ApplyIdle {
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
}

/**
 * Applies the idle animation
 * @param props - The group, idle offset, and idle rotation to apply to the weapon
 */
export const idle = (props: ApplyIdle) => {
    const { group, idleOffset, idleRotation } = props;

    group.rotateX(idleRotation.x);
    group.rotateY(idleRotation.y);
    group.rotateZ(idleRotation.z);
    group.translateX(idleOffset.x + idleCoordinates(props.clock).x);
    group.translateY(idleOffset.y + idleCoordinates(props.clock).y);
    group.translateZ(idleOffset.z);
};

/**
 * Generates a movement pattern for the idle animation
 * @returns {x: number, y: number} - The x and y values for the idle animation
 */
const idleCoordinates = (clock: Clock): { x: number; y: number } => {
    const amplitude = 0.005;
    const frequency = 1.3;
    const time = clock.getElapsedTime();

    const x = amplitude * Math.sin(frequency * time); // Horizontal movement
    const y = amplitude * Math.sin(2 * frequency * time) * Math.cos(frequency * time); // Vertical movement combining sine and cosine for figure-eight

    return { x, y };
};
