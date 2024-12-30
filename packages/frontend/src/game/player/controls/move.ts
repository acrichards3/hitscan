import React from "react";
import { getSideVector, getForwardVector } from "../functions/playerFunctions";
import type { Euler, Vector3, Camera } from "three";
import type { PlayerState } from "@fps/lib";

interface UseMoveProps {
    camera: Camera;
    delta: number;
    euler: Euler;
    gamepad: Gamepad;
    playerDirection: Vector3;
    playerOnFloor: boolean;
    playerStateRef: React.MutableRefObject<PlayerState>;
    playerVelocity: Vector3;
}

export const move = (props: UseMoveProps) => {
    const playerRef = props.playerStateRef.current;

    const [leftX, leftY, rightX, rightY] = props.gamepad.axes.map((angle) =>
        // TODO: Better deadzone handling
        Math.abs(angle) < 0.1 ? 0 : angle,
    );

    if (leftX == null || leftY == null || rightX == null || rightY == null) {
        return;
    }

    // Update camera position
    const cameraSpeedDelta = props.delta * 25;
    props.euler.setFromQuaternion(props.camera.quaternion);

    props.euler.y -= rightX * 0.15 * cameraSpeedDelta;
    props.euler.x -= rightY * 0.15 * cameraSpeedDelta;

    const maxPolarAngle = Math.PI;
    const minPolarAngle = 0;
    props.euler.x = Math.max(
        Math.PI / 2 - maxPolarAngle,
        Math.min(Math.PI / 2 - minPolarAngle, props.euler.x),
    );

    props.camera.quaternion.setFromEuler(props.euler);

    // Update player position
    let moveSpeedDelta = props.delta * (props.playerOnFloor ? 25 : 8);

    // Increase movement speed by 50% when sprinting
    if (playerRef.isSprinting) moveSpeedDelta *= 1.5;

    // Cut movement speed in half when aiming
    if (playerRef.isAiming) moveSpeedDelta /= 2;

    // Cut movement speed in half when crouching (this stacks with aiming)
    if (playerRef.isCrouching) moveSpeedDelta /= 2;

    // Cut movement speed into a quarter when prone (this stacks with crouching)
    if (playerRef.isProne) moveSpeedDelta /= 4;

    // Prevent player from moving if they ADS while prone
    if (playerRef.isProne && playerRef.isAiming) moveSpeedDelta = 0;

    props.playerVelocity.add(
        getSideVector(props.camera, props.playerDirection).multiplyScalar(moveSpeedDelta * leftX),
    );

    props.playerVelocity.add(
        getForwardVector(props.camera, props.playerDirection).multiplyScalar(
            -moveSpeedDelta * leftY,
        ),
    );
};
