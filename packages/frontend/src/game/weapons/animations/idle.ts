import { MathUtils } from "three";
import type { Clock } from "three";
import type { Group, Vector3 } from "three";
import type { PlayerState } from "@fps/lib";

interface ApplyIdle {
    clock: Clock;
    crouchOffset: { x: number; y: number };
    currentOffset: { x: number; y: number };
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
    playerState: PlayerState;
}

/**
 * Applies the idle animation
 * @param props - The current offset, crouch offset, group, idle offset, idle rotation, and player state to apply to the weapon
 */
export const idle = (props: ApplyIdle) => {
    const { currentOffset, crouchOffset, group, idleOffset, idleRotation, playerState } = props;

    const [targetOffsetX, targetOffsetY] = [
        playerState.isCrouching ? crouchOffset.x : 0,
        playerState.isCrouching ? crouchOffset.y : 0,
    ];

    // Smoothly transition between the current and target offsets
    currentOffset.x = MathUtils.lerp(currentOffset.x, targetOffsetX, 0.1);
    currentOffset.y = MathUtils.lerp(currentOffset.y, targetOffsetY, 0.1);

    group.rotateX(idleRotation.x);
    group.rotateY(idleRotation.y);
    group.rotateZ(idleRotation.z);
    group.translateX(currentOffset.x + idleOffset.x + idleCoordinates(props.clock).x);
    group.translateY(currentOffset.y + idleOffset.y + idleCoordinates(props.clock).y);
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
