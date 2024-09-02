import React from "react";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Euler, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "./controls/useControls";
import { teleportPlayerIfOob, updatePlayer } from "./playerFunctions";
import { channel } from "../utils/geckos";
import type { Camera } from "three";
import type { Octree } from "three/examples/jsm/Addons.js";
import type { PlayerState } from "@fps/lib";

const STEPS_PER_FRAME = 10;

export interface PlayerControls {
    camera: Camera;
    delta: number;
    euler: Euler;
    gamepad: Gamepad | null | undefined;
    playerDirection: Vector3;
    playerOnFloor: boolean;
    playerStateRef: React.MutableRefObject<PlayerState>;
    playerVelocity: Vector3;
}

interface PlayerProps {
    children?: React.ReactNode;
    octree: Octree;
    playerStateRef: React.MutableRefObject<PlayerState>;
}

export const Player: React.FC<PlayerProps> = (props) => {
    const playerOnFloor = React.useRef(false);
    const playerVelocity = React.useMemo(() => new Vector3(), []);
    const playerDirection = React.useMemo(() => new Vector3(), []);
    const euler = React.useMemo(() => new Euler(0, 0, 0, "YXZ"), []);
    // Player capsule used for collisions
    const capsule = React.useMemo(() => {
        const start = new Vector3(0, 10, 0);
        const end = new Vector3(0, 11, 0);
        const radius = 0.5;
        return new Capsule(start, end, radius);
    }, []);

    const { handleControls } = useControls({
        capsule,
        euler,
        playerDirection,
        playerOnFloor,
        playerStateRef: props.playerStateRef,
        playerVelocity,
    });

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

        // console.log(props.playerStateRef.current.isSprinting);

        // Handle player controls
        handleControls({ camera, delta, gamepad });

        // Teleport player if out of bounds
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
