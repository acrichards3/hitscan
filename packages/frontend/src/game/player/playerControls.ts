import { Euler, Vector3, Camera } from "three";
import { getSideVector, getForwardVector } from "./playerFunctions";

interface PlayerControls {
    camera: Camera;
    delta: number;
    euler: Euler;
    gamepad: Gamepad | null | undefined;
    playerDirection: Vector3;
    playerOnFloor: boolean;
    playerVelocity: Vector3;
}

type Jump = Pick<PlayerControls, "gamepad" | "playerOnFloor" | "playerVelocity">;
export const jump = (props: Jump) => {
    if (props.gamepad == null) return;

    const isJumpPressed = !!props.gamepad.buttons[0]?.pressed;

    if (props.playerOnFloor && isJumpPressed) {
        props.playerVelocity.y += 15;
    }
};

export const move = (props: PlayerControls) => {
    if (props.gamepad == null) return;

    const [leftX, leftY, rightX, rightY] = props.gamepad.axes.map((angle) =>
        // TODO(jaker): Better deadzone handling
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
    const moveSpeedDelta = props.delta * (props.playerOnFloor ? 25 : 8);
    // I guess the "A" is the first button on an xbox controller?
    props.playerVelocity.add(
        getSideVector(props.camera, props.playerDirection).multiplyScalar(moveSpeedDelta * leftX),
    );
    props.playerVelocity.add(
        getForwardVector(props.camera, props.playerDirection).multiplyScalar(
            -moveSpeedDelta * leftY,
        ),
    );
};
