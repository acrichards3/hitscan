import React from "react";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Camera, Euler, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Octree } from "three/examples/jsm/Addons.js";
import { jump, move } from "./playerControls";
import { teleportPlayerIfOob, updatePlayer } from "./playerFunctions";
import { channel } from "../utils/geckos";

const STEPS_PER_FRAME = 10;

interface PlayerProps {
    children?: React.ReactNode;
    octree: Octree;
}

export const Player: React.FC<PlayerProps> = (props) => {
    const playerOnFloor = React.useRef(false);
    const playerVelocity = React.useMemo(() => new Vector3(), []);
    const playerDirection = React.useMemo(() => new Vector3(), []);
    const euler = React.useMemo(() => new Euler(0, 0, 0, "YXZ"), []);
    const capsule = React.useMemo(
        () => new Capsule(new Vector3(0, 10, 0), new Vector3(0, 11, 0), 0.5),
        [],
    );

    useFrame(({ camera }, delta) => {
        const [gamepad] = navigator.getGamepads();
        const deltaSteps = Math.min(0.05, delta) / STEPS_PER_FRAME;

        // Update player position
        for (let i = 0; i < STEPS_PER_FRAME; i++) {
            playerOnFloor.current = updatePlayer(
                camera,
                deltaSteps,
                props.octree,
                capsule,
                playerVelocity,
                playerOnFloor.current,
            );
        }

        // Player postion and controls
        controls(camera, delta, euler, gamepad, playerDirection, playerOnFloor, playerVelocity);
        teleportPlayerIfOob(camera, capsule, playerVelocity);

        // Send player position to server
        channel.emit("client-tick", {
            direction: {
                w: camera.quaternion.w,
                x: camera.quaternion.x,
                y: camera.quaternion.y,
                z: camera.quaternion.z,
            },
            position: camera.position,
        });
    });

    return props.children;
};

function controls(
    camera: Camera,
    delta: number,
    euler: Euler,
    gamepad: Gamepad | null | undefined,
    playerDirection: Vector3,
    playerOnFloor: React.MutableRefObject<boolean>,
    playerVelocity: Vector3,
) {
    jump({ gamepad, playerOnFloor: playerOnFloor.current, playerVelocity });
    move({
        camera,
        delta,
        euler,
        gamepad,
        playerDirection,
        playerOnFloor: playerOnFloor.current,
        playerVelocity,
    });
}
