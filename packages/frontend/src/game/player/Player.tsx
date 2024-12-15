import React from "react";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Euler, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useControls } from "./hooks/useControls";
import { teleportPlayerIfOob, updatePlayer } from "./functions/playerFunctions";
import { channel } from "../utils/geckos";
import type { Camera } from "three";
import type { Octree } from "three/examples/jsm/Addons.js";
import type { WeaponStats } from "../weapons/weapon";
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
    activeWeaponRef: React.MutableRefObject<WeaponStats>;
    children?: React.ReactNode;
    octree: Octree;
    playerStateRef: React.MutableRefObject<PlayerState>;
}

export const Player: React.FC<PlayerProps> = (props) => {
    const playerOnFloor = React.useRef(false);
    const playerVelocity = React.useRef(new Vector3());
    const playerDirection = React.useRef(new Vector3());
    const euler = React.useRef(new Euler(0, 0, 0, "YXZ")); // TODO: Pls just make it XYZ
    const capsule = React.useRef(new Capsule(new Vector3(0, 10, 0), new Vector3(0, 11, 0), 0.5));

    useControls({
        activeWeaponRef: props.activeWeaponRef,
        capsule: capsule.current,
        euler: euler.current,
        playerDirection: playerDirection.current,
        playerOnFloor,
        playerStateRef: props.playerStateRef,
        playerVelocity: playerVelocity.current,
    });

    useFrame(({ camera }, delta) => {
        const deltaSteps = Math.min(0.05, delta) / STEPS_PER_FRAME;

        // Update player position
        for (let i = 0; i < STEPS_PER_FRAME; i++) {
            playerOnFloor.current = updatePlayer(
                camera,
                deltaSteps,
                props.octree,
                capsule.current,
                playerVelocity.current,
                playerOnFloor.current,
                props.playerStateRef,
            );
        }

        // Teleport player if out of bounds
        teleportPlayerIfOob(camera, capsule.current, playerVelocity.current);

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
